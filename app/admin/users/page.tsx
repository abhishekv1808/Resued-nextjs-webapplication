export default function AdminUsers() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--admin-text-main)] font-heading">User Management</h2>
                <button className="bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] px-4 py-2 rounded-lg hover:border-[#29abe2] hover:text-[#29abe2] transition-all flex items-center gap-2 font-bold text-sm">
                    <i className="ri-download-line"></i> Export
                </button>
            </div>

            <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-user-line text-4xl text-[#29abe2]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[var(--admin-text-main)] mb-2">Customer Database</h3>
                <p className="text-[var(--admin-text-muted)] max-w-md mx-auto mb-8">
                    Manage registered users, view profiles, and handle permissions.
                </p>
                <div className="animate-pulse bg-gray-100 h-8 w-64 rounded-full"></div>
            </div>
        </div>
    );
}
