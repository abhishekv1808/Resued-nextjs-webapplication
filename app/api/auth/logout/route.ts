import { NextResponse } from 'next/server';
import { clearSessionOnResponse } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
    const res = NextResponse.json({ isLoggedIn: false });
    clearSessionOnResponse(res);
    return res;
}
