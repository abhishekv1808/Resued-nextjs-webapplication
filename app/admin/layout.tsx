'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Initialize state and check auth
    useEffect(() => {
        setMounted(true);
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            setIsSidebarOpen(false);
        }

        const checkAuth = async () => {
            try {
                const res = await fetch('/api/admin/check-auth');
                const data = await res.json();

                if (pathname === '/admin/login') {
                    if (data.isLoggedIn && data.isAdmin) {
                        router.replace('/admin');
                    } else {
                        setCheckingAuth(false);
                    }
                } else {
                    if (!data.isLoggedIn || !data.isAdmin) {
                        router.replace('/admin/login');
                    } else {
                        setCheckingAuth(false);
                    }
                }
            } catch (error) {
                console.error('Auth check failed', error);
                if (pathname !== '/admin/login') {
                    router.replace('/admin/login');
                } else {
                    setCheckingAuth(false);
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('sidebarCollapsed', String(!newState));
    };

    const handleLogout = async () => {
        await logout();
        setIsLogoutModalOpen(false);
        router.push('/admin/login');
    };

    // If on login page, render without layout
    if (pathname === '/admin/login') {
        if (checkingAuth && mounted) {
            // Optional: Show nothing or a lighter loader while checking if already logged in
            return null;
        }
        return <>{children}</>;
    }

    if (checkingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--admin-bg)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: 'ri-dashboard-3-line' },
        { name: 'Inventory', href: '/admin/products', icon: 'ri-store-2-line' },
        { name: 'Add Laptop', href: '/admin/add-laptop', icon: 'ri-macbook-line' },
        { name: 'Add Monitor', href: '/admin/add-monitor', icon: 'ri-tv-line' },
        { name: 'Add Desktop', href: '/admin/add-desktop', icon: 'ri-computer-line' },
        { name: 'Add Accessories', href: '/admin/add-accessories', icon: 'ri-keyboard-line' },
    ];

    const managementItems = [
        { name: 'Customer Enquiries', href: '/admin/enquiries', icon: 'ri-question-answer-line' },
        { name: 'Push Notifications', href: '/admin/send-notification', icon: 'ri-notification-3-line' },
        { name: 'Discount Codes', href: '/admin/discounts', icon: 'ri-coupon-3-line' },
    ];

    return (
        <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text-main)] font-sans antialiased overflow-hidden selection:bg-red-500 selection:text-white transition-colors duration-300">
            {/* Sidebar */}
            <nav
                className={`bg-[var(--admin-card)] border-r border-[var(--admin-border)] min-h-screen text-[var(--admin-text-muted)] flex flex-col flex-shrink-0 relative z-30 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-6 transition-all duration-300">
                    <div className={`flex items-center gap-3 mx-auto transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                        <Image
                            src="/images/simtech-computers-logo.svg"
                            alt="Simtech Computers"
                            width={150}
                            height={40}
                            className="h-12 w-auto object-contain"
                            style={{ height: 'auto' }}
                            priority
                        />
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className={`text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] transition-transform duration-300 ${!isSidebarOpen ? 'ml-auto mr-auto' : 'ml-auto'}`}
                    >
                        <i className={`text-xl ${isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'}`}></i>
                    </button>
                </div>

                {/* Main Menu */}
                <div className="flex-grow px-4 py-4 space-y-8 overflow-y-auto scrollbar-hide">
                    {/* Section 1 */}
                    <div>
                        <p className={`px-4 text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest mb-4 whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            Main Menu
                        </p>
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-xl transition-all group whitespace-nowrap ${isActive
                                            ? 'bg-[var(--admin-hover)] text-[var(--admin-text-main)]'
                                            : 'hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text-main)]'
                                            }`}
                                        title={!isSidebarOpen ? item.name : ''}
                                    >
                                        <i className={`${item.icon} mr-3 text-lg flex-shrink-0 ${isActive ? 'text-red-500' : 'text-[var(--admin-text-muted)] group-hover:text-red-400'}`}></i>
                                        <span className={`font-medium text-sm transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <p className={`px-4 text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest mb-4 whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            Management
                        </p>
                        <div className="space-y-1">
                            {managementItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-xl transition-all group whitespace-nowrap ${isActive
                                            ? 'bg-[var(--admin-hover)] text-[var(--admin-text-main)]'
                                            : 'hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text-main)]'
                                            }`}
                                        title={!isSidebarOpen ? item.name : ''}
                                    >
                                        <i className={`${item.icon} mr-3 text-lg flex-shrink-0 ${isActive ? 'text-red-500' : 'text-[var(--admin-text-muted)] group-hover:text-red-400'}`}></i>
                                        <span className={`font-medium text-sm transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* User Profile Bottom */}
                <div className="p-6 border-t border-[var(--admin-border)] flex items-center justify-between gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 hover:bg-[var(--admin-hover)] p-2 rounded-xl transition-colors whitespace-nowrap flex-grow overflow-hidden group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-cyan-500 p-[2px] flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-[var(--admin-bg)] border-2 border-transparent overflow-hidden">
                                <img
                                    src="https://ui-avatars.com/api/?name=Admin+User"
                                    alt="Admin"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className={`flex-grow transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            <h4 className="text-[var(--admin-text-main)] text-sm font-bold group-hover:text-red-500 transition-colors">
                                Admin User
                            </h4>
                            <p className="text-xs text-[var(--admin-text-muted)]">View Store</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition-all shadow-sm flex-shrink-0 border border-transparent hover:border-red-200"
                        title="Logout"
                    >
                        <i className="ri-logout-box-r-line text-xl"></i>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow h-screen overflow-y-auto w-full relative flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-6 sticky top-0 z-20 bg-[var(--admin-bg)]/95 backdrop-blur-sm transition-colors duration-300">
                    {/* Search */}
                    <div className="relative w-96">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"></i>
                        <input
                            type="text"
                            placeholder="Search in inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text-main)] rounded-xl pl-12 pr-20 py-3 focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--admin-hover)] hover:bg-gray-200 text-[var(--admin-text-muted)] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-full px-2 py-1">
                            <button className="w-8 h-8 rounded-full hover:bg-[var(--admin-hover)] flex items-center justify-center text-[var(--admin-text-muted)] transition-colors">
                                <i className="ri-notification-3-line"></i>
                            </button>
                            <button className="w-8 h-8 rounded-full hover:bg-[var(--admin-hover)] flex items-center justify-center text-[var(--admin-text-muted)] transition-colors">
                                <i className="ri-chat-3-line"></i>
                            </button>
                            <button className="w-8 h-8 rounded-full hover:bg-[var(--admin-hover)] flex items-center justify-center text-[var(--admin-text-muted)] transition-colors">
                                <i className="ri-settings-4-line"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-grow px-8 pb-8">
                    {children}
                </div>
            </main>

            {/* Logout Modal */}
            {mounted && isLogoutModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">

                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        aria-hidden="true"
                        onClick={() => setIsLogoutModalOpen(false)}
                    ></div>

                    {/* Modal Panel */}
                    <div className="flex items-center justify-center min-h-screen px-4 p-4 text-center">
                        <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full animate-scale-up border border-gray-100">

                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <i className="ri-logout-circle-line text-red-600 text-xl"></i>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                            Sign Out Confirmation
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to sign out? You will need to login again to access the admin dashboard.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 sm:gap-0">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={() => setIsLogoutModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
