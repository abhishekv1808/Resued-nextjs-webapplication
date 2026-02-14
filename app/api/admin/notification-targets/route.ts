import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const searchUser = searchParams.get('searchUser');

        // If searching for a specific user
        if (searchUser) {
            const escaped = searchUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'i');
            const users = await User.find({
                $or: [
                    { name: regex },
                    { phone: regex },
                    { email: regex },
                ],
            })
                .select('_id name phone email')
                .limit(10)
                .lean();

            return NextResponse.json({ users });
        }

        // Otherwise return available tags and locations
        const [tagsResult, locationsResult] = await Promise.all([
            User.aggregate([
                { $unwind: '$tags' },
                { $group: { _id: '$tags' } },
                { $sort: { _id: 1 } },
            ]),
            User.aggregate([
                { $match: { location: { $nin: [null, '', 'Not set'] } } },
                { $group: { _id: '$location' } },
                { $sort: { _id: 1 } },
            ]),
        ]);

        const tags = tagsResult.map((t: { _id: string }) => t._id);
        const locations = locationsResult.map((l: { _id: string }) => l._id);

        return NextResponse.json({ tags, locations });
    } catch (error) {
        console.error('Error fetching notification targets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch targeting data' },
            { status: 500 }
        );
    }
}
