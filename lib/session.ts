import { SessionOptions, sealData } from 'iron-session';
import { NextResponse } from 'next/server';

if (!process.env.IRON_SESSION_PASSWORD || process.env.IRON_SESSION_PASSWORD.length < 32) {
    throw new Error('IRON_SESSION_PASSWORD must be set and at least 32 characters long');
}

const SESSION_TTL = 60 * 60 * 8; // 8 hours
const COOKIE_NAME = 'simtech_session';
const ADMIN_COOKIE_NAME = 'simtech_admin_session';

/* ─── User session options (for getIronSession reads) ─── */
export const sessionOptions: SessionOptions = {
    password: process.env.IRON_SESSION_PASSWORD,
    cookieName: COOKIE_NAME,
    ttl: SESSION_TTL,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: SESSION_TTL,
        path: '/',
    },
};

/* ─── Admin session options (separate cookie so both can coexist) ─── */
export const adminSessionOptions: SessionOptions = {
    password: process.env.IRON_SESSION_PASSWORD,
    cookieName: ADMIN_COOKIE_NAME,
    ttl: SESSION_TTL,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: SESSION_TTL,
        path: '/',
    },
};

export interface SessionData {
    user?: {
        _id: string;
        name: string;
        phone?: string;
        location?: string;
        email?: string;
        address?: string;
        isAdmin?: boolean;
        profileImage?: string;
    };
    isLoggedIn: boolean;
}

/* ─── Cookie helper options ─── */
const cookieOpts = (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
});

/* ─── User session helpers ─── */

export async function setSessionOnResponse(
    response: NextResponse,
    data: SessionData,
): Promise<void> {
    const sealed = await sealData(data, {
        password: process.env.IRON_SESSION_PASSWORD!,
        ttl: SESSION_TTL,
    });
    response.cookies.set(COOKIE_NAME, sealed, cookieOpts(SESSION_TTL));
}

export function clearSessionOnResponse(response: NextResponse): void {
    response.cookies.set(COOKIE_NAME, '', cookieOpts(0));
}

/* ─── Admin session helpers ─── */

export async function setAdminSessionOnResponse(
    response: NextResponse,
    data: SessionData,
): Promise<void> {
    const sealed = await sealData(data, {
        password: process.env.IRON_SESSION_PASSWORD!,
        ttl: SESSION_TTL,
    });
    response.cookies.set(ADMIN_COOKIE_NAME, sealed, cookieOpts(SESSION_TTL));
}

export function clearAdminSessionOnResponse(response: NextResponse): void {
    response.cookies.set(ADMIN_COOKIE_NAME, '', cookieOpts(0));
}

declare module 'iron-session' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IronSessionData extends SessionData { }
}
