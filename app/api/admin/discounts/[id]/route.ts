import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";
import { requireAdmin } from '@/lib/admin-auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdmin();
    if (authError) return authError;
    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();
        // Whitelist allowed fields to prevent mass assignment
        const { code, type, value, minOrderAmount, expiryDate, usageLimit, isActive } = body;
        const safeUpdate = { code, type, value, minOrderAmount, expiryDate, usageLimit, isActive };

        const updatedDiscount = await DiscountCode.findByIdAndUpdate(id, safeUpdate, { new: true });

        if (!updatedDiscount) {
            return NextResponse.json({ success: false, message: "Discount code not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, discount: updatedDiscount });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdmin();
    if (authError) return authError;
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
