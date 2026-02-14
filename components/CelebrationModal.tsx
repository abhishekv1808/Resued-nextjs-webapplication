"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    discountAmount: number;
    originalTotal: number;
    discountCode: string;
}

const CONFETTI_COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#A78BFA", "#F472B6"];

function rand(a: number, b: number) {
    return a + Math.random() * (b - a);
}

export default function CelebrationModal({
    isOpen,
    onClose,
    discountAmount,
    originalTotal,
    discountCode,
}: CelebrationModalProps) {
    const confetti = useMemo(
        () =>
            Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: rand(5, 95),
                delay: rand(0, 0.45),
                dur: rand(2, 3.2),
                color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                rot: rand(0, 360),
                w: i % 3 === 0 ? 4 : rand(6, 10),
                h: i % 3 === 0 ? rand(14, 22) : rand(6, 10),
                br: i % 3 === 1 ? "50%" : "2px",
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isOpen],
    );

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(onClose, 6000);
        return () => clearTimeout(t);
    }, [isOpen, onClose]);

    const newTotal = originalTotal - discountAmount;
    const pct = Math.round((discountAmount / originalTotal) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ padding: 16 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Confetti */}
                    {confetti.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute pointer-events-none"
                            style={{
                                top: 0,
                                left: `${p.left}%`,
                                width: p.w,
                                height: p.h,
                                borderRadius: p.br,
                                backgroundColor: p.color,
                            }}
                            initial={{ y: -20, opacity: 0, rotate: 0 }}
                            animate={{
                                y: "100vh",
                                opacity: [0, 1, 1, 0],
                                rotate: p.rot + 720,
                                x: [0, rand(-30, 30), rand(-20, 20)],
                            }}
                            transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
                        />
                    ))}

                    {/* Modal */}
                    <motion.div
                        className="relative"
                        style={{
                            width: "100%",
                            maxWidth: 420,
                            background: "#fff",
                            borderRadius: 24,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                            overflow: "hidden",
                            zIndex: 1,
                        }}
                        initial={{ opacity: 0, scale: 0.75, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.8 }}
                    >
                        {/* Top accent */}
                        <div
                            style={{
                                height: 5,
                                background: "linear-gradient(90deg, #FACC15, #34D399, #10B981)",
                            }}
                        />

                        <div style={{ padding: "32px 32px 36px" }}>
                            {/* Close */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: "absolute",
                                    top: 18,
                                    right: 18,
                                    width: 34,
                                    height: 34,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "transparent",
                                    color: "#9CA3AF",
                                    cursor: "pointer",
                                    fontSize: 20,
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#F3F4F6";
                                    e.currentTarget.style.color = "#4B5563";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#9CA3AF";
                                }}
                            >
                                <i className="ri-close-line" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.15 }}
                            >
                                <motion.div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <i
                                        className="ri-trophy-line"
                                        style={{ fontSize: 40, color: "#D97706" }}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                style={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    textAlign: "center",
                                    color: "#111827",
                                    margin: "0 0 6px",
                                }}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                Discount Applied!
                            </motion.h2>
                            <motion.p
                                style={{
                                    textAlign: "center",
                                    color: "#6B7280",
                                    fontSize: 14,
                                    margin: "0 0 24px",
                                }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.28, duration: 0.4 }}
                            >
                                Your coupon has been applied successfully
                            </motion.p>

                            {/* Coupon badge */}
                            <motion.div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: 24,
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.32, type: "spring", damping: 14, stiffness: 200 }}
                            >
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 10,
                                        background: "linear-gradient(90deg, #ECFDF5, #F0FDF4)",
                                        border: "2px dashed #86EFAC",
                                        borderRadius: 100,
                                        padding: "10px 24px",
                                    }}
                                >
                                    <i
                                        className="ri-coupon-3-line"
                                        style={{ fontSize: 20, color: "#16A34A" }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: "#15803D",
                                            textTransform: "uppercase",
                                            letterSpacing: 1.5,
                                        }}
                                    >
                                        {discountCode}
                                    </span>
                                    <i
                                        className="ri-checkbox-circle-fill"
                                        style={{ fontSize: 20, color: "#22C55E" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Breakdown */}
                            <motion.div
                                style={{
                                    borderRadius: 16,
                                    border: "1px solid #E5E7EB",
                                    overflow: "hidden",
                                    marginBottom: 24,
                                }}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.38, duration: 0.45 }}
                            >
                                <div style={{ padding: "20px 24px" }}>
                                    {/* Original */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 16,
                                        }}
                                    >
                                        <span style={{ fontSize: 14, color: "#6B7280" }}>
                                            Original Total
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: "#374151",
                                                fontWeight: 600,
                                            }}
                                        >
                                            ₹{originalTotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    {/* Savings */}
                                    <motion.div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.55, duration: 0.35 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "#16A34A",
                                                }}
                                            >
                                                You Save
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#fff",
                                                    background: "#22C55E",
                                                    borderRadius: 100,
                                                    padding: "2px 8px",
                                                }}
                                            >
                                                {pct}% OFF
                                            </span>
                                        </div>
                                        <motion.span
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: "#16A34A",
                                            }}
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                delay: 0.6,
                                                type: "spring",
                                                damping: 10,
                                                stiffness: 200,
                                            }}
                                        >
                                            −₹{discountAmount.toLocaleString("en-IN")}
                                        </motion.span>
                                    </motion.div>
                                </div>

                                {/* New total */}
                                <div
                                    style={{
                                        background: "#0a2e5e",
                                        padding: "18px 24px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "rgba(255,255,255,0.75)",
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        New Total
                                    </span>
                                    <motion.span
                                        style={{
                                            fontSize: 26,
                                            fontWeight: 800,
                                            color: "#fff",
                                        }}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.65,
                                            type: "spring",
                                            damping: 12,
                                            stiffness: 180,
                                        }}
                                    >
                                        ₹{newTotal.toLocaleString("en-IN")}
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* CTA */}
                            <motion.button
                                onClick={onClose}
                                style={{
                                    width: "100%",
                                    padding: "14px 0",
                                    borderRadius: 12,
                                    border: "none",
                                    background: "linear-gradient(90deg, #0a2e5e, #164a8a)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(10,46,94,0.2)",
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.72, duration: 0.35 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Continue to Checkout
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
