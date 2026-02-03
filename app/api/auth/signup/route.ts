import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import axios from "axios";

function isValidAuthUrl(urlString: string | undefined): boolean {
    try {
        if (!urlString || typeof urlString !== 'string') return false;
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
}

export async function POST(req: NextRequest) {
    try {
        const { name, location, user_json_url } = await req.json();

        if (!isValidAuthUrl(user_json_url)) {
            console.error('Invalid auth URL:', user_json_url);
            return NextResponse.json(
                { message: 'Invalid authentication URL' },
                { status: 400 }
            );
        }

        const response = await axios.get(user_json_url, { timeout: 10000 });
        console.log("Phone.email response:", response.data);
        const { user_phone_number, user_country_code } = response.data;

        if (!user_phone_number) {
            console.error('Missing phone number in response:', response.data);
            return NextResponse.json(
                { message: 'Invalid response from auth provider' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Normalize phone number (remove + if present for consistency or check logic)
        // The previous logic seemed to handle both. Here we will store as is from provider?
        // Let's stick to simple find first.
        let existingUser = await User.findOne({ phone: user_phone_number });

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
        });

        await newUser.save();

        const session = await getIronSession<SessionData>(req, new Response(), sessionOptions);

        // Create actual session on response
        const res = NextResponse.json({
            isLoggedIn: true,
            user: {
                _id: newUser._id.toString(),
                name: newUser.name,
                phone: newUser.phone,
                location: newUser.location,
                email: newUser.email,
                address: newUser.address,
            }
        });

        const ironSession = await getIronSession<SessionData>(req, res, sessionOptions);
        ironSession.isLoggedIn = true;
        ironSession.user = {
            _id: newUser._id.toString(),
            name: newUser.name,
            phone: newUser.phone,
            location: newUser.location,
            email: newUser.email,
            address: newUser.address,
        };
        await ironSession.save();

        return res;

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
