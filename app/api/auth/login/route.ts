import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import axios from 'axios';

// Helper to validate the auth URL
const isValidAuthUrl = (urlString: string) => {
    try {
        if (!urlString) return false;
        const url = new URL(urlString);
        return (
            url.protocol === 'https:' &&
            (url.hostname === 'phone.email' ||
                url.hostname.endsWith('.phone.email') ||
                url.hostname === 'www.phone.email')
        );
    } catch (e) {
        return false;
    }
};

import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    if (!await rateLimit(req, 10, 60)) {
        return NextResponse.json(
            { message: 'Too many login attempts. Please try again later.' },
            { status: 429 }
        );
    }
    try {
        const { user_json_url } = await req.json();

        if (!isValidAuthUrl(user_json_url)) {
            return NextResponse.json(
                { message: 'Invalid authentication URL' },
                { status: 400 }
            );
        }

        const response = await axios.get(user_json_url, { timeout: 10000 });
        const { user_phone_number } = response.data;

        if (!user_phone_number) {
            return NextResponse.json(
                { message: 'Invalid response from auth provider' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Search logic from original controller
        let user = await User.findOne({ phone: user_phone_number });

        if (!user && user_phone_number.startsWith('+')) {
            const last10 = user_phone_number.slice(-10);
            if (last10.length === 10) {
                user = await User.findOne({ phone: { $regex: last10 + '$' } });
            }
        }

        if (!user) {
            return NextResponse.json(
                { message: 'User not found. Please register first.' },
                { status: 404 }
            );
        }

        const session = await getIronSession<SessionData>(
            req,
            new Response(),
            sessionOptions
        );

        // We need to construct response with session
        const res = NextResponse.json({
            isLoggedIn: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                phone: user.phone,
                location: user.location,
                email: user.email,
                address: user.address,
            }
        });

        const ironSession = await getIronSession<SessionData>(req, res, sessionOptions);
        ironSession.isLoggedIn = true;
        ironSession.user = {
            _id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            location: user.location,
            email: user.email,
            address: user.address,
        };
        await ironSession.save();

        return res;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
