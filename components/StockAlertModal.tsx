"use client";

import { useState } from "react";
import axios from "axios";

interface StockAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
}

export default function StockAlertModal({ isOpen, onClose, productId, productName }: StockAlertModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("LOADING");
        try {
            const response = await axios.post("/api/stock-alert", {
                email,
                phone,
                productId
            });
            setStatus("SUCCESS");
            setMessage(response.data.message);
            setTimeout(onClose, 2000);
        } catch (error: any) {
            setStatus("ERROR");
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-up relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-notification-3-line text-2xl text-red-600"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Get Notified!</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        We&apos;ll alert you when <strong>{productName}</strong> is back in stock.
                    </p>
                </div>

                {status === "SUCCESS" ? (
                    <div className="text-center py-6">
                        <i className="ri-checkbox-circle-fill text-5xl text-green-500 mb-2 block"></i>
                        <p className="font-semibold text-gray-800">{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Required)</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        {status === "ERROR" && (
                            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "LOADING"}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === "LOADING" ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin"></i> Submitting...
                                </>
                            ) : (
                                "Notify Me"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
