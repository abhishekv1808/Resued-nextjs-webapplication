import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarFilter from "@/components/ProductList/SidebarFilter";
import HeroSection from "@/components/ProductList/HeroSection";
import SortDropdown from "@/components/ProductList/SortDropdown";
import ProductCard from "@/components/ProductCard";
import { categoryConfig } from "@/constants/categoryConfig";
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { category } = await params;

    // Validate category (simple singular/plural normalization if needed or strict check)
    // The EJS files used 'laptops', 'desktops', 'monitors'. 
    // We'll support singular mapping too just in case.
    const singularMap: Record<string, string> = {
        'laptop': 'laptops',
        'desktop': 'desktops',
        'monitor': 'monitors',
        'accessory': 'accessories'
    };

    const normalizedCategory = singularMap[category] || category;
    const config = categoryConfig[normalizedCategory];

    if (!config) {
        notFound();
    }

    const resolvedSearchParams = await searchParams;

    // Database Query Construction
    await dbConnect();
    const query: any = {
        category: normalizedCategory.slice(0, -1) // 'laptops' -> 'laptop'
    };

    // Apply Filters
    if (resolvedSearchParams.brand) {
        const brands = Array.isArray(resolvedSearchParams.brand)
            ? resolvedSearchParams.brand
            : [resolvedSearchParams.brand];
        query.brand = { $in: brands };
    }

    if (resolvedSearchParams.price) {
        // Price filtering logic matches the EJS implementation manually
        // Since we can't easily query mixed ranges like EJS frontend did without complex logic affecting separate queries
        // Ideally, we'd parse these strings into numeric ranges. 
        // For now, let's fetch matching brand/category and filter in memory if volume is low, 
        // OR implement proper range parsing. Given the "Under X" strings, it's safer to implement range logic.

        // EJS implementation was handled by re-fetching or reloading page. 
        // Let's implement basic range parsing:
        const priceRanges = Array.isArray(resolvedSearchParams.price)
            ? resolvedSearchParams.price
            : [resolvedSearchParams.price];

        const priceQuery: any[] = [];
        priceRanges.forEach((range: string) => {
            if (range.includes('Under')) {
                const val = parseInt(range.replace(/[^\d]/g, ''));
                priceQuery.push({ price: { $lte: val } });
            } else if (range.includes('Above')) {
                const val = parseInt(range.replace(/[^\d]/g, ''));
                priceQuery.push({ price: { $gte: val } });
            } else if (range.includes('-')) {
                const [min, max] = range.split('-').map(s => parseInt(s.replace(/[^\d]/g, '')));
                priceQuery.push({ price: { $gte: min, $lte: max } });
            }
        });

        if (priceQuery.length > 0) {
            query.$or = priceQuery;
        }
    }

    // Add other filters similarly (processor, ram, storage, formFactor, screenSize, etc.)
    ['processor', 'ram', 'storage', 'formFactor', 'screenSize', 'resolution', 'refreshRate'].forEach(field => {
        if (resolvedSearchParams[field]) {
            const values = Array.isArray(resolvedSearchParams[field])
                ? resolvedSearchParams[field]
                : [resolvedSearchParams[field]];

            // Map common display fields to their nested specification counterparts
            const schemaField = `specifications.${field}`;
            query[schemaField] = { $in: values };
        }
    });


    // Sorting Logic
    const sortParam = resolvedSearchParams.sort || 'featured';
    let sortOptions: any = {};

    switch (sortParam) {
        case 'price_asc':
            sortOptions = { price: 1 };
            break;
        case 'price_desc':
            sortOptions = { price: -1 };
            break;
        case 'newest':
            sortOptions = { createdAt: -1 };
            break;
        default:
            sortOptions = { rating: -1 }; // Featured logic default
    }

    const products = await Product.find(query).sort(sortOptions).lean() as any[];

    // Serialize for clean prop passing
    const serializedProducts = products.map(p => ({
        ...p,
        _id: p._id.toString(),
        date: p.date ? p.date.toISOString() : null
    }));

    // Determine current brand for specific Hero styling (like in EJS: brandConfig[currentBrand])
    // If multiple brands selected, default to 'Default' or just the first one.
    const currentBrand = typeof resolvedSearchParams.brand === 'string'
        ? resolvedSearchParams.brand
        : (Array.isArray(resolvedSearchParams.brand) && resolvedSearchParams.brand.length === 1 ? resolvedSearchParams.brand[0] : 'Default');

    const heroConfig = config.hero[currentBrand] || config.hero['Default'];


    // "You May Also Like" - fetch some random items or best sellers
    const recommendedProducts = await Product.find({ category: { $ne: query.category } }).limit(4).lean() as any[];
    const serializedRecommended = recommendedProducts.map(p => ({ ...p, _id: p._id.toString(), date: p.date ? p.date.toISOString() : null }));


    return (
        <>
            <Header />
            <main className="flex-grow pt-8 pb-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8 text-sm text-gray-500">
                        <a href="/" className="hover:text-[#a51c30]">Home</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium capitalize">{normalizedCategory}</span>
                    </nav>

                    <HeroSection config={heroConfig} />

                    <div className="flex flex-col lg:flex-row gap-8">
                        <SidebarFilter filters={config.filters} />

                        <div className="lg:w-3/4 flex flex-col min-h-[600px]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                    {currentBrand !== 'Default' ? `Used ${currentBrand} ${normalizedCategory}` : `All ${normalizedCategory}`}
                                    <span className="text-gray-500 text-lg font-normal ml-2">({products.length} items)</span>
                                </h2>
                                {/* Sort Dropdown */}
                                <SortDropdown />
                            </div>

                            {serializedProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {serializedProducts.map((product: any) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-lg">There are no {normalizedCategory} matching your criteria at the moment.</p>
                                </div>
                            )}

                            {/* Pagination - Simplified Placeholder */}
                            <div className="flex justify-center mt-auto pt-12">
                                <nav className="flex gap-2">
                                    <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                                        <i className="ri-arrow-left-s-line"></i>
                                    </button>
                                    <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#a51c30] text-white font-bold">1</button>
                                    <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50">
                                        <i className="ri-arrow-right-s-line"></i>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* You May Also Like Section */}
                    <div className="mt-20">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {serializedRecommended.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
