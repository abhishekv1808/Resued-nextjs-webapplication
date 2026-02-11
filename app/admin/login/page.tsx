'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Show Welcome Modal
            setShowWelcome(true);

            // Redirect to admin dashboard after delay
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--admin-bg)] min-h-screen flex items-center justify-center overflow-hidden font-sans text-[var(--admin-text-main)] selection:bg-red-500 selection:text-white transition-colors duration-300 relative">


            {/* Welcome Modal Overlay */}
            {showWelcome && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-scale-up relative overflow-hidden">
                        {/* Confetti / Decoration Background */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-red-500 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-green-500 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/10">
                                <svg className="w-10 h-10 text-green-600 animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2">Login Successful!</h3>
                            <p className="text-gray-500 mb-6 font-medium">Welcome back, Admin 👋</p>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                Redirecting to dashboard...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-[var(--admin-card)] w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex border border-[var(--admin-border)] relative mx-4 lg:mx-0 transition-all duration-500 ${showWelcome ? 'scale-95 blur-sm' : ''}`}>

                {/* Left Side: Illustration */}
                <div className="hidden lg:flex w-1/2 bg-red-50/50 dark:bg-red-900/10 relative items-center justify-center p-12">
                    {/* Decorative Circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-200/20 dark:bg-red-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 w-full max-w-xl">
                        <img
                            src="/images/simtech-computers-admin-image.png"
                            alt="Admin Login Illustration"
                            className="w-full h-auto drop-shadow-2xl animate-float"
                        />

                        {/* Floating Stats Card 1 */}
                        <div className="absolute -top-4 -left-4 bg-[var(--admin-card)] p-4 rounded-2xl shadow-lg border border-[var(--admin-border)] animate-float-delayed">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                    <i className="ri-bar-chart-fill"></i>
                                </div>
                                <span className="text-xs font-bold text-[var(--admin-text-muted)]">Profit</span>
                            </div>
                            <div className="text-xl font-bold text-[var(--admin-text-main)]">₹ 8.4L</div>
                            <div className="text-xs text-green-500 font-medium">+12% this month</div>
                        </div>

                        {/* Floating Stats Card 2 */}
                        <div className="absolute bottom-8 -right-4 bg-[var(--admin-card)] p-4 rounded-2xl shadow-lg border border-[var(--admin-border)] animate-float">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                                    <i className="ri-shopping-bag-3-fill"></i>
                                </div>
                                <span className="text-xs font-bold text-[var(--admin-text-muted)]">Orders</span>
                            </div>
                            <div className="text-xl font-bold text-[var(--admin-text-main)]">1,240</div>
                            <div className="text-xs text-red-500 font-medium">+5% new orders</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-[var(--admin-card)]">

                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <Image
                            src="/images/simtech-computers-logo.svg"
                            alt="Simtech"
                            width={120}
                            height={40}
                            className="h-16 w-auto object-contain"
                            style={{ height: 'auto' }}
                            priority
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[var(--admin-text-main)] mb-2">
                            Simtech admin panel! 👋
                        </h2>
                        <p className="text-[var(--admin-text-muted)] text-sm">
                            Please sign-in to your account and start the operations
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2"
                            >
                                Email or Username
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@simtech.com"
                                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider"
                                >
                                    Password
                                </label>
                                <a href="#" className="text-xs text-red-600 hover:text-red-700 font-bold">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] focus:outline-none"
                                >
                                    <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                                <i className="ri-error-warning-fill"></i>
                                {error}
                            </div>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="w-4 h-4 text-red-600 bg-[var(--admin-bg)] border-[var(--admin-border)] rounded focus:ring-red-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-[var(--admin-text-muted)]">
                                Remember Me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || showWelcome}
                            className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center ${loading || showWelcome ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
