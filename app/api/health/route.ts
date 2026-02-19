import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            service: 'simtech-webapp'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({ 
            status: 'error', 
            message: 'Database connection failed' 
        }, { status: 503 });
    }
}
