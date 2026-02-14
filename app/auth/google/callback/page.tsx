'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [userName, setUserName] = useState('User');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function handleCallback() {
            try {
                // Session is already set by the server-side callback route
                // We just need to load the user data into client-side auth state
                const { data } = await axios.get('/api/auth/user');

                if (data.isLoggedIn && data.user) {
                    setUserName(data.user.name || 'User');
                    setStatus('success');
                    login(data.user);

                    // Redirect after showing welcome
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setErrorMsg('Failed to authenticate. Please try again.');
                    setTimeout(() => router.push('/login'), 3000);
                }
            } catch (err) {
                console.error('Google callback error:', err);
                setStatus('error');
                setErrorMsg('Something went wrong. Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            }
        }

        handleCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-200/30 blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-sm w-full mx-4">
                {status === 'loading' && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a2e5e]"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Signing you in...
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Authenticating with Google
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#0a2e5e] rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#29abe2] rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/10">
                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">
                                Welcome!
                            </h3>
                            <p className="text-gray-500 mb-6 font-medium">
                                Welcome, {userName} 👋
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className="w-2 h-2 bg-[#0a2e5e] rounded-full animate-pulse"></span>
                                Redirecting to home...
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                            <i className="ri-error-warning-line text-3xl text-red-500"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Authentication Failed
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">{errorMsg}</p>
                        <div className="flex items-center gap-2 justify-center text-sm text-gray-400">
                            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                            Redirecting to login...
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
