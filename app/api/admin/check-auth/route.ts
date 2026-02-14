import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { adminSessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getIronSession<SessionData>(await cookies(), adminSessionOptions);

        if (session.isLoggedIn && session.user?.isAdmin) {
            return NextResponse.json(
                { isLoggedIn: true, isAdmin: true, user: session.user },
                { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
            );
        }

        return NextResponse.json(
            { isLoggedIn: false, isAdmin: false },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );

    } catch (error) {
        console.error('Check auth error:', error);
        return NextResponse.json(
            { isLoggedIn: false, isAdmin: false },
            { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
    }
}
