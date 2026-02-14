import dbConnect from '@/lib/db';
import RateLimit from '@/models/RateLimit';
import { NextRequest } from 'next/server';

// In-memory fallback when DB is unavailable
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

/**
 * Checks if the request has exceeded the rate limit.
 * @param req NextRequest object
 * @param limit Max requests allowed in the window
 * @param windowSeconds Window size in seconds
 * @returns true if request is allowed, false if limit exceeded
 */
export async function rateLimit(req: NextRequest, limit = 5, windowSeconds = 60): Promise<boolean> {
    // Get IP — prefer x-real-ip (set by most reverse proxies), fallback to x-forwarded-for
    let ip = req.headers.get('x-real-ip')
        || req.headers.get('x-forwarded-for')
        || '127.0.0.1';
    if (ip.includes(',')) ip = ip.split(',')[0].trim();

    const path = req.nextUrl.pathname;
    const key = `${ip}:${path}`;

    try {
        await dbConnect();

        const now = new Date();
        const expiresAt = new Date(Date.now() + windowSeconds * 1000);

        // First check if existing record has expired — if so, delete it so $setOnInsert works fresh
        await RateLimit.deleteMany({ ip, path, expiresAt: { $lte: now } });

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
        console.error('Rate limit DB error, using memory fallback:', error);

        // Fail closed with in-memory fallback
        const now = Date.now();
        const entry = memoryStore.get(key);

        if (entry && entry.expiresAt > now) {
            entry.count += 1;
            return entry.count <= limit;
        }

        // New window
        memoryStore.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });

        // Cleanup old entries periodically
        if (memoryStore.size > 1000) {
            for (const [k, v] of memoryStore) {
                if (v.expiresAt <= now) memoryStore.delete(k);
            }
        }

        return true; // first request in new window
    }
}
