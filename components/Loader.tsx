"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Loader() {
    const [loading, setLoading] = useState(true);
    const { loading: authLoading } = useAuth();
    const [progress, setProgress] = useState(15);

    useEffect(() => {
        // Faster simulation for better UX
        const interval = setInterval(() => {
            setProgress(prev => (prev < 95 ? prev + Math.random() * 10 : prev));
        }, 80);

        const checkLoaded = () => {
            if (!authLoading) {
                setProgress(100);
                setTimeout(() => {
                    setLoading(false);
                    clearInterval(interval);
                }, 300); // Reduced delay
            }
        };

        checkLoaded();
        const timeout = setTimeout(() => {
            if (authLoading) {
                setProgress(100);
                setLoading(false);
            }
        }, 1200); // Faster fallback

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
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-[#0a2e5e] rounded-full animate-spin"></div>

                    {/* Pulse Rings */}
                    <div className="absolute inset-0 w-16 h-16 border-4 border-[#0a2e5e]/20 rounded-full animate-ping"></div>

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="ri-computer-line text-[#0a2e5e] text-xl animate-pulse"></i>
                    </div>
                </div>

                {/* Techy Loading Text */}
                <div className="absolute mt-28 flex flex-col items-center">
                    <span className="text-gray-900 font-bold text-xs tracking-[0.3em] uppercase">
                        Reused Loading
                    </span>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1 /h-1 bg-[#0a2e5e] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-[#0a2e5e] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-[#0a2e5e] rounded-full animate-bounce"></div>
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
                    background: 'linear-gradient(to right, #0a2e5e, #29abe2)',
                    zIndex: 10000,
                    boxShadow: '0 0 10px rgba(10, 46, 94, 0.4)',
                    transition: 'width 0.4s cubic-bezier(0.1, 0.7, 0.1, 1)',
                    opacity: loading ? 1 : 0
                }}
            ></div>
        </>
    );
}
