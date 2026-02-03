import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(req: NextRequest) {
    const res = new Response();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (session.isLoggedIn) {
        return NextResponse.json({
            isLoggedIn: true,
            user: session.user,
        });
    } else {
        return NextResponse.json({
            isLoggedIn: false,
        });
    }
}
