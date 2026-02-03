import Image from "next/image";
import Link from "next/link";

export default function BrandLogos() {
    return (
        <section className="py-6 md:py-8 bg-white border-t border-gray-100 rounded-2xl">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Brands We Deal With</h2>
                    <p className="text-gray-500 text-xs md:text-base">We partner with the best to bring you premium quality.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-8 items-center justify-items-center">
                    {[
                        { name: "Apple", src: "/images/apple-logo.png", h: "h-8 md:h-10" },
                        { name: "Dell", src: "/images/dell-logo2.png", h: "h-6 md:h-8" },
                        { name: "Asus", src: "/images/Asus-Logo.png", h: "h-10 md:h-14" },
                        { name: "MSI", src: "/images/MSI-Logo.jpg", h: "h-8 md:h-10", mixBlend: true },
                        { name: "HP", src: "/images/hp-logo.png", h: "h-8 md:h-10" },
                        { name: "Lenovo", src: "/images/lenovo-logo.png", h: "h-4 md:h-6" },
                    ].map((brand, idx) => (
                        <div key={idx} className="group p-2 md:p-4 bg-gray-50 rounded-xl w-full h-16 md:h-24 flex items-center justify-center hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200">
                            <Image
                                src={brand.src}
                                alt={brand.name}
                                width={120}
                                height={60}
                                className={`${brand.h} w-auto object-contain ${brand.mixBlend ? 'mix-blend-multiply' : ''} group-hover:scale-110 transition-transform duration-300`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
