import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    const { pathname } = req.nextUrl;

    // Define paths to protect
    const isAdminPage = pathname.startsWith('/admin');
    const isAdminApi = pathname.startsWith('/api/admin');

    // Define paths to exclude from protection
    const isLoginPage = pathname === '/admin/login';
    const isLoginApi = pathname === '/api/admin/login';
    const isCheckAuthApi = pathname === '/api/admin/check-auth';

    // If it's a public flow, allow it
    if (isLoginPage || isLoginApi || isCheckAuthApi) {
        return res;
    }

    // Protection Logic
    if (isAdminPage || isAdminApi) {
        // Validation: Must be logged in AND be an admin
        if (!session.isLoggedIn || !session.user?.isAdmin) {

            // Handle API requests (return 401)
            if (isAdminApi) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Admin access required' },
                    { status: 401 }
                );
            }

            // Handle Page requests (redirect to login)
            const loginUrl = new URL('/admin/login', req.url);
            // Optional: returnUrl parameter could be added here
            return NextResponse.redirect(loginUrl);
        }
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all paths starting with /admin or /api/admin
         */
        '/admin/:path*',
        '/api/admin/:path*',
    ],
};
