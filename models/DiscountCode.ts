import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscountCode extends Document {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount?: number;
    expiryDate?: Date;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
    createdAt: Date;
}

const discountCodeSchema: Schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    minOrderAmount: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usageLimit: {
        type: Number,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const DiscountCode: Model<IDiscountCode> =
    mongoose.models.DiscountCode || mongoose.model<IDiscountCode>('DiscountCode', discountCodeSchema);

export default DiscountCode;
