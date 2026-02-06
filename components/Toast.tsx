"use client";

import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill';

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
                <i className={`${icon} text-xl`}></i>
                <span className="font-semibold">{message}</span>
                <button onClick={onClose} className="ml-2 hover:opacity-80">
                    <i className="ri-close-line"></i>
                </button>
            </div>
        </div>
    );
}
