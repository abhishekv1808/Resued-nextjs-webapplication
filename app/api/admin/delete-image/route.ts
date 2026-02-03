import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { productId, imageUrl } = await request.json();

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Remove image from array
        product.images = product.images.filter((img: string) => img !== imageUrl);

        // Update main image if needed
        if (product.image === imageUrl) {
            product.image = product.images.length > 0 ? product.images[0] : '';
        }

        await product.save();

        // Optional: Delete from Cloudinary if possible (need public_id)
        // Usually we store public_id or extract it from URL

        return NextResponse.json({ success: true, product });

    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
