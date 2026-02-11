"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

interface CartItem {
    product_id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    inStock: boolean;
}

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            fetchCart();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [authLoading, user]);

    const fetchCart = async () => {
        try {
            const { data } = await axios.get("/api/cart");
            const mappedItems = (data.cart || []).map((item: any) => ({
                product_id: item.product._id,
                slug: item.product.slug,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                inStock: item.product.inStock
            }));

            setCartItems(mappedItems);

            // Calculate totals locally since API only returns items
            const subtotal = mappedItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            const tax = Math.round(subtotal * 0.18);
            const total = subtotal + tax; // Provided API doesn't seem to charge shipping

            setTotals({ subtotal, tax, total });
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, action: 'increase' | 'decrease') => {
        const item = cartItems.find(i => i.product_id === productId);
        if (!item) return;

        const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;

        if (newQuantity < 1) return; // Prevent going below 1, let remove button handle that

        try {
            // Optimistic update
            setCartItems(prev => prev.map(i =>
                i.product_id === productId ? { ...i, quantity: newQuantity } : i
            ));

            // Recalculate totals immediately for better UX
            const updatedItems = cartItems.map(i =>
                i.product_id === productId ? { ...i, quantity: newQuantity } : i
            );
            const subtotal = updatedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            const tax = Math.round(subtotal * 0.18);
            const total = subtotal + tax;
            setTotals({ subtotal, tax, total });

            await axios.put("/api/cart", { productId, quantity: newQuantity });
            fetchCart(); // Sync with server to be safe
            router.refresh();
        } catch (error) {
            console.error("Failed to update cart", error);
            fetchCart(); // Revert on error
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await axios.delete(`/api/cart?productId=${productId}`);
            fetchCart();
            router.refresh();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    if (authLoading || (user && loading)) return <Loader />;

    return (
        <>
            <Header />
            <main className="flex-grow py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    {user ? (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items List */}
                            <div className={cartItems.length > 0 ? "lg:w-2/3" : "w-full"}>
                                {cartItems.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        {/* Desktop Header */}
                                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                            <div className="col-span-6">Product</div>
                                            <div className="col-span-2 text-center">Price</div>
                                            <div className="col-span-2 text-center">Quantity</div>
                                            <div className="col-span-2 text-center">Total</div>
                                        </div>

                                        {/* Items */}
                                        <div className="divide-y divide-gray-100">
                                            {cartItems.map((item) => (
                                                <div key={item.product_id} className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group">
                                                    {/* Product Info */}
                                                    <div className="w-full md:col-span-6 flex gap-4 items-center">
                                                        <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                                                            <Image
                                                                src={item.image || '/images/placeholder.png'}
                                                                alt={item.name}
                                                                width={100}
                                                                height={100}
                                                                className="w-full h-full object-contain mix-blend-multiply"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 md:text-sm mb-1 hover:text-[#a51c30] transition-colors">
                                                                <Link href={`/product/${item.slug}`}>{item.name}</Link>
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mb-2">Condition: Good | Warranty: 6 Months</p>
                                                            <button onClick={() => removeItem(item.product_id)} className="text-red-500 text-xs font-semibold hover:underline flex items-center gap-1">
                                                                <i className="ri-delete-bin-line"></i> Remove
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="w-full md:col-span-2 md:text-center flex justify-between md:block">
                                                        <span className="md:hidden text-gray-500 text-sm">Price:</span>
                                                        <span className="font-bold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="w-full md:col-span-2 md:text-center flex justify-between md:justify-center">
                                                        <span className="md:hidden text-gray-500 text-sm">Quantity:</span>
                                                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                            <button onClick={() => updateQuantity(item.product_id, 'decrease')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors rounded-l-lg">-</button>
                                                            <input type="text" id="quantity" name="quantity" value={item.quantity} className="w-10 text-center text-sm font-semibold border-x border-gray-200 focus:outline-none py-1" readOnly />
                                                            <button onClick={() => updateQuantity(item.product_id, 'increase')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors rounded-r-lg">+</button>
                                                        </div>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="w-full md:col-span-2 md:text-center flex justify-between md:block">
                                                        <span className="md:hidden text-gray-500 text-sm">Total:</span>
                                                        <span className="font-bold text-[#a51c30]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-2xl mx-auto">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <i className="ri-shopping-cart-2-line text-4xl text-gray-300"></i>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                                        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                                        <Link href="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-[#a51c30] hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}

                                {cartItems.length > 0 && (
                                    <div className="mt-6 flex justify-between items-center">
                                        <Link href="/" className="text-gray-600 hover:text-[#a51c30] font-semibold flex items-center gap-2 transition-colors">
                                            <i className="ri-arrow-left-line"></i> Continue Shopping
                                        </Link>
                                    </div>
                                )}

                            </div>

                            {/* Order Summary */}
                            {cartItems.length > 0 && (
                                <div className="lg:w-1/3">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                                        <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span className="font-semibold">₹{totals.subtotal.toLocaleString("en-IN")}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span className="text-green-600 font-semibold">Free</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax (18% GST)</span>
                                                <span className="font-semibold">₹{totals.tax.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 mb-6">
                                            <div className="flex justify-between items-end">
                                                <span className="text-lg font-bold text-gray-900">Total</span>
                                                <span className="text-2xl font-bold text-[#a51c30]">₹{totals.total.toLocaleString("en-IN")}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
                                        </div>

                                        <Link href="/checkout" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                            Proceed to Checkout <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                                        </Link>

                                        <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
                                            <i className="ri-visa-line text-2xl"></i>
                                            <i className="ri-mastercard-line text-2xl"></i>
                                            <i className="ri-paypal-line text-2xl"></i>
                                            <i className="ri-bank-card-line text-2xl"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <i className="ri-lock-2-line text-4xl text-[#a51c30]"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
                            <p className="text-gray-500 mb-8 text-center max-w-md">
                                Please login to view your shopping cart and proceed with your purchase.
                            </p>
                            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-[#a51c30] hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl gap-2">
                                <i className="ri-login-box-line"></i> Login Now
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
