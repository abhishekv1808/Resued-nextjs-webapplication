import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasPublicKey: !!process.env.VAPID_PUBLIC_KEY,
        hasPrivateKey: !!process.env.VAPID_PRIVATE_KEY,
        hasNextPublicKey: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        publicKeyLength: process.env.VAPID_PUBLIC_KEY?.length || 0,
        nextPublicKeyLength: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.length || 0,
    });
}
