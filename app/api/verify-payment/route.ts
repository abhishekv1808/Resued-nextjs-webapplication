import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            await dbConnect();
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

            if (order) {
                order.status = 'Paid';
                order.razorpayPaymentId = razorpay_payment_id;
                await order.save();

                // Clear Cart
                const cookieStore = await cookies();
                cookieStore.delete('cart');

                return NextResponse.json({ success: true, message: "Payment verified successfully" });
            } else {
                return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
            }
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
