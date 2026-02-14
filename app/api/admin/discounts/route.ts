import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    await dbConnect();
    try {
        const discounts = await DiscountCode.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, discounts });
    } catch (error: unknown) {
        console.error('Discounts fetch error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    await dbConnect();
    try {
        const body = await req.json();
        const { code, type, value, minOrderAmount, expiryDate, usageLimit } = body;

        // Basic validation
        if (!code || !type || !value) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const existingCode = await DiscountCode.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return NextResponse.json({ success: false, message: "Discount code already exists" }, { status: 400 });
        }

        const newDiscount = await DiscountCode.create({
            code: code.toUpperCase(),
            type,
            value,
            minOrderAmount,
            expiryDate,
            usageLimit,
        });

        return NextResponse.json({ success: true, discount: newDiscount });
    } catch (error: unknown) {
        console.error('Discount create error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
