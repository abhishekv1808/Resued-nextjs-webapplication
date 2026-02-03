import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(req: NextRequest) {
    try {
        const res = new NextResponse();
        const session = await getIronSession<SessionData>(req, res, sessionOptions);

        if (session.isLoggedIn && session.user?.isAdmin) {
            return NextResponse.json({
                isLoggedIn: true,
                isAdmin: true,
                user: session.user
            });
        }

        return NextResponse.json({
            isLoggedIn: false,
            isAdmin: false
        });

    } catch (error) {
        console.error('Check auth error:', error);
        return NextResponse.json({
            isLoggedIn: false,
            isAdmin: false
        }, { status: 500 });
    }
}
