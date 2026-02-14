'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, backgroundColor: '#f9fafb' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <span style={{ fontSize: 28 }}>!</span>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Something went wrong</h1>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>An unexpected error occurred. Please try again.</p>
                    <button
                        onClick={reset}
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0a2e5e', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
