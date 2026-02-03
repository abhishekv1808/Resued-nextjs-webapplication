import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: {
        product: any; // Using any for Object type from original schema, ideally interface this
        quantity: number;
    }[];
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Failed';
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    address: string;
    discountCode?: string;
    discountAmount?: number;
    createdAt: Date;
}

const orderSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: Object,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    discountCode: {
        type: String,
    },
    discountAmount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
