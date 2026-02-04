import mongoose from "mongoose";

const StockAlertSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["PENDING", "NOTIFIED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

// Prevent duplicate alerts for same product/email
StockAlertSchema.index({ productId: 1, email: 1 }, { unique: true });

export default mongoose.models.StockAlert || mongoose.model("StockAlert", StockAlertSchema);
