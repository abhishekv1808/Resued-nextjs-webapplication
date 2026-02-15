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
        <div className="bg-[#f0f2f5] min-h-screen flex items-center justify-center font-sans selection:bg-[#29abe2] selection:text-white p-2 sm:p-4">
            {/* Welcome Modal Overlay */}
            {showWelcome && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-2xl sm:rounded-[40px] p-6 sm:p-8 max-w-sm w-full mx-2 sm:mx-4 shadow-2xl text-center animate-scale-up relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#0a2e5e] rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#29abe2] rounded-full blur-3xl"></div>
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
                                <span className="w-2 h-2 bg-[#0a2e5e] rounded-full animate-pulse"></span>
                                Redirecting to dashboard...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-white w-full max-w-[1100px] sm:min-h-[720px] rounded-2xl sm:rounded-[50px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row transition-all duration-500 ${showWelcome ? 'scale-95 blur-sm' : ''}`}>

                {/* Left Side: Decorative Column - Exact Literal Replication */}
                <div className="hidden lg:flex w-[48%] bg-[#f8f2f2] relative items-end justify-center overflow-hidden">
                    {/* Decorative Shape at Bottom (Rebranded to Cyan) */}
                    <div className="absolute bottom-[-10%] left-0 w-full h-[250px] bg-[#29abe2] rounded-[50%] translate-y-24 scale-x-110"></div>

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-0">
                        {/* Main Image: Exact match from screenshot */}
                        <div className="relative z-10 translate-y-4">
                            <Image
                                src="/images/Indian-women-with-apple-laptop.png"
                                alt="Admin Panel"
                                width={600}
                                height={600}
                                className="w-full h-auto object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Floating Stats Card 1: Profit (Top Left) */}
                        <div className="absolute top-[22%] left-10 bg-white p-5 rounded-[24px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] z-20 animate-float-delayed min-w-[140px]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                    <i className="ri-bar-chart-fill text-xl"></i>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profit</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900">₹ 8.4L</div>
                            <div className="text-[10px] text-green-500 font-bold mt-1">+12% this month</div>
                        </div>

                        {/* Floating Stats Card 2: Orders (Bottom Right) */}
                        <div className="absolute bottom-[28%] right-10 bg-white p-5 rounded-[24px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] z-20 animate-float min-w-[140px]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-[#e6f4fa] text-[#29abe2] flex items-center justify-center">
                                    <i className="ri-shopping-bag-3-fill text-xl"></i>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900">1,240</div>
                            <div className="text-[10px] text-[#29abe2] font-bold mt-1">+5% new orders</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Column */}
                <div className="flex-1 p-5 sm:p-10 lg:p-16 flex flex-col justify-center bg-white relative">
                    {/* Reused Logo */}
                    <div className="flex items-start mb-4">
                        <Image
                            src="/images/Reused-logo.svg"
                            alt="Reused"
                            width={160}
                            height={40}
                            className="h-14 sm:h-28 w-auto object-contain"
                            priority
                        />
                    </div>

                    {/* Header Text */}
                    <div className="mb-4 sm:mb-10">
                        <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-0.5 sm:mb-2 tracking-tight">
                            Reused admin panel! 👋
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Please sign-in to your account and start the operations
                        </p>
                    </div>

                    {/* Form Component */}
                    {error && (
                        <div className="text-[#0a2e5e] text-sm bg-blue-50/50 p-4 rounded-xl flex items-center gap-3 mb-8 border border-blue-100 animate-shake">
                            <i className="ri-error-warning-fill text-xl"></i>
                            <span className="font-bold">{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
                        <div className="space-y-1.5 sm:space-y-3">
                            <label
                                htmlFor="email"
                                className="block text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]"
                            >
                                Email or Username
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@reused.in"
                                className="w-full bg-[#f3f6f9] border-none text-gray-900 text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-5 sm:py-5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#29abe2]/10 transition-all font-bold placeholder:text-gray-300 placeholder:font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 sm:space-y-3">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]"
                                >
                                    Password
                                </label>
                                <a href="#" className="text-[10px] sm:text-xs text-[#0a2e5e] hover:text-[#29abe2] font-black underline underline-offset-4 decoration-2">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#f3f6f9] border-none text-gray-900 text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-5 sm:py-5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#29abe2]/10 transition-all font-bold placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 border-none bg-transparent"
                                >
                                    <i className={showPassword ? "ri-eye-line text-xl" : "ri-eye-off-line text-xl"}></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-[#0a2e5e] peer-checked:border-[#0a2e5e] transition-all"></div>
                                    <i className="ri-check-line absolute inset-0 text-white text-lg flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform"></i>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-400 font-bold group-hover:text-gray-600 transition-colors">
                                    Remember Me
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || showWelcome}
                            className={`w-full bg-[#0a2e5e] hover:bg-[#29abe2] text-white font-black py-2.5 sm:py-5 rounded-lg sm:rounded-[18px] shadow-xl shadow-blue-900/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center text-sm sm:text-lg ${loading || showWelcome ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
