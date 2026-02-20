import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UsedVsRefurbished from "@/components/UsedVsRefurbished";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refurbished vs Reused | The Truth About Used Tech",
  description:
    "Understand the difference between refurbished and reused electronics. Why Reused.in offers superior quality with zero soldering and original parts.",
};

export default function RefurbishedVsReusedPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-[#0a2e5e] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#29abe2] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#29abe2] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm border border-white/10">
              The Honest Truth
            </span>
            <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight">
              Refurbished vs <span className="text-[#29abe2]">Reused</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Most "refurbished" laptops have been repaired, soldered, and
              modified.
              <strong className="text-white block mt-2">
                We don't do that.
              </strong>
            </p>
          </div>
        </section>

        {/* Comparison Component */}
        <UsedVsRefurbished />

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Reused?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                We source exclusively from corporate environments where devices
                are maintained perfectly and retired on schedule, not because
                they broke.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "ri-money-dollar-circle-line",
                  title: "Unbeatable Value",
                  desc: "Save up to 70% off the original MRP without compromising on quality or performance.",
                },
                {
                  icon: "ri-building-2-line",
                  title: "Business Grade Quality",
                  desc: "We only sell enterprise models (ThinkPad, Latitude, EliteBook) built to last for decades.",
                },
                {
                  icon: "ri-leaf-line",
                  title: "Environmental Impact",
                  desc: "Extending the life of premium electronics reduces e-waste and your carbon footprint.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors duration-300 group"
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#29abe2] text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <i className={item.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 md:py-24 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#29abe2] font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">
                Feature by Feature
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                The Reused.in Difference
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-gray-100 text-gray-500 font-medium text-sm w-1/4">
                      Feature
                    </th>
                    <th className="p-4 border-b-2 border-red-100 bg-red-50/50 text-red-600 font-bold text-lg w-1/3">
                      Typical Refurbished
                    </th>
                    <th className="p-4 border-b-2 border-blue-100 bg-blue-50/50 text-[#0a2e5e] font-bold text-lg w-1/3">
                      Reused Certified
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                  {[
                    {
                      feature: "Motherboard",
                      bad: "Often Repaired / Soldered",
                      good: "Original Factory Seal",
                    },
                    {
                      feature: "Display Screen",
                      bad: "Cheap Compatible Copy",
                      good: "Original OEM Panel",
                    },
                    {
                      feature: "Battery",
                      bad: "3rd Party Replacement",
                      good: "Original High Health",
                    },
                    {
                      feature: "Body / Casing",
                      bad: "Repainted / Dented",
                      good: "Grade A / A+",
                    },
                    {
                      feature: "Internal Parts",
                      bad: "Mismatched / Cannibalized",
                      good: "100% Matching Serials",
                    },
                    {
                      feature: "Lifespan",
                      bad: "Unpredictable (Months)",
                      good: "Reliable (Years)",
                    },
                    {
                      feature: "Resale Value",
                      bad: "Near Zero",
                      good: "Retains Value",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 border-b border-gray-100 font-semibold text-gray-700">
                        {row.feature}
                      </td>
                      <td className="p-4 border-b border-gray-100 text-red-500 bg-red-50/10">
                        <div className="flex items-center gap-2">
                          <i className="ri-close-circle-line text-lg"></i>{" "}
                          {row.bad}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-100 text-[#0a2e5e] font-bold bg-blue-50/10">
                        <div className="flex items-center gap-2">
                          <i className="ri-checkbox-circle-fill text-[#29abe2] text-lg"></i>{" "}
                          {row.good}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Detailed Quality Section */}
        <section className="py-16 md:py-24 bg-[#f8faff] border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="w-full md:w-1/2">
                <span className="text-[#29abe2] font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">
                  Our Standard
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                  Zero Soldering. <br />
                  Zero Substitutions.
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-green-600 font-bold text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Original Motherboards
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        We never sell laptops with repaired or soldered
                        motherboards. If a board has an issue, the laptop is
                        recycled, not repaired.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-green-600 font-bold text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Original Screens
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        No cheap third-party replacements. You get the original
                        OEM display panel with true colors and brightness.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-green-600 font-bold text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Rigorous Testing
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        Every unit passes a 40+ point quality check before it
                        reaches you. We test everything from ports to pixels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10 blur-lg"></div>
                <div className="relative bg-white rounded-3xl p-2 shadow-2xl border border-gray-100">
                  <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative group">
                    {/* Placeholder for an image showing internal components or testing */}
                    <i className="ri-shield-check-line text-6xl md:text-8xl text-gray-300 group-hover:text-[#29abe2] transition-colors duration-500"></i>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500">
                Everything you need to know about our premium Original Pulls.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-question-fill text-[#29abe2]"></i> Are these
                  laptops used?
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-7">
                  Yes, they are pre-owned. However, they are high-end corporate
                  lease returns, meaning they were used in professional
                  environments and maintained by IT departments. They are not
                  discarded broken units.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-shield-star-fill text-[#29abe2]"></i> Do they
                  come with a warranty?
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-7">
                  Absolutely. We provide a comprehensive 1-year warranty on all
                  our devices, covering the motherboard and other major
                  components. We stand behind our quality.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-battery-charge-fill text-[#29abe2]"></i> How
                  is the battery life?
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-7">
                  We guarantee a minimum of 60-70% original battery health
                  capacity. In many cases, it's even higher. We are transparent
                  about battery health and do not use cheap compatible
                  batteries.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-search-eye-line text-[#29abe2]"></i> Can I
                  inspect the laptop before buying?
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-7">
                  Yes! You can visit our Experience Center in Jayanagar to
                  touch, feel, and test the devices yourself. We encourage you
                  to verify our "Zero Soldering" claim.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-exchange-dollar-line text-[#29abe2]"></i>{" "}
                  What if I don't like the product?
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-7">
                  We offer a 7-day return policy for any manufacturing defects.
                  If the product doesn't match our description, we will replace
                  it or refund you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#0a2e5e] text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience True Quality?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Browse our inventory of premium, factory-original laptops and
            desktops.
          </p>
          <Link
            href="/laptops"
            className="inline-flex items-center gap-2 bg-[#29abe2] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#0a2e5e] transition-all transform hover:scale-105"
          >
            Shop Premium Laptops <i className="ri-arrow-right-line"></i>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
