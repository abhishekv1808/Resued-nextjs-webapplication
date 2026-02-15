'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from '@/app/actions/user';

interface UserData {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    address?: string;
    authProvider?: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function ProfileForm({ user }: { user: UserData }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState);
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setIsDeleting(true);
        setDeleteError('');
        try {
            const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                router.push('/');
                router.refresh();
            } else {
                setDeleteError(data.error || 'Something went wrong');
                setIsDeleting(false);
            }
        } catch {
            setDeleteError('Network error. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#0a2e5e] to-[#29abe2] px-8 py-10 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#29abe2] opacity-10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-blue-100 text-sm mt-2 font-medium">Manage your personal information and preferences</p>
                </div>
                <div className="relative z-10 bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-inner">
                    <i className="ri-user-settings-line text-3xl md:text-4xl text-white"></i>
                </div>
            </div>

            {/* Feedback Messages */}
            {state.message && (
                <div className={`mx-8 mt-8 px-4 py-3 rounded-lg flex items-center ${state.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-blue-50 border border-blue-200 text-[#0a2e5e]'}`} role="alert">
                    <i className={`${state.success ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-xl mr-2`}></i>
                    <span>{state.message}</span>
                </div>
            )}

            <form action={formAction} className="p-8 space-y-8">

                {/* Read-Only Identity Card - Only show for phone-based auth users */}
                {user.authProvider !== 'google' && (
                    <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <label className="block text-[#0a2e5e] text-xs font-bold uppercase tracking-wider mb-1">Registered Mobile Number</label>
                            <div className="flex items-center text-gray-800 font-mono text-xl font-semibold">
                                <i className="ri-smartphone-line mr-2 text-[#29abe2]"></i>
                                {user.phone}
                            </div>
                            <p className="text-xs text-[#29abe2]/70 mt-1">Unique identity • Cannot be changed</p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <i className="ri-verified-badge-fill mr-1.5"></i> Verified Account
                            </span>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <i className="ri-edit-box-line mr-2 text-[#29abe2]"></i> Editable Details
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
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold">Location</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-map-pin-line text-gray-400"></i>
                                </div>
                                <input type="text" name="location" id="location" defaultValue={user.location} required
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        {/* Mobile Number field for Google Auth users */}
                        {user.authProvider === 'google' && (
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-phone-line text-gray-400"></i>
                                    </div>
                                    <input type="tel" name="phone" id="phone" defaultValue={user.phone || ''} placeholder="e.g. 9876543210"
                                        maxLength={15}
                                        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                                </div>
                                <p className="text-xs text-gray-400">Enter 10-digit mobile number (country code +91 will be added automatically)</p>
                            </div>
                        )}

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-400"></i>
                                </div>
                                <input type="email" name="email" id="email" defaultValue={user.email || ''} placeholder="name@example.com"
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="address" className="block text-gray-700 text-sm font-semibold">Shipping Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <i className="ri-home-4-line text-gray-400"></i>
                                </div>
                                <textarea name="address" id="address" rows={3} placeholder="Enter your full shipping address" defaultValue={user.address || ''}
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-[#29abe2] focus:ring-[#29abe2] sm:text-sm py-2.5 transition-colors duration-200 ease-in-out resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                    <button type="submit" disabled={isPending} className="bg-gradient-to-r from-[#0a2e5e] to-[#1a4e8e] hover:from-[#1a4e8e] hover:to-[#29abe2] text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
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

            {/* Danger Zone */}
            <div style={{ margin: '0 32px 32px', padding: 24, borderRadius: 16, border: '1px solid #FCA5A5', background: '#FEF2F2' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <i className="ri-error-warning-line" style={{ fontSize: 20, color: '#DC2626' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991B1B', margin: 0 }}>Delete Account</h3>
                        </div>
                        <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(''); }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: '1px solid #FCA5A5',
                            background: '#fff',
                            color: '#DC2626',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#DC2626';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '#DC2626';
                            e.currentTarget.style.borderColor = '#FCA5A5';
                        }}
                    >
                        <i className="ri-delete-bin-6-line" /> Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 16,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)',
                            }}
                            onClick={() => !isDeleting && setShowDeleteModal(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal */}
                        <motion.div
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: 440,
                                background: '#fff',
                                borderRadius: 20,
                                boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                zIndex: 1,
                            }}
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 15 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 300, mass: 0.8 }}
                        >
                            {/* Red top bar */}
                            <div style={{ height: 5, background: 'linear-gradient(90deg, #EF4444, #DC2626, #B91C1C)' }} />

                            <div style={{ padding: '28px 28px 32px' }}>
                                {/* Close */}
                                {!isDeleting && (
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        style={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#9CA3AF',
                                            cursor: 'pointer',
                                            fontSize: 20,
                                        }}
                                    >
                                        <i className="ri-close-line" />
                                    </button>
                                )}

                                {/* Warning icon */}
                                <motion.div
                                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                                >
                                    <div style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <i className="ri-alarm-warning-line" style={{ fontSize: 36, color: '#DC2626' }} />
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', color: '#111827', margin: '0 0 8px' }}>
                                    Delete Your Account?
                                </h2>
                                <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
                                    This will permanently delete your profile, wishlist, cart, and all personal data. Your order history will be anonymised for records.
                                </p>

                                {/* What gets deleted */}
                                <div style={{
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    borderRadius: 12,
                                    padding: '14px 18px',
                                    marginBottom: 20,
                                }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#991B1B', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        This will delete:
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                                        {['Profile & personal info', 'Wishlist & saved items', 'Cart items', 'Push notifications'].map((item) => (
                                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#7F1D1D' }}>
                                                <i className="ri-close-circle-fill" style={{ fontSize: 14, color: '#EF4444', flexShrink: 0 }} />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Confirmation input */}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                                        Type <span style={{ fontFamily: 'monospace', background: '#F3F4F6', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: '#DC2626' }}>DELETE</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Type DELETE here"
                                        disabled={isDeleting}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: 10,
                                            border: deleteConfirmText === 'DELETE' ? '2px solid #DC2626' : '2px solid #E5E7EB',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            letterSpacing: 2,
                                            textAlign: 'center',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxSizing: 'border-box',
                                            fontFamily: 'monospace',
                                        }}
                                        autoComplete="off"
                                    />
                                </div>

                                {/* Error message */}
                                {deleteError && (
                                    <div style={{
                                        background: '#FEF2F2',
                                        border: '1px solid #FECACA',
                                        borderRadius: 8,
                                        padding: '10px 14px',
                                        marginBottom: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        color: '#DC2626',
                                    }}>
                                        <i className="ri-error-warning-fill" style={{ fontSize: 16 }} />
                                        {deleteError}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        style={{
                                            flex: 1,
                                            padding: '12px 0',
                                            borderRadius: 10,
                                            border: '1px solid #E5E7EB',
                                            background: '#fff',
                                            color: '#374151',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                                            opacity: isDeleting ? 0.5 : 1,
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                        style={{
                                            flex: 1,
                                            padding: '12px 0',
                                            borderRadius: 10,
                                            border: 'none',
                                            background: deleteConfirmText === 'DELETE' && !isDeleting
                                                ? 'linear-gradient(90deg, #DC2626, #B91C1C)'
                                                : '#E5E7EB',
                                            color: deleteConfirmText === 'DELETE' && !isDeleting ? '#fff' : '#9CA3AF',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: deleteConfirmText === 'DELETE' && !isDeleting ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-delete-bin-6-line" />
                                                Delete Forever
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
