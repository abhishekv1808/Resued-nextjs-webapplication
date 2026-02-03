import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password?: string;
}

const adminSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
