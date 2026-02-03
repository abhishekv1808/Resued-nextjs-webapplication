"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export default function ComparisonSlider() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const updateSlider = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let percentage = ((clientX - rect.left) / rect.width) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        setSliderPos(percentage);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        updateSlider(e.clientX);
    }, [updateSlider]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        updateSlider(e.touches[0].clientX);
    }, [updateSlider]);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) updateSlider(e.clientX);
        };
        const handleTouchEnd = () => setIsDragging(false);
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) updateSlider(e.touches[0].clientX);
        };

        if (isDragging) {
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchend", handleTouchEnd);
            window.addEventListener("touchmove", handleTouchMove);
        }

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isDragging, updateSlider]);

    return (
        <section className="py-8 md:py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Simtech Quality Difference</h2>
                    <p className="text-gray-500 text-xs md:text-base">
                        The Simtech Impact: <span className="text-[#a51c30] font-bold border-b-2 border-[#a51c30]">Premium Quality Meets Affordability</span>
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative w-full mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl select-none group touch-none cursor-ew-resize"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Bad Image (Bottom Layer) */}
                    <div className="absolute inset-0 w-full h-full bg-gray-200 pointer-events-none">
                        <Image
                            src="/images/laptop-comparison-bad.png"
                            alt="Others"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Good Image (Top Layer) */}
                    <div
                        className="absolute inset-0 h-full bg-white overflow-hidden pointer-events-none"
                        style={{ width: `${sliderPos}%` }}
                    >
                        <div className="relative h-full w-full" style={{ width: sliderPos > 0 ? `${100 * 100 / sliderPos}%` : '100vw' }}>
                            <Image
                                src="/images/laptop-comparison-good.png"
                                alt="Simtech"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Slider Handle */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center transform hover:scale-110 transition-transform"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-gray-100 text-gray-400">
                            <i className="ri-arrow-left-right-line text-sm md:text-lg"></i>
                        </div>
                    </div>

                    {/* Badges */}
                    <div
                        className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold pointer-events-none border border-white/20 transition-opacity duration-300"
                        style={{ opacity: sliderPos > 90 ? 0 : 1 }}
                    >
                        Others (Market)
                    </div>
                    <div
                        className="absolute top-2 left-2 md:top-4 md:left-4 bg-[#a51c30] backdrop-blur-md text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-sm font-extrabold pointer-events-none border-2 border-white/30 shadow-[0_4px_15px_rgba(165,28,48,0.6)] uppercase tracking-wide transition-opacity duration-300"
                        style={{ opacity: sliderPos < 10 ? 0 : 1 }}
                    >
                        Simtech Premium
                    </div>
                </div>
            </div>
        </section>
    );
}
