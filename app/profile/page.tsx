import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        redirect('/login?from=/profile');
    }

    await dbConnect();
    // Fetch full user data to ensure latest details
    const user = await User.findById(session.user._id).lean();

    if (!user) {
        // Handle edge case where session exists but user is deleted
        // We cannot modify cookies in Server Component, so redirect to an API route to do it
        redirect('/api/auth/clear-session');
    }

    const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        address: user.address
    };

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[70vh] bg-gray-50">
                <ProfileForm user={userData} />
            </main>
            <Footer />
        </>
    );
}
