"use client";
import { useCart } from "@/context/CartContext";

export default function TestCart() {
    const { cartCount } = useCart();
    return <div>Cart Connection Works! Count: {cartCount}</div>;
}
