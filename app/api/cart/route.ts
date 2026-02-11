import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

async function getUserFromSession(req: NextRequest) {
    const res = new Response();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (session.isLoggedIn && session.user) {
        return session.user._id;
    }
    return null;
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const userId = await getUserFromSession(req);
        if (!userId) {
            return NextResponse.json({ cart: [] });
        }

        // Fetch user only
        const user = await User.findById(userId).lean();
        if (!user || !user.cart || user.cart.length === 0) {
            return NextResponse.json({ cart: [] });
        }

        // Manual populate: Fetch all products in the cart in one go
        const productIds = user.cart
            .filter((item: any) => item.product)
            .map((item: any) => item.product);

        if (productIds.length === 0) {
            return NextResponse.json({ cart: [] });
        }

        // Fetch product details
        const products = await Product.find({
            _id: { $in: productIds }
        }).lean();

        // Create a map for quick lookup
        const productMap = new Map();
        products.forEach((p: any) => {
            productMap.set(p._id.toString(), p);
        });

        // Reconstruct cart with populated products
        const cart = user.cart
            .map((item: any) => {
                const productId = item.product?.toString();
                return {
                    product: productId ? productMap.get(productId) : null,
                    quantity: item.quantity
                };
            })
            .filter((item: any) => item.product !== null);

        return NextResponse.json({ cart });
    } catch (error: any) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({
            error: error?.message || 'Server error',
            details: error?.toString()
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getUserFromSession(req);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity = 1 } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if item exists in cart
        const existingItemIndex = user.cart.findIndex(
            (item: any) => item.product && item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Increment quantity
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        return NextResponse.json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getUserFromSession(req);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const itemIndex = user.cart.findIndex((item: any) => item.product && item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                user.cart[itemIndex].quantity = quantity;
            } else {
                // If quantity 0, remove it
                user.cart.splice(itemIndex, 1);
            }
            await user.save();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getUserFromSession(req);
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (productId) {
            // Remove specific item
            user.cart = user.cart.filter((item: any) => item.product && item.product.toString() !== productId);
        } else {
            // Clear cart
            user.cart = [];
        }

        await user.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
