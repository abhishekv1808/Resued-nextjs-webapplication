import { NextResponse } from 'next/server';
import { clearAdminSessionOnResponse } from '@/lib/session';

export async function POST() {
    const res = NextResponse.json({ isLoggedIn: false });
    await clearAdminSessionOnResponse(res);
    return res;
}
