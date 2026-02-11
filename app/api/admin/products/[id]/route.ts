import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import cloudinary, { deleteFromCloudinaryByUrl } from '@/lib/cloudinary';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const brand = formData.get('brand') as string;
        const price = parseFloat(formData.get('price') as string);
        const mrp = parseFloat(formData.get('mrp') as string);
        const quantity = parseInt(formData.get('quantity') as string);
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;

        // Handle specifications based on category
        const specifications: any = {};

        if (category === 'laptop' || category === 'desktop') {
            const processor = formData.get('processor');
            if (processor) specifications.processor = processor;

            const ram = formData.get('ram');
            if (ram) specifications.ram = ram;

            const storage = formData.get('storage');
            if (storage) specifications.storage = storage;

            const graphics = formData.get('graphics');
            if (graphics) specifications.graphics = graphics;

            const os = formData.get('os');
            if (os) specifications.os = os;

            const formFactor = formData.get('formFactor');
            if (formFactor) specifications.formFactor = formFactor;

            if (category === 'laptop') {
                const display = formData.get('display');
                if (display) specifications.display = display;
            }
        } else if (category === 'monitor') {
            const screenSize = formData.get('screenSize');
            if (screenSize) specifications.screenSize = screenSize;

            const panelType = formData.get('panelType');
            if (panelType) specifications.panelType = panelType;

            const refreshRate = formData.get('refreshRate');
            if (refreshRate) specifications.refreshRate = refreshRate;

            const resolution = formData.get('resolution');
            if (resolution) specifications.resolution = resolution;
        }

        // Handle Images
        const files = formData.getAll('images') as File[];
        let imageUrls: string[] = [];

        // Keep existing images (handled via frontend usually passing what's left, 
        // but here we might just append new ones to the existing set if sending both is hard.
        // Better strategy: The PUT request should probably replace the list, or we assume
        // the frontend manages the list. 
        // If we want to support adding new images while keeping old ones that weren't deleted:
        // The frontend should probably have deleted images via a separate API or we just add to existing.
        // Let's look at legacy: it uploads new files.
        // We will fetch existing product to merge images if needed, or just push new ones.

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Upload new images
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 0) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    // Upload to Cloudinary
                    const result = await new Promise<any>((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'simtech-products',
                                quality: "auto",
                                fetch_format: "auto"
                            },
                            (error: any, result: any) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        uploadStream.end(buffer);
                    });

                    imageUrls.push(result.secure_url);
                }
            }
        }

        // If we have new images, append them to existing ones?
        // Or if the user deleted images on frontend, they should have been removed via `delete-image` API?
        // Let's assume frontend calls delete-image for removals, and this API just adds new ones.
        // So we concatenate new images to existing ones.

        const updatedImages = [...product.images, ...imageUrls];
        const updatedMainImage = updatedImages.length > 0 ? updatedImages[0] : product.image;

        // Calculate Discount
        const discount = Math.round(((mrp - price) / mrp) * 100);

        // Update Product
        product.name = name;
        product.brand = brand;
        product.price = price;
        product.mrp = mrp;
        product.discount = discount;
        product.quantity = quantity;
        product.description = description;

        // Update specifications - merge with existing to avoid wiping out fields not in the current form
        product.specifications = { ...product.specifications, ...specifications };

        // Explicitly mark specifications as modified for Mongoose
        product.markModified('specifications');

        product.images = updatedImages;
        product.image = updatedMainImage;

        await product.save();

        return NextResponse.json({ success: true, product });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                try {
                    await deleteFromCloudinaryByUrl(imageUrl);
                } catch (cloudinaryError) {
                    console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, cloudinaryError);
                    // Continue deleting other images if one fails
                }
            }
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
