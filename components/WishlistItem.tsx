'use client';

import Image from 'next/image';
import Link from 'next/link';
import { removeFromWishlist } from '@/app/actions/user';
import { useTransition } from 'react';

interface Product {
    _id: string;
    name: string;
    brand: string;
    slug: string;
    price: number;
    mrp: number;
    image: string; // URL string
    inStock: boolean;
}

export default function WishlistItem({ product }: { product: Product }) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        if (!confirm('Are you sure you want to remove this item?')) return;

        startTransition(async () => {
            const result = await removeFromWishlist(product._id);
            if (!result.success) {
                alert(result.message);
            }
        });
    };

    // Ensure image format. If 'uploads/' prefix exists and not http, prepend domain or use public. 
    // Assuming optimizeImage logic from EJS is handled by next/image or Cloudinary config for 'https'.
    // If local path, prepend slash if missing.
    const imgSrc = product.image.startsWith('http') ? product.image : (product.image.startsWith('/') ? product.image : `/${product.image}`);


    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative group border border-gray-100 flex flex-col">

            {/* Remove Button */}
            <button
                onClick={handleRemove}
                disabled={isPending}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
                title="Remove from Wishlist"
            >
                {isPending ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-close-line text-lg"></i>}
            </button>

            {/* Image */}
            <Link href={`/product/${product.slug}`} className="block mb-4 bg-gray-50 rounded-xl p-6 h-48 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-full h-full">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                </div>
                <Link href={`/product/${product.slug}`} className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#0a2e5e] transition-colors">
                    {product.name}
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#0a2e5e]">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                    </div>

                    {product.inStock ? (
                        <Link href={`/product/${product.slug}`} className="bg-[#0a2e5e] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#29abe2] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                            <i className="ri-eye-line"></i> View
                        </Link>
                    ) : (
                        <button disabled className="bg-gray-200 text-gray-400 px-4 py-2 rounded-full text-sm font-bold cursor-not-allowed">
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
