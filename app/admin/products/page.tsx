"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockInputs, setStockInputs] = useState<{ [key: string]: number }>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch Products on Load or when query changes
  useEffect(() => {
    fetchProducts();
  }, [query]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/api/admin/products?query=${encodeURIComponent(query)}`
        : "/api/admin/products";

      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
        // Initialize stock inputs
        const inputs: { [key: string]: number } = {};
        data.products.forEach((p: any) => {
          inputs[p._id] = p.quantity;
        });
        setStockInputs(inputs);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id: string, value: string) => {
    setStockInputs((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const updateStock = async (product: any) => {
    try {
      const newQuantity = stockInputs[product._id];
      const response = await fetch("/api/admin/products/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: newQuantity }),
      });

      if (response.ok) {
        setToast({ message: "Stock updated successfully", type: "success" });
        fetchProducts(); // Refresh data
      } else {
        setToast({ message: "Failed to update stock", type: "error" });
      }
    } catch (error) {
      console.error("Error updating stock", error);
      setToast({
        message: "An error occurred while updating stock",
        type: "error",
      });
    }
  };

  const toggleStatus = async (product: any) => {
    try {
      const response = await fetch("/api/admin/products/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          inStock: !product.inStock,
        }),
      });

      if (response.ok) {
        setToast({ message: "Status updated successfully", type: "success" });
        fetchProducts(); // Refresh data
      } else {
        setToast({ message: "Failed to toggle status", type: "error" });
      }
    } catch (error) {
      console.error("Error toggling status", error);
      setToast({
        message: "An error occurred while toggling status",
        type: "error",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToast({ message: "Product deleted successfully", type: "success" });
        fetchProducts();
      } else {
        const data = await response.json();
        setToast({
          message: data.error || "Failed to delete product",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast({
        message: "An error occurred while deleting the product",
        type: "error",
      });
    }
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a2e5e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between sticky top-0 z-10 bg-[var(--admin-bg)]/95 backdrop-blur-sm py-3 md:py-4 transition-colors duration-300">
        <h2 className="text-lg md:text-xl font-bold text-[var(--admin-text-main)]">
          Inventory Management
        </h2>
        <Link
          href="/admin/add-product"
          className="bg-[#0a2e5e] hover:bg-[#29abe2] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2 transition-colors"
        >
          <i className="ri-add-line"></i> Add Product
        </Link>
      </header>

      <div className="bg-[var(--admin-card)] rounded-xl md:rounded-2xl border border-[var(--admin-border)] overflow-hidden shadow-xl">
        {/* Mobile Card Layout */}
        <div className="lg:hidden divide-y divide-[var(--admin-border)]">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="p-3 md:p-4">
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center">
                    {product.images?.[0] || product.image ? (
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[var(--admin-text-muted)]">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <div
                      className="font-bold text-[var(--admin-text-main)] text-sm leading-tight line-clamp-2 mb-0.5"
                      title={product.name}
                    >
                      {product.name}
                    </div>
                    <div className="text-[var(--admin-text-muted)] text-[10px] uppercase tracking-wider font-semibold mb-1">
                      {product.brand}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm text-[var(--admin-text-main)]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[var(--admin-text-muted)] line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-[#0a2e5e] capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Stock */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={stockInputs[product._id] ?? product.quantity}
                          onChange={(e) =>
                            handleStockChange(product._id, e.target.value)
                          }
                          className="w-16 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#29abe2] text-center font-bold"
                        />
                        <button
                          onClick={() => updateStock(product)}
                          className="w-7 h-7 rounded-lg bg-[#0a2e5e] hover:bg-[#29abe2] text-white flex items-center justify-center transition-all"
                          title="Update Stock"
                        >
                          <i className="ri-refresh-line text-xs"></i>
                        </button>
                      </div>
                      {/* Status Toggle */}
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.inStock ? "bg-green-500" : "bg-gray-200"}`}
                      >
                        <span
                          className={`${product.inStock ? "translate-x-4" : "translate-x-0.5"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        ></span>
                      </button>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => openProductModal(product)}
                          className="w-7 h-7 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] flex items-center justify-center"
                          title="View"
                        >
                          <i className="ri-eye-line text-xs"></i>
                        </button>
                        <Link
                          href={`/admin/edit-product/${product._id}?edit=true`}
                          className="w-7 h-7 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] flex items-center justify-center"
                          title="Edit"
                        >
                          <i className="ri-pencil-line text-xs"></i>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="w-7 h-7 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] flex items-center justify-center"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <i className="ri-inbox-2-line text-3xl mb-2 text-[var(--admin-text-muted)] opacity-50"></i>
              <p className="text-sm font-medium text-[var(--admin-text-muted)]">
                No products found
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--admin-bg)]/50 text-[var(--admin-text-muted)] text-xs uppercase tracking-wider border-b border-[var(--admin-border)]">
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold">Stock Level</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)] text-sm">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-[var(--admin-hover)] transition-colors duration-200"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-8">
                        <div className="w-40 h-40 rounded-2xl bg-white border border-gray-200 p-2 flex-shrink-0 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                          {product.images?.[0] || product.image ? (
                            <img
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-[var(--admin-text-muted)]">
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="max-w-[350px]">
                          <div
                            className="font-bold text-[var(--admin-text-main)] group-hover:text-[#29abe2] transition-colors mb-1 line-clamp-2 leading-tight text-sm"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div className="text-[var(--admin-text-muted)] text-[10px] mb-2 uppercase tracking-wider font-semibold">
                            {product.brand}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.specifications &&
                              Object.values(product.specifications)
                                .slice(0, 3)
                                .map((spec: any, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 border border-gray-200 truncate max-w-[100px]"
                                  >
                                    {spec}
                                  </span>
                                ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0a2e5e] border border-blue-100 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-5 text-[var(--admin-text-main)]">
                      <div className="font-bold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-[var(--admin-text-muted)] line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="number"
                            value={stockInputs[product._id] ?? product.quantity}
                            onChange={(e) =>
                              handleStockChange(product._id, e.target.value)
                            }
                            className="w-20 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#29abe2] text-center font-bold"
                          />
                        </div>
                        <button
                          onClick={() => updateStock(product)}
                          className="w-8 h-8 rounded-lg bg-[#0a2e5e] hover:bg-[#29abe2] text-white flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
                          title="Update Stock"
                        >
                          <i className="ri-refresh-line"></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        {product.quantity > 0 ? (
                          <span className="text-xs text-[var(--admin-text-muted)]">
                            {product.quantity} units
                          </span>
                        ) : (
                          <span className="text-xs text-red-500 font-bold">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${product.inStock ? "bg-green-500" : "bg-gray-200"}`}
                        title="Toggle Status"
                      >
                        <span
                          className={`${product.inStock ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        ></span>
                      </button>
                      <div
                        className={`mt-1 text-[10px] font-bold ${product.inStock ? "text-green-500" : "text-[var(--admin-text-muted)]"}`}
                      >
                        {product.inStock ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openProductModal(product)}
                          className="w-9 h-9 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] hover:border-[#29abe2] hover:text-[#29abe2] text-[var(--admin-text-muted)] flex items-center justify-center transition-all"
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <Link
                          href={`/admin/edit-product/${product._id}?edit=true`}
                          className="w-9 h-9 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] hover:border-[#29abe2] hover:text-[#29abe2] text-[var(--admin-text-muted)] flex items-center justify-center transition-all"
                          title="Edit"
                        >
                          <i className="ri-pencil-line"></i>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="w-9 h-9 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] hover:border-[#29abe2] hover:text-[#29abe2] text-[var(--admin-text-muted)] flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[var(--admin-text-muted)]">
                      <i className="ri-inbox-2-line text-4xl mb-3 opacity-50"></i>
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">
                        Start by adding a new product to your inventory.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-2xl bg-[var(--admin-card)] text-left shadow-2xl transition-all w-full sm:my-8 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-[var(--admin-bg)]/50 px-4 md:px-6 py-3 md:py-4 border-b border-[var(--admin-border)] flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-lg font-bold text-[var(--admin-text-main)] flex items-center gap-2">
                  <i className="ri-macbook-line text-[#0a2e5e]"></i> Product
                  Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              {/* Content */}
              <div className="px-4 md:px-6 py-4 md:py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image Section */}
                  <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center aspect-square shadow-inner">
                      {selectedProduct.images?.[0] || selectedProduct.image ? (
                        <img
                          src={
                            selectedProduct.images?.[0] || selectedProduct.image
                          }
                          alt={selectedProduct.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-4xl text-gray-300 font-bold">
                          {selectedProduct.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center bg-[var(--admin-bg)] p-3 rounded-lg border border-[var(--admin-border)]">
                      <span className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                        Stock Status
                      </span>
                      {selectedProduct.inStock ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          In Stock ({selectedProduct.quantity} units)
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="lg:w-2/3 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--admin-text-main)] leading-tight mb-1">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--admin-text-muted)] font-medium">
                          {selectedProduct.brand}
                        </span>
                        <span className="text-[var(--admin-border)]">•</span>
                        <span className="text-[#0a2e5e] font-bold capitalize">
                          {selectedProduct.category}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--admin-bg)] p-4 rounded-xl border border-[var(--admin-border)]">
                        <span className="text-xs text-[var(--admin-text-muted)] uppercase tracking-wider block mb-1">
                          Price
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[var(--admin-text-main)]">
                            ₹{selectedProduct.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-sm text-[var(--admin-text-muted)] line-through">
                            ₹{selectedProduct.mrp.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="bg-[var(--admin-bg)] p-4 rounded-xl border border-[var(--admin-border)]">
                        <span className="text-xs text-[var(--admin-text-muted)] uppercase tracking-wider block mb-1">
                          Discount
                        </span>
                        <span className="text-xl font-bold text-green-500">
                          {selectedProduct.discount}% OFF
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-2 uppercase tracking-wider">
                        Description
                      </h4>
                      <p className="text-sm text-[var(--admin-text-muted)] leading-relaxed bg-[var(--admin-bg)] p-4 rounded-xl border border-[var(--admin-border)]">
                        {selectedProduct.description ||
                          "No description available."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-2 uppercase tracking-wider">
                        Specifications
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedProduct.specifications &&
                          Object.entries(selectedProduct.specifications).map(
                            ([key, value]: [string, any]) => (
                              <div
                                key={key}
                                className="bg-[var(--admin-bg)] p-3 rounded-lg border border-[var(--admin-border)]"
                              >
                                <span className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wide block mb-0.5">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span
                                  className="font-bold text-[var(--admin-text-main)] text-xs truncate block"
                                  title={value}
                                >
                                  {value}
                                </span>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[var(--admin-bg)]/50 px-4 md:px-6 py-3 md:py-4 border-t border-[var(--admin-border)] flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/admin/edit-product/${selectedProduct._id}?edit=true`}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[#0a2e5e] hover:bg-[#29abe2] text-white transition-colors shadow-lg shadow-blue-900/20"
                >
                  Edit Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
