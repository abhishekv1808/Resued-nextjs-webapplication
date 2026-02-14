'use client';

import { useState, useEffect, useCallback } from 'react';
import Toast from '@/components/Toast';

interface UserTag {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    location?: string;
    tags: string[];
    lastLogin?: string;
    createdAt: string;
}

interface TagStat {
    tag: string;
    count: number;
}

export default function UserTagsPage() {
    const [users, setUsers] = useState<UserTag[]>([]);
    const [allTags, setAllTags] = useState<TagStat[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/user-tags?search=${encodeURIComponent(search)}&page=${page}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.pages);
                setAllTags(data.allTags);
            }
        } catch {
            setToast({ message: 'Failed to load users', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u._id));
        }
    };

    const applyTags = async (action: 'add' | 'remove', tags: string[]) => {
        if (selectedUsers.length === 0) {
            setToast({ message: 'Select at least one user', type: 'error' });
            return;
        }
        if (tags.length === 0) {
            setToast({ message: 'Enter at least one tag', type: 'error' });
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/user-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, userIds: selectedUsers, tags }),
            });
            const data = await res.json();
            if (res.ok) {
                setToast({ message: data.message, type: 'success' });
                setNewTag('');
                setSelectedUsers([]);
                fetchUsers(); // Refresh
            } else {
                setToast({ message: data.error || 'Failed', type: 'error' });
            }
        } catch {
            setToast({ message: 'Something went wrong', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const removeTagFromUser = async (userId: string, tag: string) => {
        try {
            const res = await fetch('/api/admin/user-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove', userIds: [userId], tags: [tag] }),
            });
            if (res.ok) {
                setToast({ message: `Tag "${tag}" removed`, type: 'success' });
                fetchUsers();
            }
        } catch {
            setToast({ message: 'Failed to remove tag', type: 'error' });
        }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--admin-text-main)] font-heading">User Tags &amp; Segments</h2>
                        <p className="text-sm text-[var(--admin-text-muted)] mt-1">Manage user tags for targeted push notifications</p>
                    </div>
                </div>

                {/* Tag Stats Overview */}
                {allTags.length > 0 && (
                    <div className="px-6 py-4 border-b border-[var(--admin-border)] bg-[var(--admin-hover)]/50">
                        <p className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-3">Active Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(t => (
                                <span key={t.tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--admin-border)] rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                    <i className="ri-price-tag-3-line text-blue-500"></i>
                                    {t.tag}
                                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{t.count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Bulk Actions */}
                <div className="px-6 py-4 border-b border-[var(--admin-border)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="ri-search-line text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Search users..."
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-[#0a2e5e] text-white rounded-lg text-sm font-bold hover:bg-[#29abe2] transition-colors">
                            Search
                        </button>
                    </form>

                    {/* Bulk Tag Actions */}
                    {selectedUsers.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{selectedUsers.length} selected</span>
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-40"
                                placeholder="Tag name..."
                            />
                            <button
                                onClick={() => applyTags('add', newTag.split(',').map(t => t.trim()).filter(Boolean))}
                                disabled={actionLoading || !newTag.trim()}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                <i className="ri-add-line"></i> Add Tag
                            </button>
                            <button
                                onClick={() => applyTags('remove', newTag.split(',').map(t => t.trim()).filter(Boolean))}
                                disabled={actionLoading || !newTag.trim()}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                <i className="ri-delete-bin-line"></i> Remove Tag
                            </button>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 text-[var(--admin-text-muted)]">
                            <i className="ri-user-search-line text-4xl mb-3 block opacity-40"></i>
                            <p className="font-medium">No users found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--admin-hover)]/50 border-b border-[var(--admin-border)]">
                                    <th className="text-left px-6 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === users.length && users.length > 0}
                                            onChange={selectAll}
                                            className="w-4 h-4 rounded accent-blue-600"
                                        />
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">User</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">Location</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">Tags</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className={`border-b border-[var(--admin-border)] hover:bg-[var(--admin-hover)]/50 transition-colors ${selectedUsers.includes(user._id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => toggleUserSelection(user._id)}
                                                className="w-4 h-4 rounded accent-blue-600"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[var(--admin-text-main)]">{user.name}</p>
                                                    <p className="text-xs text-[var(--admin-text-muted)]">{user.phone || user.email || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[var(--admin-text-muted)]">
                                            {user.location || '—'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.tags && user.tags.length > 0 ? user.tags.map(tag => (
                                                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-medium text-blue-700 group">
                                                        {tag}
                                                        <button
                                                            onClick={() => removeTagFromUser(user._id, tag)}
                                                            className="text-blue-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title={`Remove "${tag}"`}
                                                        >
                                                            <i className="ri-close-line text-xs"></i>
                                                        </button>
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-gray-400 italic">No tags</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-[var(--admin-text-muted)]">
                                            {formatDate(user.lastLogin)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-[var(--admin-border)] flex items-center justify-between">
                        <p className="text-xs text-[var(--admin-text-muted)]">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 border border-[var(--admin-border)] rounded-lg text-sm font-medium hover:bg-[var(--admin-hover)] disabled:opacity-40 transition-colors"
                            >
                                <i className="ri-arrow-left-s-line"></i> Prev
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 border border-[var(--admin-border)] rounded-lg text-sm font-medium hover:bg-[var(--admin-hover)] disabled:opacity-40 transition-colors"
                            >
                                Next <i className="ri-arrow-right-s-line"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
