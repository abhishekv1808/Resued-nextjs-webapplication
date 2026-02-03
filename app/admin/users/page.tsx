export default function AdminUsers() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
                    <i className="ri-download-line"></i> Export
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-user-line text-3xl text-orange-300"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Database</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Manage registered users, view profiles, and handle permissions.
                </p>
                <div className="animate-pulse bg-gray-100 h-8 w-64 rounded-full"></div>
            </div>
        </div>
    );
}
