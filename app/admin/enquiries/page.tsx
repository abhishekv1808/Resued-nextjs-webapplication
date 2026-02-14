"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/admin/enquiries");
      const data = await response.json();
      if (data.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveEnquiry = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to mark this enquiry as resolved? It will be removed.",
      )
    )
      return;

    try {
      const response = await fetch("/api/admin/enquiries/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId: id }),
      });

      if (response.ok) {
        setToast({ message: "Enquiry marked as resolved", type: "success" });
        fetchEnquiries(); // Refresh list
      } else {
        setToast({ message: "Failed to resolve enquiry", type: "error" });
      }
    } catch (error) {
      console.error("Error resolving enquiry:", error);
      setToast({
        message: "An error occurred while resolving the enquiry",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a2e5e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text-main)] font-heading">
            Customer Enquiries
          </h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            View and manage customer enquiries.
          </p>
        </div>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="md:hidden divide-y divide-[var(--admin-border)]">
          {enquiries.length > 0 ? (
            enquiries.map((enquiry) => (
              <div key={enquiry._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0a2e5e] to-[#29abe2] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {enquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[var(--admin-text-main)] truncate">
                        {enquiry.name}
                      </div>
                      <div className="text-[11px] text-[var(--admin-text-muted)]">
                        {new Date(enquiry.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => resolveEnquiry(enquiry._id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-[11px] font-medium border border-green-200 flex-shrink-0"
                  >
                    <i className="ri-check-double-line"></i> Resolve
                  </button>
                </div>
                {/* Contact */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-[var(--admin-text-main)] flex items-center gap-1"
                  >
                    <i className="ri-phone-fill text-[#0a2e5e]"></i>{" "}
                    {enquiry.phone}
                  </a>
                  {enquiry.email && (
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-[var(--admin-text-muted)] flex items-center gap-1"
                    >
                      <i className="ri-mail-line"></i> {enquiry.email}
                    </a>
                  )}
                </div>
                {/* Requirements */}
                <div className="flex flex-wrap gap-1.5">
                  {enquiry.brand && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-[#0a2e5e]">
                      {enquiry.brand}
                    </span>
                  )}
                  {enquiry.model && (
                    <span className="text-xs font-semibold text-[var(--admin-text-main)]">
                      {enquiry.model}
                    </span>
                  )}
                  {enquiry.processor && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                      <i className="ri-cpu-line"></i> {enquiry.processor}
                    </span>
                  )}
                  {enquiry.ram && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                      <i className="ri-database-2-line"></i> {enquiry.ram}
                    </span>
                  )}
                  {enquiry.storage && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                      <i className="ri-hard-drive-line"></i> {enquiry.storage}
                    </span>
                  )}
                  {enquiry.purpose && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-[#0a2e5e]">
                      <i className="ri-focus-3-line"></i> {enquiry.purpose}
                    </span>
                  )}
                </div>
                {/* Message */}
                {enquiry.message && (
                  <p className="text-xs text-[var(--admin-text-muted)] italic line-clamp-2">
                    &quot;{enquiry.message}&quot;
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[var(--admin-text-muted)]">
              <i className="ri-inbox-line text-3xl mb-2 opacity-50"></i>
              <p className="text-sm font-medium">No Enquiries Yet</p>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                  <tr
                    key={enquiry._id}
                    className="hover:bg-[var(--admin-hover)] transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0a2e5e] to-[#29abe2] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {enquiry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-[var(--admin-text-main)]">
                            {enquiry.name}
                          </div>
                          <div className="text-xs text-[var(--admin-text-muted)] flex items-center gap-1">
                            <i className="ri-calendar-line"></i>
                            {new Date(enquiry.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                            <span className="mx-1 opacity-50">|</span>
                            <i className="ri-time-line"></i>
                            {new Date(enquiry.date).toLocaleTimeString(
                              undefined,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="text-sm text-[var(--admin-text-main)] hover:text-[#29abe2] flex items-center gap-2 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0a2e5e] flex items-center justify-center text-xs">
                            <i className="ri-phone-fill"></i>
                          </div>
                          {enquiry.phone}
                        </a>
                        {enquiry.email && (
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="text-sm text-[var(--admin-text-muted)] hover:text-[#29abe2] flex items-center gap-2 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                              <i className="ri-mail-line"></i>
                            </div>
                            {enquiry.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 max-w-xs">
                        {(enquiry.brand || enquiry.model) && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {enquiry.brand && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-[#0a2e5e] border border-blue-100">
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
                        <div className="flex flex-wrap gap-1.5">
                          {enquiry.processor && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                              title="Processor"
                            >
                              <i className="ri-cpu-line"></i>{" "}
                              {enquiry.processor}
                            </span>
                          )}
                          {enquiry.ram && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                              title="RAM"
                            >
                              <i className="ri-database-2-line"></i>{" "}
                              {enquiry.ram}
                            </span>
                          )}
                          {enquiry.storage && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                              title="Storage"
                            >
                              <i className="ri-hard-drive-line"></i>{" "}
                              {enquiry.storage}
                            </span>
                          )}
                        </div>
                        {enquiry.purpose && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0a2e5e] bg-blue-50 px-2 py-1 rounded-full">
                              <i className="ri-focus-3-line"></i>{" "}
                              {enquiry.purpose}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {enquiry.message ? (
                        <div className="relative group/msg cursor-help">
                          <p className="text-sm text-[var(--admin-text-muted)] line-clamp-2 max-w-xs italic">
                            &quot;{enquiry.message}&quot;
                          </p>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/msg:opacity-100 group-hover/msg:visible transition-all z-50 pointer-events-none">
                            {enquiry.message}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
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
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-[var(--admin-text-muted)]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="ri-inbox-line text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[var(--admin-text-main)]">
                        No Enquiries Yet
                      </h3>
                      <p className="text-sm mt-1">
                        Customer enquiries will appear here once submitted.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
