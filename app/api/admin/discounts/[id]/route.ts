import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();

        const updatedDiscount = await DiscountCode.findByIdAndUpdate(id, body, { new: true });

        if (!updatedDiscount) {
            return NextResponse.json({ success: false, message: "Discount code not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, discount: updatedDiscount });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;
        const deletedDiscount = await DiscountCode.findByIdAndDelete(id);

        if (!deletedDiscount) {
            return NextResponse.json({ success: false, message: "Discount code not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Discount code deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
