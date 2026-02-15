"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useState, useRef, useEffect } from "react";

export default function SloganSection() {
    const [riveError, setRiveError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const springScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax transforms for background elements
    const y1 = useTransform(springScroll, [0, 1], [0, -250]);
    const y2 = useTransform(springScroll, [0, 1], [0, 250]);
    const rotate = useTransform(springScroll, [0, 1], [0, 60]);
    const scale = useTransform(springScroll, [0, 0.5, 1], [0.8, 1, 0.8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const { RiveComponent } = useRive({
        src: "/originality.riv",
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        autoplay: true,
        onLoadError: () => {
            console.warn("Rive animation failed to load, falling back to Framer Motion Glow");
            setRiveError(true);
        }
    });

    const sloganParts = [
        { text: "Zero Soldering.", color: "text-[#0a2e5e]", delay: 0 },
        { text: "Zero Substitutions.", color: "text-[#29abe2]", delay: 0.15 },
        { text: "100% Originality.", color: "bg-gradient-to-r from-[#0a2e5e] via-[#29abe2] to-[#0a2e5e] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent underline decoration-[#29abe2]/20 decoration-4 underline-offset-[12px]", delay: 0.3 }
    ];

    const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

    return (
        <section
            className="relative py-20 md:py-32 bg-[#f8fafc] overflow-hidden flex items-center justify-center min-h-[60vh] cursor-default"
            ref={containerRef}
            onMouseMove={handleMouseMove}
        >
            {/* Background - Minimalist */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {/* Optimized Noise Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                    style={{ backgroundImage: noiseBg }}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="flex flex-col items-center sm:items-start space-y-8 md:space-y-16">
                    {sloganParts.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 100, rotateX: -20 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-150px" }}
                            transition={{
                                duration: 1.5,
                                delay: item.delay,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="relative group w-full"
                        >
                            <h2 className="text-3xl sm:text-7xl md:text-[10rem] font-black leading-none tracking-tighter flex flex-wrap justify-center sm:justify-start relative transition-all duration-700">
                                {item.text.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{
                                            scale: 1.05,
                                            y: -10,
                                        }}
                                        className={`mr-4 sm:mr-12 last:mr-0 inline-block transition-colors duration-500 relative ${item.color} ${index !== 2 ? "group-hover:text-[#29abe2]/80" : ""}`}
                                    >
                                        {word}
                                    </motion.span>
                                ))}

                                {index === 2 && (
                                    <div className="absolute inset-x-0 bottom-0 -z-10 opacity-0 pointer-events-none translate-y-1/3">
                                    </div>
                                )}
                            </h2>

                            {/* Refined Decorative Accent Line */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                whileInView={{ scaleX: 1, opacity: 1 }}
                                transition={{ delay: 1 + item.delay, duration: 2, ease: "circOut" }}
                                className="h-[2px] md:h-[3px] w-full bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent mt-8 opacity-60 origin-left"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    );
}
