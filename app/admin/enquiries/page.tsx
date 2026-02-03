'use client';

import { useState, useEffect } from 'react';

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await fetch('/api/admin/enquiries');
            const data = await response.json();
            if (data.enquiries) {
                setEnquiries(data.enquiries);
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const resolveEnquiry = async (id: string) => {
        if (!confirm('Are you sure you want to mark this enquiry as resolved? It will be removed.')) return;

        try {
            const response = await fetch('/api/admin/enquiries/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enquiryId: id })
            });

            if (response.ok) {
                fetchEnquiries(); // Refresh list
            } else {
                alert('Failed to resolve enquiry');
            }
        } catch (error) {
            console.error('Error resolving enquiry:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--admin-text-main)] font-heading">Customer Enquiries</h1>
                    <p className="text-sm text-[var(--admin-text-muted)] mt-1">View and manage customer enquiries.</p>
                </div>
            </div>

            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--admin-bg)] border-b border-[var(--admin-border)] text-xs uppercase text-[var(--admin-text-muted)] tracking-wider">
                                <th className="px-6 py-4 font-semibold">Customer & Date</th>
                                <th className="px-6 py-4 font-semibold">Contact Details</th>
                                <th className="px-6 py-4 font-semibold">Requirements</th>
                                <th className="px-6 py-4 font-semibold">Message</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--admin-border)]">
                            {enquiries.length > 0 ? (
                                enquiries.map((enquiry) => (
                                    <tr key={enquiry._id} className="hover:bg-[var(--admin-hover)] transition-colors group">
                                        {/* Date & Customer */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {enquiry.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-[var(--admin-text-main)]">{enquiry.name}</div>
                                                    <div className="text-xs text-[var(--admin-text-muted)] flex items-center gap-1">
                                                        <i className="ri-calendar-line"></i>
                                                        {new Date(enquiry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        <span className="mx-1 opacity-50">|</span>
                                                        <i className="ri-time-line"></i>
                                                        {new Date(enquiry.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <a href={`tel:${enquiry.phone}`} className="text-sm text-[var(--admin-text-main)] hover:text-red-600 flex items-center gap-2 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs">
                                                        <i className="ri-phone-fill"></i>
                                                    </div>
                                                    {enquiry.phone}
                                                </a>
                                                {enquiry.email && (
                                                    <a href={`mailto:${enquiry.email}`} className="text-sm text-[var(--admin-text-muted)] hover:text-red-600 flex items-center gap-2 transition-colors">
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                                            <i className="ri-mail-line"></i>
                                                        </div>
                                                        {enquiry.email}
                                                    </a>
                                                )}
                                            </div>
                                        </td>

                                        {/* Requirements */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 max-w-xs">
                                                {/* Brand & Model */}
                                                {(enquiry.brand || enquiry.model) && (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {enquiry.brand && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                                {enquiry.brand}
                                                            </span>
                                                        )}
                                                        {enquiry.model && (
                                                            <span className="text-sm font-semibold text-[var(--admin-text-main)]">
                                                                {enquiry.model}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Specs Badges */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {enquiry.processor && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200" title="Processor">
                                                            <i className="ri-cpu-line"></i> {enquiry.processor}
                                                        </span>
                                                    )}
                                                    {enquiry.ram && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200" title="RAM">
                                                            <i className="ri-database-2-line"></i> {enquiry.ram}
                                                        </span>
                                                    )}
                                                    {enquiry.storage && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200" title="Storage">
                                                            <i className="ri-hard-drive-line"></i> {enquiry.storage}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Purpose */}
                                                {enquiry.purpose && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                            <i className="ri-focus-3-line"></i> {enquiry.purpose}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Message */}
                                        <td className="px-6 py-4">
                                            {enquiry.message ? (
                                                <div className="relative group/msg cursor-help">
                                                    <p className="text-sm text-[var(--admin-text-muted)] line-clamp-2 max-w-xs italic">
                                                        "{enquiry.message}"
                                                    </p>
                                                    {/* Tooltip for full message */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/msg:opacity-100 group-hover/msg:visible transition-all z-50 pointer-events-none">
                                                        {enquiry.message}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => resolveEnquiry(enquiry._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg text-xs font-medium transition-colors border border-green-200"
                                            >
                                                <i className="ri-check-double-line"></i> Resolve
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-[var(--admin-text-muted)]">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <i className="ri-inbox-line text-3xl text-gray-400"></i>
                                            </div>
                                            <h3 className="text-lg font-medium text-[var(--admin-text-main)]">No Enquiries Yet</h3>
                                            <p className="text-sm mt-1">Customer enquiries will appear here once submitted.</p>
                                        </div>
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
