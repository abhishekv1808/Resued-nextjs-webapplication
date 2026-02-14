import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Suspense } from "react";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';
    const category = typeof params.category === 'string' ? params.category : '';

    await dbConnect();

    const query: any = {};

    if (category) {
        query.category = category;
    }

    if (q) {
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escaped, 'i');
        const searchConditions = [
            { name: { $regex: searchRegex } },
            { brand: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
        ];

        if (category) {
            // If category is selected, we must match category AND at least one of the search text conditions
            query.$and = [
                { category: category },
                { $or: searchConditions }
            ];
            // Remove the top-level category assignment since it's now in $and
            delete query.category;
        } else {
            // General search across all fields including category name if not specified
            query.$or = [
                ...searchConditions,
                { category: { $regex: searchRegex } }
            ];
        }
    }

    const products = await Product.find(query).lean();

    // Serialize for client component
    const serializedProducts = products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    }));

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumbs */}
                    <nav className="flex text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#29abe2]">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-semibold">Search Results</span>
                    </nav>

                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {q ? `Ah, searching for "${q}"...` : 'All Products'}
                        </h1>
                        <p className="text-gray-500">
                            We found <span className="font-bold text-[#0a2e5e]">{products.length}</span> results
                            {category ? ` in ${category}` : ''}
                            {q ? ` for "${q}"` : ''}
                        </p>
                    </div>

                    {serializedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {serializedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-4">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#0a2e5e]">
                                <i className="ri-search-2-line text-4xl"></i>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No matches found</h2>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                We couldn&apos;t find any products matching your search. Try different keywords or browse our categories.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/" className="px-6 py-3 bg-[#0a2e5e] text-white rounded-xl font-bold hover:bg-[#29abe2] transition-colors">
                                    Go Home
                                </Link>
                                <Link href="/laptops" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                    Browse Laptops
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
