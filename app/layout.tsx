import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CompareProvider } from "@/context/CompareContext";
import NotificationBanner from "@/components/NotificationBanner";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://reused.in",
  ),
  title: {
    default: "Reused | Premium Laptops & Desktops in Bangalore",
    template: "%s | Reused",
  },
  description:
    "Buy certified refurbished laptops, used desktops, and second-hand monitors in Bangalore. Premium brands like Apple, Dell, HP, Lenovo at unbeatable prices with warranty. Visit our Jayanagar store.",
  keywords: [
    "refurbished laptops in bangalore",
    "used laptops in bangalore",
    "second hand laptops bangalore",
    "used computers karnataka",
    "second hand pc monitor",
    "refurbished monitors",
    "used desktop monitor",
    "best laptops under 25k",
    "dell",
    "hp",
    "lenovo",
    "macbook",
    "reused",
  ],
  publisher: "Reused",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Reused | Premium Pre-Owned Tech",
    description:
      "Best deals on used laptops and desktops in Bangalore. Quality tested, warranty backed.",
    siteName: "Reused",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // Ensure this exists or fallback
        width: 1200,
        height: 630,
        alt: "Reused Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reused",
    description: "Premium refurbished laptops and desktops in Bangalore.",
    images: ["/images/og-image.jpg"], // Same as OG
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "any" },
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
  // Add your Google Search Console verification code here
  // verification: {
  //     google: "your-actual-verification-code",
  // }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Required by PhonePe PG for QR code generation in checkout IFRAME */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <NotificationBanner />
              {children}
              <WhatsAppWidget />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
