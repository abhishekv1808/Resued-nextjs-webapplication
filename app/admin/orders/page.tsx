"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";

// ─── Constants ──────────────────────────────────────────────────────────────
const STATUS_TABS = [
  "All",
  "Pending",
  "Paid",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
  "Failed",
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    Pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-400",
    },
    Paid: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
    Confirmed: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-400",
    },
    Processing: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-400",
    },
    Shipped: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-400" },
    Delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-400",
    },
    Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
    Returned: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-400",
    },
    Failed: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  };

const VALID_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Paid", "Cancelled", "Failed"],
  Paid: ["Confirmed", "Cancelled", "Failed"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Returned"],
  Delivered: ["Returned"],
  Cancelled: [],
  Returned: [],
  Failed: [],
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface OrderProduct {
  product: {
    _id?: string;
    name?: string;
    image?: string;
    images?: string[];
    price?: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  customerName?: string;
  customerPhone?: string;
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
  user?: any;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  statusCounts: Record<string, number>;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminOrders() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalOrders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [courierName, setCourierName] = useState("");

  // ─── Fetch Orders ───────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 20 };
      if (activeTab !== "All") params.status = activeTab;
      if (search) params.search = search;

      const { data } = await axios.get("/api/admin/orders", { params });
      setOrders(data.orders || []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 20,
          totalPages: 1,
          totalOrders: 0,
        },
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, search]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/orders/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, []);

  // ─── Open order detail drawer ───────────────────────────────────────────
  const openOrderDetail = async (orderId: string) => {
    try {
      const { data } = await axios.get(`/api/admin/orders/${orderId}`);
      setSelectedOrder(data.order);
      setTrackingId(data.order.trackingId || "");
      setCourierName(data.order.courierName || "");
      setStatusNote("");
      setDrawerOpen(true);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  // ─── Update order status ────────────────────────────────────────────────
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await axios.put(`/api/admin/orders/${selectedOrder._id}`, {
        status: newStatus,
        note: statusNote || undefined,
        trackingId: trackingId || undefined,
        courierName: courierName || undefined,
      });
      // Refetch
      const { data } = await axios.get(
        `/api/admin/orders/${selectedOrder._id}`,
      );
      setSelectedOrder(data.order);
      setStatusNote("");
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ─── Search handler ─────────────────────────────────────────────────────
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  // ─── Helpers ────────────────────────────────────────────────────────────
  const formatDate = (d: string) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
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

  const formatCurrency = (amount: number) =>
    `₹${amount?.toLocaleString("en-IN")}`;

  const getProductImage = (p: OrderProduct) => {
    return (
      p.product?.image || p.product?.images?.[0] || "/images/placeholder.png"
    );
  };

  const truncateId = (id: string) =>
    id?.length > 16 ? `${id.slice(0, 8)}...${id.slice(-6)}` : id;

  const statusStyle = (status: string) =>
    STATUS_COLORS[status] || STATUS_COLORS.Failed;

  // ─── Render: Stats Cards ────────────────────────────────────────────────
  const renderStats = () => {
    const cards = [
      {
        label: "Total Orders",
        value: stats?.totalOrders || 0,
        icon: "ri-shopping-bag-3-line",
        color: "text-[#0a2e5e]",
        bg: "bg-blue-50",
      },
      {
        label: "Revenue",
        value: formatCurrency(stats?.revenue || 0),
        icon: "ri-money-rupee-circle-line",
        color: "text-green-600",
        bg: "bg-green-50",
      },
      {
        label: "Pending",
        value: stats?.pendingOrders || 0,
        icon: "ri-time-line",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      {
        label: "Delivered",
        value: stats?.statusCounts?.Delivered || 0,
        icon: "ri-checkbox-circle-line",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--admin-card)] rounded-xl md:rounded-2xl border border-[var(--admin-border)] p-3 md:p-5 flex items-center gap-3 md:gap-4"
          >
            <div
              className={`w-9 h-9 md:w-12 md:h-12 ${card.bg} rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <i
                className={`${card.icon} text-lg md:text-xl ${card.color}`}
              ></i>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-[var(--admin-text-muted)] font-medium truncate">
                {card.label}
              </p>
              <p className="text-base md:text-xl font-bold text-[var(--admin-text-main)] truncate">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── Render: Filter Bar ─────────────────────────────────────────────────
  const renderFilters = () => (
    <div className="bg-[var(--admin-card)] rounded-xl md:rounded-2xl border border-[var(--admin-border)] p-3 md:p-4 mb-4 md:mb-6 space-y-3 md:space-y-4">
      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-[#0a2e5e] text-white shadow-md"
                : "bg-[var(--admin-hover)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]"
            }`}
          >
            {tab}
            {tab !== "All" && stats?.statusCounts?.[tab] ? (
              <span className="ml-1.5 text-xs opacity-70">
                ({stats.statusCounts[tab]})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"></i>
          <input
            type="text"
            placeholder="Search by customer name, phone, or order ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-sm text-[var(--admin-text-main)] focus:outline-none focus:border-[#29abe2] transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[#0a2e5e] text-white text-sm font-semibold rounded-xl hover:bg-[#08244a] transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[var(--admin-hover)] text-[var(--admin-text-muted)] text-sm font-semibold rounded-xl hover:text-red-500 transition-colors"
          >
            <i className="ri-close-line"></i>
          </button>
        )}
      </div>
    </div>
  );

  // ─── Render: Orders Table ───────────────────────────────────────────────
  const renderTable = () => {
    if (loading) {
      return (
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#29abe2]"></div>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Loading orders...
            </p>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] min-h-[400px] flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <i className="ri-shopping-bag-3-line text-3xl text-[#0a2e5e]"></i>
          </div>
          <p className="text-[var(--admin-text-main)] font-bold text-lg mb-1">
            No orders found
          </p>
          <p className="text-[var(--admin-text-muted)] text-sm">
            {search
              ? `No results for "${search}"`
              : `No ${activeTab !== "All" ? activeTab.toLowerCase() : ""} orders yet.`}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-[var(--admin-card)] rounded-xl md:rounded-2xl border border-[var(--admin-border)] overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="md:hidden divide-y divide-[var(--admin-border)]">
          {orders.map((order) => {
            const sc = statusStyle(order.status);
            return (
              <div
                key={order._id}
                onClick={() => openOrderDetail(order._id)}
                className="p-4 hover:bg-[var(--admin-hover)] cursor-pointer transition-colors active:bg-[var(--admin-hover)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-grow">
                    <p className="text-sm font-semibold text-[var(--admin-text-main)] truncate">
                      {order.customerName || "Unknown"}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)] font-mono">
                      {truncateId(
                        order.phonePeMerchantTransactionId || order._id,
                      )}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--admin-text-main)] ml-3 flex-shrink-0">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${sc.bg} ${sc.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                    ></span>
                    {order.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      {order.products.length} item
                      {order.products.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      {formatDate(order.createdAt)}
                    </span>
                    <i className="ri-arrow-right-s-line text-[var(--admin-text-muted)]"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Products
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-5 py-4 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const sc = statusStyle(order.status);
                return (
                  <tr
                    key={order._id}
                    onClick={() => openOrderDetail(order._id)}
                    className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono font-semibold text-[var(--admin-text-main)]">
                        {truncateId(
                          order.phonePeMerchantTransactionId || order._id,
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--admin-text-main)]">
                          {order.customerName || "Unknown"}
                        </p>
                        <p className="text-xs text-[var(--admin-text-muted)]">
                          {order.customerPhone || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {order.products.slice(0, 3).map((p, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0"
                            >
                              <Image
                                src={getProductImage(p)}
                                alt={p.product?.name || "Product"}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--admin-text-muted)]">
                          {order.products.length} item
                          {order.products.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[var(--admin-text-main)]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        ></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--admin-text-muted)]">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderDetail(order._id);
                        }}
                        className="p-2 hover:bg-[var(--admin-hover)] rounded-lg text-[var(--admin-text-muted)] hover:text-[#29abe2] transition-colors"
                      >
                        <i className="ri-arrow-right-s-line text-lg"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-5 py-3 md:py-4 border-t border-[var(--admin-border)] gap-2">
            <p className="text-xs text-[var(--admin-text-muted)]">
              Showing {(page - 1) * pagination.limit + 1}–
              {Math.min(page * pagination.limit, pagination.totalOrders)} of{" "}
              {pagination.totalOrders} orders
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--admin-hover)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] disabled:opacity-40 transition-colors"
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-[#0a2e5e] text-white"
                          : "bg-[var(--admin-hover)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--admin-hover)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] disabled:opacity-40 transition-colors"
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Render: Order Detail Drawer ────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerOpen || !selectedOrder) return null;

    const order = selectedOrder;
    const sc = statusStyle(order.status);
    const allowedNext = VALID_TRANSITIONS[order.status] || [];

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeDrawer}
        ></div>

        {/* Drawer */}
        <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-[var(--admin-card)] z-50 shadow-2xl overflow-y-auto animate-slide-in-right">
          {/* Header */}
          <div className="sticky top-0 bg-[var(--admin-card)] border-b border-[var(--admin-border)] px-4 md:px-6 py-4 md:py-5 flex items-center justify-between z-10">
            <div>
              <h3 className="text-lg font-bold text-[var(--admin-text-main)]">
                Order Details
              </h3>
              <p className="text-xs text-[var(--admin-text-muted)] font-mono mt-0.5">
                {order.phonePeMerchantTransactionId || order._id}
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 hover:bg-[var(--admin-hover)] rounded-lg transition-colors"
            >
              <i className="ri-close-line text-xl text-[var(--admin-text-muted)]"></i>
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Status Badge + Info */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${sc.bg} ${sc.text}`}
              >
                <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
                {order.status}
              </span>
              <span className="text-sm text-[var(--admin-text-muted)]">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </span>
            </div>

            {/* Products */}
            <div className="bg-[var(--admin-bg)] rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">
                <i className="ri-shopping-bag-line mr-2 text-[#29abe2]"></i>
                Products ({order.products.length})
              </h4>
              {order.products.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[var(--admin-card)] p-3 rounded-lg border border-[var(--admin-border)]"
                >
                  <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 p-1 flex-shrink-0">
                    <Image
                      src={getProductImage(p)}
                      alt={p.product?.name || "Product"}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-[var(--admin-text-main)] truncate">
                      {p.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Qty: {p.quantity} ×{" "}
                      {formatCurrency(p.product?.price || 0)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[var(--admin-text-main)] flex-shrink-0">
                    {formatCurrency((p.product?.price || 0) * p.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="bg-[var(--admin-bg)] rounded-xl p-4">
              <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">
                <i className="ri-user-line mr-2 text-[#29abe2]"></i>
                Customer
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                    Name
                  </p>
                  <p className="font-semibold text-[var(--admin-text-main)]">
                    {(typeof order.user === "object"
                      ? order.user?.name
                      : null) ||
                      order.customerName ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                    Phone
                  </p>
                  <p className="font-semibold text-[var(--admin-text-main)]">
                    {(typeof order.user === "object"
                      ? order.user?.phone
                      : null) ||
                      order.customerPhone ||
                      "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                    Address
                  </p>
                  <p className="font-semibold text-[var(--admin-text-main)]">
                    {order.address || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[var(--admin-bg)] rounded-xl p-4">
              <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">
                <i className="ri-bank-card-line mr-2 text-[#29abe2]"></i>
                Payment
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)]">
                    Total Amount
                  </span>
                  <span className="font-bold text-[var(--admin-text-main)]">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                {order.discountCode && (
                  <div className="flex justify-between">
                    <span className="text-[var(--admin-text-muted)]">
                      Discount ({order.discountCode})
                    </span>
                    <span className="font-semibold text-green-600">
                      - {formatCurrency(order.discountAmount || 0)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)]">
                    PhonePe Transaction
                  </span>
                  <span className="font-mono text-xs text-[var(--admin-text-main)]">
                    {order.phonePeMerchantTransactionId || "—"}
                  </span>
                </div>
                {order.phonePePaymentId && (
                  <div className="flex justify-between">
                    <span className="text-[var(--admin-text-muted)]">
                      Payment ID
                    </span>
                    <span className="font-mono text-xs text-[var(--admin-text-main)]">
                      {order.phonePePaymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Info (if shipped) */}
            {(order.trackingId || order.courierName) && (
              <div className="bg-[var(--admin-bg)] rounded-xl p-4">
                <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">
                  <i className="ri-truck-line mr-2 text-[#29abe2]"></i>
                  Shipping
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {order.courierName && (
                    <div>
                      <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                        Courier
                      </p>
                      <p className="font-semibold text-[var(--admin-text-main)]">
                        {order.courierName}
                      </p>
                    </div>
                  )}
                  {order.trackingId && (
                    <div>
                      <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                        Tracking ID
                      </p>
                      <p className="font-mono font-semibold text-[var(--admin-text-main)]">
                        {order.trackingId}
                      </p>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-[var(--admin-text-muted)] text-xs mb-0.5">
                        Est. Delivery
                      </p>
                      <p className="font-semibold text-[var(--admin-text-main)]">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-[var(--admin-bg)] rounded-xl p-4">
                <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">
                  <i className="ri-time-line mr-2 text-[#29abe2]"></i>
                  Status Timeline
                </h4>
                <div className="space-y-0">
                  {order.statusHistory.map((entry, i) => {
                    const esc = statusStyle(entry.status);
                    const isLast = i === order.statusHistory!.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${esc.dot} flex-shrink-0 mt-1.5`}
                          ></div>
                          {!isLast && (
                            <div className="w-0.5 bg-[var(--admin-border)] flex-grow my-1"></div>
                          )}
                        </div>
                        <div className={`pb-4 ${isLast ? "" : ""}`}>
                          <p className="text-sm font-semibold text-[var(--admin-text-main)]">
                            {entry.status}
                          </p>
                          {entry.note && (
                            <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
                              {entry.note}
                            </p>
                          )}
                          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
                            {formatDate(entry.timestamp)} at{" "}
                            {formatTime(entry.timestamp)} • by {entry.updatedBy}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status Update Form */}
            {allowedNext.length > 0 && (
              <div className="bg-[var(--admin-bg)] rounded-xl p-4 border-2 border-dashed border-[var(--admin-border)]">
                <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-4">
                  <i className="ri-refresh-line mr-2 text-[#29abe2]"></i>
                  Update Status
                </h4>

                {/* Tracking fields (show when Shipped is an option or current) */}
                {(allowedNext.includes("Shipped") ||
                  order.status === "Shipped") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--admin-text-muted)] mb-1">
                        Courier Name
                      </label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. BlueDart, Delhivery"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text-main)] focus:outline-none focus:border-[#29abe2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--admin-text-muted)] mb-1">
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="e.g. BD123456789"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text-main)] focus:outline-none focus:border-[#29abe2]"
                      />
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--admin-text-muted)] mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text-main)] focus:outline-none focus:border-[#29abe2]"
                  />
                </div>

                {/* Status buttons */}
                <div className="flex flex-wrap gap-2">
                  {allowedNext.map((nextStatus) => {
                    const nsc = statusStyle(nextStatus);
                    const isDanger = [
                      "Cancelled",
                      "Failed",
                      "Returned",
                    ].includes(nextStatus);
                    return (
                      <button
                        key={nextStatus}
                        onClick={() => handleStatusUpdate(nextStatus)}
                        disabled={updatingStatus}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                          isDanger
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : `${nsc.bg} ${nsc.text} hover:opacity-80 border border-transparent`
                        }`}
                      >
                        {updatingStatus ? (
                          <i className="ri-loader-4-line animate-spin mr-1"></i>
                        ) : null}
                        Mark as {nextStatus}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // ─── Main Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--admin-text-main)] font-heading">
          Orders
        </h2>
        <p className="text-xs md:text-sm text-[var(--admin-text-muted)]">
          {pagination.totalOrders} total orders
        </p>
      </div>

      {renderStats()}
      {renderFilters()}
      {renderTable()}
      {renderDrawer()}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
