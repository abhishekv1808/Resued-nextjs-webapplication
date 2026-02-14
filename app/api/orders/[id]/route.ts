import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.isLoggedIn || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Auth guard: only allow the owning user to see their order
        if (order.user?.toString() !== session.user._id) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const serialized = {
            ...order,
            _id: order._id.toString(),
            user: order.user?.toString(),
            createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString() : null,
            statusHistory: (order.statusHistory || []).map((entry: any) => ({
                ...entry,
                timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : null,
            })),
        };

        return NextResponse.json({ order: serialized });
    } catch (error: any) {
        console.error('Customer order detail error:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
