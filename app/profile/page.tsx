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
    let user;
    try {
        user = await User.findById(session.user._id).lean();
    } catch (err) {
        console.error('Profile: DB query failed for user', session.user._id, err);
        // Don't destroy the session on transient DB errors — just show stale session data
        user = null;
    }

    if (!user) {
        // Instead of destroying the session (which causes logout), redirect to home.
        // The session is still valid — the user might just have a DB connectivity issue.
        // Only clear session if we're SURE the user was deleted (not a transient failure).
        console.warn('Profile: User not found in DB for session user:', session.user._id);
        redirect('/');
    }

    const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        address: user.address,
        authProvider: user.authProvider || 'phone',
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
