"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 5,
        minutes: 42,
        seconds: 18
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev; // Reset or stop
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex gap-3 md:gap-4 items-center bg-gray-900 text-white px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-xl">
            <span className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-widest hidden md:block">Offer Ends In:</span>
            <div className="flex gap-2 md:gap-3 text-center items-center">
                <div className="flex flex-col">
                    <span className="font-bold text-lg md:text-2xl leading-none font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-400 uppercase">Hrs</span>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="flex flex-col">
                    <span className="font-bold text-lg md:text-2xl leading-none font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-400 uppercase">Min</span>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="flex flex-col">
                    <span className="font-bold text-lg md:text-2xl leading-none w-[3ch] text-left font-mono text-[#29abe2]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-400 uppercase">Sec</span>
                </div>
            </div>
        </div>
    );
}
