import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin-auth';

// GET: List all users with their tags, or search users
export async function GET(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = 20;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'i');
            query.$or = [{ name: regex }, { phone: regex }, { email: regex }];
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('name phone email location tags lastLogin createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        // Get all unique tags across users
        const allTags = await User.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        return NextResponse.json({
            users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            allTags: allTags.map((t: { _id: string; count: number }) => ({ tag: t._id, count: t.count })),
        });
    } catch (error) {
        console.error('Error fetching users for tags:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST: Add or remove tags from users
export async function POST(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await connectDB();
        const body = await req.json();
        const { action, userIds, tags } = body;

        if (!userIds?.length || !tags?.length) {
            return NextResponse.json({ error: 'userIds and tags are required' }, { status: 400 });
        }

        const normalizedTags = tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean);

        if (action === 'remove') {
            await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { tags: { $in: normalizedTags } } }
            );
        } else {
            // Default: add tags
            await User.updateMany(
                { _id: { $in: userIds } },
                { $addToSet: { tags: { $each: normalizedTags } } }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Tags ${action === 'remove' ? 'removed from' : 'added to'} ${userIds.length} user(s)`,
        });
    } catch (error) {
        console.error('Error updating tags:', error);
        return NextResponse.json({ error: 'Failed to update tags' }, { status: 500 });
    }
}
