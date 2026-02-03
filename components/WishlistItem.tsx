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
                <Link href={`/product/${product.slug}`} className="group-hover:text-[#a51c30] transition-colors">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-[#a51c30]">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                    </div>

                    {product.inStock ? (
                        // Using simple form for Cart for now, or could use Client Component for Cart Action
                        // For simplicity and to match existing patterns:
                        <form action="/api/cart/add" method="POST">
                            {/* NOTE: We might want a dedicated Server Action for Add to Cart later. 
                               For now, let's assume Cart page handles generic add, or we use a button that calls an API.
                               Actually, standard Next.js way: Server Action `addToCart(productId)`.
                           */}
                            <input type="hidden" name="productId" value={product._id} />
                            <Link href={`/product/${product.slug}`} className="bg-[#a51c30] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                                <i className="ri-shopping-cart-line"></i> View
                            </Link>
                        </form>
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
