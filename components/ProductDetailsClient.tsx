"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import StockAlertModal from "./StockAlertModal";
import Toast from "./Toast";

interface ProductDetailsClientProps {
    product: any; // Type accurately if possible
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const [activeImage, setActiveImage] = useState(product.image);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [stockAlertOpen, setStockAlertOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { user } = useAuth();
    const { addToCart, loading: cartLoading } = useCart();
    const router = useRouter();

    const handleImageChange = (src: string) => {
        setActiveImage(src);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = product.name;
        if (navigator.share) {
            try {
                await navigator.share({ title, text: 'Check out this product on Simtech Computers!', url });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setToast({ message: 'Link copied to clipboard!', type: 'success' });
            } catch (err) {
                setToast({ message: 'Failed to copy link', type: 'error' });
            }
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            setToast({ message: 'Please login to add items to cart', type: 'error' });
            return;
        }

        try {
            await addToCart(product._id);
            // Cart count will automatically update via CartContext
            setToast({ message: 'Product added to cart!', type: 'success' });
        } catch (err) {
            console.error("Failed to add to cart:", err);
            setToast({ message: 'Failed to add to cart', type: 'error' });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-10">

                {/* Left Column: Image Gallery */}
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center group">
                        {/* Assurance Badge */}
                        <div className="absolute top-4 left-4 bg-[#0a1e38] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 shadow-sm">
                            <i className="ri-checkbox-circle-fill text-[#a51c30] text-sm"></i> SIMTECH ASSURED
                        </div>
                        {/* Share Btn */}
                        <button onClick={handleShare} className="absolute top-4 right-14 w-9 h-9 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all z-10" title="Share Product">
                            <i className="ri-share-line text-lg"></i>
                        </button>

                        {/* Main Image */}
                        <Image
                            src={activeImage || '/images/placeholder.png'}
                            alt={product.name}
                            width={500}
                            height={400}
                            className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images && product.images.length > 0 ? (
                            [product.image, ...product.images.filter((img: string) => img !== product.image)].map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageChange(img)}
                                    className={`w-20 h-20 rounded-lg border-2 ${activeImage === img ? 'border-[#a51c30]' : 'border-gray-200 hover:border-gray-300'} bg-white p-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all`}
                                >
                                    <Image src={img || '/images/placeholder.png'} alt="thumbnail" width={80} height={80} className="object-contain w-full h-full" />
                                </button>
                            ))
                        ) : (
                            <button className="w-20 h-20 rounded-lg border-2 border-[#a51c30] bg-white p-2 flex-shrink-0 cursor-pointer overflow-hidden">
                                <Image src={product.image || '/images/placeholder.png'} alt="thumbnail" width={80} height={80} className="object-contain w-full h-full" />
                            </button>
                        )}
                    </div>

                    {/* Trust Bar */}
                    <div className="bg-black text-white rounded-lg p-3 flex justify-between items-center text-xs md:text-sm font-medium mt-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded flex items-center justify-center font-bold">32</span>
                            <div>Points<br />Quality Check</div>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded flex items-center justify-center font-bold text-[#00aaff]">7</span>
                            <div>Days<br />Replacement</div>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded flex items-center justify-center font-bold text-[#00aaff]">06</span>
                            <div>Months<br />Warranty</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                        <div className="relative">
                            <p className={`text-gray-600 text-sm leading-relaxed ${descriptionExpanded ? '' : 'line-clamp-3'} transition-all duration-300`}>
                                {product.description}
                            </p>
                            <button
                                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                                className="text-[#a51c30] text-sm font-bold mt-1 hover:underline focus:outline-none"
                            >
                                {descriptionExpanded ? 'View Less' : 'View More'}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Product Details */}
                <div className="lg:w-1/2">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 leading-tight">{product.name}</h1>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-[#a51c30] text-white px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                            {product.rating} <i className="ri-star-fill text-[10px]"></i>
                        </span>
                        <span className="text-gray-500 text-sm hover:underline cursor-pointer">4 reviews</span>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6">
                        <div className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1"><i className="ri-price-tag-3-fill"></i> Online Exclusive Price!</div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="text-gray-400 text-lg line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                            <span className="text-red-500 font-bold text-lg">{product.discount}% OFF</span>
                        </div>
                    </div>

                    {/* Extended Warranty Add-on */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#a51c30] shadow-sm">
                                <i className="ri-shield-check-fill text-xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Extended Warranty</h4>
                                <p className="text-gray-500 text-xs">Add 6 Months for ₹1,499</p>
                            </div>
                        </div>
                        <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded hover:bg-gray-800 transition-colors">Add</button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-10">
                        {product.inStock ? (
                            <>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="flex-1 border-2 border-black text-black font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cartLoading ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-shopping-cart-2-line"></i>} Add to Cart
                                </button>
                                <button className="flex-1 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                    Buy Now
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setStockAlertOpen(true)}
                                    className="flex-1 border-2 border-blue-500 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="ri-notification-3-line"></i> Notify When Available
                                </button>
                                <button disabled className="flex-1 bg-gray-200 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed">
                                    Out of Stock
                                </button>
                            </>
                        )}
                    </div>

                    {/* Technical Specs */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Technical Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Map specs dynamically or safely */}
                            {(product.category === 'laptop' || product.category === 'desktop') && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Processor</span>
                                        <span className="font-bold text-gray-900 text-sm">{product.specifications?.processor || 'N/A'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">RAM</span>
                                        <span className="font-bold text-gray-900 text-sm">{product.specifications?.ram || 'N/A'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Storage</span>
                                        <span className="font-bold text-gray-900 text-sm">{product.specifications?.storage || 'N/A'}</span>
                                    </div>
                                    {product.specifications?.display && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Display</span>
                                            <span className="font-bold text-gray-900 text-sm">{product.specifications?.display}</span>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">OS</span>
                                        <span className="font-bold text-gray-900 text-sm">{product.specifications?.os || 'N/A'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Graphics</span>
                                        <span className="font-bold text-gray-900 text-sm">{product.specifications?.graphics || 'Integrated'}</span>
                                    </div>
                                </>
                            )}
                            {/* Add other categories logic if needed, simplify for now */}
                        </div>
                    </div>

                </div>
            </div>

            {/* Stock Alert Modal */}
            <StockAlertModal
                isOpen={stockAlertOpen}
                onClose={() => setStockAlertOpen(false)}
                productId={product._id}
                productName={product.name}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={!!toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
