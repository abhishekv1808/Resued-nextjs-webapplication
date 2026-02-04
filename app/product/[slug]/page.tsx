import type { Metadata } from 'next';
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import DailyStats from "@/models/DailyStats";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import Loader from "@/components/Loader";

async function getProduct(slug: string) {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;

    // Update Daily Stats
    const today = new Date().toISOString().split('T')[0];
    try {
        // Fire and forget or await - await is safer in server component
        // But we need to use 'mock' connection logic if using our cached helper or just standard mongoose
        // The helper should work.
        await DailyStats.findOneAndUpdate(
            { date: today },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );
    } catch (e) { console.error("Stats update failed", e); }

    const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    }).limit(4).lean();

    const serialize = (obj: any) => ({ ...obj, _id: obj._id.toString() });

    return {
        product: serialize(product),
        relatedProducts: relatedProducts.map(serialize)
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const product = await Product.findOne({ slug }).select('name description image brand category').lean();

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const title = product.name;
    const description = product.description?.substring(0, 160) || `Buy ${product.name} at Simtech Computers. Best price for ${product.brand} ${product.category}.`;
    const url = `https://simtechcomputers.in/product/${slug}`;

    const image = product.image || '/images/og-image.jpg';

    return {
        title: title, // Root template will add suffix
        description: description,
        keywords: [product.name, product.brand, product.category, "refurbished laptop", "simtech computers"],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: "Simtech Computers",
            images: [
                {
                    url: image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [image],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getProduct(slug);

    if (!data) {
        notFound();
    }

    const { product, relatedProducts } = data;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: product.brand
        },
        offers: {
            '@type': 'Offer',
            url: `https://simtechcomputers.in/product/${product.slug}`,
            priceCurrency: 'INR',
            price: product.price,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/RefurbishedCondition',
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Loader />
            <Header />
            <main className="flex-grow py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#a51c30]">Home</Link>
                        <span className="mx-2">&gt;</span>
                        <Link href={`/${product.category}s`} className="hover:text-[#a51c30] capitalize">{product.category}s</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                    </nav>

                    <ProductDetailsClient product={product} />

                    {/* Related Products */}
                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                            <Link href={`/${product.category}s`} className="text-[#a51c30] font-semibold hover:underline flex items-center gap-1 text-sm">
                                View All <i className="ri-arrow-right-line"></i>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((relProduct: any) => (
                                <ProductCard key={relProduct._id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
