"use client";

import { useEffect, useState } from "react";

interface CelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    discountAmount: number;
    originalTotal: number;
    discountCode: string;
}

export default function CelebrationModal({
    isOpen,
    onClose,
    discountAmount,
    originalTotal,
    discountCode
}: CelebrationModalProps) {
    const [confettiPieces, setConfettiPieces] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Generate confetti pieces
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.3,
                duration: 2 + Math.random() * 2,
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)]
            }));
            setConfettiPieces(pieces);

            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            {/* Confetti */}
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute top-0 w-3 h-3 opacity-0 animate-confetti"
                    style={{
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                />
            ))}

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 p-8 animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Party Popper Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <i className="ri-emotion-happy-line text-8xl text-yellow-400 animate-bounce"></i>
                        <div className="absolute -top-2 -right-2 animate-ping">
                            <i className="ri-sparkle-fill text-3xl text-yellow-400"></i>
                        </div>
                    </div>
                </div>

                {/* Congratulations Text */}
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    🎉 Congratulations! 🎉
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Your discount code has been applied successfully!
                </p>

                {/* Discount Details Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <i className="ri-coupon-2-fill text-3xl text-green-600"></i>
                        <span className="text-2xl font-bold text-green-700 uppercase tracking-wide">
                            {discountCode}
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Original Total:</span>
                            <span className="text-gray-900 font-semibold">₹{originalTotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-600 font-semibold text-sm">You Saved:</span>
                            <span className="text-green-600 font-bold text-xl">-₹{discountAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-gray-900 font-bold">New Total:</span>
                            <span className="text-2xl font-bold text-[#a51c30]">
                                ₹{(originalTotal - discountAmount).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <p className="text-center text-sm text-gray-500">
                    Your discount will be applied at checkout
                </p>
            </div>

            <style jsx>{`
                @keyframes confetti {
                    0% {
                        opacity: 1;
                        transform: translateY(0) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-confetti {
                    animation: confetti forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </div>
    );
}
