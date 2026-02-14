"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "./ProductCard";

interface ProductRowProps {
    title: string;
    description?: string;
    brand?: string;
    logo?: string; // URL for brand logo
    iconClass?: string; // Remix icon class if no logo
    viewAllLink: string;
    products: any[];
    bgColor?: string;
}

export default function ProductRow({
    title,
    description,
    brand,
    logo,
    iconClass,
    viewAllLink,
    products,
    bgColor = "white"
}: ProductRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className={`py-12 border-b border-gray-100 ${bgColor === 'gray-50' ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <div className="h-8 md:h-12 w-auto flex items-center justify-center">
                                <Image
                                    src={logo}
                                    alt={brand || title}
                                    width={64}
                                    height={40}
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        ) : iconClass ? (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <i className={`${iconClass} text-2xl text-gray-700`}></i>
                            </div>
                        ) : null}

                        <div>
                            <h2 className="md:text-2xl text-lg font-bold text-gray-900">{title}</h2>
                            {description && (
                                <p className="text-gray-500 text-sm hidden md:block max-w-2xl">{description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Scroll Buttons */}
                        <div className="flex gap-2 hidden md:flex">
                            <button
                                onClick={() => scroll('left')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                                aria-label="Scroll left"
                            >
                                <i className="ri-arrow-left-s-line"></i>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                                aria-label="Scroll right"
                            >
                                <i className="ri-arrow-right-s-line"></i>
                            </button>
                        </div>

                        <Link href={viewAllLink} className="text-[#0a2e5e] font-semibold hover:underline text-sm whitespace-nowrap">
                            View All
                        </Link>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x scroll-smooth"
                >
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="w-full text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300 col-span-full">
                            <p>No products available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
