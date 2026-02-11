import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug?: string;
    price: number;
    mrp: number;
    discount: number;
    image?: string;
    images: string[];
    category: 'laptop' | 'desktop' | 'monitor' | 'accessory';
    brand: string;
    rating: number;
    inStock: boolean;
    quantity: number;
    description: string;
    specifications?: {
        processor?: string;
        ram?: string;
        storage?: string;
        display?: string;
        os?: string;
        graphics?: string;
        screenSize?: string;
        refreshRate?: string;
        panelType?: string;
        resolution?: string;
        formFactor?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        mrp: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            // required: true // Make optional for now to allow migration or fallback
        },
        images: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            required: true,
            enum: ['laptop', 'desktop', 'monitor', 'accessory'],
        },
        brand: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        quantity: {
            type: Number,
            default: 10,
        },
        description: {
            type: String,
            default: 'Premium refurbished product with warranty.',
        },
        specifications: {
            processor: String,
            ram: String,
            storage: String,
            display: String,
            os: String,
            graphics: String,
            screenSize: String,
            refreshRate: String,
            panelType: String,
            resolution: String,
            formFactor: String,
        },
    },
    { timestamps: true }
);

// Indexes for performance
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({
    name: 'text',
    brand: 'text',
    description: 'text',
    category: 'text',
});

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
