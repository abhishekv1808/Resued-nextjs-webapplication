'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [specifications, setSpecifications] = useState<any>({});
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/admin/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data.product);
                setSpecifications(data.product.specifications || {});
            } else {
                setToast({ message: 'Failed to load product', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSpecifications((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            // Generate previews
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setPreviews(prev => [...prev, ev.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewFile = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingImage = async (imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch('/api/admin/delete-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id, imageUrl })
            });

            if (response.ok) {
                // Refresh product to reflect changes
                fetchProduct();
                setToast({ message: 'Image deleted successfully', type: 'success' });
            } else {
                setToast({ message: 'Failed to delete image', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('brand', product.brand);
        formData.append('category', product.category);
        formData.append('price', product.price);
        formData.append('mrp', product.mrp);
        formData.append('quantity', product.quantity);
        formData.append('description', product.description || '');

        // Append Specifications based on category
        Object.entries(specifications).forEach(([key, value]) => {
            if (value) formData.append(key, value as string);
        });

        // Append New Images
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                setToast({ message: 'Product updated successfully!', type: 'success' });
                setTimeout(() => router.push('/admin/products'), 1500);
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to update product', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setToast({ message: 'An error occurred while updating the product', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a2e5e]"></div></div>;
    if (!product) return <div className="p-8 text-center text-red-500 font-bold">Product not found</div>;

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            <header className="flex items-center justify-between py-6">
                <h2 className="text-xl md:text-3xl font-bold text-[var(--admin-text-main)] font-heading">Edit Product</h2>
                <Link href="/admin/products" className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] text-sm font-medium transition-colors">
                    Back to Inventory
                </Link>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                        <i className="ri-article-line text-[#0a2e5e]"></i> Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Category</label>
                            <input type="text" value={product.category} disabled className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] rounded-lg px-3 py-2.5 text-sm capitalize cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Brand</label>
                            <select name="brand" value={product.brand} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" required>
                                <option value="Apple">Apple</option>
                                <option value="Dell">Dell</option>
                                <option value="HP">HP</option>
                                <option value="Lenovo">Lenovo</option>
                                <option value="Samsung">Samsung</option>
                                <option value="Acer">Acer</option>
                                <option value="Asus">Asus</option>
                                <option value="MSI">MSI</option>
                                <option value="LG">LG</option>
                                <option value="BenQ">BenQ</option>
                                <option value="ASUS">ASUS</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Product Name</label>
                            <input type="text" name="name" value={product.name} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Description</label>
                            <textarea name="description" rows={4} value={product.description || ''} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors resize-none"></textarea>
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                        <i className="ri-price-tag-3-line text-green-500"></i> Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">MRP (₹)</label>
                            <input type="number" name="mrp" value={product.mrp} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Selling Price (₹)</label>
                            <input type="number" name="price" value={product.price} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Stock Quantity</label>
                            <input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" required />
                        </div>
                    </div>
                </div>

                {/* Specifications (Conditional) */}
                {product.category !== 'accessory' && (
                    <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                            <i className="ri-cpu-line text-blue-500"></i> Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {(product.category === 'laptop' || product.category === 'desktop') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Processor</label>
                                        <input type="text" name="processor" value={specifications.processor || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">RAM</label>
                                        <select name="ram" value={specifications.ram || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select RAM</option>
                                            <option value="4GB">4GB</option>
                                            <option value="8GB">8GB</option>
                                            <option value="16GB">16GB</option>
                                            <option value="32GB">32GB</option>
                                            <option value="64GB">64GB</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Storage</label>
                                        <select name="storage" value={specifications.storage || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select Storage</option>
                                            <option value="128GB SSD">128GB SSD</option>
                                            <option value="256GB SSD">256GB SSD</option>
                                            <option value="512GB SSD">512GB SSD</option>
                                            <option value="1TB SSD">1TB SSD</option>
                                            <option value="2TB SSD">2TB SSD</option>
                                            <option value="500GB HDD">500GB HDD</option>
                                            <option value="1TB HDD">1TB HDD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Graphics</label>
                                        <input type="text" name="graphics" value={specifications.graphics || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">OS</label>
                                        <select name="os" value={specifications.os || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select OS</option>
                                            <option value="Windows 10">Windows 10</option>
                                            <option value="Windows 11">Windows 11</option>
                                            <option value="macOS">macOS</option>
                                            <option value="Linux">Linux</option>
                                            <option value="DOS">DOS</option>
                                        </select>
                                    </div>
                                    {product.category === 'desktop' && (
                                        <div>
                                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Form Factor</label>
                                            <select name="formFactor" value={specifications.formFactor || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                                <option value="">Select Form Factor</option>
                                                <option value="All-in-One (AIO)">All-in-One (AIO)</option>
                                                <option value="Tower Desktop">Tower Desktop</option>
                                                <option value="Mini PC">Mini PC</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {product.category === 'laptop' && (
                                <div>
                                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Display Size</label>
                                    <input type="text" name="display" value={specifications.display || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors" />
                                </div>
                            )}

                            {product.category === 'monitor' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Screen Size</label>
                                        <select name="screenSize" value={specifications.screenSize || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select Size</option>
                                            <option value="21.5 inch">21.5 inch</option>
                                            <option value="22 inch">22 inch</option>
                                            <option value="24 inch">24 inch</option>
                                            <option value="27 inch">27 inch</option>
                                            <option value="32 inch">32 inch</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Panel Type</label>
                                        <select name="panelType" value={specifications.panelType || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select Panel</option>
                                            <option value="IPS">IPS</option>
                                            <option value="VA">VA</option>
                                            <option value="TN">TN</option>
                                            <option value="OLED">OLED</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Refresh Rate</label>
                                        <select name="refreshRate" value={specifications.refreshRate || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select Refresh Rate</option>
                                            <option value="60Hz">60Hz</option>
                                            <option value="75Hz">75Hz</option>
                                            <option value="120Hz">120Hz</option>
                                            <option value="144Hz">144Hz</option>
                                            <option value="165Hz">165Hz</option>
                                            <option value="240Hz">240Hz</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Resolution</label>
                                        <select name="resolution" value={specifications.resolution || ''} onChange={handleSpecChange} className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] transition-colors">
                                            <option value="">Select Resolution</option>
                                            <option value="HD (1366x768)">HD (1366x768)</option>
                                            <option value="Full HD (1920x1080)">Full HD (1920x1080)</option>
                                            <option value="2K QHD (2560x1440)">2K QHD (2560x1440)</option>
                                            <option value="4K UHD (3840x2160)">4K UHD (3840x2160)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Images */}
                <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                        <i className="ri-image-line text-purple-500"></i> Product Images
                    </h3>

                    {/* Existing Images */}
                    {product.images && product.images.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Current Images</label>
                            <div className="flex flex-wrap gap-4">
                                {product.images.map((img: string, idx: number) => (
                                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--admin-border)] w-24 h-24">
                                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(img)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Delete Image"
                                        >
                                            <i className="ri-close-line text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Uploads */}
                    <div className="w-full h-[150px] border-2 border-dashed border-[var(--admin-border)] hover:border-[#29abe2] rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <div className="text-center pointer-events-none">
                            <i className="ri-upload-cloud-2-line text-3xl text-[#0a2e5e] mb-2 block"></i>
                            <p className="text-[var(--admin-text-main)] font-medium text-sm">Upload New Images</p>
                        </div>
                    </div>

                    {/* New Images Preview */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--admin-border)] aspect-square">
                                    <img src={src} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        onClick={() => removeNewFile(index)}
                                    >
                                        <i className="ri-close-line text-xs"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--admin-border)]">
                    <Link href="/admin/products" className="px-5 py-2.5 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] hover:bg-[var(--admin-hover)] text-sm font-bold transition-all">Cancel</Link>
                    <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg bg-[#0a2e5e] hover:bg-[#29abe2] text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {submitting ? <><i className="ri-loader-4-line animate-spin"></i> Updating...</> : 'Update Product'}
                    </button>
                </div>

            </form>

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
