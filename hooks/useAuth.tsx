"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    phone: string;
    location: string;
    email?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        async function loadUser() {
            try {
                const { data } = await axios.get("/api/auth/user");
                if (!isMounted.current) return; // Prevent state update if unmounted

                if (data.isLoggedIn) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to load user", error);
                if (!isMounted.current) return;
                setUser(null);
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
            setUser(null);
            window.location.href = "/";
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
