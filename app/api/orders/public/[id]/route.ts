import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

/**
 * Public order lookup endpoint.
 * Used by the payment-success page as a fallback when the user's session cookie
 * is lost during the external PhonePe redirect.
 *
 * Security: MongoDB ObjectIds are 24-char hex strings and are not guessable.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id || id.length < 12) {
            return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
        }

        const order = await Order.findById(id).lean();

        if (!order) {
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
        console.error('Public order lookup error:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
