'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        outOfStock: 0,
        newEnquiries: 0,
        inventoryValue: 0
    });
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock Chart Data - To be replaced with real analytics later
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        sales: [65, 59, 80, 81, 56, 55],
        views: [28, 48, 40, 19, 86, 27]
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();

                if (data.stats) {
                    setStats(data.stats);
                }
                if (data.recentProducts) {
                    setRecentProducts(data.recentProducts);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header / Top Bar Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--admin-text-main)] mb-2 font-heading">
                        Dashboard
                    </h1>
                    <p className="text-[var(--admin-text-muted)] text-sm">
                        Here is today's report and performances
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/add-laptop"
                        className="bg-[#a51c30] hover:bg-[#8e1829] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all"
                    >
                        <i className="ri-macbook-line"></i> Add Laptop
                    </Link>
                    <Link
                        href="/admin/add-monitor"
                        className="bg-[#a51c30] hover:bg-[#8e1829] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all"
                    >
                        <i className="ri-tv-line"></i> Add Monitor
                    </Link>
                    <Link
                        href="/admin/add-desktop"
                        className="bg-[#a51c30] hover:bg-[#8e1829] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all"
                    >
                        <i className="ri-computer-line"></i> Add Desktop
                    </Link>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Inventory */}
                <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] relative group overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-[var(--admin-text-muted)] text-sm font-medium">
                            Total Inventory
                        </h3>
                        <button className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]">
                            <i className="ri-more-fill"></i>
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-[var(--admin-text-main)] mb-2 relative z-10 font-heading">
                        {stats.totalProducts}
                        <span className="text-sm font-normal text-[var(--admin-text-muted)] ml-1">Items</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-500 relative z-10">
                        <i className="ri-arrow-right-up-line"></i>
                        <span>+12% from last month</span>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
                </div>

                {/* Card 2: Out of Stock */}
                <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] relative group overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-[var(--admin-text-muted)] text-sm font-medium">
                            Out of Stock
                        </h3>
                        <button className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]">
                            <i className="ri-more-fill"></i>
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-[var(--admin-text-main)] mb-2 relative z-10 font-heading">
                        {stats.outOfStock}
                        <span className="text-sm font-normal text-[var(--admin-text-muted)] ml-1">Items</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-red-500 relative z-10">
                        <i className="ri-arrow-right-down-line"></i>
                        <span>Needs Attention</span>
                    </div>
                </div>

                {/* Card 3: Enquiries */}
                <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] relative group overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-[var(--admin-text-muted)] text-sm font-medium">
                            New Enquiries
                        </h3>
                        <button className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]">
                            <i className="ri-more-fill"></i>
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-[var(--admin-text-main)] mb-2 relative z-10 font-heading">
                        {stats.newEnquiries}
                        <span className="text-sm font-normal text-[var(--admin-text-muted)] ml-1">Pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-red-500 relative z-10">
                        <i className="ri-message-3-line"></i>
                        <span>Needs Response</span>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
                </div>

                {/* Card 4: Inventory Value */}
                <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] relative group overflow-hidden shadow-sm">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-[var(--admin-text-muted)] text-sm font-medium">
                            Inventory Value
                        </h3>
                        <button className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]">
                            <i className="ri-more-fill"></i>
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-[var(--admin-text-main)] mb-2 relative z-10 font-heading">
                        ₹{(stats.inventoryValue / 100000).toFixed(1)}L
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-500 relative z-10">
                        <i className="ri-arrow-right-up-line"></i>
                        <span>+5% from last quarter</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart Mockup */}
                <div className="lg:col-span-2 bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[var(--admin-text-main)]">
                            Stock Performance
                        </h3>
                        <button className="bg-[var(--admin-hover)] text-[var(--admin-text-muted)] border border-[var(--admin-border)] px-3 py-1 rounded text-xs flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            Weekly <i className="ri-arrow-down-s-line"></i>
                        </button>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {/* Simple CSS Bar Chart */}
                        {chartData.sales.map((val, idx) => (
                            <div key={idx} className="w-full flex flex-col justify-end items-center gap-2 group h-full">
                                <div className="w-full flex items-end justify-center h-[85%] relative gap-1">
                                    <div style={{ height: `${val}%` }} className="w-3 md:w-6 bg-gray-200 rounded-t-md relative group-hover:bg-gray-300 transition-all"></div>
                                    <div style={{ height: `${chartData.sales?.[idx] * 0.6}%` }} className="w-3 md:w-6 bg-[#a51c30] rounded-t-md relative group-hover:bg-red-800 transition-all"></div>
                                </div>
                                <span className="text-xs text-[var(--admin-text-muted)]">{chartData.labels[idx]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart Mockup */}
                <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[var(--admin-text-main)]">
                            Category Split
                        </h3>
                        <button className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]">
                            <i className="ri-calendar-line"></i>
                        </button>
                    </div>
                    <div className="relative h-48 mb-4 flex items-center justify-center">
                        {/* Simple CSS Donut Chart Mockup using Conic Gradient */}
                        <div className="w-40 h-40 rounded-full" style={{
                            background: `conic-gradient(
                                #a51c30 0% 37.5%, 
                                #3b82f6 37.5% 62.5%, 
                                #10b981 62.5% 83%, 
                                #f59e0b 83% 100%
                            )`
                        }}>
                            <div className="w-32 h-32 bg-[var(--admin-card)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-[var(--admin-text-main)] font-heading">{stats.totalProducts}</span>
                                <span className="text-xs text-[var(--admin-text-muted)]">Total Items</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-3 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-muted)] text-sm font-medium hover:bg-[var(--admin-hover)] transition-colors">
                        View Full Details
                    </button>
                </div>
            </div>

            {/* Recent Items Table */}
            <div className="bg-[var(--admin-card)] rounded-2xl p-6 border border-[var(--admin-border)] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[var(--admin-text-main)]">
                        Recent Inventory
                    </h3>
                    <button className="bg-[var(--admin-hover)] text-[var(--admin-text-muted)] border border-[var(--admin-border)] px-3 py-1 rounded text-xs flex items-center gap-2">
                        All Items <i className="ri-arrow-down-s-line"></i>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[var(--admin-text-muted)] text-xs uppercase border-b border-[var(--admin-border)]">
                                <th className="pb-4 font-medium pl-6">Product ID</th>
                                <th className="pb-4 font-medium px-4">Product Name</th>
                                <th className="pb-4 font-medium px-4">Category</th>
                                <th className="pb-4 font-medium px-4">Price</th>
                                <th className="pb-4 font-medium px-4">Status</th>
                                <th className="pb-4 font-medium px-4">Stock</th>
                                <th className="pb-4 font-medium text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentProducts.length > 0 ? (
                                recentProducts.map((product) => (
                                    <tr key={product._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-hover)] transition-colors group">
                                        <td className="py-4 pl-6 text-[var(--admin-text-muted)] whitespace-nowrap">
                                            #{product._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-lg bg-white border border-[var(--admin-border)] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                                                    {product.images?.[0] || product.image ? (
                                                        <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-[var(--admin-text-muted)]">{product.name.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="max-w-[250px]" title={product.name}>
                                                    <p className="text-[var(--admin-text-main)] font-semibold line-clamp-2 leading-tight text-sm">
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[var(--admin-text-muted)] capitalize whitespace-nowrap">{product.category}</td>
                                        <td className="py-4 px-4 text-[var(--admin-text-muted)] whitespace-nowrap">₹{product.price.toLocaleString('en-IN')}</td>
                                        <td className="py-4 px-4">
                                            {product.quantity > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white text-green-700 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white text-red-700 border border-red-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-[var(--admin-text-main)] font-medium">{product.quantity}</td>
                                        <td className="py-4 pr-6 text-right text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text-main)] cursor-pointer">
                                            <Link href={`/admin/edit-product/${product._id}?edit=true`} className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 hover:text-red-600 transition-all" title="Edit Product">
                                                <i className="ri-pencil-line text-lg"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[var(--admin-text-muted)]">
                                        No recent items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
