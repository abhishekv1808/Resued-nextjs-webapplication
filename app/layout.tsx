import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CompareProvider } from "@/context/CompareContext";
import CompareFloatBar from "@/components/CompareFloatBar";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://simtechcomputers.in'),
    title: {
        default: "Simtech Computers | Refurbished Laptops & Desktops in Bangalore",
        template: "%s | Simtech Computers"
    },
    description: "Buy high-quality refurbished laptops, desktops, and monitors in Bangalore. Premium brands like Apple, Dell, HP, Lenovo at unbeatable prices with warranty.",
    keywords: ["refurbished laptops", "used laptops bangalore", "second hand computers", "dell", "hp", "lenovo", "macbook", "simtech computers"],
    publisher: "Simtech Computers",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Simtech Computers | Premium Refurbished Tech",
        description: "Best deals on used laptops and desktops in Bangalore. Quality tested, warranty backed.",
        siteName: "Simtech Computers",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: '/images/og-image.jpg', // Ensure this exists or fallback
                width: 1200,
                height: 630,
                alt: 'Simtech Computers Store',
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Simtech Computers",
        description: "Premium refurbished laptops and desktops in Bangalore.",
        images: ['/images/og-image.jpg'], // Same as OG
    },
    icons: {
        icon: '/images/favicon/favicon.ico',
        shortcut: '/images/favicon/favicon.ico',
        apple: '/images/favicon/apple-touch-icon.png',
    },
    verification: {
        google: "google-site-verification-code", // Placeholder
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
                    rel="stylesheet"
                />
                <link rel="icon" href="/images/favicon/favicon.ico" sizes="any" />
            </head>
            <body
                className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`}
            >
                <AuthProvider>
                    <CartProvider>
                        <CompareProvider>
                            {children}
                            <WhatsAppWidget />
                            <CompareFloatBar />
                        </CompareProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
