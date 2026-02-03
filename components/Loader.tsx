"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Loader() {
    const [loading, setLoading] = useState(true);
    const { loading: authLoading } = useAuth();
    const [progress, setProgress] = useState(15);

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setProgress(prev => (prev < 90 ? prev + Math.random() * 5 : prev));
        }, 150);

        const checkLoaded = () => {
            if (!authLoading) {
                setProgress(100);
                setTimeout(() => {
                    setLoading(false);
                    clearInterval(interval);
                }, 500);
            }
        };

        checkLoaded();
        // In real app, we might depend on more things
        const timeout = setTimeout(() => {
            if (authLoading) {
                setProgress(100);
                setLoading(false);
            }
        }, 2000); // Fallback

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        }
    }, [authLoading]);

    // If we want a global loader based on auth check
    if (!loading && !authLoading) return null;

    return (
        <>
            <div
                id="site-loader"
                className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md transition-opacity duration-500 ${!loading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
                <div className="relative">
                    {/* Main Tech Spinner */}
                    <div className="w-16 h-16 border-4 border-red-100 border-t-[#a51c30] rounded-full animate-spin"></div>

                    {/* Pulse Rings */}
                    <div className="absolute inset-0 w-16 h-16 border-4 border-[#a51c30]/20 rounded-full animate-ping"></div>

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="ri-computer-line text-[#a51c30] text-xl animate-pulse"></i>
                    </div>
                </div>

                {/* Techy Loading Text */}
                <div className="absolute mt-28 flex flex-col items-center">
                    <span className="text-gray-900 font-bold text-xs tracking-[0.3em] uppercase">
                        Simtech Loading
                    </span>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1 h-1 bg-[#a51c30] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-[#a51c30] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-[#a51c30] rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>

            <div
                id="site-progress-bar"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: `${progress}%`,
                    height: '3px',
                    background: 'linear-gradient(to right, #a51c30, #ff4d4d)',
                    zIndex: 10000,
                    boxShadow: '0 0 10px rgba(165, 28, 48, 0.4)',
                    transition: 'width 0.4s cubic-bezier(0.1, 0.7, 0.1, 1)',
                    opacity: loading ? 1 : 0
                }}
            ></div>
        </>
    );
}
