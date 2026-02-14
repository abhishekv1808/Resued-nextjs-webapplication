import { NextResponse } from 'next/server';
import { clearSessionOnResponse } from '@/lib/session';

export const dynamic = 'force-dynamic';

// POST-only handler — prevents accidental session destruction via prefetch/crawlers/GET requests
export async function POST() {
    const res = NextResponse.json({ isLoggedIn: false });
    clearSessionOnResponse(res);
    return res;
}

// Keep GET as a no-op redirect to prevent accidental session destruction
export async function GET() {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
