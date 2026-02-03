"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        user_json_url: "",
    });
    const [isVerified, setIsVerified] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (window as any).phoneEmailListener = function (userObj: any) {
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
                login(response.data.user);
                router.push("/");
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
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-200/30 blur-3xl"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl"></div>
                </div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <i className="ri-user-add-line text-3xl text-red-600"></i>
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
                                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out"
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
                                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed"
                                style={{ display: isVerified ? 'none' : 'flex' }}
                            >
                                <p className="text-gray-600 mb-4 font-medium text-sm">
                                    Verify your mobile number
                                </p>

                                <div
                                    className="pe_signin_button"
                                    data-client-id="11157398436047844963"
                                ></div>
                            </div>

                            {/* Phone.email Script - Handled by useEffect */}

                            <div>
                                <button
                                    type="submit"
                                    disabled={!isVerified || submitting}
                                    className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 shadow-sm ${!isVerified || submitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 shadow-md"
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
                                className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
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
