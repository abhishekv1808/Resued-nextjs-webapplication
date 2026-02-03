import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { productId, quantity } = await req.json();

        if (!productId || quantity === undefined) {
            return NextResponse.json({ error: 'Missing productId or quantity' }, { status: 400 });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                quantity: Number(quantity),
                inStock: Number(quantity) > 0 // Auto-update inStock status
            },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Error updating stock:', error);
        return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
}
