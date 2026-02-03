import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default async function BlogPage() {
    await dbConnect();
    const blogsRaw = await Blog.find({}).sort({ date: -1 }).lean();

    // Serialize
    const blogs = blogsRaw.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
        date: blog.date ? blog.date.toISOString() : null
    }));

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-red-50 text-[#a51c30] rounded-full text-xs font-bold tracking-wide uppercase mb-3">
                        Resources
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">Our Blog</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest tech trends, buying guides, and news from Simtech Computers.</p>
                </div>

                {/* Blog Grid */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <article key={blog._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                                <Link href={`/blogs/${blog._id}`} className="block relative overflow-hidden h-48">
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <i className="ri-calendar-line text-[#a51c30]"></i>
                                            {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <i className="ri-user-3-line text-[#a51c30]"></i>
                                            {blog.author}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#a51c30] transition-colors leading-tight font-heading">
                                        <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">{blog.excerpt}</p>
                                    <Link href={`/blogs/${blog._id}`} className="inline-flex items-center text-[#a51c30] font-bold text-sm hover:underline mt-auto uppercase tracking-wide">
                                        Read More <i className="ri-arrow-right-line ml-1 transition-transform group-hover:translate-x-1"></i>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <i className="ri-article-line text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                        <p className="text-gray-500">Check back later for new updates.</p>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
