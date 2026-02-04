import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.destroy();
    await session.save();
    redirect('/login');
}
