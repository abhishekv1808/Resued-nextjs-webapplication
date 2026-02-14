"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Header() {
    const { user, loading, logout } = useAuth();
    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({
        id: "",
        name: "All Categories",
        icon: "ri-apps-line",
    });
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleDropdown = () => setCategoryDropdownOpen(!categoryDropdownOpen);

    const selectCategory = (id: string, name: string, icon: string) => {
        setSelectedCategory({ id, name, icon });
        setCategoryDropdownOpen(false);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q") as string;
        const category = selectedCategory.id;
        router.push(`/search?q=${q}&category=${category}`);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full transition-all duration-300 font-sans">
                {/* Thin Gradient Top Bar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-[#0a2e5e] via-[#29abe2] to-[#0a2e5e] animate-gradient-x"></div>

                {/* Main Header with Glassmorphism */}
                <div className={`bg-white/90 backdrop-blur-xl border-b border-gray-100/50 py-3 md:py-4 relative z-20 transition-shadow duration-300 ${isScrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.1)]" : "shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
                    }`}>
                    <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
                        {/* Mobile Menu Triggers */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="text-gray-700 text-2xl mr-4 hover:bg-gray-100 p-3 rounded-full transition-colors"
                                aria-label="Open Menu"
                            >
                                <i className="ri-menu-line"></i>
                            </button>
                            <Link href="/" className="block">
                                <Image
                                    src="/images/Reused-logo.svg"
                                    alt="Reused"
                                    width={180}
                                    height={48}
                                    className="h-18 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Logo (Desktop) */}
                        <div className="hidden md:block ml-8 mr-12 flex justify-center">
                            <Link href="/" className="block group">
                                <Image
                                    src="/images/Reused-logo.svg"
                                    alt="Reused"
                                    width={240}
                                    height={60}
                                    className="h-24 w-auto group-hover:scale-105 transition-transform duration-300 mx-auto"
                                />
                            </Link>
                        </div>

                        {/* Search Bar (Desktop) - Action Center Look */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex flex-1 max-w-2xl bg-white/50 backdrop-blur-sm rounded-2xl mr-8 ml-8 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-gray-200/60 focus-within:border-[#29abe2]/40 focus-within:bg-white focus-within:shadow-lg transition-all duration-500 overflow-hidden"
                        >
                            <div
                                className="relative min-w-[170px] border-r border-gray-100 bg-gray-50/50 h-full rounded-l-full"
                                ref={dropdownRef}
                            >
                                <button
                                    type="button"
                                    className="w-full h-full px-5 py-2.5 flex items-center justify-between text-gray-700 text-sm font-semibold hover:bg-gray-200/50 transition-colors focus:outline-none"
                                    onClick={toggleDropdown}
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <i className={`${selectedCategory.icon} text-[#29abe2]`}></i>{" "}
                                        {selectedCategory.name}
                                    </span>
                                    <i
                                        className={`ri-arrow-down-s-line text-gray-400 transition-transform duration-500 ${categoryDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    ></i>
                                </button>

                                {/* Dropdown Menu - Glass Effect */}
                                <div
                                    className={`absolute top-[calc(100%+10px)] left-0 w-[240px] bg-white/95 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl z-50 transition-all duration-300 ease-out transform origin-top-left ${categoryDropdownOpen
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-4 invisible"
                                        } overflow-hidden`}
                                >
                                    <ul className="py-2">
                                        {[
                                            {
                                                id: "",
                                                name: "All Categories",
                                                icon: "ri-apps-line",
                                                color: "text-blue-500",
                                            },
                                            {
                                                id: "desktop",
                                                name: "Desktops",
                                                icon: "ri-computer-line",
                                                color: "text-emerald-500",
                                            },
                                            {
                                                id: "laptop",
                                                name: "Laptops",
                                                icon: "ri-macbook-line",
                                                color: "text-indigo-500",
                                            },
                                            {
                                                id: "monitor",
                                                name: "Monitors",
                                                icon: "ri-tv-2-line",
                                                color: "text-purple-500",
                                            },
                                            {
                                                id: "accessory",
                                                name: "Accessories",
                                                icon: "ri-headphone-line",
                                                color: "text-teal-500",
                                            },
                                        ].map((cat) => (
                                            <li
                                                key={cat.id}
                                                className="px-5 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-sm text-gray-700 transition-colors"
                                                onClick={() =>
                                                    selectCategory(cat.id, cat.name, cat.icon)
                                                }
                                            >
                                                <i className={`${cat.icon} ${cat.color} text-lg`}></i>{" "}
                                                {cat.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <input
                                type="text"
                                name="q"
                                placeholder="What are you looking for today?"
                                className="flex-1 px-5 py-2.5 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-sm font-medium"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#0a2e5e] to-[#29abe2] text-white px-6 hover:shadow-glow transition-all duration-300 flex items-center justify-center group"
                            >
                                <i className="ri-search-2-line text-xl group-hover:scale-125 transition-transform duration-300 font-bold"></i>
                            </button>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4 text-gray-700">
                            <div className="hidden xl:block text-right text-sm mr-4">
                                <div className="text-gray-500 text-xs font-bold mb-0.5 uppercase tracking-wider font-heading">
                                    Need Help?
                                </div>
                                <div className="font-black text-gray-900 tracking-wide font-heading">
                                    +91 96321 78786
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/wishlist"
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                    title="Wishlist"
                                >
                                    <i className="ri-heart-line text-2xl group-hover:text-pink-300 transition-colors"></i>
                                </Link>

                                {loading ? (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
                                ) : user ? (
                                    <Link
                                        href="/cart"
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                        title="Cart"
                                    >
                                        <i className="ri-shopping-cart-2-line text-2xl group-hover:text-yellow-300 transition-colors"></i>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#0a2e5e] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-[#0a2e5e]">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => setLoginModalOpen(true)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                        title="Cart"
                                    >
                                        <i className="ri-shopping-cart-2-line text-2xl group-hover:text-yellow-300 transition-colors"></i>
                                    </button>
                                )}

                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
                                        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
                                    </div>
                                ) : user ? (
                                    <>
                                        <Link
                                            href="/profile/orders"
                                            prefetch={false}
                                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                            title="My Orders"
                                        >
                                            <i className="ri-file-list-3-line text-2xl group-hover:text-[#29abe2] transition-colors"></i>
                                        </Link>
                                        <Link
                                            href="/profile"
                                            prefetch={false}
                                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                            title="My Profile"
                                        >
                                            <i className="ri-user-settings-line text-2xl group-hover:text-green-300 transition-colors"></i>
                                        </Link>
                                        <button
                                            onClick={() => setLogoutModalOpen(true)}
                                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                            title="Logout"
                                        >
                                            <i className="ri-logout-box-r-line text-2xl group-hover:text-[#29abe2] transition-colors"></i>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 bg-[#0a2e5e] hover:bg-[#29abe2] md:px-6 md:py-2 px-4 py-1 rounded-full transition-all ml-2 border border-transparent text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-heading"
                                        title="Login"
                                    >
                                        <i className="ri-user-line text-xl"></i>
                                        <span className="md:text-sm text-xs font-bold uppercase tracking-wider">
                                            Login
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden container mx-auto px-4 mt-4 pb-2">
                        <form
                            onSubmit={handleSearch}
                            className="flex bg-gray-50 rounded-full overflow-hidden shadow-sm border border-gray-200"
                        >
                            <input
                                type="text"
                                name="q"
                                placeholder="Search..."
                                className="flex-1 px-5 md:py-2.5 py-2 outline-none text-gray-700 text-xs md:text-sm "
                            />
                            <button type="submit" className="bg-[#0a2e5e] text-white px-5">
                                <i className="ri-search-line"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Mobile Menu Backdrop */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setMobileMenuOpen(false)}
                ></div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#0a2e5e] text-white">
                        <Link href="/" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <Image src="/images/Reused-logo.svg" alt="Reused" width={140} height={36} className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-gray-200 transition-colors p-2">
                            <i className="ri-close-line text-3xl"></i>
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        {user ? (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0a2e5e] font-bold text-xl border-2 border-white shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-lg leading-tight font-heading">{user.name}</p>
                                        <Link href="/profile" prefetch={false} className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 font-heading" onClick={() => setMobileMenuOpen(false)}>
                                            View Profile <i className="ri-arrow-right-s-line"></i>
                                        </Link>
                                    </div>
                                </div>
                                <button onClick={() => { setMobileMenuOpen(false); setLogoutModalOpen(true); }} className="flex items-center justify-center w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[#0a2e5e] hover:border-blue-100 transition-all shadow-sm">
                                    <i className="ri-logout-box-r-line mr-2"></i> Logout
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-3 font-medium">Welcome! Manage your orders & profile</p>
                                <div className="flex gap-3">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 rounded-xl bg-[#0a2e5e] text-white text-center text-sm font-bold shadow-md hover:bg-[#29abe2] hover:shadow-lg transition-all transform hover:-translate-y-0.5">Login</Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 text-center text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">Sign Up</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        <ul className="flex flex-col text-gray-700 font-medium text-base">
                            {[
                                { href: "/", icon: "ri-home-4-line text-blue-500", label: "Home" },
                                { href: "/desktops", icon: "ri-computer-line text-emerald-500", label: "Desktops" },
                                { href: "/laptops", icon: "ri-macbook-line text-indigo-500", label: "Laptops" },
                                { href: "/monitors", icon: "ri-tv-2-line text-purple-500", label: "Monitors" },
                                { href: "/accessories", icon: "ri-headphone-line text-teal-500", label: "Accessories" },
                                { href: "/profile/orders", icon: "ri-file-list-3-line text-cyan-500", label: "My Orders" },
                                { href: "/compare", icon: "ri-scales-3-line text-blue-500", label: "Compare" },
                                { href: "/about-us", icon: "ri-information-line text-orange-500", label: "About Us" },
                                { href: "/contact-us", icon: "ri-contacts-line text-pink-500", label: "Contact Us" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 hover:bg-gray-50 hover:text-[#0a2e5e] transition-colors border-b border-gray-50 flex items-center gap-4">
                                        <i className={`${item.icon} text-xl`}></i> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Navigation Menu (Desktop) - Premium Pills */}
                <div className={`bg-white/95 backdrop-blur-md border-b border-gray-100/50 hidden md:block select-none overflow-hidden transition-shadow duration-300 ${isScrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.05)]" : ""
                    }`}>
                    <div className="container mx-auto px-4 max-w-7xl">
                        <ul className="flex items-center justify-center space-x-2 py-3">
                            {[
                                { href: "/", icon: "ri-home-5-line text-blue-500", label: "Home", color: "hover:text-blue-600" },
                                { href: "/desktops", icon: "ri-computer-line text-emerald-500", label: "Desktops", color: "hover:text-emerald-600" },
                                { href: "/laptops", icon: "ri-macbook-line text-indigo-500", label: "Laptops", color: "hover:text-indigo-600" },
                                { href: "/monitors", icon: "ri-tv-2-line text-purple-500", label: "Monitors", color: "hover:text-purple-600" },
                                { href: "/accessories", icon: "ri-headphone-line text-teal-500", label: "Accessories", color: "hover:text-teal-600" },
                                { href: "/compare", icon: "ri-scales-3-line text-[#29abe2]", label: "Compare", color: "hover:text-blue-500" },
                                { href: "/about-us", icon: "ri-information-line text-orange-500", label: "About", color: "hover:text-orange-600" },
                                { href: "/contact-us", icon: "ri-contacts-line text-pink-500", label: "Contact Us", color: "hover:text-pink-600" },
                                { href: "/blogs", icon: "ri-article-line text-yellow-500", label: "Blog", color: "hover:text-yellow-600" },
                            ].map(item => (
                                <li key={item.label} className="relative group">
                                    <Link
                                        href={item.href}
                                        className={`px-5 py-2 rounded-xl text-gray-600 transition-all duration-300 flex items-center gap-2.5 text-[13px] font-bold tracking-wide ${item.color} hover:bg-gray-100/50 group-hover:scale-105`}
                                    >
                                        <i className={`text-lg ${item.icon} opacity-80 group-hover:opacity-100 transition-opacity`}></i>
                                        {item.label}
                                    </Link>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-[#0a2e5e] to-[#29abe2] rounded-full transition-all duration-300 group-hover:w-[60%] opacity-0 group-hover:opacity-100"></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Login Required Modal */}
                {loginModalOpen && (
                    <div className="fixed inset-0 z-[100]" role="dialog">
                        <div className="fixed inset-0 bg-black/20 transition-opacity backdrop-blur-md" onClick={() => setLoginModalOpen(false)}></div>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <i className="ri-lock-line text-[#0a2e5e] text-xl"></i>
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Login Required</h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">You need to be logged in to add products to your cart.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <Link href="/login" onClick={() => setLoginModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0a2e5e] text-base font-medium text-white hover:bg-[#29abe2] sm:ml-3 sm:w-auto sm:text-sm">
                                            Login
                                        </Link>
                                        <button type="button" onClick={() => setLoginModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout Modal */}
                {logoutModalOpen && (
                    <div className="fixed inset-0 z-[60]" role="dialog">
                        <div className="fixed inset-0 bg-black/30 transition-opacity backdrop-blur-md" onClick={() => setLogoutModalOpen(false)}></div>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <i className="ri-alert-line text-[#0a2e5e] text-xl"></i>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900">Logout Confirmation</h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">Are you sure you want to logout? You will need to login again to access your account.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button type="button" onClick={() => { logout(); setLogoutModalOpen(false); }} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Confirm Logout</button>
                                        <button type="button" onClick={() => setLogoutModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </header>
        </>
    );
}
