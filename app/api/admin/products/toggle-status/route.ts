import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: Request) {
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
