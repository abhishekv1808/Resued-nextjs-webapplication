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
    selectedProductIds: string[];
    setSelectedProductIds: (ids: string[]) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("simtech_compare");
        if (saved) {
            try {
                setSelectedProductIds(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load compare list");
            }
        }
    }, []);

    // Save to localStorage whenever selectedProductIds changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("simtech_compare", JSON.stringify(selectedProductIds));
        }
    }, [selectedProductIds, isMounted]);

    const clearCompare = () => {
        setSelectedProductIds([]);
    };

    return (
        <CompareContext.Provider value={{ selectedProductIds, setSelectedProductIds, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        // Return safe defaults during SSR or before provider is mounted
        return {
            selectedProductIds: [],
            setSelectedProductIds: () => { },
            clearCompare: () => { },
        };
    }
    return context;
}
