import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <>
            <Header />
            <main style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#0a2e5e', marginBottom: '0.5rem', lineHeight: 1 }}>404</h1>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Page Not Found</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: 400, lineHeight: 1.5, margin: '0 auto 2rem' }}>
                        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            href="/"
                            style={{ padding: '0.75rem 2rem', backgroundColor: '#0a2e5e', color: 'white', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/contact-us"
                            style={{ padding: '0.75rem 2rem', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
