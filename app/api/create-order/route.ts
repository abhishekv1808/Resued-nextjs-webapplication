import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";


export async function POST(req: NextRequest) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        if (!session.isLoggedIn || !session.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { address, discountCode } = await req.json();

        await dbConnect();

        // Read cart from user's DB document (NOT from cookies)
        const dbUser = await User.findById(session.user._id).populate('cart.product').lean();
        if (!dbUser || !dbUser.cart || dbUser.cart.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }

        // --- 1. Calculate Base Total ---
        // Extract product IDs (handle both populated and unpopulated cart)
        const productIds = dbUser.cart.map((item: any) =>
            item.product?._id || item.product
        );
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        let subTotal = 0;
        const orderProducts: any[] = [];

        for (const cartItem of dbUser.cart as any[]) {
            const cartProductId = (cartItem.product?._id || cartItem.product)?.toString();
            const product = products.find((p: any) => p._id.toString() === cartProductId);
            if (product) {
                if (!product.inStock || product.quantity < cartItem.quantity) {
                    return NextResponse.json({
                        success: false,
                        message: `"${product.name}" is out of stock or has insufficient quantity`
                    }, { status: 400 });
                }
                const itemTotal = product.price * cartItem.quantity;
                subTotal += itemTotal;
                orderProducts.push({
                    product: product,
                    quantity: cartItem.quantity
                });
            }
        }

        if (orderProducts.length === 0) {
            return NextResponse.json({ success: false, message: "No valid products in cart" }, { status: 400 });
        }

        // --- 2. Calculate Tax ---
        const tax = Math.round(subTotal * 0.18);
        const totalWithTax = subTotal + tax;

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

        // --- 4. Create PhonePe Payment (V2 OAuth) ---
        const { getAccessToken, getPhonePeUrls } = await import("@/lib/phonepe");

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                success: false,
                message: "Failed to authenticate with PhonePe (OAuth)",
            }, { status: 500 });
        }

        const merchantOrderId = "ORDER_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

        // Robust Base URL detection for Render/Production
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
            const host = req.headers.get("host");
            const proto = req.headers.get("x-forwarded-proto") || "http";
            baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";
        }
        console.log(`[create-order] Using BaseURL for redirect: ${baseUrl}`);

        const paymentPayload = {
            merchantId: (await import("@/lib/phonepe")).phonePeConfig.clientId,
            merchantOrderId: merchantOrderId,
            amount: Math.round(finalAmount * 100), // paise
            merchantUserId: "MUID_" + (session.user._id).toString().substring(0, 10),
            paymentFlow: {
                type: "PG_CHECKOUT",
                message: `Payment for Order ${merchantOrderId}`,
                merchantUrls: {
                    redirectUrl: `${baseUrl}/api/verify-payment?merchantOrderId=${merchantOrderId}`,
                },
            },
        };

        const { payUrl } = getPhonePeUrls();
        const paymentResponse = await fetch(payUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${accessToken}`,
            },
            body: JSON.stringify(paymentPayload),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentData.redirectUrl) {
            console.error("PhonePe V2 Pay error:", JSON.stringify(paymentData, null, 2));
            const path = (await import("path")).default;
            const fs = (await import("fs")).default;
            const logFile = path.join(process.cwd(), 'phonepe-debug.log');
            const logEntry = `${new Date().toISOString()} - [create-order] V2 Pay Failed:\nResponse: ${JSON.stringify(paymentData, null, 2)}\nPayload: ${JSON.stringify(paymentPayload)}\n\n`;
            try { fs.appendFileSync(logFile, logEntry); } catch (e) { console.error("Failed to write log", e); }

            return NextResponse.json({
                success: false,
                message: paymentData.message || "Error creating PhonePe payment",
            }, { status: 500 });
        }

        const phonePeCheckoutUrl = paymentData.redirectUrl;

        // --- 5. Save Order ---
        const newOrder = new Order({
            user: session.user._id,
            products: orderProducts,
            totalAmount: finalAmount,
            phonePeTransactionId: paymentData.orderId || merchantOrderId,
            phonePeMerchantTransactionId: merchantOrderId,
            address: address || session.user.location || 'Default Address',
            status: 'Pending',
            customerName: session.user.name || '',
            customerPhone: session.user.phone || '',
            statusHistory: [{
                status: 'Pending',
                timestamp: new Date(),
                note: 'Order created',
                updatedBy: 'system',
            }],
            discountCode: appliedDiscountCode,
            discountAmount: discountAmount > 0 ? discountAmount : undefined
        });

        await newOrder.save();

        return NextResponse.json({
            success: true,
            redirectUrl: phonePeCheckoutUrl,
            merchantOrderId: merchantOrderId
        });

    } catch (error: any) {
        console.error("Order creation error:", error?.message || error, error?.stack);
        return NextResponse.json({ success: false, message: error?.message || "Internal Server Error" }, { status: 500 });
    }
}
