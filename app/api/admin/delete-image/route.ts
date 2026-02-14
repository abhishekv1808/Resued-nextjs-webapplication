import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { deleteFromCloudinaryByUrl } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
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

        // Delete from Cloudinary
        try {
            await deleteFromCloudinaryByUrl(imageUrl);
        } catch (cloudinaryError) {
            console.error('Failed to delete image from Cloudinary:', cloudinaryError);
            // We already removed it from DB, so we continue
        }

        return NextResponse.json({ success: true, product });

    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
