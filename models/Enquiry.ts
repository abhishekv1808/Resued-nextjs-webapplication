import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Omit<Document, 'model'> {
    name: string;
    phone: string;
    email?: string;
    brand?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    model?: string;
    purpose?: string;
    message?: string;
    date: Date;
}

const enquirySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    brand: {
        type: String,
        required: false,
    },
    processor: {
        type: String,
        required: false,
    },
    ram: {
        type: String,
        required: false,
    },
    storage: {
        type: String,
        required: false,
    },
    model: {
        type: String,
        required: false,
    },
    purpose: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Enquiry: Model<IEnquiry> =
    mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', enquirySchema);

export default Enquiry;
