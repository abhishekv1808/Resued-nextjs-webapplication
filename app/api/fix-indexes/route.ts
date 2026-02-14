import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/admin-auth';

// Utility to fix MongoDB indexes after schema changes — admin only
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        await dbConnect();
        const collection = mongoose.connection.collection('users');

        // Get current indexes
        const indexes = await collection.indexes();
        console.log('[Fix Indexes] Current indexes:', JSON.stringify(indexes, null, 2));

        // Drop the old phone_1 unique index if it exists (non-sparse)
        for (const index of indexes) {
            if (index.key?.phone && index.unique && !index.sparse) {
                console.log('[Fix Indexes] Dropping old phone unique index:', index.name);
                await collection.dropIndex(index.name!);
            }
        }

        // Recreate with sparse: true (allows multiple null values)
        try {
            await collection.createIndex({ phone: 1 }, { unique: true, sparse: true });
            console.log('[Fix Indexes] Created sparse unique phone index');
        } catch (e) {
            console.log('[Fix Indexes] Phone index already exists or error:', e);
        }

        // Create googleId sparse unique index
        try {
            await collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });
            console.log('[Fix Indexes] Created sparse unique googleId index');
        } catch (e) {
            console.log('[Fix Indexes] GoogleId index already exists or error:', e);
        }

        // Create email sparse index
        try {
            await collection.createIndex({ email: 1 }, { sparse: true });
            console.log('[Fix Indexes] Created sparse email index');
        } catch (e) {
            console.log('[Fix Indexes] Email index already exists or error:', e);
        }

        // Get updated indexes
        const updatedIndexes = await collection.indexes();

        return NextResponse.json({
            message: 'Indexes fixed successfully',
            indexes: updatedIndexes,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[Fix Indexes] Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
