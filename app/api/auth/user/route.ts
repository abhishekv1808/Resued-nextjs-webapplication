import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (session.isLoggedIn) {
        return NextResponse.json(
            { isLoggedIn: true, user: session.user },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
    } else {
        return NextResponse.json(
            { isLoggedIn: false },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
    }
}
