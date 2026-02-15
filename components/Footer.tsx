"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SloganSection from "./SloganSection";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error" | "already">(
        "idle"
    );
    const router = useRouter();
    const tapCount = useRef(0);
    const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSecretTap = () => {
        tapCount.current += 1;
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
        if (tapCount.current >= 5) {
            tapCount.current = 0;
            router.push("/admin/login");
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else if (res.status === 409) {
                setStatus("already");
            } else {
                setStatus("error");
            }
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error(error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300  md:mt-20 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#0a2e5e] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="border-b border-gray-800/50 py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#0a2e5e] rounded-2xl blur-xl opacity-50"></div>
                                <div className="relative bg-gradient-to-br from-[#0a2e5e] to-[#29abe2] p-4 md:p-5 rounded-2xl text-white shadow-xl">
                                    <i className="ri-mail-send-line text-2xl md:text-4xl"></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-3xl font-bold text-white mb-1 font-heading">
                                    Join Our Newsletter
                                </h3>
                                <p className="text-sm md:text-base text-gray-400">
                                    Get ₹1,000 off your first purchase + exclusive deals
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-auto lg:min-w-[400px]">
                            <form
                                onSubmit={handleSubscribe}
                                className="relative"
                            >
                                <div className="flex bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 h-14 md:h-16 hover:border-[#29abe2]/50 transition-colors">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        id="newsletterEmail"
                                        name="email"
                                        className="flex-1 px-5 py-3 text-sm md:text-base bg-transparent outline-none text-white placeholder-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-[#0a2e5e] to-[#29abe2] text-white px-6 md:px-8 text-sm md:text-base font-bold hover:from-[#29abe2] hover:to-[#0a2e5e] transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        Subscribe
                                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                                {status === "success" && (
                                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <i className="ri-checkbox-circle-fill"></i>
                                        Subscribed successfully!
                                    </p>
                                )}
                                {status === "already" && (
                                    <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <i className="ri-information-line"></i>
                                        You&apos;re already subscribed!
                                    </p>
                                )}
                                {status === "error" && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <i className="ri-error-warning-line"></i>
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="py-12 md:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 font-heading">
                                    Reused
                                </h2>
                                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                                    Bangalore&apos;s premium destination for <strong>Fresh Corporate Pulls</strong>. We sell only factory-original used laptops with zero soldering and zero substituted parts. Just Original DNA.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 group">
                                    <div className="bg-gray-800/50 p-2 rounded-lg group-hover:bg-[#29abe2]/20 transition-colors">
                                        <i className="ri-phone-line text-[#29abe2] text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Call Us 24/7</p>
                                        <a href="tel:+919886786706" className="text-white font-bold text-lg hover:text-[#29abe2] transition-colors">
                                            +91 98867 86706
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 group">
                                    <div className="bg-gray-800/50 p-2 rounded-lg group-hover:bg-[#29abe2]/20 transition-colors">
                                        <i className="ri-map-pin-line text-[#29abe2] text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Visit Us</p>
                                        <p className="text-white text-sm">
                                            Bangalore, Karnataka<br />India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 group">
                                    <div className="bg-gray-800/50 p-2 rounded-lg group-hover:bg-[#29abe2]/20 transition-colors">
                                        <i className="ri-mail-line text-[#29abe2] text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                        <a href="mailto:support@reused.in" className="text-white text-sm hover:text-[#29abe2] transition-colors">
                                            support@reused.in
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6 font-heading relative inline-block">
                                Quick Links
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#29abe2] to-transparent rounded-full"></span>
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link
                                        href="/about-us"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/return-and-refund"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Return & Refund
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/refurbished-vs-reused"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Refurbished vs Reused
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        FAQs
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6 font-heading relative inline-block">
                                Categories
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#29abe2] to-transparent rounded-full"></span>
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link
                                        href="/laptops"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Laptops
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/desktops"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Desktops
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/monitors"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Monitors
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/compare"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Compare Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="hover:text-[#29abe2] transition-colors flex items-center gap-2 group"
                                    >
                                        <i className="ri-arrow-right-s-line text-[#29abe2] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        Shopping Cart
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social & App */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6 font-heading relative inline-block">
                                Stay Connected
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#29abe2] to-transparent rounded-full"></span>
                            </h4>
                            <p className="text-sm text-gray-400 mb-6">
                                Follow us for latest updates, exclusive deals, and tech insights.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://www.facebook.com/reused.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group"
                                    title="Follow us on Facebook"
                                >
                                    <div className="absolute inset-0 bg-[#1877F2] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gray-800/50 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 border border-gray-700/50 group-hover:border-[#1877F2] group-hover:scale-110">
                                        <i className="ri-facebook-fill text-xl text-gray-400 group-hover:text-white transition-colors"></i>
                                    </div>
                                </a>
                                <a
                                    href="https://www.instagram.com/reused.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group"
                                    title="Follow us on Instagram"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#F58529] via-[#E1306C] to-[#C13584] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gray-800/50 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#E1306C] hover:to-[#C13584] transition-all duration-300 border border-gray-700/50 group-hover:border-[#E1306C] group-hover:scale-110">
                                        <i className="ri-instagram-line text-xl text-gray-400 group-hover:text-white transition-colors"></i>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/919886786706"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group"
                                    title="Chat on WhatsApp"
                                >
                                    <div className="absolute inset-0 bg-[#25D366] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gray-800/50 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#25D366] transition-all duration-300 border border-gray-700/50 group-hover:border-[#25D366] group-hover:scale-110">
                                        <i className="ri-whatsapp-line text-xl text-gray-400 group-hover:text-white transition-colors"></i>
                                    </div>
                                </a>
                                <a
                                    href="https://www.twitter.com/reused_in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group"
                                    title="Follow us on Twitter"
                                >
                                    <div className="absolute inset-0 bg-[#1DA1F2] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gray-800/50 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] transition-all duration-300 border border-gray-700/50 group-hover:border-[#1DA1F2] group-hover:scale-110">
                                        <i className="ri-twitter-x-line text-xl text-gray-400 group-hover:text-white transition-colors"></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800/50 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-400">
                                &copy; 2025 <span className="text-white font-semibold cursor-default select-none" onClick={handleSecretTap}>Reused</span>. All Rights Reserved.
                            </p>
                            <p className="text-xs text-cyan-400 mt-2 font-black tracking-widest uppercase">
                                Zero Soldering. Zero Substitutions. 100% Originality.
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">
                                Made with <i className="ri-heart-fill text-red-500"></i> in Bangalore
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">We Accept</p>
                            <div className="flex gap-2">
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                                    <i className="ri-visa-line text-2xl text-gray-400"></i>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                                    <i className="ri-mastercard-line text-2xl text-gray-400"></i>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                                    <i className="ri-bank-card-line text-2xl text-gray-400"></i>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors flex items-center">
                                    <span className="text-xs font-bold text-gray-400">UPI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Slogan Integration at Footer End */}
            <div className="relative py-12 bg-black/40 border-t border-gray-800/30 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-[#29abe2] rounded-full blur-[80px] opacity-[0.05]"></div>
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#0a2e5e] rounded-full blur-[80px] opacity-[0.05]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
                        <span className="text-lg md:text-xl font-bold text-white tracking-tight hover:text-[#29abe2] transition-colors cursor-default">
                            Zero Soldering.
                        </span>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                        <span className="text-lg md:text-xl font-bold text-gray-400 tracking-tight hover:text-[#29abe2] transition-colors cursor-default">
                            Zero Substitutions.
                        </span>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#29abe2] to-[#0a2e5e] bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform cursor-default">
                            100% Originality.
                        </span>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:from-[#0a2e5e] hover:to-[#29abe2] hover:border-[#29abe2] transition-all duration-300 group opacity-0 hover:opacity-100 focus:opacity-100"
                aria-label="Scroll to top"
            >
                <i className="ri-arrow-up-line text-xl group-hover:scale-110 transition-transform"></i>
            </button>

            {/* Added Slogan Section at the end */}
            <SloganSection />
        </footer >
    );
}
