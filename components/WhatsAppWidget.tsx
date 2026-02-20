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
  const phoneNumber = "918147867701";

  const message = encodeURIComponent(
    "Hello! I'm interested in buying an original used laptop (Corporate Pull).",
  );

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      <Link
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        className="flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white w-14 hover:w-44 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
        aria-label="Chat on WhatsApp"
      >
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
          <i className="ri-whatsapp-line text-3xl"></i>
        </div>
        <span className="font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-6">
          Chat with Us
        </span>
      </Link>
    </div>
  );
}
