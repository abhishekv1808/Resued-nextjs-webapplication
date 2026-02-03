"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        // Define the global listener function expected by phone.email
        (window as any).phoneEmailListener = async function (userObj: any) {
            const user_json_url = userObj.user_json_url;

            if (user_json_url) {
                try {
                    const response = await axios.post("/api/auth/login", {
                        user_json_url,
                    });

                    if (response.data.isLoggedIn) {
                        const user = response.data.user;
                        setUserName(user.name || "User");
                        setShowWelcome(true);

                        // Delay login and redirect to show modal
                        setTimeout(() => {
                            login(user);
                            router.push("/");
                        }, 2000);
                    }
                } catch (err: any) {
                    console.error("Login failed", err);
                    setError(
                        err.response?.data?.message || "Login failed. Please try again."
                    );
                }
            } else {
                console.error("No user_json_url received");
            }
        };
    }, [login, router]);

    return (
        <>
            <Loader />
            <Header />
            <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <style jsx global>{`
                    @keyframes scaleUp {
                        0% { transform: scale(0.9); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-scale-up {
                        animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    @keyframes checkmark {
                        0% { stroke-dashoffset: 50; }
                        100% { stroke-dashoffset: 0; }
                    }
                    .animate-checkmark path {
                        stroke-dasharray: 50;
                        stroke-dashoffset: 50;
                        animation: checkmark 0.5s 0.2s ease-in-out forwards;
                    }
                `}</style>

                {/* Welcome Modal Overlay */}
                {showWelcome && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-scale-up relative overflow-hidden">
                            {/* Confetti / Decoration Background */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-red-500 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-500 rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/10">
                                    <svg className="w-10 h-10 text-green-600 animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-2">Login Successful!</h3>
                                <p className="text-gray-500 mb-6 font-medium">Welcome back, {userName} 👋</p>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                    Redirecting to home...
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-200/30 blur-3xl"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl"></div>
                </div>

                <div className={`max-w-md w-full space-y-8 relative z-10 transition-all duration-500 ${showWelcome ? 'scale-95 blur-sm' : ''}`}>
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <i className="ri-login-circle-line text-3xl text-red-600"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Sign in to access your account
                            </p>
                        </div>

                        {error && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-6 text-sm"
                                role="alert"
                            >
                                <i className="ri-error-warning-fill text-lg mr-2"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                <p className="text-gray-600 mb-4 font-medium text-sm">
                                    Authenticate with your phone
                                </p>

                                {/* Phone.email Configuration */}
                                <div
                                    className="pe_signin_button"
                                    data-client-id="11157398436047844963"
                                ></div>
                            </div>

                            {/* Phone.email Script */}
                            <Script
                                src="https://www.phone.email/sign_in_button_v1.js"
                                strategy="lazyOnload"
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        New to our platform?
                                    </span>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500">
                        By signing in, you agree to our{" "}
                        <Link href="#" className="underline hover:text-gray-900">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="underline hover:text-gray-900">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
