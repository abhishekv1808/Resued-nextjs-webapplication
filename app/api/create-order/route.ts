import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Razorpay from "razorpay";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";


export async function POST(req: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        });

        const session = await getIronSession<SessionData>(req, new Response(), sessionOptions);
        if (!session.isLoggedIn || !session.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { address, discountCode } = await req.json();
        const cookieStore = await cookies();
        let cart: any[] = [];
        if (cookieStore.has('cart')) {
            cart = JSON.parse(cookieStore.get('cart')!.value);
        }

        if (cart.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }

        await dbConnect();

        // --- 1. Calculate Base Total ---
        const productIds = cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        let subToal = 0;
        const orderProducts: any[] = [];

        cart.forEach((cartItem: any) => {
            const product = products.find((p: any) => p._id.toString() === cartItem.productId);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                subToal += itemTotal;
                orderProducts.push({
                    product: product,
                    quantity: cartItem.quantity
                });
            }
        });

        // --- 2. Calculate Tax ---
        const tax = Math.round(subToal * 0.18);
        const totalWithTax = subToal + tax;

        // --- 3. Apply Discount ---
        let finalAmount = totalWithTax;
        let discountAmount = 0;
        let appliedDiscountCode = null;

        if (discountCode) {
            const discount = await import("@/models/DiscountCode").then(mod => mod.default.findOne({
                code: discountCode.toUpperCase(),
                isActive: true
            }));

            if (discount) {
                // Re-verify validity
                const isExpired = discount.expiryDate && new Date() > discount.expiryDate;
                const isLimitReached = discount.usageLimit !== undefined && discount.usedCount >= discount.usageLimit;
                const isBelowMinOrder = discount.minOrderAmount && totalWithTax < discount.minOrderAmount;

                if (!isExpired && !isLimitReached && !isBelowMinOrder) {
                    if (discount.type === 'percentage') {
                        discountAmount = Math.round((totalWithTax * discount.value) / 100);
                    } else {
                        discountAmount = discount.value;
                    }

                    // Cap discount at total amount
                    if (discountAmount > totalWithTax) discountAmount = totalWithTax;

                    finalAmount = totalWithTax - discountAmount;
                    appliedDiscountCode = discount.code;

                    // Increment usage count
                    await import("@/models/DiscountCode").then(mod => mod.default.findByIdAndUpdate(discount._id, { $inc: { usedCount: 1 } }));
                }
            }
        }

        // --- 4. Create Razorpay Order ---
        const options = {
            amount: Math.round(finalAmount * 100), // paise
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return NextResponse.json({ success: false, message: "Error creating Razorpay order" }, { status: 500 });
        }

        const newOrder = new Order({
            user: session.user._id,
            products: orderProducts,
            totalAmount: finalAmount,
            razorpayOrderId: order.id,
            address: address || session.user.location || 'Default Address',
            status: 'Pending',
            discountCode: appliedDiscountCode,
            discountAmount: discountAmount > 0 ? discountAmount : undefined
        });

        await newOrder.save();

        return NextResponse.json({
            success: true,
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
