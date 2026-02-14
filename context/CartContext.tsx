"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: string | number; // Handle potential string from API
        image: string;
        slug: string;
        mrp: number; // For discount calc
    };
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    addToCart: (productId: string) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/api/cart');
            if (isMounted.current) {
                setCart(res.data.cart || []);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Failed to fetch cart:", error.response.status, error.response.data);
            } else {
                console.error("Failed to fetch cart", error);
            }
            if (isMounted.current) {
                setCart([]);
            }
        }
    };

    // Fetch cart when user logs in
    useEffect(() => {
        isMounted.current = true;

        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const addToCart = async (productId: string) => {
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            // Optimistic update
            // We can't really do full optimistic update without product details,
            // but we can simulate success after API call or assume it works

            await axios.post('/api/cart', { productId });
            await fetchCart(); // Refresh cart to get full product details

            // Show success toast (optional, can be implemented globally)
            // alert("Added to cart!"); 
        } catch (error) {
            console.error("Error adding to cart", error);
            alert("Failed to add to cart");
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            setCart(prev => prev.filter(item => item.product._id !== productId)); // Optimistic
            await axios.delete(`/api/cart?productId=${productId}`);
            fetchCart(); // Sync to be sure
        } catch (error) {
            console.error("Error removing from cart", error);
            fetchCart(); // Revert on error
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            // Optimistic
            setCart(prev => prev.map(item =>
                item.product._id === productId ? { ...item, quantity } : item
            ));

            await axios.put('/api/cart', { productId, quantity });
        } catch (error) {
            console.error("Error updating quantity", error);
            fetchCart(); // Revert
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        // Return a dummy context to prevent crashes in pages that might not be wrapped (e.g. some admin routes or edge cases)
        if (process.env.NODE_ENV === 'development') {
            console.error("useCart must be used within a CartProvider. Returning dummy context.");
        }
        return {
            cart: [],
            loading: false,
            addToCart: async () => { },
            removeFromCart: async () => { },
            updateQuantity: async () => { },
            cartCount: 0,
            cartTotal: 0
        };
    }
    return context;
}
