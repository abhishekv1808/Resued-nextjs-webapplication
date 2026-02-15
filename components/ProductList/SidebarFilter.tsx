"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface FilterOption {
    id: string;
    label: string;
    options: string[];
}

interface SidebarFilterProps {
    filters: FilterOption[];
}

export default function SidebarFilter({ filters }: SidebarFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        // Initialize filters from URL params
        const newFilters: Record<string, string[]> = {};
        filters.forEach(filter => {
            const values = searchParams.getAll(filter.id);
            if (values.length > 0) {
                newFilters[filter.id] = values;
            }
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedFilters(newFilters);
    }, [searchParams, filters]);

    const handleFilterChange = (filterId: string, value: string) => {
        const currentValues = selectedFilters[filterId] || [];
        const isSelected = currentValues.includes(value);

        let newValues: string[];
        if (isSelected) {
            newValues = currentValues.filter(v => v !== value);
        } else {
            newValues = [...currentValues, value];
        }

        const newFilters = { ...selectedFilters, [filterId]: newValues };
        if (newValues.length === 0) {
            delete newFilters[filterId];
        }

        applyFilters(newFilters);
    };

    const applyFilters = (newFilters: Record<string, string[]>) => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, values]) => {
            values.forEach(value => params.append(key, value));
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <aside className="lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6 sticky top-24">
                <div className="flex justify-between items-center mb-3 md:mb-6">
                    <h2 className="text-sm md:text-lg font-bold text-gray-900">Filters</h2>
                    <button
                        onClick={() => router.push(pathname)}
                        className="text-xs md:text-sm text-[#0a2e5e] hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                {filters.map((filter) => (
                    <div key={filter.id} className="mb-4 md:mb-6 border-b border-gray-100 pb-4 md:pb-6 last:mb-0 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-xs md:text-sm">{filter.label}</h3>
                        <div className="space-y-1.5 md:space-y-2">
                            {filter.options.map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={filter.id}
                                        value={option}
                                        checked={selectedFilters[filter.id]?.includes(option) || false}
                                        onChange={() => handleFilterChange(filter.id, option)}
                                        className="rounded border-gray-300 text-[#0a2e5e] focus:ring-blue-100"
                                    />
                                    <span className="text-xs md:text-sm text-gray-600">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
