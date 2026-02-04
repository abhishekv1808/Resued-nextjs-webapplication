import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import StockAlert from "@/models/StockAlert";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, productId, phone } = await req.json();

        if (!email || !productId) {
            return NextResponse.json(
                { message: "Email and Product ID are required" },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Check if already subscribed
        const existingAlert = await StockAlert.findOne({ productId, email });
        if (existingAlert) {
            return NextResponse.json(
                { message: "You are already subscribed for alerts on this product." },
                { status: 200 } // Not an error, just info
            );
        }

        // Create alert
        await StockAlert.create({
            productId,
            email,
            phone,
            status: "PENDING"
        });

        return NextResponse.json(
            { message: "Success! We'll notify you when stock arrives." },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Stock Alert Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
