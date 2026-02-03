import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext";

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
    title: "Refurbished Laptops & Desktops in Bangalore | Simtech Computers",
    description:
        "Buy high-quality refurbished laptops and desktops in Bangalore at Simtech Computers. Guaranteed performance with expert support.",
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
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
