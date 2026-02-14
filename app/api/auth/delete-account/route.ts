import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData, clearSessionOnResponse } from '@/lib/session';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import Subscription from '@/models/Subscription';
import StockAlert from '@/models/StockAlert';

export async function DELETE() {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        if (!session.isLoggedIn || !session.user?._id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user._id;

        await dbConnect();

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            const res = NextResponse.json({ error: 'User not found' }, { status: 404 });
            clearSessionOnResponse(res);
            return res;
        }

        // Delete related data
        await Promise.all([
            // Remove push notification subscriptions
            Subscription.deleteMany({ userId }),
            // Remove stock alerts by user's email/phone
            ...(user.email ? [StockAlert.deleteMany({ email: user.email })] : []),
        ]);

        // Note: Orders are kept for business records but anonymised
        await Order.updateMany(
            { user: userId },
            {
                $set: {
                    customerName: 'Deleted User',
                    customerPhone: '',
                    address: 'Account deleted',
                },
            },
        );

        // Delete the user document
        await User.findByIdAndDelete(userId);

        // Clear session cookie
        const res = NextResponse.json({ success: true, message: 'Account deleted successfully' });
        clearSessionOnResponse(res);
        return res;
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Failed to delete account. Please try again.' },
            { status: 500 },
        );
    }
}
