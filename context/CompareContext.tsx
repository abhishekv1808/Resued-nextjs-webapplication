"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    mrp: number;
    category: string;
    brand?: string;
    specifications?: any;
}

interface CompareContextType {
    compareList: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    clearCompare: () => void;
    isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareList, setCompareList] = useState<Product[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("simtech_compare");
        if (saved) {
            try {
                setCompareList(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load compare list");
            }
        }
    }, []);

    // Save to localStorage whenever compareList changes
    useEffect(() => {
        localStorage.setItem("simtech_compare", JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product: Product) => {
        // Limit to 3 items
        if (compareList.length >= 3) {
            alert("You can compare up to 3 products at a time.");
            return;
        }
        // Prevent duplicates
        if (compareList.some(p => p._id === product._id)) {
            return;
        }
        setCompareList(prev => [...prev, product]);
    };

    const removeFromCompare = (productId: string) => {
        setCompareList(prev => prev.filter(p => p._id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (productId: string) => {
        return compareList.some(p => p._id === productId);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        // Return safe defaults during SSR or before provider is mounted
        return {
            compareList: [],
            addToCompare: () => { },
            removeFromCompare: () => { },
            clearCompare: () => { },
            isInCompare: () => false,
        };
    }
    return context;
}
