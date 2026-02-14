"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import Toast from "@/components/Toast";

interface DiscountCode {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount?: number;
    expiryDate?: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
}

export default function AdminDiscounts() {
    const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        type: "percentage",
        value: "" as number | "",
        minOrderAmount: "" as number | "",
        expiryDate: "",
        usageLimit: "" as number | "",
        isActive: true
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const { data } = await axios.get("/api/admin/discounts");
            if (data.success) {
                setDiscounts(data.discounts);
            }
        } catch (error: any) {
            console.error("Failed to fetch discounts", error);

            // Handle 401 Unauthorized - redirect to login
            if (error.response?.status === 401) {
                setToast({ message: "Your session has expired. Please log in again.", type: 'error' });
                setTimeout(() => window.location.href = "/admin/login", 2000);
                return;
            }

            // Handle other errors
            const errorMessage = error.response?.data?.message || "Failed to load discounts";
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (discount?: DiscountCode) => {
        if (discount) {
            setEditingDiscount(discount);
            setFormData({
                code: discount.code,
                type: discount.type,
                value: discount.value,
                minOrderAmount: discount.minOrderAmount || "",
                expiryDate: discount.expiryDate ? new Date(discount.expiryDate).toISOString().split('T')[0] : "",
                usageLimit: discount.usageLimit || "",
                isActive: discount.isActive
            });
        } else {
            setEditingDiscount(null);
            setFormData({
                code: "",
                type: "percentage",
                value: "",
                minOrderAmount: "",
                expiryDate: "",
                usageLimit: "",
                isActive: true
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                value: Number(formData.value),
                minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined
            };

            if (editingDiscount) {
                await axios.put(`/api/admin/discounts/${editingDiscount._id}`, payload);
            } else {
                await axios.post("/api/admin/discounts", payload);
            }
            setModalOpen(false);
            fetchDiscounts();
        } catch (error: any) {
            // Handle 401 Unauthorized
            if (error.response?.status === 401) {
                setToast({ message: "Your session has expired. Please log in again.", type: 'error' });
                setTimeout(() => window.location.href = "/admin/login", 2000);
                return;
            }

            setToast({ message: error.response?.data?.message || "Operation failed", type: 'error' });
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount code?")) return;
        try {
            await axios.delete(`/api/admin/discounts/${id}`);
            fetchDiscounts();
            setToast({ message: "Discount deleted successfully", type: 'success' });
        } catch (error: any) {
            console.error("Failed to delete", error);

            // Handle 401 Unauthorized
            if (error.response?.status === 401) {
                setToast({ message: "Your session has expired. Please log in again.", type: 'error' });
                setTimeout(() => window.location.href = "/admin/login", 2000);
                return;
            }

            setToast({ message: error.response?.data?.message || "Failed to delete discount", type: 'error' });
        }
    };

    if (loading && !modalOpen) return <Loader />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Discount Codes</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#0a2e5e] text-white px-4 py-2 rounded-lg hover:bg-[#29abe2] transition shadow-lg shadow-blue-900/20"
                >
                    + Create New
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Value</th>
                            <th className="p-4">Used</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {discounts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No discount codes found.</td>
                            </tr>
                        ) : (
                            discounts.map((discount) => (
                                <tr key={discount._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-900">{discount.code}</td>
                                    <td className="p-4 capitalize">{discount.type}</td>
                                    <td className="p-4">
                                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                                    </td>
                                    <td className="p-4">
                                        {discount.usedCount}
                                        {discount.usageLimit ? ` / ${discount.usageLimit}` : ''}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${discount.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {discount.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(discount)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <i className="ri-pencil-line text-xl"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <i className="ri-delete-bin-line text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">{editingDiscount ? 'Edit Discount' : 'Create Discount'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2 uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Type</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Value</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value === "" ? "" : Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Min Order Amount (Optional)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value === "" ? "" : Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Usage Limit (Optional)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value === "" ? "" : Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-[#0a2e5e] rounded focus:ring-[#29abe2]"
                                />
                                <label htmlFor="isActive" className="text-sm font-semibold">Active</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-[#0a2e5e] text-white rounded-lg font-medium hover:bg-[#29abe2] disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    {loading ? 'Saving...' : 'Save Discount'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
