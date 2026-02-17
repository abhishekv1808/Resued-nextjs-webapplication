import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// Helper to check payment status with PhonePe (V2 OAuth)
async function checkPhonePeStatus(merchantOrderId: string) {
    const { getAccessToken, getPhonePeUrls } = await import("@/lib/phonepe");
    const { statusUrl } = getPhonePeUrls();

    const accessToken = await getAccessToken();
    if (!accessToken) {
        return { state: "ERROR", message: "Failed to get auth token" };
    }

    const url = statusUrl(merchantOrderId);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `O-Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    return data;
}

// Helper to process successful payment
async function processPayment(merchantOrderId: string, phonePeData: any) {
    await dbConnect();
    const order = await Order.findOne({ phonePeMerchantTransactionId: merchantOrderId });

    if (!order) {
        console.error(`[verify-payment] Order not found for merchantOrderId: ${merchantOrderId}`);
        return { success: false, message: "Order not found" };
    }

    // Idempotency: already paid or beyond
    if (['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(order.status)) {
        return { success: true, message: "Payment already verified", orderId: order._id.toString() };
    }

    // Status guard: only pending orders can be paid
    if (order.status !== 'Pending') {
        return { success: false, message: `Order is already ${order.status}` };
    }

    // Extract payment ID from PhonePe response
    let phonePePaymentId = phonePeData.orderId || '';

    order.status = 'Paid';
    order.phonePePaymentId = phonePePaymentId;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
        status: 'Paid',
        timestamp: new Date(),
        note: 'Payment verified via PhonePe',
        updatedBy: 'system',
    });
    await order.save();

    console.log(`[verify-payment] Order ${order._id} marked as Paid. PhonePe Payment ID: ${phonePePaymentId}`);

    // Auto-tag user based on purchase (non-critical)
    try {
        const categoryTags: string[] = [];
        if (order.products && order.products.length > 0) {
            for (const item of order.products) {
                const cat = item.product?.category?.toLowerCase();
                if (cat) {
                    categoryTags.push(`${cat}_buyer`);
                }
            }
        }

        const totalOrders = await Order.countDocuments({
            user: order.user,
            status: { $in: ['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] }
        });
        const valueTags: string[] = [];
        if (totalOrders >= 3) valueTags.push('repeat_buyer');
        if (order.totalAmount >= 50000) valueTags.push('high_value');

        const allTags = [...new Set([...categoryTags, ...valueTags])];

        if (allTags.length > 0) {
            await User.findByIdAndUpdate(order.user, {
                $addToSet: { tags: { $each: allTags } },
            });
        }
        await User.findByIdAndUpdate(order.user, {
            $pull: { tags: 'new_user' },
        });
    } catch (tagError) {
        console.error('[verify-payment] Auto-tagging failed (non-critical):', tagError);
    }

    // Clear cart from DB (non-critical)
    try {
        await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    } catch (cartError) {
        console.error('[verify-payment] Cart clear failed (non-critical):', cartError);
    }

    // Reduce product stock (non-critical)
    try {
        const Product = (await import("@/models/Product")).default;
        for (const item of order.products) {
            const productId = item.product?._id;
            if (productId) {
                await Product.findByIdAndUpdate(productId, {
                    $inc: { quantity: -item.quantity },
                });
            }
        }
    } catch (stockError) {
        console.error('[verify-payment] Stock update failed (non-critical):', stockError);
    }

    return { success: true, message: "Payment verified successfully", orderId: order._id.toString() };
}

// GET handler - PhonePe redirects user here after payment
export async function GET(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
        const merchantOrderId = req.nextUrl.searchParams.get("merchantOrderId");
        console.log(`[verify-payment] GET called with merchantOrderId: ${merchantOrderId}`);

        if (!merchantOrderId) {
            return NextResponse.redirect(`${baseUrl}/checkout?error=missing_transaction`);
        }

        // Check payment status with PhonePe
        const statusData = await checkPhonePeStatus(merchantOrderId);

        if (statusData.state === "COMPLETED") {
            const result = await processPayment(merchantOrderId, statusData);
            if (result.success) {
                return NextResponse.redirect(
                    `${baseUrl}/payment-success?orderId=${result.orderId}&merchantOrderId=${merchantOrderId}`
                );
            } else {
                return NextResponse.redirect(`${baseUrl}/checkout?error=order_update_failed`);
            }
        } else if (statusData.state === "PENDING") {
            // Payment might still be processing — try to process anyway after a short wait
            // In UAT, completed payments sometimes show PENDING briefly
            // Payment might still be processing
            // We fetch order just to redirect to success page with status=pending

            await dbConnect();
            const order = await Order.findOne({ phonePeMerchantTransactionId: merchantOrderId });

            return NextResponse.redirect(
                `${baseUrl}/payment-success?orderId=${order?._id?.toString() || ''}&merchantOrderId=${merchantOrderId}&status=pending`
            );
        } else if (statusData.state === "FAILED") {
            // Mark order as failed
            try {
                await dbConnect();
                const order = await Order.findOne({ phonePeMerchantTransactionId: merchantOrderId });
                if (order && order.status === 'Pending') {
                    order.status = 'Failed';
                    order.statusHistory.push({
                        status: 'Failed',
                        timestamp: new Date(),
                        note: 'Payment failed on PhonePe',
                        updatedBy: 'system',
                    });
                    await order.save();
                }
            } catch (failError) {
                console.error('[verify-payment] Failed to update order status:', failError);
            }
            return NextResponse.redirect(`${baseUrl}/checkout?error=PAYMENT_FAILED`);
        } else {
            const code = statusData.state || statusData.code || "PAYMENT_ERROR";
            return NextResponse.redirect(`${baseUrl}/checkout?error=${code}`);
        }
    } catch (error: any) {
        console.error("[verify-payment] Payment verification error (GET):", error?.message || error);
        return NextResponse.redirect(`${baseUrl}/checkout?error=verification_failed`);
    }
}

// POST handler - PhonePe webhook server-to-server callback
export async function POST(req: NextRequest) {
    try {
        const merchantOrderId = req.nextUrl.searchParams.get("merchantOrderId");
        console.log(`[verify-payment] POST webhook called with merchantOrderId: ${merchantOrderId}`);

        if (!merchantOrderId) {
            // Try to read from body (webhook payload)
            try {
                const body = await req.json();
                console.log("[verify-payment] Webhook body:", JSON.stringify(body, null, 2));

                if (body.response) {
                    // Start verify checksum
                    const xVerify = req.headers.get("x-verify");
                    // We can verify checksum here if needed, but for now we trust the decoded payload's ID to check status

                    const decoded = Buffer.from(body.response, "base64").toString("utf-8");
                    const parsedData = JSON.parse(decoded);

                    if (parsedData.data && parsedData.data.merchantTransactionId) {
                        const moid = parsedData.data.merchantTransactionId;
                        const statusData = await checkPhonePeStatus(moid);

                        if (statusData.state === "COMPLETED") {
                            const result = await processPayment(moid, statusData);
                            return NextResponse.json(result);
                        }
                    }
                }
            } catch (bodyErr) {
                // Ignore body parse errors
                console.error("Webhook processing error", bodyErr);
            }

            return NextResponse.json({ success: false, message: "Missing merchantOrderId" }, { status: 400 });
        }

        // Verify payment status with PhonePe
        const statusData = await checkPhonePeStatus(merchantOrderId);

        if (statusData.state === "COMPLETED") {
            const result = await processPayment(merchantOrderId, statusData);
            return NextResponse.json(result);
        } else {
            return NextResponse.json({
                success: false,
                message: statusData.message || "Payment not successful",
                state: statusData.state
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("[verify-payment] Payment verification error (POST):", error?.message || error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
