import Image from "next/image";
import Link from "next/link";

export default function CTABanner() {
    return (
        <section className="py-10 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-gradient-to-r from-[#a51c30] to-[#7f1d1d] rounded-[2rem] md:rounded-[2.5rem] px-6 pt-8 md:px-16 md:pt-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl shadow-teal-100">
                    <div className="z-10 md:w-1/2 text-white pb-8 md:pb-16">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight md:text-left">Unlock Premium <br className="md:hidden" /> Quality</h2>
                        <p className="text-sm md:text-lg lg:text-xl font-medium opacity-90 mb-6 md:mb-8 max-w-lg md:max-w-3xl leading-relaxed mx-auto md:mx-0 md:text-left">
                            Buy top-quality Used laptops | Get expert repairs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 md:justify-start">
                            <Link href="/shop" className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center justify-center md:justify-start gap-3 hover:bg-gray-900 transition-transform hover:-translate-y-1 shadow-lg">
                                <i className="ri-shopping-bag-3-fill text-xl md:text-2xl"></i>
                                <div className="text-left leading-tight">
                                    <span className="block text-[10px] font-bold tracking-wider opacity-80">SHOP NOW</span>
                                    <span className="block text-xs md:text-sm font-bold">Buy Refurbished</span>
                                </div>
                            </Link>
                            <Link href="/contact-us" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center justify-center md:justify-start gap-3 hover:bg-white/30 transition-transform hover:-translate-y-1 shadow-lg">
                                <i className="ri-customer-service-2-fill text-xl md:text-2xl"></i>
                                <div className="text-left leading-tight">
                                    <span className="block text-[10px] font-bold tracking-wider opacity-80">NEED HELP?</span>
                                    <span className="block text-xs md:text-sm font-bold">Talk to Expert</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:bottom-0 md:right-0 md:h-full flex items-center justify-center pointer-events-none mx-auto">
                        <Image
                            src="/images/girl-holding-laptop.png"
                            alt="Simtech Expert"
                            width={400}
                            height={550}
                            className="object-contain h-48 md:h-[550px] w-auto mx-auto flex"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
