import mongoose from 'mongoose';

const RateLimitSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    path: { type: String, required: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 } // TTL index
});

// Compound index for efficient lookups
RateLimitSchema.index({ ip: 1, path: 1 });

export default mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema);
