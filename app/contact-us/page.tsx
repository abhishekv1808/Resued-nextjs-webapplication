"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { submitContact } from "@/app/actions/contact";

const initialState = {
  success: false,
  message: "",
};

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowModal(true);
    }
  }, [state]);

  return (
    <>
      <Header />
      <main className="flex-grow pt-6 pb-6 md:pt-12 md:pb-12 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex mb-4 md:mb-8 text-xs md:text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0a2e5e]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Contact Us</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {/* Contact Information and Map */}
            <div className="flex flex-col h-full space-y-4 md:space-y-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                  Get in Touch
                </h1>
                <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                  Have a specific requirement or query? Fill out the form, and
                  our team will get back to you with the best options.
                </p>

                <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-base md:text-lg">
                  Our Locations
                </h3>

                {/* Jayanagar Store */}
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0a2e5e] flex-shrink-0">
                    <i className="ri-store-2-fill text-base md:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">
                      Jayanagar Store
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      680/58, 30th Cross, Swagath Rd, 4th T Block East, <br />{" "}
                      Jayanagar, Bengaluru, Karnataka 560041
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0a2e5e] flex-shrink-0">
                    <i className="ri-phone-line text-base md:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">
                      Phone
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      +91 96321 78786
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0a2e5e] flex-shrink-0">
                    <i className="ri-mail-line text-base md:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">
                      Email
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      support@reused.in
                    </p>
                  </div>
                </div>
              </div>

              {/* Maps */}
              <div className="flex-grow flex flex-col min-h-[250px] md:min-h-[400px]">
                {/* Jayanagar Map */}
                <div className="bg-gray-200 rounded-xl w-full overflow-hidden relative flex-grow shadow-sm h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1156.1130666016759!2d77.59391504098757!3d12.927934611905219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15a46aa76ee3%3A0xc7f30a2a5d418801!2sSimtech%20Computers%20%7C%20Top%20Rated%20Used%20Laptops%20in%20Bangalore%20%7C%20Warranty%20Laptops%20%7C%20Desktops%20%7C%20Certified%20Laptops%20with%20Warranty!5e0!3m2!1sen!2sin!4v1771560556359!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">
                Enquiry Form
              </h2>

              {/* Success Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 relative animate-fade-in-up">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-3xl shadow-sm">
                      <i className="ri-checkbox-circle-fill"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Success!
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      {state.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-full bg-[#0a2e5e] hover:bg-[#29abe2] text-white font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <form action={formAction} className="space-y-4 md:space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all placeholder-gray-400 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      autoComplete="tel"
                      pattern="[0-9]{10,15}"
                      title="Please enter a valid phone number (at least 10 digits)"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all placeholder-gray-400 text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all placeholder-gray-400 text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <hr className="border-gray-100 my-3 md:my-6" />

                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  Product Specifications
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                  Select the specifications you are looking for.
                </p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Preferred Brand
                    </label>
                    <select
                      id="brand"
                      name="brand"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all bg-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Brand
                      </option>
                      <option value="Apple">Apple</option>
                      <option value="Dell">Dell</option>
                      <option value="HP">HP</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Processor */}
                  <div>
                    <label
                      htmlFor="processor"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Processor
                    </label>
                    <select
                      id="processor"
                      name="processor"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all bg-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Processor
                      </option>
                      <option value="i3">Core i3</option>
                      <option value="i5">Core i5</option>
                      <option value="i7">Core i7</option>
                      <option value="i9">Core i9</option>
                      <option value="M1">Apple M1</option>
                      <option value="M2">Apple M2</option>
                      <option value="Ryzen 5">Ryzen 5</option>
                      <option value="Ryzen 7">Ryzen 7</option>
                    </select>
                  </div>

                  {/* RAM */}
                  <div>
                    <label
                      htmlFor="ram"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      RAM
                    </label>
                    <select
                      id="ram"
                      name="ram"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all bg-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select RAM
                      </option>
                      <option value="8GB">8GB</option>
                      <option value="16GB">16GB</option>
                      <option value="32GB">32GB</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                    </select>
                  </div>

                  {/* Storage */}
                  <div>
                    <label
                      htmlFor="storage"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Storage
                    </label>
                    <select
                      id="storage"
                      name="storage"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all bg-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Storage
                      </option>
                      <option value="256GB SSD">256GB SSD</option>
                      <option value="512GB SSD">512GB SSD</option>
                      <option value="1TB SSD">1TB SSD</option>
                      <option value="2TB SSD">2TB SSD</option>
                      <option value="4TB SSD">4TB SSD</option>
                    </select>
                  </div>

                  {/* Model No */}
                  <div>
                    <label
                      htmlFor="model"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Model No (Optional)
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all placeholder-gray-400 text-sm"
                      placeholder="e.g. XPS 13, MacBook Air M2"
                    />
                  </div>

                  {/* Purpose */}
                  <div>
                    <label
                      htmlFor="purpose"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                    >
                      Purpose
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all bg-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Purpose
                      </option>
                      <option value="Business">Business</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Designing">Designing</option>
                      <option value="Coding">Coding</option>
                      <option value="Students">Students</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1"
                  >
                    Additional Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#0a2e5e] outline-none transition-all placeholder-gray-400 text-sm"
                    placeholder="Any specific details, model years, or budget range..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#0a2e5e] hover:bg-[#29abe2] text-white font-bold py-2.5 md:py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
                >
                  {isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <span>Send Enquiry</span>
                      <i className="ri-send-plane-fill"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
