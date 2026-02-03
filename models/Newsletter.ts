import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    subscribedAt: Date;
}

const newsletterSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

const Newsletter: Model<INewsletter> =
    mongoose.models.Newsletter ||
    mongoose.model<INewsletter>('Newsletter', newsletterSchema);

export default Newsletter;
