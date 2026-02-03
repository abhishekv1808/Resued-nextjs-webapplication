"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'featured';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value === 'featured') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#a51c30] bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                aria-label="Sort products"
            >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
            </select>
        </div>
    );
}
