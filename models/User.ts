import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    phone?: string;
    location?: string;
    email?: string;
    address?: string;
    googleId?: string;
    authProvider: 'phone' | 'google' | 'email';
    profileImage?: string;
    wishlist: mongoose.Types.ObjectId[];
    cart: { product: mongoose.Types.ObjectId; quantity: number }[];
    tags: string[];
    lastLogin?: Date;
    createdAt: Date;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
    },
    authProvider: {
        type: String,
        enum: ['phone', 'google', 'email'],
        default: 'phone',
    },
    profileImage: {
        type: String,
        required: false,
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    lastLogin: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ tags: 1 });
userSchema.index({ lastLogin: 1 });

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

