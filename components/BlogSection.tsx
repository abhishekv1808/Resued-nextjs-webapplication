import Link from "next/link";
import Image from "next/image";

interface BlogProps {
    latestBlogs: any[];
}

export default function BlogSection({ latestBlogs }: BlogProps) {
    return (
        <section className="bg-white py-10 md:py-12 border-t border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-end mb-6 md:mb-10">
                    <div>
                        <span className="text-[#0a2e5e] font-bold text-xs md:text-sm tracking-widest uppercase mb-1 block">Our Blog</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Tech Insights</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestBlogs && latestBlogs.length > 0 ? (
                        latestBlogs.map((blog) => (
                            <Link href={`/blogs/${blog._id}`} key={blog._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative">
                                <div className="relative h-40 md:h-48 overflow-hidden">
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>

                                <div className="p-4 md:p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 md:mb-3">
                                        <span className="bg-blue-50 text-[#0a2e5e] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block">
                                            Our Journal
                                        </span>
                                        <time>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0a2e5e] transition-colors leading-tight font-heading">
                                        {blog.title}
                                    </h3>

                                    <p className="text-gray-500 text-xs md:text-sm line-clamp-3 mb-3 md:mb-4 flex-grow">
                                        {blog.excerpt}
                                    </p>

                                    <span className="inline-flex items-center text-[#0a2e5e] font-bold text-xs uppercase tracking-wide mt-auto group-hover:translate-x-1 transition-transform">
                                        Read Article <i className="ri-arrow-right-line ml-1"></i>
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-4 text-center text-gray-500">No blog posts available.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
