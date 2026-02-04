import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    if (!await rateLimit(req, 5, 60)) {
        return NextResponse.json(
            { message: 'Too many login attempts. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const admin = await Admin.findOne({ email });

        if (!admin || !admin.password) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const res = NextResponse.json({
            isLoggedIn: true,
            isAdmin: true,
            user: {
                email: admin.email,
                isAdmin: true
            }
        });

        const session = await getIronSession<SessionData>(req, res, sessionOptions);
        session.isLoggedIn = true;
        session.user = {
            _id: admin._id.toString(),
            name: 'Admin', // Default name as Admin model might not have name
            phone: '',
            location: '',
            email: admin.email,
            isAdmin: true
        };
        await session.save();

        return res;

    } catch (error: any) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
