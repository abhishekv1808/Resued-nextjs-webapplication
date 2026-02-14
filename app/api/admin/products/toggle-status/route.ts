import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();
        const { productId, inStock } = await req.json();

        if (!productId || inStock === undefined) {
            return NextResponse.json({ error: 'Missing productId or inStock status' }, { status: 400 });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { inStock: Boolean(inStock) },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Error toggling status:', error);
        return NextResponse.json({ error: 'Failed to toggle status' }, { status: 500 });
    }
}
