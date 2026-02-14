import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.isLoggedIn || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const skip = (page - 1) * limit;

        const [orders, totalOrders] = await Promise.all([
            Order.find({ user: session.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments({ user: session.user._id }),
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        const serializedOrders = orders.map((order: any) => ({
            ...order,
            _id: order._id.toString(),
            user: order.user?.toString(),
            createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString() : null,
            statusHistory: (order.statusHistory || []).map((entry: any) => ({
                ...entry,
                timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : null,
            })),
        }));

        return NextResponse.json({
            orders: serializedOrders,
            pagination: { page, limit, totalPages, totalOrders },
        });
    } catch (error: any) {
        console.error('Customer orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
