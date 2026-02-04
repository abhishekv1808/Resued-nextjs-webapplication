'use client';

import { useState, useRef } from 'react';

export default function SendNotificationPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Previews
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    // Refs for file inputs and form
    const formRef = useRef<HTMLFormElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, inputRef: React.RefObject<HTMLInputElement | null>, setPreview: (url: string | null) => void) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (inputRef.current) {
                // Set the file to the input
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputRef.current.files = dataTransfer.files;
            }
            // Update preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeFile = (inputRef: React.RefObject<HTMLInputElement | null>, setPreview: (url: string | null) => void, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering click on parent
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/admin/send-notification', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Notification sent successfully!');
                // Reset form using formRef
                if (formRef.current) {
                    formRef.current.reset();
                }
                setBannerPreview(null);
                setIconPreview(null);

                // Show success message for 3 seconds then clear
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.error || 'Failed to send notification');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto space-y-6">

            {/* Success Modal / Toast */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 animate-scale-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-3xl shadow-sm">
                            <i className="ri-checkbox-circle-fill"></i>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--admin-text-main)] mb-2">Success!</h3>
                        <p className="text-[var(--admin-text-muted)] text-center">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-[var(--admin-text-main)] font-heading">Send Push Notification</h2>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="p-6">

                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2" role="alert">
                            <i className="ri-error-warning-fill"></i>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="space-y-8">

                        {/* Section 1: Notification Details */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-notification-3-line text-red-500"></i> Notification Details
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Target Audience</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-group-line text-gray-400"></i>
                                        </div>
                                        <select name="audience" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none" defaultValue="all">
                                            <option value="all">All Subscribers</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Notification Title</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-notification-badge-line text-gray-400"></i>
                                        </div>
                                        <input type="text" name="title" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="e.g. Big Sale Starting Now!" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Message Body</label>
                                    <div className="relative">
                                        <textarea name="body" rows={4} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none" placeholder="e.g. Get 50% off on all Laptops. Limited time offer." required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Media */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-image-line text-orange-500"></i> Media
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Large Image (Banner) */}
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Large Image (Banner)</label>
                                    <div
                                        className="w-full h-[200px] border-2 border-dashed border-[var(--admin-border)] hover:border-red-500 rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group"
                                        onClick={() => bannerInputRef.current?.click()}
                                        onDrop={(e) => handleDrop(e, bannerInputRef, setBannerPreview)}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            name="image"
                                            ref={bannerInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setBannerPreview)}
                                        />

                                        {bannerPreview ? (
                                            <div className="w-full h-full relative group">
                                                <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    onClick={(e) => removeFile(bannerInputRef, setBannerPreview, e)}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center pointer-events-none">
                                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                    <i className="ri-image-line text-2xl text-red-500"></i>
                                                </div>
                                                <p className="text-[var(--admin-text-main)] font-medium text-sm">Banner Image</p>
                                                <p className="text-[var(--admin-text-muted)] text-xs mt-1">Click to upload or drag and drop</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notification Icon */}
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Notification Icon (Optional)</label>
                                    <div
                                        className="w-full h-[200px] border-2 border-dashed border-[var(--admin-border)] hover:border-red-500 rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group"
                                        onClick={() => iconInputRef.current?.click()}
                                        onDrop={(e) => handleDrop(e, iconInputRef, setIconPreview)}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            name="icon"
                                            ref={iconInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setIconPreview)}
                                        />

                                        {iconPreview ? (
                                            <div className="w-full h-full relative group">
                                                <img src={iconPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    onClick={(e) => removeFile(iconInputRef, setIconPreview, e)}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center pointer-events-none">
                                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                    <i className="ri-notification-badge-line text-2xl text-purple-500"></i>
                                                </div>
                                                <p className="text-[var(--admin-text-main)] font-medium text-sm">Small Icon</p>
                                                <p className="text-[var(--admin-text-muted)] text-xs mt-1">Click to upload or drag and drop</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Actions & Links */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-links-line text-green-500"></i> Actions & Links
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Target URL (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-link text-gray-400"></i>
                                        </div>
                                        <input type="text" name="url" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="e.g. /laptops or https://simtech.com/offers" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Action 1 */}
                                    <div className="p-4 bg-[var(--admin-hover)]/30 rounded-xl border border-[var(--admin-border)]">
                                        <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">1</span>
                                            Action Button 1
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs text-[var(--admin-text-muted)] mb-1">Button Title</label>
                                                <input type="text" name="action1_title" className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="e.g. View Offer" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[var(--admin-text-muted)] mb-1">Action URL</label>
                                                <input type="text" name="action1_url" className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="e.g. /offers" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action 2 */}
                                    <div className="p-4 bg-[var(--admin-hover)]/30 rounded-xl border border-[var(--admin-border)]">
                                        <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">2</span>
                                            Action Button 2
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs text-[var(--admin-text-muted)] mb-1">Button Title</label>
                                                <input type="text" name="action2_title" className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="e.g. Call Now" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[var(--admin-text-muted)] mb-1">Action URL</label>
                                                <input type="text" name="action2_url" className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="e.g. tel:+1234567890" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-6 mt-6 border-t border-[var(--admin-border)] flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-900/20 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="ri-send-plane-fill"></i> Send Notification
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
