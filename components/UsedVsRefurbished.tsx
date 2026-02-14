"use client";

import { motion } from "framer-motion";

export default function UsedVsRefurbished() {
    return (
        <section className="py-16 md:py-28 bg-[#f8faff] overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 rounded-full bg-[#0a2e5e] text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-xl shadow-blue-900/20"
                >
                    The Transparency Audit
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black text-[#0a2e5e] mb-4">
                    Know Your <span className="text-[#29abe2]">Machine&apos;s</span> DNA
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
                    We don&apos;t just sell laptops. We preserve original engineering. See the difference between a <span className="text-red-500 font-bold italic">repaired</span> refurbished unit and our <span className="text-[#29abe2] font-bold underline">factory-original</span> used units.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Refurbished Side - The "Surgery" View */}
                    <div className="relative group p-6 md:p-12 bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
                        <div className="z-10">
                            <h3 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2">
                                <i className="ri-error-warning-fill"></i> Typical Refurbished
                            </h3>
                            <p className="text-gray-400 text-sm mb-8">Subjected to local repairs and part substitutions.</p>
                        </div>

                        {/* Visual Rep of Refurbished Interior */}
                        <div className="relative w-full h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center p-8">
                            <i className="ri-cpu-line text-8xl text-gray-200"></i>

                            {/* Scanning Beam (Refurbished) */}
                            <motion.div
                                animate={{
                                    x: ["-100%", "200%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-y-0 w-2 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-sm z-20"
                            />

                            {/* Red Alerts / Repairs Reveal */}
                            <div className="absolute inset-0 z-10 p-4 overflow-hidden">
                                {[
                                    { text: "Soldered Motherboard", top: "20%", left: "10%", delay: 0 },
                                    { text: "Local Copy Screen", top: "50%", right: "15%", delay: 0.5 },
                                    { text: "3rd Party Battery", bottom: "15%", left: "25%", delay: 1 },
                                ].map((alert, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: [0, 1, 1, 0],
                                            scale: [0.8, 1, 1, 0.8],
                                        }}
                                        transition={{
                                            duration: 3,
                                            times: [0, 0.2, 0.8, 1],
                                            repeat: Infinity,
                                            delay: alert.delay,
                                        }}
                                        className="absolute bg-red-50 border border-red-200 px-4 py-1.5 rounded-full shadow-md z-10"
                                        style={{
                                            top: alert.top,
                                            left: alert.left,
                                            right: alert.right,
                                            bottom: alert.bottom
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                            <span className="text-[10px] md:text-[12px] font-bold text-red-700 uppercase">{alert.text}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 z-10">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-gray-500 text-sm">
                                    <i className="ri-close-circle-line text-red-500 mt-0.5"></i>
                                    <span>Compromised structural integrity due to internal meddling.</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-500 text-sm">
                                    <i className="ri-close-circle-line text-red-500 mt-0.5"></i>
                                    <span>Unpredictable performance from mismatched local parts.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Used Side - The "Factory Original" View */}
                    <div className="relative group p-6 md:p-12 bg-[#0a2e5e] rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-between border-4 border-[#29abe2]/20">
                        {/* Energy Background */}
                        <motion.div
                            animate={{ opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#29abe2]/20 via-transparent to-transparent pointer-events-none"
                        />

                        <div className="z-10">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <i className="ri-shield-flash-fill text-[#29abe2]"></i> Fresh Corporate Original
                            </h3>
                            <p className="text-blue-200 text-sm mb-8">Untouched internal craftsmanship. Just as the factory intended.</p>
                        </div>

                        {/* Visual Rep of Used Interior */}
                        <div className="relative w-full h-64 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 shadow-inner backdrop-blur-sm">
                            <i className="ri-cpu-line text-8xl text-white/10"></i>

                            {/* Scanning Beam (Used) */}
                            <motion.div
                                animate={{
                                    x: ["-100%", "200%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-y-0 w-3 bg-gradient-to-r from-transparent via-[#29abe2] to-transparent blur-md z-20 shadow-[0_0_20px_#29abe2]"
                            />

                            {/* Blue Authentications / Original Reveal */}
                            <div className="absolute inset-0 z-10 p-4 overflow-hidden">
                                {
                                    [
                                        { text: "Original Thermal System", top: "12%", left: "5%", delay: 0 },
                                        { text: "OEM Factory Board", top: "12%", right: "5%", delay: 0.5 },
                                        { text: "Original Premium Panel", bottom: "12%", left: "5%", delay: 1 },
                                        { text: "90%+ Health Battery", bottom: "12%", right: "5%", delay: 1.5 },
                                    ].map((alert, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                opacity: [0, 1, 1, 0],
                                                scale: [0.95, 1.05, 1],
                                                y: [5, 0, -5],
                                            }}
                                            transition={{
                                                duration: 4,
                                                times: [0, 0.2, 0.8, 1],
                                                repeat: Infinity,
                                                delay: alert.delay,
                                            }}
                                            className="absolute bg-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_0_20px_rgba(41,171,226,0.3)] border border-white/20 z-[60] hover:bg-white/10 transition-all group"
                                            style={{
                                                top: alert.top,
                                                left: alert.left,
                                                right: alert.right,
                                                bottom: alert.bottom
                                            }}
                                        >
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <div className="w-5 h-5 rounded-full bg-[#29abe2]/20 flex items-center justify-center">
                                                    <i className="ri-shield-check-fill text-[#29abe2] text-[10px]"></i>
                                                </div>
                                                <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-wider">{alert.text}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </div>

                            {/* Central Verified Badge - Minimalist Components Edition */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { type: "spring", stiffness: 400, damping: 15 }
                                }}
                                viewport={{ once: false }}
                                className="absolute z-40 cursor-pointer"
                            >
                                {/* Subtle Glow */}
                                <motion.div
                                    animate={{
                                        opacity: [0.1, 0.15, 0.1],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-[-15%] rounded-full bg-[#FFD700]/10 blur-xl -z-10"
                                />

                                {/* The Components Badge - Compact */}
                                <div className="relative group overflow-hidden bg-white/95 backdrop-blur-md p-2.5 md:p-3 rounded-full shadow-[0_8px_20px_rgba(218,165,32,0.1),inset_0_-1px_3px_rgba(218,165,32,0.05)] flex flex-col items-center border border-[#DAA520]/20 relative z-10">

                                    <div className="relative z-30 flex flex-col items-center">
                                        <i className="ri-verified-badge-fill text-xl md:text-2xl text-[#DAA520]/80 drop-shadow-sm"></i>
                                        <div className="mt-0.5 flex flex-col items-center">
                                            <span className="text-[6px] md:text-[7px] font-black text-[#8B4513]/60 uppercase tracking-[0.2em] whitespace-nowrap leading-none font-heading text-center">100% FACTORY<br />COMPONENTS</span>
                                        </div>
                                    </div>

                                    {/* Shimmer micro-animation */}
                                    <motion.div
                                        animate={{
                                            x: ["-100%", "200%"],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            repeatDelay: 3
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 z-20"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-8 z-10">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-[#29abe2] font-black text-xs uppercase mb-2">Technical Verdict:</p>
                                <p className="text-white font-medium text-sm leading-snug">
                                    &quot;Our engineers reject 85% of units to ensure you get the one with zero repairs, zero soldering, and zero fake parts.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Icons */}
                <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 flex flex-wrap justify-around items-center gap-8 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0a2e5e]">
                            <i className="ri-cpu-line text-2xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0a2e5e]">No Boards Repaired</h4>
                            <p className="text-gray-400 text-xs italic">Never Soldered</p>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0a2e5e]">
                            <i className="ri-battery-2-charge-line text-2xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0a2e5e]">OEM Battery Always</h4>
                            <p className="text-gray-400 text-xs italic">No Random Brands</p>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0a2e5e]">
                            <i className="ri-shield-flash-fill text-2xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0a2e5e]">XPS/ThinkPad Standards</h4>
                            <p className="text-gray-400 text-xs italic">Premium Build Only</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
