import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAt: Date;
}

const subscriptionSchema: Schema = new Schema({
    endpoint: {
        type: String,
        required: true,
        unique: true,
    },
    keys: {
        p256dh: {
            type: String,
            required: true,
        },
        auth: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription: Model<ISubscription> =
    mongoose.models.Subscription ||
    mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
