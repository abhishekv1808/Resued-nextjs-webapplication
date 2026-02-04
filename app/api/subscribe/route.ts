import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function POST(req: Request) {
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

        // Use findOneAndUpdate with upsert to prevent duplicates
        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            subscription,
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
