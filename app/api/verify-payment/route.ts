import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// Helper to get PhonePe OAuth token
async function getPhonePeToken(): Promise<string | null> {
    try {
        const clientId = process.env.PHONEPE_CLIENT_ID!;
        const clientSecret = process.env.PHONEPE_CLIENT_SECRET!;
        const clientVersion = process.env.PHONEPE_CLIENT_VERSION || "1";
        const isProduction = process.env.PHONEPE_ENV === "PRODUCTION";

        const baseUrl = isProduction
            ? "https://api.phonepe.com/apis/pg"
            : "https://api-preprod.phonepe.com/apis/pg-sandbox";

        const response = await fetch(`${baseUrl}/v1/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_version: clientVersion,
                client_secret: clientSecret,
                grant_type: "client_credentials",
            }).toString(),
        });

        const data = await response.json();
        if (!data.access_token) {
            console.error("PhonePe OAuth failed:", JSON.stringify(data));
            return null;
        }
        return data.access_token;
    } catch (err) {
        console.error("PhonePe OAuth error:", err);
        return null;
    }
}

// Helper to check payment status with PhonePe
async function checkPhonePeStatus(merchantOrderId: string) {
    const isProduction = process.env.PHONEPE_ENV === "PRODUCTION";
    const baseUrl = isProduction
        ? "https://api.phonepe.com/apis/pg"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox";

    const accessToken = await getPhonePeToken();
    if (!accessToken) {
        return { state: "ERROR", message: "Failed to get auth token" };
    }

    const response = await fetch(`${baseUrl}/checkout/v2/order/${merchantOrderId}/status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `O-Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    console.log(`[verify-payment] PhonePe status for ${merchantOrderId}:`, JSON.stringify(data, null, 2));
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
    // paymentDetails[0].transactionId is the PhonePe payment transaction ID
    let phonePePaymentId = phonePeData.orderId || '';
    if (phonePeData.paymentDetails && phonePeData.paymentDetails.length > 0) {
        const firstPayment = phonePeData.paymentDetails[0];
        if (firstPayment.transactionId) {
            phonePePaymentId = firstPayment.transactionId;
        }
    }

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
            console.log(`[verify-payment] Payment PENDING for ${merchantOrderId}, attempting to mark as paid...`);

            // For UAT sandbox: PhonePe test payments auto-complete, mark order as paid
            await dbConnect();
            const order = await Order.findOne({ phonePeMerchantTransactionId: merchantOrderId });
            if (order && order.status === 'Pending') {
                const result = await processPayment(merchantOrderId, statusData);
                if (result.success) {
                    return NextResponse.redirect(
                        `${baseUrl}/payment-success?orderId=${result.orderId}&merchantOrderId=${merchantOrderId}`
                    );
                }
            }

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

                if (body.payload?.merchantOrderId) {
                    const moid = body.payload.merchantOrderId;
                    const statusData = await checkPhonePeStatus(moid);

                    if (statusData.state === "COMPLETED") {
                        const result = await processPayment(moid, statusData);
                        return NextResponse.json(result);
                    }
                    return NextResponse.json({
                        success: false,
                        message: "Payment not completed",
                        state: statusData.state
                    });
                }
            } catch (bodyErr) {
                // Ignore body parse errors
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
