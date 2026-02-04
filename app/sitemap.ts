import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://simtechcomputers.in';

    // Connect to DB
    await dbConnect();

    // Fetch dynamic data
    const products = await Product.find({}).select('slug updatedAt').lean();
    const blogs = await Blog.find({}).select('_id updatedAt').lean();

    // Static Routes
    const routes = [
        '',
        '/about-us',
        '/contact-us',
        '/blogs',
        '/login',
        '/signup',
        '/cart',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Product Routes
    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic Blog Routes
    const blogRoutes = blogs.map((blog: any) => ({
        url: `${baseUrl}/blogs/${blog._id}`,
        lastModified: blog.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Category Routes (Static list or dynamic if we had a Category model)
    const categoryRoutes = ['laptops', 'desktops', 'monitors', 'accessories'].map((cat) => ({
        url: `${baseUrl}/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
