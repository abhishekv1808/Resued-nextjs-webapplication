import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { adminSessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

/**
 * Defense-in-depth admin auth check.
 * Call at the top of every admin API route handler.
 * Returns null if authorized, or a 401 NextResponse if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
    try {
        const session = await getIronSession<SessionData>(await cookies(), adminSessionOptions);

        if (session.isLoggedIn && session.user?.isAdmin) {
            return null; // Authorized
        }

        return NextResponse.json(
            { error: 'Unauthorized', message: 'Admin access required' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Unauthorized', message: 'Authentication failed' },
            { status: 401 }
        );
    }
}
