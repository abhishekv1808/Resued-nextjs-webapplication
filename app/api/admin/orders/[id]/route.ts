import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order, { VALID_STATUS_TRANSITIONS } from '@/models/Order';
import { requireAdmin } from '@/lib/admin-auth';

import User from '@/models/User';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();
        const { id } = await params;

        // Ensure User model is registered before populate
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        User; 

        const order = await Order.findById(id).populate('user', 'name phone email location address').lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Serialize
        const serialized = {
            ...order,
            _id: (order._id as any).toString(),
            user: typeof order.user === 'object' && order.user !== null
                ? { ...(order.user as any), _id: (order.user as any)._id?.toString() }
                : (order.user as any)?.toString(),
            createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString() : null,
            statusHistory: (order.statusHistory || []).map((entry: any) => ({
                ...entry,
                timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : null,
            })),
        };

        return NextResponse.json({ order: serialized });
    } catch (error: any) {
        console.error('Admin order detail error:', error);
        return NextResponse.json({ error: `Failed to fetch order: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { status: newStatus, note, trackingId, courierName, estimatedDelivery } = body;

        if (!newStatus) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Validate status transition
        const currentStatus = order.status;
        const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];

        if (!allowedTransitions.includes(newStatus)) {
            return NextResponse.json({
                error: `Cannot change status from "${currentStatus}" to "${newStatus}". Allowed: ${allowedTransitions.join(', ') || 'none'}`,
            }, { status: 400 });
        }

        // Update status
        order.status = newStatus;

        // Add to status history
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date(),
            note: note || `Status changed to ${newStatus}`,
            updatedBy: 'admin',
        });

        // Update tracking info if provided
        if (trackingId !== undefined) order.trackingId = trackingId;
        if (courierName !== undefined) order.courierName = courierName;
        if (estimatedDelivery !== undefined) order.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : undefined;

        await order.save();

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${newStatus}`,
            order: {
                _id: order._id.toString(),
                status: order.status,
                trackingId: order.trackingId,
                courierName: order.courierName,
            },
        });
    } catch (error: any) {
        console.error('Admin order status update error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
