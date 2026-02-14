import mongoose, { Schema, Document, Model } from 'mongoose';

// Valid status transitions map
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
    'Pending': ['Paid', 'Cancelled', 'Failed'],
    'Paid': ['Confirmed', 'Cancelled', 'Failed'],
    'Confirmed': ['Processing', 'Cancelled'],
    'Processing': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered', 'Returned'],
    'Delivered': ['Returned'],
    'Cancelled': [],
    'Returned': [],
    'Failed': [],
};

export const ORDER_STATUSES = [
    'Pending', 'Paid', 'Confirmed', 'Processing',
    'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Failed'
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export interface IStatusHistoryEntry {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy: string; // 'system' or admin identifier
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: {
        product: any;
        quantity: number;
    }[];
    totalAmount: number;
    status: OrderStatus;
    statusHistory: IStatusHistoryEntry[];
    phonePeTransactionId: string;
    phonePeMerchantTransactionId: string;
    phonePePaymentId?: string;
    address: string;
    customerName?: string;
    customerPhone?: string;
    trackingId?: string;
    courierName?: string;
    estimatedDelivery?: Date;
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
        enum: ORDER_STATUSES,
        default: 'Pending',
    },
    statusHistory: [
        {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            note: { type: String },
            updatedBy: { type: String, default: 'system' },
        },
    ],
    phonePeTransactionId: {
        type: String,
        required: true,
    },
    phonePeMerchantTransactionId: {
        type: String,
        required: true,
    },
    phonePePaymentId: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
    },
    customerPhone: {
        type: String,
    },
    trackingId: {
        type: String,
    },
    courierName: {
        type: String,
    },
    estimatedDelivery: {
        type: Date,
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

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerName: 'text', customerPhone: 'text' });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
