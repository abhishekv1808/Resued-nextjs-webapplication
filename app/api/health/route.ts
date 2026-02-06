import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();

        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        if (dbState === 1) {
            return NextResponse.json({
                status: 'healthy',
                database: {
                    status: 'connected',
                    state: states[dbState as keyof typeof states],
                    host: mongoose.connection.host,
                    name: mongoose.connection.name
                },
                timestamp: new Date().toISOString()
            });
        } else {
            return NextResponse.json({
                status: 'degraded',
                database: {
                    status: 'not fully connected',
                    state: states[dbState as keyof typeof states]
                },
                timestamp: new Date().toISOString()
            }, { status: 503 });
        }
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({
            status: 'unhealthy',
            database: {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
