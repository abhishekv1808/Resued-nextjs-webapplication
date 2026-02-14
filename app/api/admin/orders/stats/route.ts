import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();

        const [
            totalOrders,
            pendingOrders,
            revenueAgg,
            statusBreakdown,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments({}),
            Order.countDocuments({ status: { $in: ['Pending', 'Paid', 'Confirmed'] } }),
            Order.aggregate([
                { $match: { status: { $in: ['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Order.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('customerName customerPhone totalAmount status createdAt phonePeMerchantTransactionId')
                .lean(),
        ]);

        const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const statusCounts: Record<string, number> = {};
        statusBreakdown.forEach((item: any) => {
            statusCounts[item._id] = item.count;
        });

        const serializedRecent = recentOrders.map((o: any) => ({
            ...o,
            _id: o._id.toString(),
            createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
        }));

        return NextResponse.json({
            totalOrders,
            pendingOrders,
            revenue,
            statusCounts,
            recentOrders: serializedRecent,
        });
    } catch (error: any) {
        console.error('Admin orders stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch order stats' }, { status: 500 });
    }
}
