"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
    {
        brand: 'Apple',
        gradient: 'linear-gradient(135deg, #1E0B36 0%, #102B7B 45%, #04D0D9 100%)',
        badge: 'Premium Original',
        title: 'MacBook Pro & Air',
        subtitle: '100% Originality.',
        subtitleGradient: 'from-blue-400 to-cyan-400',
        desc: 'Fresh corporate pulls with factory-sealed internals. Zero soldering, zero substitutions.',
        image: '/images/Indian-women-with-apple-laptop.png',
        link: '/laptops?brand=Apple',
        priority: true
    },
    {
        brand: 'Dell',
        gradient: 'linear-gradient(135deg, #021B35 0%, #004E8F 50%, #007DB8 100%)',
        badge: 'Corporate Pulls',
        title: 'Dell Latitude & XPS',
        subtitle: 'Zero Soldered Boards.',
        subtitleGradient: 'from-cyan-300 to-blue-200',
        desc: 'Untouched factory engineering for professionals who demand 100% original hardware.',
        image: '/images/Indian-women-with-Dell-laptop.png',
        link: '/laptops?brand=Dell',
        priority: false
    },
    {
        brand: 'HP',
        gradient: 'linear-gradient(135deg, #002D3A 0%, #006D85 50%, #00A6C7 100%)',
        badge: 'MNC Standards',
        title: 'HP EliteBook',
        subtitle: 'No Repaired Parts.',
        subtitleGradient: 'from-teal-300 to-emerald-200',
        desc: 'Audit-grade machines straight from global bank pulls. Just as the factory intended.',
        image: '/images/Indian-women-with-hp-laptop.png',
        link: '/laptops?brand=HP',
        priority: false
    },
    {
        brand: 'Lenovo',
        gradient: 'linear-gradient(135deg, #2D0F0F 0%, #881212 50%, #E22B2B 100%)',
        badge: 'Originality Audit',
        title: 'Lenovo ThinkPad',
        subtitle: 'Legendary Reliability.',
        subtitleGradient: 'from-red-400 to-orange-300',
        desc: 'Factory-sealed ThinkPads that have never seen a local repair shop. 100% Original DNA.',
        image: '/images/Indian-women-with-lenovo-laptop.png',
        link: '/laptops?brand=Lenovo',
        priority: false
    }
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Optimized local noise pattern
    const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

    return (
        <div className="relative w-full rounded-xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl mb-6 md:mb-12 group h-[160px] md:h-[380px]">
            <div className="carousel-inner relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        style={{ background: slide.gradient }}
                    >
                        {/* Optimized Noise Overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                            style={{ backgroundImage: noiseBg }}
                        ></div>

                        <div className="flex flex-col md:flex-row h-full items-center relative z-20">
                            <div className="pl-4 pr-0 py-2 md:py-8 md:px-16 md:pl-24 flex flex-col justify-center items-start text-left h-full w-full md:w-[58%]">
                                <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white text-gray-900 text-[8px] md:text-xs font-bold tracking-widest uppercase mb-1.5 md:mb-3 shadow-lg animate-fade-in-up">
                                    {slide.badge}
                                </span>
                                <h2 className="text-lg md:text-5xl font-bold text-white leading-tight mb-0.5 md:mb-2 tracking-tight animate-fade-in-up delay-100 line-clamp-2 md:line-clamp-none">
                                    {slide.title}
                                </h2>
                                <p className="text-xs md:text-2xl font-light text-gray-300 mb-2 md:mb-4 animate-fade-in-up delay-200">
                                    <span className={`bg-gradient-to-r ${slide.subtitleGradient} bg-clip-text text-transparent font-medium`}>{slide.subtitle}</span>
                                </p>
                                <p className="text-gray-300 text-sm md:text-base max-w-lg leading-relaxed mb-6 animate-fade-in-up delay-300 hidden md:block">
                                    {slide.desc}
                                </p>
                                <Link href={slide.link} className="px-3 py-1 md:px-6 md:py-2.5 rounded-full bg-white text-gray-900 text-[10px] md:text-sm font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl animate-fade-in-up delay-400">
                                    Shop Now
                                </Link>
                            </div>

                            <div className="h-full flex items-end justify-center relative pr-0 md:pr-4 pb-0 w-full md:w-[42%]">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    width={500}
                                    height={400}
                                    className="object-contain w-auto h-[80%] md:h-[85%] drop-shadow-2xl animate-slide-up"
                                    priority={slide.priority}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button onClick={prevSlide} className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300">
                <i className="ri-arrow-left-s-line text-xl md:text-2xl"></i>
            </button>
            <button onClick={nextSlide} className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300">
                <i className="ri-arrow-right-s-line text-xl md:text-2xl"></i>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 focus:outline-none ${index === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/40 hover:bg-white/60'}`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
