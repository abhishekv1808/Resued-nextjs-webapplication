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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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
            <header className="sticky top-0 z-50 w-full relative">
                {/* Notification Permission Soft Prompt - Skipped for now or implement web-push logic later */}

                {/* Main Header */}
                <div className="bg-white border-b border-gray-100 py-4 shadow-sm relative z-20">
                    <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl mx-auto">
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
                                    src="/images/simtech-computers-logo.svg"
                                    alt="Simtech Computers"
                                    width={150}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Logo (Desktop) */}
                        <div className="hidden md:block mr-12">
                            <Link href="/" className="block group">
                                <Image
                                    src="/images/simtech-computers-logo.svg"
                                    alt="Simtech Computers"
                                    width={200}
                                    height={50}
                                    className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                        </div>

                        {/* Search Bar (Desktop) */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex flex-1 max-w-3xl bg-gray-50 rounded-full mr-12 mx-auto relative shadow-sm border border-gray-200 focus-within:border-red-300 transition-all duration-300"
                        >
                            <div
                                className="relative min-w-[170px] border-r border-gray-100 bg-gray-50/50 h-full rounded-l-full"
                                ref={dropdownRef}
                            >
                                <button
                                    type="button"
                                    className="w-full h-full px-5 py-2.5 flex items-center justify-between text-gray-700 text-sm font-medium hover:bg-gray-100/80 transition-colors focus:outline-none rounded-l-full"
                                    onClick={toggleDropdown}
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <i className={`${selectedCategory.icon} text-[#a51c30]`}></i>{" "}
                                        {selectedCategory.name}
                                    </span>
                                    <i
                                        className={`ri-arrow-down-s-line text-gray-400 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    ></i>
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute top-full left-0 w-[220px] bg-white border border-gray-100 shadow-xl rounded-2xl mt-2 z-50 transition-all duration-300 ease-in-out transform origin-top ${categoryDropdownOpen
                                        ? "opacity-100 scale-100 visible"
                                        : "opacity-0 scale-95 invisible"
                                        } overflow-hidden`}
                                >
                                    <ul className="py-2">
                                        {[
                                            {
                                                id: "",
                                                name: "All Categories",
                                                icon: "ri-apps-line",
                                                color: "text-red-500",
                                            },
                                            {
                                                id: "desktop",
                                                name: "Desktops",
                                                icon: "ri-computer-line",
                                                color: "text-red-500",
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
                                                className="px-5 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-sm text-gray-700 transition-colors"
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
                                placeholder="Search for products, brands and more..."
                                className="flex-1 px-5 py-2.5 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-[#a51c30] text-white px-8 rounded-r-full hover:bg-red-700 transition-all duration-300 flex items-center justify-center group"
                            >
                                <i className="ri-search-line text-xl group-hover:scale-110 transition-transform"></i>
                            </button>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4 text-gray-700">
                            <div className="hidden xl:block text-right text-sm mr-4">
                                <div className="text-gray-500 text-xs font-medium mb-0.5">
                                    Need Help?
                                </div>
                                <div className="font-bold text-gray-900 tracking-wide">
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

                                {user ? (
                                    <Link
                                        href="/cart"
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all cursor-pointer group relative"
                                        title="Cart"
                                    >
                                        <i className="ri-shopping-cart-2-line text-2xl group-hover:text-yellow-300 transition-colors"></i>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-[#a51c30]">
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

                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
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
                                            <i className="ri-logout-box-r-line text-2xl group-hover:text-red-300 transition-colors"></i>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 bg-[#a51c30] hover:bg-[#8d1829] md:px-6 md:py-2 px-4 py-1 rounded-full transition-all ml-2 border border-transparent text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        title="Login"
                                    >
                                        <i className="ri-user-line text-xl"></i>
                                        <span className="md:text-sm text-xs font-semibold">
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
                            <button type="submit" className="bg-[#a51c30] text-white px-5">
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
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#a51c30] text-white">
                        <Link href="/" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <Image src="/images/simtech-computers-logo.svg" alt="Simtech" width={120} height={32} className="h-8 w-auto brightness-0 invert" />
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
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#a51c30] font-bold text-xl border-2 border-white shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg leading-tight">{user.name}</p>
                                        <Link href="/profile" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
                                            View Profile <i className="ri-arrow-right-s-line"></i>
                                        </Link>
                                    </div>
                                </div>
                                <button onClick={() => { setMobileMenuOpen(false); setLogoutModalOpen(true); }} className="flex items-center justify-center w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                                    <i className="ri-logout-box-r-line mr-2"></i> Logout
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-3 font-medium">Welcome! Manage your orders & profile</p>
                                <div className="flex gap-3">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 rounded-xl bg-[#a51c30] text-white text-center text-sm font-bold shadow-md hover:bg-red-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">Login</Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 text-center text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">Sign Up</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        <ul className="flex flex-col text-gray-700 font-medium text-base">
                            {[
                                { href: "/", icon: "ri-home-4-line text-red-600", label: "Home" },
                                { href: "/desktops", icon: "ri-computer-line text-red-500", label: "Desktops" },
                                { href: "/laptops", icon: "ri-macbook-line text-indigo-500", label: "Laptops" },
                                { href: "/monitors", icon: "ri-tv-2-line text-purple-500", label: "Monitors" },
                                { href: "/accessories", icon: "ri-headphone-line text-teal-500", label: "Accessories" },
                                { href: "/compare", icon: "ri-scales-3-line text-blue-500", label: "Compare" },
                                { href: "/about-us", icon: "ri-information-line text-orange-500", label: "About Us" },
                                { href: "/contact-us", icon: "ri-contacts-line text-pink-500", label: "Contact Us" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 hover:bg-gray-50 hover:text-[#a51c30] transition-colors border-b border-gray-50 flex items-center gap-4">
                                        <i className={`${item.icon} text-xl`}></i> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Navigation Menu (Desktop) */}
                <div className="bg-white border-b border-gray-100 shadow-sm hidden md:block">
                    <div className="container mx-auto px-4 max-w-7xl mx-auto">
                        <ul className="flex items-center justify-center space-x-10 py-4 overflow-x-auto text-gray-700 font-medium text-sm scrollbar-hide">
                            {[
                                { href: "/", icon: "ri-home-4-line text-red-600", label: "Home" },
                                { href: "/desktops", icon: "ri-computer-line text-red-500", label: "Desktops" },
                                { href: "/laptops", icon: "ri-macbook-line text-indigo-500", label: "Laptops" },
                                { href: "/monitors", icon: "ri-tv-2-line text-purple-500", label: "Monitors" },
                                { href: "/accessories", icon: "ri-headphone-line text-teal-500", label: "Accessories" },
                                { href: "/compare", icon: "ri-scales-3-line text-blue-500", label: "Compare" },
                                { href: "/about-us", icon: "ri-information-line text-orange-500", label: "About" },
                                { href: "/contact-us", icon: "ri-contacts-line text-pink-500", label: "Contact Us" },
                                { href: "/blogs", icon: "ri-article-line text-yellow-500", label: "Blog" },
                            ].map(item => (
                                <li key={item.label} className="whitespace-nowrap">
                                    <Link href={item.href} className="hover:text-[#a51c30] transition-colors flex items-center gap-2">
                                        <i className={`text-lg ${item.icon}`}></i> {item.label}
                                    </Link>
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
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <i className="ri-lock-line text-red-600 text-xl"></i>
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
                                        <Link href="/login" onClick={() => setLoginModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
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
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <i className="ri-alert-line text-red-600 text-xl"></i>
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
                                        <button type="button" onClick={() => { logout(); setLogoutModalOpen(false); }} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Logout</button>
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
