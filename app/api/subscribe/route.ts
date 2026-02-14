import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const subscription = await req.json();

        // Validate subscription data
        if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
            return NextResponse.json(
                { error: 'Invalid subscription data' },
                { status: 400 }
            );
        }

        // Try to get the logged-in user's ID from the session
        let userId = null;
        try {
            const { cookies } = await import('next/headers');
            const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
            if (session.isLoggedIn && session.user?._id) {
                userId = session.user._id;
            }
        } catch {
            // Session read failed — save subscription without userId
        }

        // Build the update payload
        const updateData: Record<string, unknown> = {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
        };
        // Only set userId if we have one (don't overwrite existing userId with null)
        if (userId) {
            updateData.userId = userId;
        }

        // Use findOneAndUpdate with upsert to prevent duplicates
        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            updateData,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error saving subscription:', error);
        return NextResponse.json(
            { error: 'Failed to save subscription' },
            { status: 500 }
        );
    }
}
