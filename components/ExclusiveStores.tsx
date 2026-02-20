"use client";

import Link from "next/link";

export default function ExclusiveStores() {
  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-start mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Exclusive Store
          </h2>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            <div className="bg-blue-50 text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium">
              <i className="ri-map-pin-line text-[#29abe2]"></i> Experience
              Centre
            </div>
            <div className="bg-blue-50 text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium">
              <i className="ri-star-fill text-[#29abe2]"></i> 4.8+ Star Ratings
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-white">
          {/* Left Content - Branch Details */}
          <div className="lg:w-2/5 p-6 md:p-10 flex flex-col justify-center relative bg-white z-10">
            {/* Pincode Search (Optional visual element as per design image) */}
            <div className="mb-8 hidden lg:block">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                />
                <button className="absolute right-1 top-1 w-9 h-9 bg-[#0a2e5e] text-white rounded-lg flex items-center justify-center hover:bg-[#29abe2] transition-colors">
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#29abe2] mb-4">
                <i className="ri-store-2-fill text-2xl"></i>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Jayanagar Branch
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                680/58, 30th Cross, Swagath Rd, 4th T Block East, Jayanagar,
                Bengaluru - 560041
              </p>

              <a
                href="tel:09632178786"
                className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-6 hover:text-[#29abe2] transition-colors"
              >
                <i className="ri-phone-fill text-[#29abe2]"></i> 096321 78786
              </a>

              <a
                href="https://maps.app.goo.gl/q79LsB3NagcxgdJNA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-blue-100 text-[#0a2e5e] py-3 rounded-xl text-sm font-bold hover:bg-[#0a2e5e] hover:text-white transition-all duration-300"
              >
                Get Directions <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>

          {/* Right Content - Map */}
          <div className="lg:w-3/5 h-[300px] lg:h-auto min-h-[400px] relative bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1156.1130666016759!2d77.59391504098757!3d12.927934611905219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15a46aa76ee3%3A0xc7f30a2a5d418801!2sSimtech%20Computers%20%7C%20Top%20Rated%20Used%20Laptops%20in%20Bangalore%20%7C%20Warranty%20Laptops%20%7C%20Desktops%20%7C%20Certified%20Laptops%20with%20Warranty!5e0!3m2!1sen!2sin!4v1771560556359!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full lg:absolute lg:inset-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
