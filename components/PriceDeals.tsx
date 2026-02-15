"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const dealCards = [
    {
        title: "Budget-Friendly Laptops",
        price: "15,000",
        imageUrl: "/images/lenovo-hero-image.png",
        bgColor: "bg-[#fff1f1]",
        textColor: "text-[#d14d4d]",
        btnColor: "bg-[#ff6b6b]",
        filter: "Above 15000",
        delay: 0.1
    },
    {
        title: "Performance Laptops",
        price: "20,000",
        imageUrl: "/images/hero-laptops.png",
        bgColor: "bg-[#effcf6]",
        textColor: "text-[#2d8a63]",
        btnColor: "bg-[#4ecb71]",
        filter: "Above 20000",
        delay: 0.2
    },
    {
        title: "Workstation Laptops",
        price: "25,000",
        imageUrl: "/images/hero-section-image.png",
        bgColor: "bg-[#f3f1ff]",
        textColor: "text-[#5c54a4]",
        btnColor: "bg-[#845ef7]",
        filter: "Above 25000",
        delay: 0.3
    },
    {
        title: "Premium Flagships",
        price: "30,000",
        imageUrl: "/images/hero-section-image.png",
        bgColor: "bg-[#fff9db]",
        textColor: "text-[#9e7a2a]",
        btnColor: "bg-[#fcc419]",
        filter: "Above 30000",
        delay: 0.4
    }
];

export default function PriceDeals() {
    return (
        <section className="py-6 md:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-4 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Hot Deals</h2>
                    <p className="text-gray-500 text-xs md:text-sm">Exciting offers for more value</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {dealCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: card.delay }}
                        >
                            <Link
                                href={`/laptops?price=${card.filter}`}
                                className={`group relative block h-[140px] md:h-[200px] rounded-2xl md:rounded-3xl overflow-hidden ${card.bgColor} p-3 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                            >
                                {/* Background Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-110" />

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="w-full md:w-2/3">
                                        <h3 className="text-sm md:text-xl font-extrabold text-gray-900 leading-tight mb-1 md:mb-2">
                                            {card.title}
                                        </h3>
                                        <p className={`font-bold ${card.textColor} text-[10px] md:text-sm uppercase tracking-wider`}>
                                            Starting ₹{card.price}
                                        </p>
                                    </div>

                                    {/* Arrow Button */}
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center ${card.textColor} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <i className="ri-arrow-right-s-line text-sm md:text-lg"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Laptop Image */}
                                <div className="absolute top-1/2 right-[-20px] -translate-y-1/2 w-[60%] h-[120%] z-0 origin-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                                    <Image
                                        src={card.imageUrl}
                                        alt={card.title}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
