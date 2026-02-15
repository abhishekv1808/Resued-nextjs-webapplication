"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        { q: "Are these laptops refurbished or corporate used?", a: "Neither. Our laptops are 'Fresh Corporate Pulls'—premium business machines sourced directly from MNCs. They undergo a rigorous 32-point Originality Audit to ensure 100% factory components. We do not sell units with soldered motherboards or third-party repairs." },
        { q: "What warranty do you offer?", a: "We offer a comprehensive 6-month warranty on the motherboard and a 1-month testing warranty on the battery and adapter. We provide full hardware support during the warranty period." },
        { q: "Can I return the product if I don't like it?", a: "Yes, we have a 7-day hassle-free return policy. If you find any functional defect or if the product does not match the description, you can initiate a return or replacement within 7 days of delivery." },
        { q: "Do you ship all over India?", a: "Absolutely! We offer free and insured shipping to over 25,000 pin codes across India using trusted courier partners like Bluedart, Delhivery, and DTDC." },
        { q: "Do the laptops come with original chargers?", a: "Yes, all our laptops come with compatible, high-quality, or original chargers depending on availability. All accessories are tested for safety and performance." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="relative py-20 md:py-32 bg-white overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#f8fafc_0%,_transparent_70%)] opacity-50 -z-10" />

            <div className="max-w-4xl mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-2xl md:text-5xl font-black text-[#0a2e5e] mb-4 tracking-tight">
                        Got Questions? <span className="text-[#29abe2]">We Have Answers.</span>
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Everything you need to know about our premium Original Pulls and the Reused experience.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-4"
                >
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            layout
                            className={`group relative rounded-[2rem] transition-all duration-500 ease-out ${activeIndex === idx
                                ? 'bg-white shadow-[0_20px_50px_rgba(10,46,94,0.1)] border-[#29abe2]/20'
                                : 'bg-gray-50/50 hover:bg-white border-transparent hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]'
                                } border-2 overflow-hidden`}
                            onClick={() => toggle(idx)}
                        >
                            <button className="w-full flex justify-between items-center px-6 py-5 md:px-8 md:py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#29abe2] rounded-[2rem]">
                                <span className={`font-bold text-base md:text-xl transition-colors duration-300 ${activeIndex === idx ? 'text-[#0a2e5e]' : 'text-gray-700'
                                    }`}>
                                    {faq.q}
                                </span>
                                <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden ${activeIndex === idx
                                    ? 'bg-[#0a2e5e] text-white rotate-90 scale-110'
                                    : 'bg-gray-200/50 text-gray-500 group-hover:bg-[#29abe2]/10 group-hover:text-[#29abe2]'
                                    }`}>
                                    <i className={`${activeIndex === idx ? 'ri-subtract-line' : 'ri-add-line'} text-2xl`}></i>
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {activeIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                                            <div className="h-[1px] w-full bg-gray-100 mb-6" />
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA Overlay Effect */}
                <div className="mt-16 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0a2e5e] hover:text-[#29abe2] transition-colors cursor-pointer group"
                    >
                        Still have questions? Chat with our experts
                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
