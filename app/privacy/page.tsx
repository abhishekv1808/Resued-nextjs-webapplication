import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Reused",
    description: "Learn how Reused.in collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#0a2e5e]">Privacy Policy</h1>

                <div className="bg-white p-8 rounded-lg shadow-sm prose prose-blue max-w-none">
                    <p className="mb-4 text-sm text-gray-500">Last updated: October 1, 2025</p>

                    <p className="mb-6">
                        Reused.in (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates this website and services. This Privacy Policy explains how we collect, use, and share your personal information when you visit or use reused.in, make a purchase, or contact us.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">1. Personal Information We Collect</h2>
                    <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li><strong>Contact details:</strong> name, email, phone, billing &amp; shipping addresses.</li>
                        <li><strong>Payment details:</strong> card / transaction info (processed by payment partners).</li>
                        <li><strong>Account info:</strong> username, password, preferences.</li>
                        <li><strong>Order &amp; transaction data:</strong> purchases, returns, wishlist items.</li>
                        <li><strong>Communications:</strong> messages you send to our support team.</li>
                        <li><strong>Device &amp; usage:</strong> IP, browser, cookies, and analytics data.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Collect Information</h2>
                    <p className="mb-2">We collect information:</p>
                    <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>Directly from you when you create an account, place an order, or contact us.</li>
                        <li>Automatically via cookies and analytics when you browse our site.</li>
                        <li>From service providers (payment gateways, shipping partners, analytics).</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
                    <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>To process and fulfil orders, manage returns and refunds, and deliver items.</li>
                        <li>To provide customer support and respond to inquiries.</li>
                        <li>To personalise your shopping experience and show relevant products.</li>
                        <li>For fraud prevention and to protect our services.</li>
                        <li>To send marketing emails (you can opt out at any time).</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">4. Who We Share Information With</h2>
                    <p className="mb-2">We may share personal information with:</p>
                    <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>Service providers such as payment processors, shipping companies, and hosting providers.</li>
                        <li>Marketing partners if you consent to targeted advertising.</li>
                        <li>Law enforcement or regulators when required by law.</li>
                        <li>Potential buyers in the event of a business sale, merger, or reorganization.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">5. Security &amp; Retention</h2>
                    <p>We use reasonable security measures to protect personal data, but no system is 100% secure. We keep information only as long as needed to provide services, comply with law, or resolve disputes.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
                    <p>Depending on your location, you may have the right to access, correct, delete, or export your personal information, and to opt out of certain processing. To exercise any rights, contact us using the details below.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">7. Children</h2>
                    <p>Our site is not intended for children under 18. We do not knowingly collect information from children.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">8. International Transfers</h2>
                    <p>Your data may be transferred, stored, and processed in countries other than where you live.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to This Policy</h2>
                    <p>We may update this policy from time to time. The &quot;Last updated&quot; date will show the latest version.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                    <p>If you have questions or want to exercise your rights, contact us:</p>
                    <p className="mt-2">
                        <strong>Email:</strong> <a href="mailto:support@reused.in" className="text-blue-600 hover:underline">support@reused.in</a><br />
                        <strong>Address:</strong> 680/58, 30th Cross, Swagat Road, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
