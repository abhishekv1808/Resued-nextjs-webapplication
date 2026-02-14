import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Return & Refund Policy | Reused",
    description: "Learn about our 5-day return policy and refund process at Reused.in.",
};

export default function ReturnAndRefundPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-[#0a2e5e]">Return &amp; Refund Policy</h1>

                <div className="bg-white p-8 rounded-lg shadow-sm prose prose-blue max-w-none">
                    <p className="mb-6 text-sm text-gray-500">Last updated: October 1, 2025</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Returns</h2>
                    <p className="mb-4">
                        We have a <strong>5-day return policy</strong>, which means you have 5 days after receiving your item to request a return.
                    </p>
                    <p className="mb-4">
                        Once the returned product is received, it will be inspected and the return will be approved within <strong>2 business days</strong>.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Refunds</h2>
                    <p className="mb-4">
                        We will notify you once we&apos;ve received and inspected your return, and let you know if the refund has been approved or not. If approved, your refund will be credited back to your original payment method within <strong>10 business days</strong>.
                    </p>
                    <p className="mb-4">
                        Please note: It can take additional time for your bank or credit card company to process and post the refund. If more than <strong>15 business days</strong> have passed since your refund approval and you still haven&apos;t received it, please contact us.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                    <p>For questions about returns or refunds, please reach out to us at:</p>
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
