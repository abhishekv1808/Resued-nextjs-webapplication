import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const products = await Product.find({})
            .select('_id name slug image price mrp category brand specifications')
            .lean();

        // Convert _id to string for serialization
        const serializedProducts = products.map(product => ({
            ...product,
            _id: product._id.toString()
        }));

        return NextResponse.json(serializedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
