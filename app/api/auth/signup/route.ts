import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { setSessionOnResponse } from "@/lib/session";
import axios from "axios";
import { signupSchema } from "@/lib/validations/auth";
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    if (!await rateLimit(req, 5, 60)) {
        return NextResponse.json(
            { message: 'Too many signup attempts. Please try again later.' },
            { status: 429 }
        );
    }
    try {
        const body = await req.json();
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, location, user_json_url } = validation.data;

        const response = await axios.get(user_json_url, { timeout: 10000 });
        console.log("Phone.email response:", response.data);
        const { user_phone_number } = response.data;

        if (!user_phone_number) {
            console.error('Missing phone number in response:', response.data);
            return NextResponse.json(
                { message: 'Invalid response from auth provider' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check for existing user
        const existingUser = await User.findOne({ phone: user_phone_number });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists. Please login.' },
                { status: 409 }
            );
        }

        const newUser = new User({
            name,
            phone: user_phone_number,
            location,
            tags: ['new_user'],
            lastLogin: new Date(),
        });

        await newUser.save();

        const userData = {
            _id: newUser._id.toString(),
            name: newUser.name,
            phone: newUser.phone,
            location: newUser.location,
            email: newUser.email,
            address: newUser.address,
        };

        // Create response FIRST, then set sealed cookie DIRECTLY on it
        const res = NextResponse.json({ isLoggedIn: true, user: userData });
        await setSessionOnResponse(res, { isLoggedIn: true, user: userData });
        return res;

    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
