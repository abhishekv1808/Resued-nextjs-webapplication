"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

// Define the window interface to include the phoneEmailListener
declare global {
    interface Window {
        phoneEmailListener: (userObj: any) => void;
    }
}

export default function LoginPage() {
    const router = useRouter();
    const { user, loading, login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState("User");
    const [isUserNotFound, setIsUserNotFound] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    // Check for Google auth errors in URL (one-time, no re-render loop)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const googleError = params.get('error');
        if (googleError) {
            const errorMessages: Record<string, string> = {
                google_denied: 'Google sign-in was cancelled or denied.',
                no_code: 'No authorization code received from Google.',
                token_failed: 'Failed to authenticate with Google. Please try again.',
                invalid_profile: 'Could not retrieve your Google profile.',
                server_error: 'Server error during Google sign-in. Please try again.',
                config_error: 'Google sign-in is not configured properly.',
            };
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError(errorMessages[googleError] || 'Google sign-in failed. Please try again.');
            // Clean URL without triggering React re-render
            window.history.replaceState({}, '', '/login');
        }
    }, []);

    useEffect(() => {
        // Define the global listener function expected by phone.email
        window.phoneEmailListener = async function (userObj: any) {
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
                    const errorMessage = err.response?.data?.message || "Login failed. Please try again.";

                    if (err.response?.data?.code === 'USER_NOT_FOUND') {
                        setIsUserNotFound(true);
                        setError("Account not found. Please create an account to continue.");
                    } else {
                        setError(errorMessage);
                    }
                }
            } else {
                console.error("No user_json_url received");
            }
        };
    }, [login, router]);

    useEffect(() => {
        // Manually load the script to ensure it runs every time the component mounts
        const script = document.createElement("script");
        script.src = "https://www.phone.email/sign_in_button_v1.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <Loader />
            <Header />
            <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">


                {/* Welcome Modal Overlay */}
                {showWelcome && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-scale-up relative overflow-hidden">
                            {/* Confetti / Decoration Background */}
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

                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Login Successful!</h3>
                                <p className="text-gray-500 mb-6 font-medium">Welcome back, {userName} 👋</p>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="w-2 h-2 bg-[#0a2e5e] rounded-full animate-pulse"></span>
                                    Redirecting to home...
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-200/30 blur-3xl"></div>
                </div>

                <div className={`max-w-md w-full space-y-8 relative z-10 transition-all duration-500 ${showWelcome ? 'scale-95 blur-sm' : ''}`}>
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 border border-blue-100 shadow-inner">
                                <i className="ri-login-circle-line text-2xl md:text-3xl text-[#0a2e5e]"></i>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Sign in to access your account
                            </p>
                        </div>

                        {error && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex flex-col mb-6 text-sm"
                                role="alert"
                            >
                                <div className="flex items-center">
                                    <i className="ri-error-warning-fill text-lg mr-2"></i>
                                    <span>{error}</span>
                                </div>
                                {isUserNotFound && (
                                    <Link
                                        href="/signup"
                                        className="mt-2 text-xs font-semibold underline hover:text-red-800 ml-6"
                                    >
                                        Create a new account &rarr;
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Phone Login */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0a2e5e]/5 to-[#29abe2]/10 rounded-xl border border-[#29abe2]/20 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a2e5e] to-[#29abe2]"></div>
                                <div className="w-10 h-10 rounded-full bg-[#0a2e5e]/10 flex items-center justify-center mb-3">
                                    <i className="ri-smartphone-line text-xl text-[#0a2e5e]"></i>
                                </div>
                                <p className="text-[#0a2e5e] mb-4 font-bold text-sm font-heading">
                                    Authenticate with your phone
                                </p>

                                {/* Phone.email Configuration */}
                                <div
                                    className="pe_signin_button phone-btn-themed"
                                    data-client-id="11157398436047844963"
                                ></div>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-white text-gray-400 font-medium">
                                        or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                                href="/api/auth/google"
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                    Sign in with Google
                                </span>
                            </a>

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
                                    className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-[#29abe2] text-sm font-bold rounded-lg text-[#0a2e5e] bg-blue-50 hover:bg-[#29abe2] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-gray-900">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-gray-900">
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