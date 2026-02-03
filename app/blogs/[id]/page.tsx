import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
    const { id } = await params;
    await dbConnect();

    // Use findOne with try-catch or isValidObjectId check if needed, but notFound() handles null
    let blog;
    try {
        blog = await Blog.findById(id).lean() as any;
    } catch (e) {
        notFound();
    }

    if (!blog) {
        notFound();
    }

    // Serialize
    blog._id = blog._id.toString();
    blog.date = blog.date ? blog.date.toISOString() : null;

    // Related Blogs
    const relatedBlogsRaw = await Blog.find({ _id: { $ne: id } }).limit(3).sort({ date: -1 }).lean() as any[];
    const relatedBlogs = relatedBlogsRaw.map(b => ({
        ...b,
        _id: b._id.toString(),
        date: b.date ? b.date.toISOString() : null
    }));

    return (
        <>
            <Header />
            <main className="pt-8 pb-16 bg-white">
                <article className="max-w-4xl mx-auto px-4">

                    {/* Breadcrumbs */}
                    <nav className="flex text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#a51c30]">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/blogs" className="hover:text-[#a51c30]">Blog</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-semibold truncate max-w-[200px] md:max-w-md">{blog.title}</span>
                    </nav>

                    {/* Blog Header */}
                    <header className="mb-10 text-center">
                        <span className="inline-block px-3 py-1 bg-red-100 text-[#a51c30] rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                            Tech Insights
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-heading">
                            {blog.title}
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                    <i className="ri-user-smile-line"></i>
                                </div>
                                <span className="font-medium text-gray-900">{blog.author}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <i className="ri-calendar-line"></i>
                                <time dateTime={blog.date}>
                                    {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </time>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed prose-headings:font-heading prose-a:text-[#a51c30] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    {/* Share */}
                    <div className="border-t border-gray-100 mt-12 pt-8 flex items-center justify-between">
                        <h4 className="font-bold text-gray-900">Share this article:</h4>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <i className="ri-facebook-fill"></i>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                                <i className="ri-twitter-x-line"></i>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                                <i className="ri-whatsapp-line"></i>
                            </button>
                        </div>
                    </div>

                </article>

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                    <section className="max-w-6xl mx-auto px-4 mt-20 border-t border-gray-100 pt-12">
                        <div className="flex items-center gap-2 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 font-heading">Read Next</h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map((item) => (
                                <Link href={`/blogs/${item._id}`} key={item._id} className="group block">
                                    <div className="rounded-xl overflow-hidden mb-4 relative aspect-[16/9] border border-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#a51c30] transition-colors line-clamp-2 font-heading">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </main>
            <Footer />
        </>
    );
}
