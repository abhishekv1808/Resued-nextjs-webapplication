import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import cloudinaryLib from '@/lib/cloudinary';

// Diagnostic endpoint to verify environment variables and Cloudinary connectivity
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    // Test Cloudinary connectivity by pinging the API
    let cloudinaryStatus = 'not_tested';
    let cloudinaryError = null;

    try {
        const result = await cloudinaryLib.api.ping();
        cloudinaryStatus = result.status === 'ok' ? 'connected' : 'error';
    } catch (err: any) {
        cloudinaryStatus = 'error';
        cloudinaryError = err.message || String(err);
    }

    return NextResponse.json({
        env: {
            CLOUDINARY_CLOUD_NAME: cloudName ? `${cloudName}` : 'MISSING',
            CLOUDINARY_API_KEY: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.slice(-4)}` : 'MISSING',
            CLOUDINARY_API_SECRET: apiSecret ? 'SET (hidden)' : 'MISSING',
            CLOUDINARY_URL: cloudinaryUrl ? 'SET' : 'NOT SET',
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
            MONGODB_URI: process.env.MONGODB_URI ? 'SET (hidden)' : 'MISSING',
            NODE_ENV: process.env.NODE_ENV,
        },
        cloudinary: {
            status: cloudinaryStatus,
            error: cloudinaryError,
        }
    });
}
