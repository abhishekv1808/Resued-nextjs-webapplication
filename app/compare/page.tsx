"use client";

import { useCompare } from "@/context/CompareContext";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) {
        return (
            <>
                <Loader />
                <Header />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-md">
                        <i className="ri-scales-3-line text-6xl text-gray-300 mb-4 block"></i>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products to Compare</h2>
                        <p className="text-gray-500 mb-6">Add up to 3 products to compare features and prices.</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                            <i className="ri-arrow-left-line"></i> Browse Products
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Collect all unique spec keys
    const allSpecKeys = new Set<string>();
    compareList.forEach(product => {
        if (product.specifications) {
            Object.keys(product.specifications).forEach(key => allSpecKeys.add(key));
        }
    });
    const specKeys = Array.from(allSpecKeys);

    return (
        <>
            <Loader />
            <Header />
            <main className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Products</h1>
                            <p className="text-gray-500">Side-by-side comparison of selected items</p>
                        </div>
                        <button
                            onClick={clearCompare}
                            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                        >
                            <i className="ri-delete-bin-line"></i> Clear All
                        </button>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 text-left font-bold text-gray-900 bg-gray-50 sticky left-0 z-10 min-w-[150px]">Specification</th>
                                    {compareList.map((product) => (
                                        <th key={product._id} className="p-4 text-center bg-gray-50 min-w-[250px]">
                                            <div className="relative">
                                                <button
                                                    onClick={() => removeFromCompare(product._id)}
                                                    className="absolute top-0 right-0 w-6 h-6 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                                                    title="Remove"
                                                >
                                                    <i className="ri-close-line text-sm"></i>
                                                </button>
                                                <Image
                                                    src={product.image || '/images/placeholder.png'}
                                                    alt={product.name}
                                                    width={120}
                                                    height={120}
                                                    className="object-contain mx-auto mb-2"
                                                />
                                                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Price Row */}
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Price</td>
                                    {compareList.map((product) => (
                                        <td key={product._id} className="p-4 text-center">
                                            <div className="text-2xl font-bold text-red-600">₹{product.price.toLocaleString('en-IN')}</div>
                                            <div className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Brand */}
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Brand</td>
                                    {compareList.map((product) => (
                                        <td key={product._id} className="p-4 text-center text-gray-900">{product.brand || 'N/A'}</td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Category</td>
                                    {compareList.map((product) => (
                                        <td key={product._id} className="p-4 text-center text-gray-900 capitalize">{product.category}</td>
                                    ))}
                                </tr>

                                {/* Specifications */}
                                {specKeys.map((key) => (
                                    <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 capitalize">{key}</td>
                                        {compareList.map((product) => (
                                            <td key={product._id} className="p-4 text-center text-gray-900">
                                                {product.specifications?.[key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Actions */}
                                <tr>
                                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Actions</td>
                                    {compareList.map((product) => (
                                        <td key={product._id} className="p-4 text-center">
                                            <Link
                                                href={`/product/${product.slug}`}
                                                className="inline-block bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
