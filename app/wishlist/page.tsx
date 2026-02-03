import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WishlistItem from '@/components/WishlistItem';
import Link from 'next/link';

export default async function WishlistPage() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        redirect('/login?from=/wishlist');
    }

    await dbConnect();
    // Fetch user with populated wishlist
    const user = await User.findById(session.user._id).populate('wishlist').lean();

    if (!user) {
        redirect('/login');
    }

    // wishlist is populated, so it should be an array of products
    // However, TypeScript might complain about populated types with `lean()`.
    // We'll cast it safely for now or let runtime handle it. 
    // Mongoose population replaces IDs with Documents.
    const products: any[] = (user.wishlist as any) || [];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-500">
                            {products.length > 0
                                ? `You have ${products.length} item(s) in your wishlist.`
                                : "Your wishlist is empty."}
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <WishlistItem key={product._id.toString()} product={{ ...product, _id: product._id.toString() }} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-heart-add-line text-4xl text-[#a51c30]"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your wishlist yet. Explore our products and save your favorites!</p>
                            <Link href="/" className="inline-flex items-center gap-2 bg-[#a51c30] text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Start Shopping <i className="ri-arrow-right-line"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
