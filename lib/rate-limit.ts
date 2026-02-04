import dbConnect from '@/lib/db';
import RateLimit from '@/models/RateLimit';
import { NextRequest } from 'next/server';

/**
 * Checks if the request has exceeded the rate limit.
 * @param req NextRequest object
 * @param limit Max requests allowed in the window
 * @param windowSeconds Window size in seconds
 * @returns true if request is allowed, false if limit exceeded
 */
export async function rateLimit(req: NextRequest, limit = 5, windowSeconds = 60): Promise<boolean> {
    try {
        await dbConnect();

        // Get IP - simplified for this environment
        let ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (ip.includes(',')) ip = ip.split(',')[0];

        const path = req.nextUrl.pathname;
        const expiresAt = new Date(Date.now() + windowSeconds * 1000);

        const result = await RateLimit.findOneAndUpdate(
            { ip, path },
            {
                $inc: { count: 1 },
                $setOnInsert: { expiresAt }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return result.count <= limit;
    } catch (error) {
        console.error('Rate limit error:', error);
        // Fail open to avoid blocking legitimate users on DB error, or fail closed?
        // Fail open is safer for availability.
        return true;
    }
}
