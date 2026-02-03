import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    phone: string;
    location: string;
    email?: string;
    address?: string;
    wishlist: mongoose.Types.ObjectId[];
    cart: { product: mongoose.Types.ObjectId; quantity: number }[];
    createdAt: Date;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    address: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
