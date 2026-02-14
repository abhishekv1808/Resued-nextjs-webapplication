import { NextRequest, NextResponse } from 'next/server';
import { setAdminSessionOnResponse } from '@/lib/session';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

import { rateLimit } from '@/lib/rate-limit';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Dummy hash for timing-safe comparison when user not found
const DUMMY_HASH = '$2a$12$LJ3m4ys3Lz0YBnQpKvFZXuH7oKRKXx5D1D3v4c9ZnXJ0RJ9Z5KXWK';

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

        // Sanitize email
        const sanitizedEmail = String(email).toLowerCase().trim();

        await dbConnect();

        const admin = await Admin.findOne({ email: sanitizedEmail });

        // Timing-safe: always run bcrypt even if user not found
        if (!admin || !admin.password) {
            await bcrypt.compare(password, DUMMY_HASH);
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check account lockout
        if (admin.lockUntil && admin.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((admin.lockUntil.getTime() - Date.now()) / 60000);
            return NextResponse.json(
                { message: `Account locked. Try again in ${minutesLeft} minute(s).` },
                { status: 423 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            // Increment failed attempts
            const attempts = (admin.failedLoginAttempts || 0) + 1;
            const update: any = { failedLoginAttempts: attempts };

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                update.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
                update.failedLoginAttempts = 0;
                console.warn(`Admin account locked: ${sanitizedEmail} after ${MAX_FAILED_ATTEMPTS} failed attempts`);
            }

            await Admin.updateOne({ _id: admin._id }, { $set: update });

            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Successful login — reset failed attempts and lock
        await Admin.updateOne(
            { _id: admin._id },
            { $set: { failedLoginAttempts: 0 }, $unset: { lockUntil: 1 } }
        );

        const userData = {
            _id: admin._id.toString(),
            name: 'Admin',
            phone: '',
            location: '',
            email: admin.email,
            isAdmin: true,
        };

        // Create response FIRST, then set sealed cookie DIRECTLY on it
        const res = NextResponse.json({
            isLoggedIn: true,
            isAdmin: true,
            user: { email: admin.email, isAdmin: true },
        });
        await setAdminSessionOnResponse(res, { isLoggedIn: true, user: userData });
        return res;

    } catch (error: any) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
