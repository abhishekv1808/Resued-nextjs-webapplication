'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 480 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <span style={{ fontSize: 28, color: '#dc2626', fontWeight: 700 }}>!</span>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Something went wrong</h1>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    We encountered an unexpected error. Please try refreshing the page.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                        onClick={reset}
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0a2e5e', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
