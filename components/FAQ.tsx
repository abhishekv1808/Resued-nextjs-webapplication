"use client";

import { useState } from "react";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        { q: "Are these laptops renewed or used?", a: "Our laptops are premium renewed business machines. They are processed through a rigorous 25-point quality check, cleaned, sanitized, and restored to like-new functional condition. They may have minor cosmetic signs of use but are 100% functional." },
        { q: "What warranty do you offer?", a: "We offer a comprehensive 6-month warranty on the motherboard and a 1-month testing warranty on the battery and adapter. We provide full hardware support during the warranty period." },
        { q: "Can I return the product if I don't like it?", a: "Yes, we have a 7-day hassle-free return policy. If you find any functional defect or if the product does not match the description, you can initiate a return or replacement within 7 days of delivery." },
        { q: "Do you ship all over India?", a: "Absolutely! We offer free and insured shipping to over 25,000 pin codes across India using trusted courier partners like Bluedart, Delhivery, and DTDC." },
        { q: "Do the laptops come with original chargers?", a: "Yes, all our laptops come with compatible, high-quality, or original chargers depending on availability. All accessories are tested for safety and performance." }
    ];

    return (
        <section className="py-10 md:py-16 bg-slate-50 border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Frequently Asked Questions</h2>
                <p className="text-center text-sm md:text-base text-gray-500 mb-8 md:mb-10">Have questions? We&apos;re here to help.</p>

                <div className="space-y-3 md:space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-md ${activeIndex === idx ? 'border-red-500' : 'border-gray-200'}`}
                            onClick={() => toggle(idx)}
                        >
                            <button className="w-full flex justify-between items-center px-4 py-3 md:px-6 md:py-4 text-left focus:outline-none">
                                <span className="font-bold text-gray-900 text-base md:text-lg group-hover:text-[#a51c30] transition-colors">{faq.q}</span>
                                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-50 flex items-center justify-center text-[#a51c30] group-hover:bg-[#a51c30] group-hover:text-white transition-all transform duration-300 ${activeIndex === idx ? 'rotate-180' : ''}`}>
                                    <i className={`${activeIndex === idx ? 'ri-subtract-line' : 'ri-add-line'} text-lg md:text-xl`}></i>
                                </div>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out ${activeIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-3 pt-0 md:px-6 md:pb-4 text-sm md:text-base text-gray-600 leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
