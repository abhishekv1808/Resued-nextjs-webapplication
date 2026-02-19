"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const merchantOrderId = searchParams.get("merchantOrderId");
  const status = searchParams.get("status");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!loading && status !== "pending") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [loading, status]);

  const fetchOrder = async () => {
    try {
      // Try authenticated endpoint first
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        if (data.order) {
          setOrder(data.order);
          return;
        }
      } catch (authErr: any) {
        // If 401 (session lost after PhonePe redirect), fall through to public endpoint
        if (authErr?.response?.status !== 401) throw authErr;
      }
      // Fallback: public endpoint for post-payment redirect
      const { data } = await axios.get(`/api/orders/public/${orderId}`);
      if (data.order) setOrder(data.order);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `₹${amount?.toLocaleString("en-IN")}`;

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <Loader />;

  const isPending = status === "pending";
  const subtotal =
    order?.products?.reduce(
      (acc: number, item: any) =>
        acc + (item.product?.price || 0) * item.quantity,
      0,
    ) || 0;
  const discount = order?.discountAmount || 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-5%",
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  backgroundColor: [
                    "#0a2e5e",
                    "#29abe2",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#ec4899",
                  ][Math.floor(Math.random() * 7)],
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2.5 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Status Icon */}
          <div className="text-center mb-6">
            <div
              className={`relative w-20 h-20 mx-auto mb-4 ${!isPending ? "animate-success-pop" : ""}`}
            >
              <div
                className={`absolute inset-0 rounded-full ${isPending ? "bg-amber-100" : "bg-green-100"} animate-ping-slow opacity-40`}
              ></div>
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center ${isPending ? "bg-amber-500" : "bg-emerald-500"} shadow-lg`}
              >
                <svg
                  className="w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isPending ? (
                    <path d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  ) : (
                    <path d="M5 13l4 4L19 7" />
                  )}
                </svg>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1.5">
              {isPending ? "Payment Processing" : "Order Confirmed!"}
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto">
              {isPending
                ? "Your payment is being processed. We'll update the status shortly."
                : "Thank you for shopping with Reused. Your order has been placed successfully."}
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            {/* Order ID Banner */}
            <div className="bg-[#0a2e5e] px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                  Order ID
                </p>
                <p className="text-white font-mono text-sm font-bold mt-0.5">
                  {order?.phonePeMerchantTransactionId ||
                    order?._id ||
                    merchantOrderId ||
                    "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                  Date
                </p>
                <p className="text-white text-sm font-semibold mt-0.5">
                  {order ? formatDate(order.createdAt) : "—"}
                </p>
              </div>
            </div>

            {order ? (
              <div className="p-5 md:p-6">
                {/* Status + Payment badge row */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      order.status === "Paid" || order.status === "Confirmed"
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : order.status === "Pending"
                          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                          : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.status === "Paid" || order.status === "Confirmed"
                          ? "bg-green-500"
                          : order.status === "Pending"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    ></span>
                    {order.status}
                  </span>
                  {order.phonePePaymentId && (
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                      Txn: {order.phonePePaymentId.slice(-12)}
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="mb-5">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <i className="ri-shopping-bag-3-line text-sm"></i>Items
                    Ordered
                  </h3>
                  <div className="space-y-4">
                    {order.products?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0 border border-gray-100 group-hover:border-gray-200 transition-colors">
                          <Image
                            src={
                              item.product?.image ||
                              item.product?.images?.[0] ||
                              "/images/placeholder.png"
                            }
                            alt={item.product?.name || "Product"}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(item.product?.price || 0)}
                          </p>
                        </div>
                        <p className="text-base font-bold text-gray-900 flex-shrink-0 tabular-nums">
                          {formatCurrency(
                            (item.product?.price || 0) * item.quantity,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 my-4 relative">
                  <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                  <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700 font-medium tabular-nums">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <i className="ri-coupon-2-line text-xs"></i>
                        Discount
                        {order.discountCode && (
                          <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            {order.discountCode}
                          </span>
                        )}
                      </span>
                      <span className="text-green-600 font-medium tabular-nums">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#0a2e5e] rounded-xl px-5 py-4 flex items-center justify-between">
                  <span className="text-white/80 text-sm font-medium">
                    Total Paid
                  </span>
                  <span className="text-white text-xl md:text-2xl font-extrabold tabular-nums">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-map-pin-2-fill text-[#0a2e5e] text-sm"></i>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Delivery Address
                        </p>
                        {order.customerName && (
                          <p className="text-sm font-semibold text-gray-900">
                            {order.customerName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {order.address}
                        </p>
                        {order.customerPhone && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <i className="ri-phone-line"></i>
                            {order.customerPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment reference */}
                {order.phonePePaymentId && (
                  <div className="mt-4 flex items-center gap-2 bg-blue-50/60 rounded-lg px-4 py-2.5 border border-blue-100">
                    <i className="ri-secure-payment-fill text-blue-500"></i>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Payment Reference
                      </p>
                      <p className="text-xs font-mono text-blue-700 truncate">
                        {order.phonePePaymentId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-fill text-green-500 text-2xl md:text-3xl"></i>
                </div>
                <p className="text-gray-600 mb-2">
                  Your payment was processed successfully.
                </p>
                {merchantOrderId && (
                  <p className="text-xs font-mono text-gray-400">
                    Reference: {merchantOrderId}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href="/profile/orders"
              className="flex-1 flex items-center justify-center gap-2.5 bg-[#0a2e5e] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#08244a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[15px]"
            >
              <i className="ri-file-list-3-line text-lg"></i>
              View My Orders
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2.5 bg-white text-[#0a2e5e] font-bold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-[#0a2e5e] hover:bg-blue-50/50 transition-all active:scale-[0.98] text-[15px]"
            >
              <i className="ri-store-2-line text-lg"></i>
              Continue Shopping
            </Link>
          </div>

          {/* Help */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Need help?{" "}
            <Link
              href="/contact-us"
              className="text-[#0a2e5e] font-semibold hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </main>
      <Footer />

      {/* Animations */}
      <style jsx global>{`
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pingSlow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-success-pop {
          animation: successPop 0.6s ease-out forwards;
        }
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-draw-check path {
          animation: drawCheck 0.5s ease forwards 0.3s;
        }
        .animate-confetti {
          animation: confettiFall 3s ease-in forwards;
        }
      `}</style>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
