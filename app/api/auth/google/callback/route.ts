import { NextRequest, NextResponse } from 'next/server';
import { setSessionOnResponse } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('[Google OAuth] Error from Google:', error);
            return NextResponse.redirect(new URL('/login?error=google_denied', req.url));
        }

        if (!code) {
            console.error('[Google OAuth] No authorization code received');
            return NextResponse.redirect(new URL('/login?error=no_code', req.url));
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${baseUrl}/api/auth/google/callback`;

        if (!clientId || !clientSecret) {
            console.error('[Google OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
            return NextResponse.redirect(new URL('/login?error=config_error', req.url));
        }

        console.log('[Google OAuth] Exchanging code for token...');

        // 1. Exchange authorization code for tokens
        let tokenData;
        try {
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
            });

            tokenData = await tokenRes.json();

            if (!tokenRes.ok || !tokenData.access_token) {
                console.error('[Google OAuth] Token exchange failed:', JSON.stringify(tokenData));
                return NextResponse.redirect(new URL('/login?error=token_failed', req.url));
            }
        } catch (fetchErr) {
            console.error('[Google OAuth] Token fetch error:', fetchErr);
            return NextResponse.redirect(new URL('/login?error=token_failed', req.url));
        }

        console.log('[Google OAuth] Token received, fetching profile...');

        // 2. Fetch user profile from Google
        let profile;
        try {
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });

            profile = await profileRes.json();
            console.log('[Google OAuth] Profile received:', profile.email, profile.name);
        } catch (profileErr) {
            console.error('[Google OAuth] Profile fetch error:', profileErr);
            return NextResponse.redirect(new URL('/login?error=invalid_profile', req.url));
        }

        if (!profile.id || !profile.email) {
            console.error('[Google OAuth] Invalid profile data:', JSON.stringify(profile));
            return NextResponse.redirect(new URL('/login?error=invalid_profile', req.url));
        }

        // 3. Find or create user
        await dbConnect();
        console.log('[Google OAuth] DB connected, finding user...');

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Check if a user with same email exists (phone-based user linking)
            user = await User.findOne({ email: profile.email });

            if (user) {
                // Link existing user to Google
                console.log('[Google OAuth] Linking existing user:', user.email);
                user.googleId = profile.id;
                if (!user.authProvider) user.authProvider = 'phone';
                if (profile.picture && !user.profileImage) {
                    user.profileImage = profile.picture;
                }
                user.lastLogin = new Date();
                await user.save();
            } else {
                // Create new Google user
                console.log('[Google OAuth] Creating new user for:', profile.email);
                user = new User({
                    name: profile.name || profile.email.split('@')[0],
                    email: profile.email,
                    googleId: profile.id,
                    authProvider: 'google',
                    profileImage: profile.picture || undefined,
                    location: 'Not set',
                    tags: ['new_user'],
                    lastLogin: new Date(),
                });
                await user.save();
            }
        } else {
            console.log('[Google OAuth] Found existing Google user:', user.email);
            // Update profile image if changed and update lastLogin
            user.lastLogin = new Date();
            if (profile.picture && user.profileImage !== profile.picture) {
                user.profileImage = profile.picture;
            }
            await user.save();
        }

        console.log('[Google OAuth] User ready, creating session for:', user._id.toString());

        // 4. Create redirect response FIRST, then set sealed cookie DIRECTLY on it
        const redirectResponse = NextResponse.redirect(`${baseUrl}/auth/google/callback`);
        await setSessionOnResponse(redirectResponse, {
            isLoggedIn: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                phone: user.phone || '',
                location: user.location || '',
                email: user.email,
                address: user.address,
                profileImage: user.profileImage,
            },
        });

        console.log('[Google OAuth] Session created, redirecting to callback page');
        return redirectResponse;

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : '';
        console.error('[Google OAuth] Callback error:', message);
        console.error('[Google OAuth] Stack:', stack);
        return NextResponse.redirect(new URL(`/login?error=server_error`, baseUrl));
    }
}
