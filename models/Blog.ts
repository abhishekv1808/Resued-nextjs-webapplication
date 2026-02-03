import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: Date;
}

const blogSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    content: {
        type: String, // Can contain HTML
        required: true,
    },
    image: {
        type: String, // URL to image
        required: true,
    },
    author: {
        type: String,
        default: 'Simtech Team',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Blog: Model<IBlog> =
    mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
