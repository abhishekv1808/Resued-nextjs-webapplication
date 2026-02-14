import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const status = searchParams.get('status');
        const search = searchParams.get('search')?.trim();
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        // Build query
        const query: any = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        if (search) {
            // Search by order ID (partial), customer name, or phone
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(escaped, 'i');
            query.$or = [
                { customerName: searchRegex },
                { customerPhone: searchRegex },
                { razorpayOrderId: searchRegex },
                { phonePeMerchantTransactionId: searchRegex },
            ];
        }

        const skip = (page - 1) * limit;

        const [orders, totalOrders] = await Promise.all([
            Order.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .select('-statusHistory') // Exclude history from list view for performance
                .lean(),
            Order.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        // Serialize
        const serializedOrders = orders.map((order: any) => ({
            ...order,
            _id: order._id.toString(),
            user: order.user?.toString(),
            createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString() : null,
        }));

        return NextResponse.json({
            orders: serializedOrders,
            pagination: {
                page,
                limit,
                totalPages,
                totalOrders,
            },
        });
    } catch (error: any) {
        console.error('Admin orders list error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
