"use client";

import { useCompare } from "@/context/CompareContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

interface Product {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    mrp: number;
    category: string;
    brand?: string;
    specifications?: any;
}

export default function ComparePage() {
    const { selectedProductIds, setSelectedProductIds, clearCompare } = useCompare();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>([null, null, null]);

    // Fetch all products
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Load selected products based on IDs
    useEffect(() => {
        if (allProducts.length > 0 && selectedProductIds && selectedProductIds.length > 0) {
            const products = selectedProductIds.map(id =>
                allProducts.find(p => p._id === id) || null
            );
            setSelectedProducts([
                products[0] || null,
                products[1] || null,
                products[2] || null
            ]);
        }
    }, [allProducts, selectedProductIds]);

    const handleProductSelect = (index: number, productId: string) => {
        const product = allProducts.find(p => p._id === productId);
        if (!product) return;

        const newSelected = [...selectedProducts];
        newSelected[index] = product;
        setSelectedProducts(newSelected);

        // Update context
        const newIds = newSelected.filter(p => p !== null).map(p => p!._id);
        setSelectedProductIds(newIds);
    };

    const handleRemoveProduct = (index: number) => {
        const newSelected = [...selectedProducts];
        newSelected[index] = null;
        setSelectedProducts(newSelected);

        // Update context
        const newIds = newSelected.filter(p => p !== null).map(p => p!._id);
        setSelectedProductIds(newIds);
    };

    const handleClearAll = () => {
        setSelectedProducts([null, null, null]);
        clearCompare();
    };

    // Group products by category for dropdown
    const laptops = allProducts.filter(p => p.category === 'laptop');
    const desktops = allProducts.filter(p => p.category === 'desktop');
    const monitors = allProducts.filter(p => p.category === 'monitor');
    const accessories = allProducts.filter(p => p.category === 'accessory');

    // Collect all unique spec keys from selected products
    const allSpecKeys = new Set<string>();
    selectedProducts.forEach(product => {
        if (product?.specifications) {
            Object.keys(product.specifications).forEach(key => allSpecKeys.add(key));
        }
    });
    const specKeys = Array.from(allSpecKeys);

    const hasAnySelected = selectedProducts.some(p => p !== null);

    return (
        <>
            <Loader />
            <Header />
            <main className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Products</h1>
                            <p className="text-gray-500">Select up to 3 products to compare specifications and prices</p>
                        </div>
                        {hasAnySelected && (
                            <button
                                onClick={handleClearAll}
                                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                            >
                                <i className="ri-delete-bin-line"></i> Clear All
                            </button>
                        )}
                    </div>

                    {/* Product Selection Dropdowns */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="ri-database-2-line text-red-600"></i>
                            Select Products to Compare
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product {index + 1}
                                    </label>
                                    <select
                                        value={selectedProducts[index]?._id || ''}
                                        onChange={(e) => handleProductSelect(index, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                                    >
                                        <option value="">-- Select a product --</option>

                                        {laptops.length > 0 && (
                                            <optgroup label="Laptops">
                                                {laptops.map(product => (
                                                    <option
                                                        key={product._id}
                                                        value={product._id}
                                                        disabled={selectedProducts.some((p, i) => i !== index && p?._id === product._id)}
                                                    >
                                                        {product.name} - ₹{product.price.toLocaleString('en-IN')}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}

                                        {desktops.length > 0 && (
                                            <optgroup label="Desktops">
                                                {desktops.map(product => (
                                                    <option
                                                        key={product._id}
                                                        value={product._id}
                                                        disabled={selectedProducts.some((p, i) => i !== index && p?._id === product._id)}
                                                    >
                                                        {product.name} - ₹{product.price.toLocaleString('en-IN')}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}

                                        {monitors.length > 0 && (
                                            <optgroup label="Monitors">
                                                {monitors.map(product => (
                                                    <option
                                                        key={product._id}
                                                        value={product._id}
                                                        disabled={selectedProducts.some((p, i) => i !== index && p?._id === product._id)}
                                                    >
                                                        {product.name} - ₹{product.price.toLocaleString('en-IN')}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}

                                        {accessories.length > 0 && (
                                            <optgroup label="Accessories">
                                                {accessories.map(product => (
                                                    <option
                                                        key={product._id}
                                                        value={product._id}
                                                        disabled={selectedProducts.some((p, i) => i !== index && p?._id === product._id)}
                                                    >
                                                        {product.name} - ₹{product.price.toLocaleString('en-IN')}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>
                                    {selectedProducts[index] && (
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            className="absolute top-0 right-0 text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            <i className="ri-close-circle-fill text-xl"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comparison Table */}
                    {hasAnySelected ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="p-4 text-left font-bold text-gray-900 bg-gray-50 sticky left-0 z-10 min-w-[150px]">Specification</th>
                                        {selectedProducts.map((product, index) => (
                                            <th key={index} className="p-4 text-center bg-gray-50 min-w-[250px]">
                                                {product ? (
                                                    <div className="relative">
                                                        <Image
                                                            src={product.image || '/images/placeholder.png'}
                                                            alt={product.name}
                                                            width={120}
                                                            height={120}
                                                            className="object-contain mx-auto mb-2"
                                                        />
                                                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 italic">Not selected</div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Price Row */}
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Price</td>
                                        {selectedProducts.map((product, index) => (
                                            <td key={index} className="p-4 text-center">
                                                {product ? (
                                                    <>
                                                        <div className="text-2xl font-bold text-red-600">₹{product.price.toLocaleString('en-IN')}</div>
                                                        <div className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Brand */}
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Brand</td>
                                        {selectedProducts.map((product, index) => (
                                            <td key={index} className="p-4 text-center text-gray-900">
                                                {product?.brand || '-'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Category */}
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Category</td>
                                        {selectedProducts.map((product, index) => (
                                            <td key={index} className="p-4 text-center text-gray-900 capitalize">
                                                {product?.category || '-'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Specifications */}
                                    {specKeys.map((key) => (
                                        <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 capitalize">{key}</td>
                                            {selectedProducts.map((product, index) => (
                                                <td key={index} className="p-4 text-center text-gray-900">
                                                    {product?.specifications?.[key] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* Actions */}
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Actions</td>
                                        {selectedProducts.map((product, index) => (
                                            <td key={index} className="p-4 text-center">
                                                {product ? (
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        className="inline-block bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                            <i className="ri-scales-3-line text-6xl text-gray-300 mb-4 block"></i>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Selected</h2>
                            <p className="text-gray-500 mb-6">Select products from the dropdowns above to start comparing.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
