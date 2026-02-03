export default function AdminOrders() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
                    <i className="ri-filter-3-line"></i> Filter
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-shopping-bag-3-line text-3xl text-blue-300"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Management</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    View and manage customer orders, track shipments, and handle returns.
                </p>
                <div className="animate-pulse bg-gray-100 h-8 w-64 rounded-full"></div>
            </div>
        </div>
    );
}
