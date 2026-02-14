'use client';

import { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function registerPushSubscription() {
    try {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
            console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set');
            return;
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Send subscription to our API
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Push subscription registered successfully');
    } catch (error) {
        console.error('Failed to register push subscription:', error);
    }
}

export default function NotificationBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Check if notification API and service workers are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            return;
        }

        const permission = Notification.permission;
        const notificationDismissed = localStorage.getItem('notificationPromptDismissed');

        if (permission === 'granted') {
            // Already granted — make sure subscription is registered
            registerPushSubscription();
        } else if (permission === 'default' && !notificationDismissed) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAllow = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                await registerPushSubscription();
            }

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
            className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${isClosing ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                }`}
        >
            <div className="w-full bg-gradient-to-r from-[#0a2e5e] to-[#29abe2] shadow-2xl">
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
                                Get fresh corporate pull deals from Reused
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
                                I&apos;ll do this later
                            </button>
                            <button
                                onClick={handleAllow}
                                className="px-3 sm:px-4 lg:px-6 py-2 bg-white text-[#0a2e5e] text-xs sm:text-sm font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg whitespace-nowrap"
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
