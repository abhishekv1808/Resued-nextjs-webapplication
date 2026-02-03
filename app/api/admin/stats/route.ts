import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Enquiry from '@/models/Enquiry';

export async function GET() {
    try {
        await dbConnect();

        // 1. Total Inventory
        const totalProducts = await Product.countDocuments({});

        // 2. Out of Stock
        const outOfStock = await Product.countDocuments({
            $or: [
                { quantity: 0 },
                { inStock: false }
            ]
        });

        // 3. New Enquiries (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newEnquiries = await Enquiry.countDocuments({ date: { $gte: thirtyDaysAgo } });

        // 4. Inventory Value
        const inventoryValueAgg = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
                }
            }
        ]);
        const inventoryValue = inventoryValueAgg.length > 0 ? inventoryValueAgg[0].totalValue : 0;

        // 5. Category Split
        const categorySplit = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Recent Inventory
        const recentProducts = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name category price inStock quantity images');

        return NextResponse.json({
            stats: {
                totalProducts,
                outOfStock,
                newEnquiries,
                inventoryValue
            },
            categorySplit,
            recentProducts
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
