'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

export default function AddMonitor() {
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (images.length + validFiles.length > 10) {
            setToast({ message: 'You can only upload a maximum of 10 images.', type: 'error' });
            return;
        }

        setImages(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setPreviews(prev => [...prev, e.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData();

            formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('brand', (form.elements.namedItem('brand') as HTMLSelectElement).value);
            formData.append('description', (form.elements.namedItem('description') as HTMLTextAreaElement).value);
            formData.append('category', 'monitor');

            formData.append('price', (form.elements.namedItem('price') as HTMLInputElement).value);
            formData.append('mrp', (form.elements.namedItem('mrp') as HTMLInputElement).value);
            formData.append('quantity', (form.elements.namedItem('quantity') as HTMLInputElement).value);

            formData.append('screenSize', (form.elements.namedItem('screenSize') as HTMLSelectElement).value);
            formData.append('panelType', (form.elements.namedItem('panelType') as HTMLSelectElement).value);
            formData.append('refreshRate', (form.elements.namedItem('refreshRate') as HTMLSelectElement).value);
            formData.append('display', (form.elements.namedItem('display') as HTMLSelectElement).value);

            images.forEach(image => {
                formData.append('images', image);
            });

            const response = await fetch('/api/admin/products', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setToast({ message: 'Monitor added successfully!', type: 'success' });
                setTimeout(() => router.push('/admin/products'), 1500);
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to save monitor', type: 'error' });
            }
        } catch (error) {
            console.error('Error saving monitor:', error);
            setToast({ message: 'An error occurred while saving the monitor', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-[var(--admin-text-main)] font-heading">Add New Monitor</h2>
                    <Link href="/admin/products" className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] text-sm font-medium transition-colors">
                        <i className="ri-close-line text-xl"></i>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-8">
                        {/* Section 1: Basic Details */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-article-line text-red-500"></i> Basic Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Brand</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-store-2-line text-gray-400"></i>
                                        </div>
                                        <select name="brand" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none" required>
                                            <option value="" disabled>Select Brand</option>
                                            <option value="Dell">Dell</option>
                                            <option value="LG">LG</option>
                                            <option value="Samsung">Samsung</option>
                                            <option value="BenQ">BenQ</option>
                                            <option value="Acer">Acer</option>
                                            <option value="HP">HP</option>
                                            <option value="ASUS">ASUS</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Monitor Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-tv-line text-gray-400"></i>
                                        </div>
                                        <input type="text" name="name" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="e.g. Dell UltraSharp 24 inch" required />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Description</label>
                                    <div className="relative">
                                        <textarea name="description" rows={4} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none" placeholder="Enter detailed product description..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Pricing & Inventory */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-price-tag-3-line text-green-500"></i> Pricing & Inventory
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">MRP (₹)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold">₹</span>
                                        </div>
                                        <input type="number" name="mrp" className="w-full pl-8 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="0.00" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Selling Price (₹)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold">₹</span>
                                        </div>
                                        <input type="number" name="price" className="w-full pl-8 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="0.00" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Stock Quantity</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-stack-line text-gray-400"></i>
                                        </div>
                                        <input type="number" name="quantity" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="0" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Display Specifications */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-tv-2-line text-purple-500"></i> Display Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Screen Size</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-aspect-ratio-line text-gray-400"></i>
                                        </div>
                                        <select name="screenSize" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none">
                                            <option value="21.5 inch">21.5 inch</option>
                                            <option value="24 inch">24 inch</option>
                                            <option value="27 inch">27 inch</option>
                                            <option value="32 inch">32 inch</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Panel Type</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-layout-line text-gray-400"></i>
                                        </div>
                                        <select name="panelType" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none">
                                            <option value="IPS">IPS</option>
                                            <option value="TN">TN</option>
                                            <option value="VA">VA</option>
                                            <option value="OLED">OLED</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Refresh Rate</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-speed-line text-gray-400"></i>
                                        </div>
                                        <select name="refreshRate" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none">
                                            <option value="60Hz">60Hz</option>
                                            <option value="75Hz">75Hz</option>
                                            <option value="144Hz">144Hz</option>
                                            <option value="165Hz">165Hz</option>
                                            <option value="240Hz">240Hz</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Resolution</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-hd-line text-gray-400"></i>
                                        </div>
                                        <select name="display" className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none">
                                            <option value="Full HD (1920x1080)">Full HD (1920x1080)</option>
                                            <option value="2K QHD (2560x1440)">2K QHD (2560x1440)</option>
                                            <option value="4K UHD (3840x2160)">4K UHD (3840x2160)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Media */}
                        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                                <i className="ri-image-line text-orange-500"></i> Product Images
                            </h3>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="w-full h-[200px] border-2 border-dashed border-[var(--admin-border)] hover:border-red-500 rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <div className="text-center pointer-events-none">
                                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <i className="ri-upload-cloud-2-line text-3xl text-red-500"></i>
                                    </div>
                                    <p className="text-[var(--admin-text-main)] font-medium">Click to upload or drag and drop</p>
                                    <p className="text-[var(--admin-text-muted)] text-xs mt-1">SVG, PNG, JPG or GIF (max. 10 images)</p>
                                </div>
                            </div>
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--admin-border)] aspect-square">
                                            <img src={src} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                <span className="text-xs font-medium">{(images[index].size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                            >
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[var(--admin-border)] flex justify-end gap-3">
                        <Link href="/admin/products" className="px-5 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] hover:bg-[var(--admin-hover)] text-sm font-bold transition-all">Cancel</Link>
                        <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? 'Saving...' : 'Save Monitor'}
                        </button>
                    </div>
                </form>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={!!toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
