import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import Countdown from "@/components/Countdown";
import ComparisonSlider from "@/components/ComparisonSlider";
import BrandLogos from "@/components/BrandLogos";
import Testimonials from "@/components/Testimonials";
import ExclusiveStores from "@/components/ExclusiveStores";
import CTABanner from "@/components/CTABanner";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import BlogSection from "@/components/BlogSection";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";
import ProductRow from "@/components/ProductRow";

async function getHomeData() {
    await dbConnect();
    const productProjection = { name: 1, slug: 1, price: 1, mrp: 1, discount: 1, image: 1, rating: 1, inStock: 1, brand: 1, category: 1, description: 1 };

    const [
        appleLaptops,
        dellLaptops,
        hpLaptops,
        lenovoLaptops,
        bestSellers,
        desktops,
        monitors,
        accessories,
        latestBlogs
    ] = await Promise.all([
        Product.find({ category: 'laptop', brand: 'Apple' }).select(productProjection).limit(8).lean(),
        Product.find({ category: 'laptop', brand: 'Dell' }).select(productProjection).limit(8).lean(),
        Product.find({ category: 'laptop', brand: 'HP' }).select(productProjection).limit(8).lean(),
        Product.find({ category: 'laptop', brand: 'Lenovo' }).select(productProjection).limit(8).lean(),
        Product.find().sort({ discount: -1 }).select(productProjection).limit(4).lean(),
        Product.find({ category: 'desktop' }).select(productProjection).limit(8).lean(),
        Product.find({ category: 'monitor' }).select(productProjection).limit(8).lean(),
        Product.find({ category: 'accessory' }).select(productProjection).limit(8).lean(),
        Blog.find({}).sort({ date: -1 }).limit(4).lean()
    ]);

    // Convert _id and all Date fields to strings for serialization
    const serialize = (data: any[]) => data.map(item => ({
        ...item,
        _id: item._id.toString(),
        date: item.date ? item.date.toISOString() : null,
        createdAt: item.createdAt ? item.createdAt.toISOString() : null,
        updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null
    }));

    return {
        appleLaptops: serialize(appleLaptops),
        dellLaptops: serialize(dellLaptops),
        hpLaptops: serialize(hpLaptops),
        lenovoLaptops: serialize(lenovoLaptops),
        bestSellers: serialize(bestSellers),
        desktops: serialize(desktops),
        monitors: serialize(monitors),
        accessories: serialize(accessories),
        latestBlogs: serialize(latestBlogs)
    };
}

export default async function Home() {
    const {
        appleLaptops,
        dellLaptops,
        hpLaptops,
        lenovoLaptops,
        bestSellers,
        desktops,
        monitors,
        accessories,
        latestBlogs
    } = await getHomeData();

    return (
        <>
            <Loader />
            <Header />
            <main>
                {/* Hero Section */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-2 md:px-4 py-4 md:py-8 space-y-4 md:space-y-8">
                        <h1 className="sr-only">Simtech Computers - Used Laptops & Desktops Bangalore</h1>
                        <HeroCarousel />

                        {/* Sub Banners Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#ffeeee] rounded-2xl p-4 md:p-8 flex flex-row items-center justify-between relative overflow-hidden group hover:shadow-md transition-all h-[140px] md:h-auto">
                                <div className="w-7/12 md:w-1/2 z-10">
                                    <span className="text-rose-500 font-semibold text-[10px] md:text-sm mb-1 md:mb-2 block">Power & Performance</span>
                                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">Build Your Dream Workstation</h3>
                                    <Link href="/desktops" className="inline-flex items-center text-rose-600 font-semibold text-xs md:text-base mt-2 md:mt-4 group-hover:underline">
                                        Order Now <i className="ri-arrow-right-line ml-1"></i>
                                    </Link>
                                </div>
                                <div className="w-5/12 md:w-1/2 mt-0 md:mt-0 z-10 flex justify-end h-full items-center">
                                    <Image src="/images/lenovo-hero-image.png" alt="Desktop" width={200} height={200} className="h-full md:h-48 object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            <div className="bg-[#eefcfc] rounded-2xl p-4 md:p-8 flex flex-row items-center justify-between relative overflow-hidden group hover:shadow-md transition-all h-[140px] md:h-auto">
                                <div className="w-7/12 md:w-1/2 z-10">
                                    <span className="text-teal-500 font-semibold text-[10px] md:text-sm mb-1 md:mb-2 block">Visual Excellence</span>
                                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">4K & High Refresh Rate Monitors</h3>
                                    <Link href="/monitors" className="inline-flex items-center text-teal-600 font-semibold text-xs md:text-base mt-2 md:mt-4 group-hover:underline">
                                        Order Now <i className="ri-arrow-right-line ml-1"></i>
                                    </Link>
                                </div>
                                <div className="w-5/12 md:w-1/2 mt-0 md:mt-0 z-10 flex justify-end h-full items-center">
                                    <Image src="/images/dell-monitor-hero-image.png" alt="Monitor" width={200} height={200} className="h-full md:h-48 object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section id="why-choose-us" className="bg-white py-8 md:py-16 border-t border-gray-100 rounded-2xl mb-0 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-6 md:mb-12">
                            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 px-4 md:px-0">Why Choose Simtech Computers?</h2>
                            <p className="text-gray-500 text-xs md:text-base">The trusted destination for premium refurbished technology.</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                            {[
                                { icon: "ri-price-tag-3-fill", title: "70%", subtitle: "Box Savings", desc: "Get premium tech for less." },
                                { icon: "ri-shield-star-fill", title: "1 Year", subtitle: "Warranty", desc: "Comprehensive coverage included." },
                                { icon: "ri-arrow-left-right-line", title: "30 Day", subtitle: "Replacement", desc: "Hassle-free returns policy." },
                                { icon: "ri-star-smile-fill", title: "4.9", subIcon: "ri-star-fill", subtitle: "Customer Review", desc: "Trusted by thousands." }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center group p-3 md:p-6 rounded-2xl hover:bg-red-50 transition-colors duration-300 border border-transparent hover:border-red-100">
                                    <div className="w-10 h-10 md:w-16 md:h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-2 md:mb-4 group-hover:bg-[#a51c30] transition-colors duration-300">
                                        <i className={`${item.icon} text-lg md:text-2xl text-[#a51c30] group-hover:text-white transition-colors duration-300`}></i>
                                    </div>
                                    <h3 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-1">
                                        {item.title} {item.subIcon && <i className={`${item.subIcon} text-yellow-400 text-base md:text-xl`}></i>}
                                    </h3>
                                    <p className="text-gray-900 font-semibold text-[10px] md:text-sm uppercase tracking-wide mb-1">{item.subtitle}</p>
                                    <p className="text-gray-500 text-[10px] md:text-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <BrandLogos />

                {/* Daily Best Sells */}
                {bestSellers.length > 0 && (
                    <section className="py-6 md:py-12 bg-white">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                                        <div className="h-1 w-6 md:w-8 bg-[#a51c30] rounded-full"></div>
                                        <span className="text-[#a51c30] font-bold text-[10px] md:text-sm uppercase tracking-wider">Don't Miss Out</span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                        Daily Best Sells
                                        <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-red-500"></span>
                                        </span>
                                    </h2>
                                </div>
                                <Countdown />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                                {bestSellers.map((product) => (
                                    <ProductCard key={product._id} product={product} isBestSeller={true} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Brand Horizontal Sections (Laptops) */}
                {[
                    { title: "Used Apple Laptops", brand: "Apple", logo: "/images/apple-logo.png", data: appleLaptops, desc: "Premium Apple MacBooks with M-series chips." },
                    { title: "Used Dell Laptops", brand: "Dell", logo: "/images/dell-logo.png", data: dellLaptops, desc: "Reliable Dell XPS and Latitude." },
                    { title: "Used HP Laptops", brand: "HP", logo: "/images/hp-logo.png", data: hpLaptops, desc: "Versatile HP Spectre and Envy." },
                    { title: "Used Lenovo Laptops", brand: "Lenovo", logo: "/images/lenovo-logo.png", data: lenovoLaptops, desc: "Business-class ThinkPads and IdeaPads." }
                ].map((section, idx) => (
                    <ProductRow
                        key={idx}
                        title={section.title}
                        description={section.desc}
                        brand={section.brand}
                        logo={section.logo}
                        products={section.data}
                        viewAllLink={`/laptops?brand=${section.brand}`}
                        bgColor={idx % 2 === 0 ? 'white' : 'gray-50'}
                    />
                ))}

                {/* Desktops Section */}
                <ProductRow
                    title="Premium Desktops & AIOs"
                    description="High-performance workstations and sleek All-in-Ones for home and office."
                    iconClass="ri-computer-line"
                    products={desktops}
                    viewAllLink="/desktops"
                    bgColor="white"
                />

                {/* Monitors Section */}
                <ProductRow
                    title="Pro Gaming & Office Monitors"
                    description="Immersive 4K displays, high refresh rate gaming monitors, and professional color-accurate screens."
                    iconClass="ri-tv-2-line"
                    products={monitors}
                    viewAllLink="/monitors"
                    bgColor="white"
                />

                {/* Accessories Section */}
                <ProductRow
                    title="Computer Accessories"
                    description="Keyboards, Mice, Chargers, Adapters, and more to enhance your setup."
                    iconClass="ri-keyboard-line"
                    products={accessories}
                    viewAllLink="/accessories"
                    bgColor="gray-50"
                />

                <ComparisonSlider />
                <Testimonials />
                <ExclusiveStores />
                <CTABanner />
                <SEOContent />
                <FAQ />
                <BlogSection latestBlogs={latestBlogs} />

            </main>
            <Footer />
        </>
    );
}
