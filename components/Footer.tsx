"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error" | "already">(
        "idle"
    );

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            // Mock API call or implement real one
            // For now, simulating success
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
            setEmail("");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-8 pb-6 mt-10 md:pt-16 md:pb-8 md:mt-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top Section: Newsletter */}
                <div className="border-b border-gray-800 pb-8 mb-8 md:pb-12 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="bg-[#a51c30] p-2 md:p-3 rounded-full text-white flex-shrink-0">
                            <i className="ri-mail-send-line text-xl md:text-2xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                                Sign up to Newsletter
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400">
                                ...and receive ₹1,000 coupon for first shopping.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 w-full md:w-auto max-w-md">
                        <form
                            onSubmit={handleSubscribe}
                            className="flex bg-white rounded-lg overflow-hidden h-10 md:h-12"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="flex-1 px-4 py-2 md:py-3 text-sm md:text-base outline-none text-gray-700"
                            />
                            <button
                                type="submit"
                                className="bg-[#a51c30] text-white px-4 md:px-6 text-sm md:text-base font-semibold hover:bg-[#8e1829] transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                        {status === "success" && (
                            <p className="text-green-500 text-xs mt-1">Subscribed successfully!</p>
                        )}
                    </div>
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Contact */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">
                            Contact Us
                        </h4>
                        <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
                            <li className="flex items-start gap-3">
                                <i className="ri-phone-line text-[#a51c30] text-lg md:text-xl mt-0.5"></i>
                                <span>
                                    Call Us 24/7<br />
                                    <span className="text-white font-bold text-base md:text-lg">
                                        +91 98867 86706
                                    </span>
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="ri-map-pin-line text-[#a51c30] text-lg md:text-xl mt-0.5"></i>
                                <span>
                                    Simtech Computers, Banglaore<br />
                                    Karnataka, India
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="ri-mail-line text-[#a51c30] text-lg md:text-xl mt-0.5"></i>
                                <span> support@simtech.com </span>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">
                            Information
                        </h4>
                        <ul className="space-y-2 text-xs md:text-sm">
                            <li>
                                <Link
                                    href="/about-us"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Delivery Information
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-and-conditions"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Customer Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* My Account */}
                    <div>
                        <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">
                            My Account
                        </h4>
                        <ul className="space-y-2 text-xs md:text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    View Cart
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Track My Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-[#a51c30] transition-colors"
                                >
                                    Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">
                            Follow Us
                        </h4>
                        <p className="text-xs md:text-sm mb-4">
                            Stay connected with us on social media
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/simtechcomputers"
                                target="_blank"
                                className="bg-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors group"
                                title="Follow us on Facebook"
                            >
                                <i className="ri-facebook-fill text-lg md:text-2xl group-hover:scale-110 transition-transform"></i>
                            </a>
                            <a
                                href="https://www.instagram.com/simtechcomputers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                className="bg-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-colors group"
                                title="Follow us on Instagram"
                            >
                                <i className="ri-instagram-line text-lg md:text-2xl group-hover:scale-110 transition-transform"></i>
                            </a>
                            <a
                                href="https://wa.me/919886786706"
                                target="_blank"
                                className="bg-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors group"
                                title="Chat on WhatsApp"
                            >
                                <i className="ri-whatsapp-line text-lg md:text-2xl group-hover:scale-110 transition-transform"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 md:pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-xs md:text-sm text-gray-500">
                        &copy; 2025 Simtech Computers. All Rights Reserved.
                    </p>
                    <div className="flex gap-3 md:gap-2 text-xl md:text-2xl text-gray-500">
                        <i className="ri-visa-line hover:text-white cursor-pointer"></i>
                        <i className="ri-mastercard-line hover:text-white cursor-pointer"></i>
                        <i className="ri-paypal-line hover:text-white cursor-pointer"></i>
                        <i className="ri-bank-card-line hover:text-white cursor-pointer"></i>
                    </div>
                </div>
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/919886786706"
                target="_blank"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group hover:shadow-xl"
            >
                <i className="ri-whatsapp-line text-3xl animate-bounce"></i>
            </a>
        </footer>
    );
}
