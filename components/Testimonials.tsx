import Image from "next/image";

export default function Testimonials() {
    const reviews = [
        { name: "Rahul Sharma", city: "Bangalore", text: "Simply superb laptop! Condition is like new only. Battery backup is also too good. Best place for original used tech in Bengaluru." },
        { name: "Priya Menon", city: "Chennai", text: "I was doubtful first, but packaging was first class. Delivery reached in 2 days only. Product is genuine Apple, very happy with purchase." },
        { name: "Suresh Patil", city: "Mumbai", text: "Full value for money deal. Bought Dell Latitude for office work, performance is butter smooth. Why spend huge amount on new one?" },
        { name: "Ananya Reddy", city: "Hyderabad", text: "Customer support is very helpful. They explained specs nicely. Laptop looks brand new, not even one scratch. Highly recommend!" },
        { name: "Karthik Gowda", city: "Mysore", text: "Best service I have seen. Laptop is faster than my old new one. Price is unbeatable. Will definitely buy again for my team." },
        { name: "Vikram Singh", city: "Delhi", text: "Original product with warranty. In this price range, it is a steal deal. Works perfectly for my coding classes." },
        { name: "Meera Iyer", city: "Pune", text: "Got 70% off on HP Spectre. Display is stunning. Reused Assured quality is real. Thank you for saving my money!" },
        { name: "Arjun Das", city: "Kolkata", text: "Just go for it. Don't think twice. Quality is top notch. Delivery guy was also polite. 5 stars from my side." }
    ];

    return (
        <section className="py-10 md:py-16 bg-slate-50 border-t border-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0a2e5e 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-6xl mx-auto px-4 mb-8 md:mb-12 text-center relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Trusted by Thousands</h2>
                <div className="w-16 h-1 md:w-20 bg-[#0a2e5e] mx-auto rounded-full mb-4"></div>
                <p className="text-gray-500 text-xs md:text-base max-w-2xl mx-auto">Join our growing community of satisfied customers across India who have switched to premium <strong>original used tech</strong>.</p>
            </div>

            <div className="relative w-full overflow-hidden z-10">
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none"></div>

                <div className="flex animate-marquee hover:pause whitespace-nowrap gap-4 md:gap-6 w-max py-4">
                    {[...reviews, ...reviews].map((review, idx) => (
                        <div key={idx} className="w-[280px] md:w-[380px] bg-white p-5 md:p-8 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(41,171,226,0.15)] border border-gray-100 hover:border-blue-100 flex-shrink-0 whitespace-normal relative transition-all duration-300 hover:-translate-y-2 group cursor-default overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="absolute top-4 right-6 md:top-6 md:right-8 text-4xl md:text-5xl text-blue-100 font-serif leading-none group-hover:text-blue-200 transition-colors duration-300">&quot;</div>

                            <div className="flex items-center gap-1 mb-4 md:mb-6 relative z-10">
                                <div className="flex text-yellow-400 text-sm md:text-base gap-0.5">
                                    <i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-6 md:mb-8 relative z-10 font-medium">&quot;{review.text}&quot;</p>

                            <div className="flex items-center gap-3 md:gap-4 mt-auto relative z-10 pt-4 md:pt-6 border-t border-gray-50">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#0a2e5e] to-[#29abe2] flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg shadow-blue-200 ring-2 ring-white">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-[#0a2e5e] transition-colors">{review.name}</h4>
                                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 font-medium">
                                        <i className="ri-map-pin-line"></i> {review.city}
                                    </div>
                                </div>
                                <div className="ml-auto bg-red-50 px-2 py-1 rounded-md">
                                    <i className="ri-verified-badge-fill text-[#0a2e5e] text-lg" title="Verified Buyer"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
