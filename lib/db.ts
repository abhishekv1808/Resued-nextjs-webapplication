import mongoose from 'mongoose';
import dns from 'dns';

// Configure DNS to use Google's public DNS servers more aggressively
// This helps resolve MongoDB Atlas SRV records which often fail on Windows with default DNS
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// Validate MongoDB URI format
if (MONGODB_URI.includes(';')) {
    throw new Error(
        'Invalid MONGODB_URI: Connection string contains semicolon. Remove any trailing semicolons from .env.local'
    );
}

if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error(
        'Invalid MONGODB_URI: Must start with mongodb:// or mongodb+srv://'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: GlobalMongoose;
}

let cached: GlobalMongoose = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            family: 4, // Force IPv4 DNS resolution
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            retryReads: true,
            heartbeatFrequencyMS: 10000,
        };

        const connectWithRetry = async (retries = 3): Promise<typeof mongoose> => {
            try {
                console.log(`Attempting MongoDB connection... (Retries left: ${retries})`);
                return await mongoose.connect(MONGODB_URI!, opts);
            } catch (error: any) {
                if (retries > 0 && (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv'))) {
                    console.warn(`MongoDB connection failed (DNS/Network), retrying in 2s... Error: ${error.message}`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return connectWithRetry(retries - 1);
                }
                throw error;
            }
        };

        cached.promise = connectWithRetry().then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error after retries:', error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('Failed to establish MongoDB connection:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
