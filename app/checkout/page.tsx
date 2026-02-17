"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import CelebrationModal from "@/components/CelebrationModal";
import Script from "next/script";

export default function CheckoutPage() {
    return (
        <Suspense fallback={<Loader />}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [discount, setDiscount] = useState({ code: "", amount: 0, message: "", isApplied: false });
    const [discountInput, setDiscountInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationData, setCelebrationData] = useState({ discountAmount: 0, originalTotal: 0, code: "" });
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentError = searchParams.get("error");

    // specific form state for the new detailed layout
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "India", // Default
        streetAddress: "",
        city: "",
        state: "",
        zipCode: ""
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login?redirect=/checkout");
            } else {
                fetchCart();
                // Auto-fill logic
                setFormData(prev => ({
                    ...prev,
                    fullName: user.name || "",
                    phone: user.phone || "",
                    email: user.email || "",
                    // If user has a saved full address, put it in street address for now, 
                    // or location if no address.
                    streetAddress: user.address || user.location || "",
                }));
            }
        }
    }, [authLoading, user, router]);

    const fetchCart = async () => {
        try {
            const { data } = await axios.get("/api/cart");
            const rawCart = data.cart || [];

            if (rawCart.length === 0) {
                router.push("/cart");
                return;
            }

            const mappedItems = rawCart.map((item: any) => ({
                product_id: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity
            }));

            setCartItems(mappedItems);

            const subtotal = mappedItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            const tax = Math.round(subtotal * 0.18);
            const total = subtotal + tax;

            setTotals({ subtotal, tax, total });
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        const { fullName, phone, streetAddress, city, state, zipCode, country } = formData;

        if (!fullName || !phone || !streetAddress || !city || !zipCode) {
            alert("Please fill in all required (*) fields.");
            return;
        }

        if (!agreedToTerms) {
            alert("Please agree to the Terms and Conditions.");
            return;
        }

        // Combine address for backend
        const fullAddress = `${streetAddress}, ${city}, ${state} - ${zipCode}, ${country}`;

        setPaying(true);
        try {
            // Create Order & get PhonePe redirect URL
            const { data } = await axios.post("/api/create-order", {
                address: fullAddress,
                discountCode: discount.isApplied ? discount.code : undefined
            });

            if (!data.success) {
                alert(data.message);
                setPaying(false);
                return;
            }

            // Use PhonePe Checkout SDK to open payment page (IFRAME mode for inline QR + UPI)
            if (data.redirectUrl) {
                const win = window as any;
                if (win.PhonePeCheckout && win.PhonePeCheckout.transact) {
                    win.PhonePeCheckout.transact({
                        tokenUrl: data.redirectUrl,
                        type: "IFRAME",
                        callback: (response: string) => {
                            if (response === "USER_CANCEL") {
                                setPaying(false);
                            } else if (response === "CONCLUDED") {
                                // Payment concluded — verify status on server
                                window.location.href = `/api/verify-payment?merchantOrderId=${data.merchantOrderId}`;
                            }
                        },
                    });
                } else {
                    // Fallback: direct redirect if SDK hasn't loaded
                    window.location.href = data.redirectUrl;
                }
            } else {
                alert("Failed to get payment URL. Please try again.");
                setPaying(false);
            }

        } catch (err: any) {
            console.error("Payment Error", err);
            alert(err.response?.data?.message || "Something went wrong");
            setPaying(false);
        }
    };

    const handleApplyDiscount = async () => {
        if (!discountInput.trim()) return;

        try {
            const { data } = await axios.post("/api/cart/verify-discount", {
                code: discountInput,
                cartTotal: totals.total // Send total including tax as base for discount check
            });

            if (data.success) {
                // Store celebration data before updating state
                setCelebrationData({
                    discountAmount: data.discountAmount,
                    originalTotal: totals.total,
                    code: discountInput
                });

                setDiscount({
                    code: discountInput,
                    amount: data.discountAmount,
                    message: data.message,
                    isApplied: true
                });
                // Update visible total locally
                setTotals(prev => ({ ...prev, total: prev.total - data.discountAmount }));
                setDiscountInput(""); // Clear input

                // Show celebration modal
                setShowCelebration(true);
            }
        } catch (error: any) {
            setDiscount({
                code: "",
                amount: 0,
                message: error.response?.data?.message || "Invalid code",
                isApplied: false
            });
        }
    };

    const handleRemoveDiscount = () => {
        setTotals(prev => ({ ...prev, total: prev.total + discount.amount }));
        setDiscount({ code: "", amount: 0, message: "", isApplied: false });
    };

    if (authLoading || loading) return <Loader />;

    return (
        <>
            <Script
                src="https://mercury.phonepe.com/web/bundle/checkout.js"
                strategy="afterInteractive"
            />
            <Header />
            <main className="min-h-screen bg-white">
                <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">

                    {/* LEFT COLUMN: Shipping Info */}
                    <div className="w-full lg:w-3/5 p-6 lg:p-12 lg:pr-16">
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                            <div className="text-sm text-gray-500 mt-2">Home / Checkout</div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                        {/* Delivery Toggle (Visual Only) */}
                        <div className="flex gap-4 mb-8">
                            <button className="flex-1 py-3 px-4 rounded-xl border-2 border-[#0a2e5e] bg-blue-50 text-[#0a2e5e] font-bold flex items-center justify-center gap-2 transition-colors">
                                <i className="ri-truck-line"></i> Delivery
                            </button>
                            <button className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                <i className="ri-store-2-line"></i> Pick up
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone number *</label>
                                <div className="flex">
                                    <div className="px-3 py-3 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg text-gray-600 flex items-center gap-1">
                                        <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5" />
                                        <span className="text-sm font-medium">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-r-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Country *</label>
                                <div className="relative">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none appearance-none bg-white transition-colors"
                                    >
                                        <option value="India">India</option>
                                        {/* Add more if needed */}
                                    </select>
                                    <i className="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Address *</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                    placeholder="Street address, Apartment, Suite, etc."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                        placeholder="Enter state"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none transition-colors"
                                        placeholder="Zip code"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        id="terms"
                                        name="terms"
                                        className="w-5 h-5 rounded border-gray-300 text-[#0a2e5e] focus:ring-[#0a2e5e] transition-colors"
                                    />
                                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                        I have read and agree to the <Link href="/terms" className="text-[#0a2e5e] font-semibold hover:underline">Terms and Conditions</Link>.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Cart Review */}
                    <div className="w-full lg:w-2/5 bg-gray-50 p-6 lg:p-12 border-l border-gray-100 min-h-screen">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Review your cart</h2>

                        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={item.image || '/images/placeholder.png'}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">{item.name}</h3>
                                        <div className="text-xs text-gray-500 mb-1.5">Qty: {item.quantity}</div>
                                        <div className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Discount Code */}
                        <div className="mb-8">
                            {!discount.isApplied ? (
                                <div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="ri-coupon-3-line text-gray-400"></i>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Discount code"
                                                value={discountInput}
                                                onChange={(e) => setDiscountInput(e.target.value)}
                                                id="discountCode"
                                                name="discountCode"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0a2e5e] focus:ring-1 focus:ring-[#0a2e5e] outline-none text-sm transition-colors uppercase"
                                            />
                                        </div>
                                        <button
                                            onClick={handleApplyDiscount}
                                            disabled={!discountInput}
                                            className="bg-white border border-gray-200 text-[#0a2e5e] font-semibold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {discount.message && !discount.isApplied && (
                                        <p className="text-red-500 text-xs mt-2">{discount.message}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-coupon-2-fill text-green-600"></i>
                                        <span className="text-green-700 font-semibold text-sm">Code <span className="uppercase">{discount.code}</span> applied!</span>
                                    </div>
                                    <button onClick={handleRemoveDiscount} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <i className="ri-close-circle-fill text-xl"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{totals.subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span className="font-medium text-gray-900">₹0.00</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (18% GST)</span>
                                <span className="font-medium text-gray-900">₹{totals.tax.toLocaleString("en-IN")}</span>
                            </div>
                            {discount.isApplied && (
                                <>
                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-₹{discount.amount.toLocaleString("en-IN")}</span>
                                    </div>
                                    {/* Congratulations Message */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mt-2">
                                        <p className="text-xs text-green-700 font-semibold flex items-center gap-2">
                                            <i className="ri-gift-fill text-lg animate-pulse"></i>
                                            Congrats! You saved ₹{discount.amount.toLocaleString("en-IN")} on your order of ₹{(totals.total + discount.amount).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-[#0a2e5e]">₹{totals.total.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {paymentError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                                <i className="ri-error-warning-fill text-red-500"></i>
                                <span className="text-sm text-red-700 font-medium">
                                    {paymentError === "PAYMENT_FAILED" ? "Payment failed. Please try again." :
                                        paymentError === "PAYMENT_PENDING" ? "Payment is still processing. Please wait or try again." :
                                            paymentError === "missing_transaction" ? "Invalid payment session." :
                                                paymentError === "verification_failed" ? "Payment verification failed. If amount was deducted, it will be refunded." :
                                                    paymentError === "order_update_failed" ? "Payment was received but order update failed. Please contact support." :
                                                        "Payment could not be completed. Please try again."}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={!agreedToTerms || paying}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${agreedToTerms && !paying ? 'bg-[#0a2e5e] hover:bg-[#08244a] hover:shadow-xl hover:-translate-y-0.5 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {paying ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Redirecting to PhonePe...
                                </>
                            ) : (
                                "Pay Now"
                            )}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <i className="ri-lock-fill text-green-600"></i> Secure Checkout - SSL Encrypted
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-2 max-w-xs mx-auto">
                            Ensuring your financial and personal details are secure during every transaction.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Celebration Modal */}
            <CelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                discountAmount={celebrationData.discountAmount}
                originalTotal={celebrationData.originalTotal}
                discountCode={celebrationData.code}
            />
        </>
    );
}
