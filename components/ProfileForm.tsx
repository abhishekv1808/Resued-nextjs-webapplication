'use client';

import { useActionState, useEffect } from 'react';
import { updateProfile } from '@/app/actions/user';

interface UserData {
    name: string;
    email?: string;
    phone: string;
    location: string;
    address?: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function ProfileForm({ user }: { user: UserData }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState);

    return (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-10 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-red-400 opacity-10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-red-100 text-sm mt-2 font-medium">Manage your personal information and preferences</p>
                </div>
                <div className="relative z-10 bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-inner">
                    <i className="ri-user-settings-line text-4xl text-white"></i>
                </div>
            </div>

            {/* Feedback Messages */}
            {state.message && (
                <div className={`mx-8 mt-8 px-4 py-3 rounded-lg flex items-center ${state.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`} role="alert">
                    <i className={`${state.success ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-xl mr-2`}></i>
                    <span>{state.message}</span>
                </div>
            )}

            <form action={formAction} className="p-8 space-y-8">

                {/* Read-Only Identity Card */}
                <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <label className="block text-red-800 text-xs font-bold uppercase tracking-wider mb-1">Registered Mobile Number</label>
                        <div className="flex items-center text-gray-800 font-mono text-xl font-semibold">
                            <i className="ri-smartphone-line mr-2 text-red-600"></i>
                            {user.phone}
                        </div>
                        <p className="text-xs text-red-600/70 mt-1">Unique identity • Cannot be changed</p>
                    </div>
                    <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <i className="ri-verified-badge-fill mr-1.5"></i> Verified Account
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <i className="ri-edit-box-line mr-2 text-red-600"></i> Editable Details
                    </h2>

                    {/* Editable Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-user-line text-gray-400"></i>
                                </div>
                                <input type="text" name="name" id="name" defaultValue={user.name} required
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold">Location</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-map-pin-line text-gray-400"></i>
                                </div>
                                <input type="text" name="location" id="location" defaultValue={user.location} required
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-400"></i>
                                </div>
                                <input type="email" name="email" id="email" defaultValue={user.email || ''} placeholder="name@example.com"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="address" className="block text-gray-700 text-sm font-semibold">Shipping Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <i className="ri-home-4-line text-gray-400"></i>
                                </div>
                                <textarea name="address" id="address" rows={3} placeholder="Enter your full shipping address" defaultValue={user.address || ''}
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-red-500 focus:ring-red-500 sm:text-sm py-2.5 transition-colors duration-200 ease-in-out resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                    <button type="submit" disabled={isPending} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isPending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="ri-save-3-line mr-2 text-lg"></i> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
