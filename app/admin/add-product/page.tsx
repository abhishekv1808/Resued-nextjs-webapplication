'use client';

import Link from 'next/link';

const categories = [
    {
        name: 'Laptop',
        description: 'Add a new laptop to the inventory with specs like processor, RAM, etc.',
        icon: 'ri-macbook-line',
        href: '/admin/add-laptop',
        color: 'bg-blue-500'
    },
    {
        name: 'Monitor',
        description: 'Add a new display monitor with screen size, refresh rate, and panel details.',
        icon: 'ri-tv-line',
        href: '/admin/add-monitor',
        color: 'bg-purple-500'
    },
    {
        name: 'Desktop',
        description: 'Add a new desktop PC or workstation with custom hardware specifications.',
        icon: 'ri-computer-line',
        href: '/admin/add-desktop',
        color: 'bg-green-500'
    },
    {
        name: 'Accessories',
        description: 'Add mice, keyboards, headphones, and other computer peripherals.',
        icon: 'ri-mouse-line',
        href: '/admin/add-accessories',
        color: 'bg-orange-500'
    }
];

export default function AddProductSelection() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <header className="mb-10 text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-[var(--admin-text-main)] mb-3 font-heading">
                    Add New Product
                </h1>
                <p className="text-[var(--admin-text-muted)]">
                    Select the category of the product you want to add to your inventory
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="group bg-[var(--admin-card)] rounded-2xl p-8 border border-[var(--admin-border)] hover:border-[#29abe2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                    >
                        <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/10`}>
                            <i className={category.icon}></i>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--admin-text-main)] mb-2">
                            {category.name}
                        </h3>
                        <p className="text-[var(--admin-text-muted)] text-sm mb-6 leading-relaxed">
                            {category.description}
                        </p>
                        <span className="mt-auto px-6 py-2 rounded-lg bg-[var(--admin-hover)] text-[var(--admin-text-main)] text-sm font-bold group-hover:bg-[#0a2e5e] group-hover:text-white transition-colors">
                            Select {category.name}
                        </span>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/admin/products"
                    className="text-[var(--admin-text-muted)] hover:text-[#0a2e5e] font-medium transition-colors inline-flex items-center gap-2"
                >
                    <i className="ri-arrow-left-line"></i> Back to Inventory
                </Link>
            </div>
        </div>
    );
}
