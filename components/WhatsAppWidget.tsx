"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WhatsAppWidget() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a small delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Replace with actual support number
    const phoneNumber = "919632178786";
    const message = encodeURIComponent("Hello! I'm interested in buying a refurbished computer.");

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
            <Link
                href={`https://wa.me/${phoneNumber}?text=${message}`}
                target="_blank"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
                aria-label="Chat on WhatsApp"
            >
                <i className="ri-whatsapp-line text-2xl"></i>
                <span className="font-semibold hidden md:inline-block max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-in-out">
                    Chat with Us
                </span>
            </Link>
        </div>
    );
}
