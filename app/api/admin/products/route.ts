import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');

        let filter: any = {};
        if (query) {
            const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter = {
                $or: [
                    { name: { $regex: escaped, $options: 'i' } },
                    { brand: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        console.log('[PRODUCT CREATE] STEP 1: Starting product creation');
        await dbConnect();
        console.log('[PRODUCT CREATE] STEP 2: DB connected');
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const brand = formData.get('brand') as string;
        const category = formData.get('category') as string;
        const price = parseFloat(formData.get('price') as string);
        const mrp = parseFloat(formData.get('mrp') as string);
        const quantity = parseInt(formData.get('quantity') as string);
        const description = formData.get('description') as string;

        console.log('[PRODUCT CREATE] STEP 3: Form data parsed -', { name, brand, category, price, mrp, quantity });

        if (!name || !brand || !price || !mrp) {
            return NextResponse.json({ error: 'Missing required fields: name, brand, price, mrp' }, { status: 400 });
        }

        // Generate slug with timestamp to avoid duplicates
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

        // Calculate discount
        const discount = Math.round(((mrp - price) / mrp) * 100);

        // Handle specifications
        const specifications: any = {};
        const processor = formData.get('processor');
        if (processor) specifications.processor = processor;
        const ram = formData.get('ram');
        if (ram) specifications.ram = ram;
        const storage = formData.get('storage');
        if (storage) specifications.storage = storage;
        const display = formData.get('display');
        if (display) specifications.display = display;
        const graphics = formData.get('graphics');
        if (graphics) specifications.graphics = graphics;
        const os = formData.get('os');
        if (os) specifications.os = os;
        const screenSize = formData.get('screenSize');
        if (screenSize) specifications.screenSize = screenSize;
        const panelType = formData.get('panelType');
        if (panelType) specifications.panelType = panelType;
        const refreshRate = formData.get('refreshRate');
        if (refreshRate) specifications.refreshRate = refreshRate;
        const resolution = formData.get('resolution');
        if (resolution) specifications.resolution = resolution;
        const formFactor = formData.get('formFactor');
        if (formFactor) specifications.formFactor = formFactor;

        // Handle image uploads
        const files = formData.getAll('images') as File[];
        const imageUrls: string[] = [];

        const isCloudinaryConfigured = !!(
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        );
        console.log('[PRODUCT CREATE] STEP 4: Images to upload:', files.length, '| Cloudinary configured:', isCloudinaryConfigured);

        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 0) {
                    try {
                        if (isCloudinaryConfigured) {
                            console.log('[PRODUCT CREATE] Uploading to Cloudinary:', file.name, file.size, 'bytes');
                            const arrayBuffer = await file.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);

                            const result = await new Promise<any>((resolve, reject) => {
                                const uploadStream = cloudinary.uploader.upload_stream(
                                    {
                                        folder: 'simtech-products',
                                        quality: 'auto',
                                        fetch_format: 'auto'
                                    },
                                    (error, result) => {
                                        if (error) reject(error);
                                        else resolve(result);
                                    }
                                );
                                uploadStream.end(buffer);
                            });

                            imageUrls.push(result.secure_url);
                            console.log('[PRODUCT CREATE] Cloudinary upload success:', result.secure_url);
                        } else {
                            // Fallback: Save locally
                            console.log('[PRODUCT CREATE] Saving locally:', file.name);
                            const { writeFile, mkdir } = await import('fs/promises');
                            const path = await import('path');
                            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
                            await mkdir(uploadsDir, { recursive: true });
                            const ext = file.name.split('.').pop() || 'jpg';
                            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
                            const filePath = path.join(uploadsDir, fileName);
                            const arrayBuffer = await file.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            await writeFile(filePath, buffer);
                            imageUrls.push(`/uploads/products/${fileName}`);
                        }
                    } catch (imgErr: any) {
                        console.error('[PRODUCT CREATE] Image upload FAILED:', imgErr.message || imgErr);
                        throw new Error(`Image upload failed: ${imgErr.message || 'Cloudinary error'}`);
                    }
                }
            }
        }

        console.log('[PRODUCT CREATE] STEP 5: Saving to DB with', imageUrls.length, 'images');
        const product = await Product.create({
            name,
            slug,
            brand,
            category,
            price,
            mrp,
            discount,
            quantity,
            description: description || 'Premium refurbished product with warranty.',
            specifications,
            images: imageUrls,
            image: imageUrls.length > 0 ? imageUrls[0] : '',
            inStock: quantity > 0,
        });

        console.log('[PRODUCT CREATE] SUCCESS: Product ID:', product._id);
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error: any) {
        const errMsg = error?.message || String(error);
        console.error('[PRODUCT CREATE] FAILED:', errMsg);
        return NextResponse.json({ error: errMsg || 'Failed to create product' }, { status: 500 });
    }
}
