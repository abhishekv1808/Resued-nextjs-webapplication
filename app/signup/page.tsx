"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

declare global {
    interface Window {
        phoneEmailListener: (userObj: any) => void;
    }
}

export default function SignupPage() {
    const router = useRouter();
    const { user, loading, login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        user_json_url: "",
    });
    const [isVerified, setIsVerified] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState("User");

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        window.phoneEmailListener = function (userObj: any) {
            const user_json_url = userObj.user_json_url;

            if (user_json_url) {
                setFormData((prev) => ({ ...prev, user_json_url }));
                setIsVerified(true);
            } else {
                console.error("No user_json_url received");
            }
        };
    }, []);

    useEffect(() => {
        // Manually load the script to ensure it runs every time the component mounts
        // This fixes the issue where standard next/script doesn't re-initialize on client-side navigation
        const script = document.createElement("script");
        script.src = "https://www.phone.email/sign_in_button_v1.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified || !formData.user_json_url) {
            setError("Please verify your phone number first.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await axios.post("/api/auth/signup", formData);
            if (response.data.isLoggedIn) {
                setUserName(response.data.user.name || "User");
                setShowWelcome(true);

                // Delay login and redirect to show modal
                setTimeout(() => {
                    login(response.data.user);
                    router.push("/");
                }, 2000);
            }
        } catch (err: any) {
            console.error("Signup failed", err);
            setError(
                err.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Loader />
            <Header />
            <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

                {/* Welcome Modal Overlay */}
                {showWelcome && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-scale-up relative overflow-hidden">
                            {/* Decoration Background */}
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

                                <h3 className="text-2xl font-black text-gray-900 mb-2">Registered Successfully!</h3>
                                <p className="text-gray-500 mb-6 font-medium">Welcome, {userName} 👋</p>

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
                                <i className="ri-user-add-line text-3xl text-[#0a2e5e]"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Create Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Join us to get started
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

                        {/* Phone Signup Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Full Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="ri-user-line text-gray-400"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="pl-10 block w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-all duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Location
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="ri-map-pin-line text-gray-400"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="location"
                                                id="location"
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="pl-10 block w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-all duration-300"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0a2e5e]/5 to-[#29abe2]/10 rounded-xl border border-[#29abe2]/20 relative overflow-hidden"
                                    style={{ display: isVerified ? 'none' : 'flex' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a2e5e] to-[#29abe2]"></div>
                                    <div className="w-10 h-10 rounded-full bg-[#0a2e5e]/10 flex items-center justify-center mb-3">
                                        <i className="ri-smartphone-line text-xl text-[#0a2e5e]"></i>
                                    </div>
                                    <p className="text-[#0a2e5e] mb-4 font-bold text-sm font-heading">
                                        Verify your mobile number
                                    </p>

                                    <div
                                        className="pe_signin_button phone-btn-themed"
                                        data-client-id="11157398436047844963"
                                    ></div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={!isVerified || submitting}
                                        className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white transition-all duration-300 shadow-lg ${!isVerified || submitting
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#0a2e5e] hover:bg-[#29abe2] hover:-translate-y-0.5 shadow-blue-900/20"
                                            }`}
                                    >
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            {isVerified ? (
                                                <i className="ri-check-line text-red-200 group-hover:text-red-100"></i>
                                            ) : (
                                                <i className="ri-lock-line text-gray-200 group-hover:text-gray-100"></i>
                                            )}
                                        </span>
                                        {submitting ? "Creating Account..." : isVerified ? "Complete Registration" : "Register Account"}
                                    </button>
                                    {!isVerified && (
                                        <p className="mt-2 text-center text-xs text-gray-500">
                                            * Please verify your phone number to enable registration
                                        </p>
                                    )}
                                </div>
                        </form>

                        {/* Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-400 font-medium">
                                    or sign up with
                                </span>
                            </div>
                        </div>

                        {/* Google Sign-Up Button */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a
                            href="/api/auth/google"
                            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                Sign up with Google
                            </span>
                        </a>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <Link
                                href="/login"
                                className="font-bold text-[#0a2e5e] hover:text-[#29abe2] transition-colors duration-300"
                            >
                                Sign in instead
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}