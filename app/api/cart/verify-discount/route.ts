import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ success: false, message: "No code provided" }, { status: 400 });
        }

        const discount = await DiscountCode.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!discount) {
            return NextResponse.json({ success: false, message: "Invalid or inactive discount code" }, { status: 400 });
        }

        // Check expiry
        if (discount.expiryDate && new Date() > discount.expiryDate) {
            return NextResponse.json({ success: false, message: "Discount code has expired" }, { status: 400 });
        }

        // Check usage limit
        if (discount.usageLimit !== undefined && discount.usedCount >= discount.usageLimit) {
            return NextResponse.json({ success: false, message: "Discount code usage limit reached" }, { status: 400 });
        }

        // Check minimum order amount
        if (discount.minOrderAmount && cartTotal < discount.minOrderAmount) {
            return NextResponse.json({
                success: false,
                message: `Minimum order amount of ₹${discount.minOrderAmount} required`
            }, { status: 400 });
        }

        // Calculate discount
        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = Math.round((cartTotal * discount.value) / 100);
        } else {
            discountAmount = discount.value;
        }

        // Ensure discount doesn't exceed total (though unlikely with min order)
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return NextResponse.json({
            success: true,
            discountAmount,
            finalTotal: cartTotal - discountAmount,
            message: "Discount applied successfully"
        });

    } catch (error: unknown) {
        console.error('Discount verification error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
