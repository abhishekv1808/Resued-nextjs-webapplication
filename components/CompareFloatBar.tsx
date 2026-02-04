"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";

export default function CompareFloatBar() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white shadow-2xl rounded-2xl border-2 border-red-500 p-4 flex items-center gap-4 max-w-4xl animate-scale-up">
            <div className="flex items-center gap-2 flex-1">
                <i className="ri-scales-line text-red-600 text-2xl"></i>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Compare Products</h3>
                    <p className="text-xs text-gray-500">{compareList.length}/3 selected</p>
                </div>
            </div>

            <div className="flex gap-2">
                {compareList.map((product) => (
                    <div key={product._id} className="relative group">
                        <div className="w-16 h-16 border-2 border-gray-200 rounded-lg bg-gray-50 p-1 flex items-center justify-center">
                            <Image
                                src={product.image || '/images/placeholder.png'}
                                alt={product.name}
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                        <button
                            onClick={() => removeFromCompare(product._id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                            <i className="ri-close-line text-xs"></i>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Link
                    href="/compare"
                    className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                    Compare Now <i className="ri-arrow-right-line"></i>
                </Link>
                <button
                    onClick={clearCompare}
                    className="text-gray-400 hover:text-gray-600 px-3"
                    title="Clear All"
                >
                    <i className="ri-delete-bin-line text-lg"></i>
                </button>
            </div>
        </div>
    );
}
