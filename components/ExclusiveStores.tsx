"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExclusiveStores() {
    const [modalOpen, setModalOpen] = useState(false);
    const [mapSrc, setMapSrc] = useState("");
    const [mapLink, setMapLink] = useState("");

    const openMap = (embedUrl: string, directUrl: string) => {
        setMapSrc(embedUrl);
        setMapLink(directUrl);
        setModalOpen(true);
    };

    const closeMap = () => {
        setModalOpen(false);
        setMapSrc("");
    };

    const stores = [
        {
            name: "Jayanagar Branch",
            address: "680/58, 30th Cross, Swagath Rd, 4th T Block East, Jayanagar, Bengaluru - 560041",
            phone: "096321 78786",
            mapEmbed: "https://maps.google.com/maps?q=680/58,+30th+Cross,+Swagath+Rd,+4th+T+Block+East,+Jayanagar,+Bengaluru+-+560041&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://maps.app.goo.gl/q79LsB3NagcxgdJNA"
        },
        {
            name: "Koramangala Branch",
            address: "229, 1st Main Rd, 7th Block, Koramangala, Bengaluru - 560095",
            phone: "098867 86706",
            mapEmbed: "https://maps.google.com/maps?q=229,+1st+Main+Rd,+7th+Block,+Koramangala,+Bengaluru+-+560095&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://maps.app.goo.gl/jmcdvri3cC4MSRFw7"
        },
        {
            name: "Chennai Branch",
            address: "9/5b thiruvallur, Cross St, Janaki Ram Nagar, Sembiyan, Perambur, Chennai, Tamil Nadu 600011",
            phone: "086819 35010",
            mapEmbed: "https://maps.google.com/maps?q=9/5b+thiruvallur,+Cross+St,+Janaki+Ram+Nagar,+Sembiyan,+Perambur,+Chennai,+Tamil+Nadu+600011&t=&z=15&ie=UTF8&iwloc=&output=embed",
            mapLink: "https://maps.app.goo.gl/mCMKjDRJzdgxqTUq8"
        }
    ];

    return (
        <section className="py-10 md:py-16 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-8 gap-4">
                    <div>
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Our Exclusive Stores</h2>
                        <div className="flex gap-3 md:gap-4">
                            <div className="bg-blue-50 text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium">
                                <i className="ri-map-pin-line text-[#29abe2]"></i> 3 Experience Centres
                            </div>
                            <div className="bg-blue-50 text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium">
                                <i className="ri-star-fill text-[#29abe2]"></i> 4.8+ Star Ratings
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 md:gap-4 w-full md:w-auto">
                        <Link href="#" className="text-[#0a2e5e] font-semibold hover:underline text-sm hidden md:block">View all stores</Link>
                        <div className="relative w-full md:w-80">
                            <input type="text" placeholder="Enter Pincode" className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 md:py-2.5 pl-4 md:pl-5 pr-10 md:pr-12 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-200" />
                            <button className="absolute right-1 top-1 w-7 h-7 md:w-8 md:h-8 bg-[#0a2e5e] text-white rounded-full flex items-center justify-center hover:bg-[#29abe2] transition-colors">
                                <i className="ri-arrow-right-line"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stores.map((store, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#29abe2] mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                <i className="ri-store-2-fill text-lg md:text-xl"></i>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">{store.name}</h3>
                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 min-h-[50px] md:min-h-[60px]">
                                {store.address}
                            </p>
                            <div className="flex items-center gap-2 text-gray-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
                                <i className="ri-phone-fill text-[#29abe2]"></i> {store.phone}
                            </div>
                            <button onClick={() => openMap(store.mapEmbed, store.mapLink)} className="w-full border border-blue-100 text-[#0a2e5e] py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-50 transition-colors">
                                Get Directions
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={closeMap}>
                    <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Store Location</h3>
                            <button onClick={closeMap} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <i className="ri-close-line text-lg"></i>
                            </button>
                        </div>
                        <div className="h-[400px] w-full bg-gray-50 relative">
                            <iframe
                                title="Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={mapSrc}
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end">
                            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#0a2e5e] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#29abe2] transition-colors">
                                <i className="ri-map-pin-2-line"></i> Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
