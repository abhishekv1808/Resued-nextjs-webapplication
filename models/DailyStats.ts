import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyStats extends Document {
    date: string;
    views: number;
    sales: number;
}

const dailyStatsSchema: Schema = new Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        unique: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    sales: {
        type: Number,
        default: 0,
    },
});

const DailyStats: Model<IDailyStats> =
    mongoose.models.DailyStats ||
    mongoose.model<IDailyStats>('DailyStats', dailyStatsSchema);

export default DailyStats;
