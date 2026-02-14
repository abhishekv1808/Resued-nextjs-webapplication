import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-[#0a2e5e] text-white py-12 md:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

                    <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                            Reused
                        </h1>
                        <p className="text-lg md:text-2xl font-light text-blue-100 mb-6 md:mb-8">
                            Your Smart Tech, Sustainable Choice
                        </p>
                        <div className="w-16 md:w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>
                </section>

                {/* Intro Section */}
                <section className="py-10 md:py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <p className="text-gray-600 text-xs md:text-lg leading-relaxed mb-4 md:mb-6">
                            At <span className="font-bold text-[#0a2e5e]">Reused</span>,
                            we believe great technology shouldn’t come with a heavy price for
                            your wallet. We bring you bargain-priced, factory-refurbished IT
                            clearance stock including Refurbished Laptops, Computers,
                            Smartphones, Workstations, and more.
                        </p>
                        <p className="text-gray-600 text-xs md:text-lg leading-relaxed mb-4 md:mb-6">
                            Each device is professionally tested, renewed, and certified,
                            Ensuring it performs just as efficiently as a new one but at a
                            fraction of the cost. With over 17 years of expertise,
                            <span className="font-bold text-[#0a2e5e]">Reused</span> has
                            established itself as one of India’s most trusted remarketers of IT
                            equipment.
                        </p>
                        <p className="text-gray-600 text-xs md:text-lg leading-relaxed font-medium">
                            Every refurbished product we sell contributes to a greener tomorrow
                            — because for every asset reused, one less is manufactured.
                        </p>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-10 md:py-16 bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
                            Others vs Reused
                        </h2>

                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200">
                                        <th className="p-3 md:p-4 font-bold text-gray-700">Feature</th>
                                        <th className="p-3 md:p-4 font-bold text-gray-500">Other Sellers</th>
                                        <th className="p-3 md:p-4 font-bold text-[#0a2e5e] bg-blue-50">Reused</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr>
                                        <td className="p-3 md:p-4 font-medium text-gray-900">Product Testing</td>
                                        <td className="p-3 md:p-4 text-gray-500">Basic or minimal checks</td>
                                        <td className="p-3 md:p-4 text-gray-900 font-medium bg-blue-50">Factory-tested and certified</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-4 font-medium text-gray-900">Warranty</td>
                                        <td className="p-3 md:p-4 text-gray-500">3–6 months limited</td>
                                        <td className="p-3 md:p-4 text-gray-900 font-medium bg-blue-50">1-Year Warranty on all products</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-4 font-medium text-gray-900">Replacement Policy</td>
                                        <td className="p-3 md:p-4 text-gray-500">Rarely offered</td>
                                        <td className="p-3 md:p-4 text-gray-900 font-medium bg-blue-50">30-Day Replacement Guarantee</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-4 font-medium text-gray-900">Pricing</td>
                                        <td className="p-3 md:p-4 text-gray-500">High markups</td>
                                        <td className="p-3 md:p-4 text-gray-900 font-medium bg-blue-50">Up to 70% less than retail</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Sustainability CTA */}
                <section className="py-12 md:py-20 bg-gray-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                            Sustainability That Matters
                        </h2>
                        <p className="text-gray-300 text-xs md:text-lg leading-relaxed mb-6 md:mb-8">
                            We don’t just sell technology. We redefine how it’s consumed. Every
                            Refurbished Laptop, Computer, or Smartphone you buy from us prevents
                            electronic waste and minimizes carbon emissions. It’s a small
                            decision that creates a big difference, both for you and the planet.
                        </p>
                        <Link href="/" className="inline-block bg-[#0a2e5e] hover:bg-[#29abe2] text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 shadow-lg">
                            Shop Sustainable Tech
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
