'use client';

import { useState, useEffect } from 'react';

export default function NotificationBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Check if notification API is supported
        if (!('Notification' in window)) {
            return;
        }

        // Check if user has already made a choice
        const notificationDismissed = localStorage.getItem('notificationPromptDismissed');
        const permission = Notification.permission;

        // Show banner only if permission is default (not granted or denied) and user hasn't dismissed
        if (permission === 'default' && !notificationDismissed) {
            // Show after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAllow = async () => {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('Notification permission granted');
                // You can add FCM token registration here if implementing full push notifications
            }
            
            // Hide banner after user interaction
            handleClose();
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            handleClose();
        }
    };

    const handleDismiss = () => {
        // Remember that user dismissed the prompt
        localStorage.setItem('notificationPromptDismissed', 'true');
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowBanner(false);
            setIsClosing(false);
        }, 300);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
                isClosing ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
        >
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 hidden sm:block">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <i className="ri-notification-3-line text-xl sm:text-2xl text-white"></i>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-0.5">
                                Get fresh refurbished tech deals from SimTech
                            </h3>
                            <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
                                Allow us to stay updated with exclusive offers and new arrivals
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={handleDismiss}
                                className="hidden sm:block px-3 lg:px-4 py-2 text-white text-xs sm:text-sm font-medium hover:bg-white/10 rounded-lg transition-all whitespace-nowrap"
                            >
                                I'll do this later
                            </button>
                            <button
                                onClick={handleAllow}
                                className="px-3 sm:px-4 lg:px-6 py-2 bg-white text-blue-600 text-xs sm:text-sm font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg whitespace-nowrap"
                            >
                                Allow
                            </button>
                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="flex-shrink-0 w-8 h-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
                                aria-label="Close"
                            >
                                <i className="ri-close-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
