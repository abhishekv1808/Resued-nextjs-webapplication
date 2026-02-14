import { NextRequest, NextResponse } from 'next/server';
import { setSessionOnResponse } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import axios from 'axios';
import { loginSchema } from '@/lib/validations/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    if (!await rateLimit(req, 10, 60)) {
        return NextResponse.json(
            { message: 'Too many login attempts. Please try again later.' },
            { status: 429 }
        );
    }
    try {
        const body = await req.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { user_json_url } = validation.data;

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
                {
                    message: 'User not found. Please register first.',
                    code: 'USER_NOT_FOUND',
                    phone: user_phone_number
                },
                { status: 404 }
            );
        }

        // Update lastLogin timestamp
        user.lastLogin = new Date();
        await user.save();

        const userData = {
            _id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            location: user.location,
            email: user.email,
            address: user.address,
        };

        // Create response FIRST, then set sealed cookie DIRECTLY on it
        const res = NextResponse.json({ isLoggedIn: true, user: userData });
        await setSessionOnResponse(res, { isLoggedIn: true, user: userData });
        return res;

    } catch (error: unknown) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
