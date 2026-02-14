'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

// ─── Constants ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; icon: string }> = {
    Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', icon: 'ri-time-line' },
    Paid: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400', icon: 'ri-bank-card-line' },
    Confirmed: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400', icon: 'ri-checkbox-circle-line' },
    Processing: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400', icon: 'ri-settings-3-line' },
    Shipped: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-400', icon: 'ri-truck-line' },
    Delivered: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400', icon: 'ri-checkbox-circle-fill' },
    Cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400', icon: 'ri-close-circle-line' },
    Returned: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400', icon: 'ri-arrow-go-back-line' },
    Failed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', icon: 'ri-error-warning-line' },
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface OrderProduct {
    product: {
        _id?: string;
        name?: string;
        image?: string;
        images?: string[];
        price?: number;
        slug?: string;
    };
    quantity: number;
}

interface Order {
    _id: string;
    products: OrderProduct[];
    totalAmount: number;
    status: string;
    phonePeMerchantTransactionId: string;
    phonePePaymentId?: string;
    address?: string;
    trackingId?: string;
    courierName?: string;
    estimatedDelivery?: string;
    discountCode?: string;
    discountAmount?: number;
    createdAt: string;
    statusHistory?: {
        status: string;
        timestamp: string;
        note?: string;
        updatedBy: string;
    }[];
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CustomerOrders() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalOrders: 0 });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile/orders');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user, page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/orders', { params: { page, limit: 10 } });
            setOrders(data.orders || []);
            setPagination(data.pagination || { totalPages: 1, totalOrders: 0 });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Helpers ────────────────────────────────────────────────────────────
    const formatDate = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (d: string) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount: number) => `₹${amount?.toLocaleString('en-IN')}`;

    const getProductImage = (p: OrderProduct) => {
        return p.product?.image || p.product?.images?.[0] || '/images/placeholder.png';
    };

    const sc = (status: string) => STATUS_COLORS[status] || STATUS_COLORS.Failed;

    if (authLoading || (loading && orders.length === 0)) return <Loader />;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {pagination.totalOrders} order{pagination.totalOrders !== 1 ? 's' : ''} placed
                            </p>
                        </div>
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 text-sm font-semibold text-[#0a2e5e] hover:text-[#29abe2] transition-colors"
                        >
                            <i className="ri-arrow-left-line"></i>
                            Profile
                        </Link>
                    </div>

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-shopping-bag-3-line text-4xl text-[#0a2e5e]"></i>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                                Looks like you haven&apos;t placed any orders. Start exploring our collection of quality refurbished products!
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-[#0a2e5e] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#08244a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <i className="ri-store-2-line"></i>
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && orders.length === 0 && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#29abe2]"></div>
                        </div>
                    )}

                    {/* Orders List */}
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusColors = sc(order.status);
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                                >
                                    {/* Order Card Header */}
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium mb-1">
                                                    Order placed on {formatDate(order.createdAt)}
                                                </p>
                                                <p className="text-xs font-mono text-gray-500">
                                                    ID: {order.phonePeMerchantTransactionId || order._id}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusColors.bg} ${statusColors.text}`}>
                                                <i className={`${statusColors.icon} text-sm`}></i>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Product thumbnails */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-3">
                                                    {order.products.slice(0, 4).map((p, i) => (
                                                        <div key={i} className="w-12 h-12 rounded-xl bg-gray-50 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={getProductImage(p)}
                                                                alt={p.product?.name || 'Product'}
                                                                width={48}
                                                                height={48}
                                                                className="w-full h-full object-contain mix-blend-multiply p-1"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                                                    </p>
                                                    <p className="text-lg font-bold text-[#0a2e5e]">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                            </div>

                                            <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-xl text-gray-400 transition-transform`}></i>
                                        </div>

                                        {/* Tracking badge (if shipped) */}
                                        {(order.status === 'Shipped' || order.status === 'Delivered') && order.trackingId && (
                                            <div className="mt-3 flex items-center gap-2 bg-cyan-50 rounded-lg px-3 py-2">
                                                <i className="ri-truck-line text-cyan-600"></i>
                                                <span className="text-xs font-semibold text-cyan-700">
                                                    {order.courierName && `${order.courierName} • `}Tracking: {order.trackingId}
                                                </span>
                                                {order.estimatedDelivery && (
                                                    <span className="text-xs text-cyan-600 ml-auto">
                                                        Est. {formatDate(order.estimatedDelivery)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50/50">
                                            {/* Products */}
                                            <div className="p-5 space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Products</h4>
                                                {order.products.map((p, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                                        <div className="w-16 h-16 rounded-lg bg-gray-50 p-1 flex-shrink-0 border border-gray-100">
                                                            <Image
                                                                src={getProductImage(p)}
                                                                alt={p.product?.name || 'Product'}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-contain mix-blend-multiply"
                                                            />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{p.product?.name || 'Unknown'}</p>
                                                            <p className="text-xs text-gray-500">Qty: {p.quantity} × {formatCurrency(p.product?.price || 0)}</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                                                            {formatCurrency((p.product?.price || 0) * p.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="px-5 pb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Payment */}
                                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</h4>
                                                    <div className="space-y-1.5 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Total</span>
                                                            <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                                                        </div>
                                                        {order.discountCode && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Discount ({order.discountCode})</span>
                                                                <span className="font-semibold text-green-600">-{formatCurrency(order.discountAmount || 0)}</span>
                                                            </div>
                                                        )}
                                                        {order.phonePePaymentId && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Payment ID</span>
                                                                <span className="font-mono text-xs text-gray-600">{order.phonePePaymentId}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delivery */}
                                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</h4>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{order.address || '—'}</p>
                                                </div>
                                            </div>

                                            {/* Status Timeline */}
                                            {order.statusHistory && order.statusHistory.length > 0 && (
                                                <div className="px-5 pb-5">
                                                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Timeline</h4>
                                                        <div className="space-y-0">
                                                            {order.statusHistory.map((entry, i) => {
                                                                const esc = sc(entry.status);
                                                                const isLast = i === order.statusHistory!.length - 1;
                                                                return (
                                                                    <div key={i} className="flex gap-3">
                                                                        <div className="flex flex-col items-center">
                                                                            <div className={`w-2.5 h-2.5 rounded-full ${esc.dot} flex-shrink-0 mt-1.5`}></div>
                                                                            {!isLast && <div className="w-0.5 bg-gray-200 flex-grow my-1"></div>}
                                                                        </div>
                                                                        <div className="pb-3">
                                                                            <p className="text-sm font-semibold text-gray-800">{entry.status}</p>
                                                                            {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                                {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500 px-3">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
