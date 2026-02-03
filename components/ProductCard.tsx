"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Toast from "./Toast";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        image: string;
        price: number;
        mrp: number;
        discount: number;
        rating: number;
        inStock: boolean;
        category: string;
        description?: string;
    };
    isBestSeller?: boolean;
}

export default function ProductCard({ product, isBestSeller = false }: ProductCardProps) {
    const { user } = useAuth();
    const { addToCart, removeFromCart, cart, loading: cartLoading } = useCart();
    const [addingLocal, setAddingLocal] = useState(false);
    // In a real app, we'd check if it's already in wishlist/cart from props or context
    const [inWishlist, setInWishlist] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // specific prevention

        if (!user) {
            // Trigger login modal via global event or context
            alert("Please login to add to cart");
            return;
        }

        try {
            setAddingLocal(true);
            await addToCart(product._id);
            setShowToast(true);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingLocal(false);
        }
    };

    const handleRemoveFromCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) return;

        try {
            setAddingLocal(true);
            await removeFromCart(product._id);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingLocal(false);
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to use wishlist");
            return;
        }
        // Optimistic update
        setInWishlist(!inWishlist);
        try {
            // await axios.post('/api/wishlist/toggle', { productId: product._id });
        } catch (err) {
            setInWishlist(!inWishlist); // Revert
        }
    };

    if (isBestSeller) {
        // Different layout for Best Sellers (Horizontal on desktop)
        // Deterministic percentage based on product ID to avoid hydration mismatch
        const seed = product._id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const percentage = (seed % 50) + 10;

        return (
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-6 flex flex-row gap-3 md:gap-8 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-gray-100 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-0 left-0 bg-[#a51c30] text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-4 md:py-2 rounded-br-xl md:rounded-br-2xl z-10 shadow-lg">
                    Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                </div>

                <button onClick={toggleWishlist} className="absolute top-2 right-2 md:top-4 md:right-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center hover:text-red-500 transition-all group/wishlist" title="Add to Wishlist">
                    <i className={`${inWishlist ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-400 group-hover/wishlist:text-red-500'} text-base md:text-xl transition-colors`}></i>
                </button>

                {/* Image Side */}
                <div className="w-1/3 md:w-1/2 flex items-center justify-center bg-[#f8f9fa] rounded-xl md:rounded-2xl p-2 md:p-6 relative overflow-hidden group-hover:bg-[#f1f3f5] transition-colors duration-300">
                    <Image
                        src={product.image || '/images/placeholder.png'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className={`object-contain h-full w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ${!product.inStock ? 'opacity-50 grayscale' : ''}`}
                    />
                </div>

                {/* Content Side */}
                <div className="w-2/3 md:w-1/2 flex flex-col justify-center py-0 md:py-2">
                    <div className="mb-1 md:mb-3">
                        <span className="text-gray-400 text-[10px] md:text-xs font-bold tracking-wider uppercase mb-0.5 md:mb-1 block">
                            {product.category}
                        </span>
                        <Link href={`/product/${product.slug}`} className="block group/title">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-xl leading-tight mb-1 md:mb-2 group-hover/title:text-[#a51c30] transition-colors line-clamp-2">{product.name}</h3>
                        </Link>
                        {/* Stars */}
                        <div className="flex text-yellow-400 text-xs md:text-sm gap-0.5">
                            <i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-half-fill"></i>
                            <span className="text-gray-400 text-[10px] md:text-xs ml-2 font-medium">({product.rating || 4.5})</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 md:gap-3 mb-2 md:mb-5">
                        <span className="text-[#a51c30] font-bold text-lg md:text-3xl">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 text-xs md:text-sm line-through font-medium">₹{product.mrp.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Render Progress Bar */}
                    <div className="mt-auto">
                        <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1">
                            <span className="text-gray-500">Sold: <span className="text-gray-900">{percentage}/100</span></span>
                            <span className="text-[#a51c30]">{100 - percentage} items left</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#a51c30] to-red-500 h-1.5 md:h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Card
    return (
        <div className="w-[280px] flex-shrink-0 block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 relative group cursor-pointer snap-start">
            {/* Wishlist Button */}
            <button onClick={toggleWishlist} className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-white hover:bg-red-50 shadow-sm flex items-center justify-center transition-all group/wishlist" title="Add to Wishlist">
                <i className={`${inWishlist ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-400 group-hover/wishlist:text-red-500'} text-lg transition-colors`}></i>
            </button>

            <Link href={`/product/${product.slug}`} className="block">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-black text-white text-[10px] font-bold px-2 py-1.5 rounded-full flex items-center gap-1">
                        <i className="ri-checkbox-circle-fill text-green-400 text-sm"></i> SIMTECH ASSURED
                    </div>
                    <div className="border border-green-300 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded bg-green-50">
                        -₹{(product.mrp - product.price).toLocaleString('en-IN')} OFF
                    </div>
                </div>
                <div className="h-48 flex items-center justify-center mb-4 relative">
                    <Image
                        src={product.image || '/images/placeholder.png'}
                        alt={product.name}
                        width={200}
                        height={200}
                        className={`object-contain h-full w-full group-hover:scale-105 transition-transform duration-500 ${!product.inStock ? 'opacity-50 grayscale' : ''}`}
                    />
                    {!product.inStock && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Out of Stock</span>
                        </div>
                    )}
                </div>
                <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded">Best Price Guaranteed</span>
                    <div className="flex items-center gap-1 border border-gray-200 px-1.5 py-0.5 rounded text-xs font-bold text-gray-700 bg-gray-50">
                        {product.rating || 4.5} <i className="ri-star-fill text-yellow-400 text-[10px]"></i>
                    </div>
                </div>
                <div className="flex items-baseline gap-2 flex-wrap pr-10">
                    <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 text-xs line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                    <span className="text-red-500 font-bold text-sm">-{product.discount}%</span>
                </div>
            </Link>

            {product.inStock ? (
                // Check if in cart
                cart.some(item => item.product._id === product._id) ? (
                    <button
                        onClick={handleRemoveFromCart}
                        disabled={addingLocal}
                        className="absolute bottom-4 right-4 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-md z-20"
                        title="Remove from Cart">
                        {addingLocal ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-delete-bin-line"></i>}
                    </button>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={addingLocal}
                        className="absolute bottom-4 right-4 bg-[#a51c30] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-md z-20 disabled:opacity-70"
                        title="Add to Cart">
                        {addingLocal ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-shopping-cart-2-line"></i>}
                    </button>
                )
            ) : (
                <button className="absolute bottom-4 right-4 bg-gray-200 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center cursor-not-allowed z-20" disabled>
                    <i className="ri-prohibited-line"></i>
                </button>
            )}

            {/* Toast Notification */}
            <Toast
                message="Product added to cart!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
