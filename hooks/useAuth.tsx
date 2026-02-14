"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useRef, useCallback } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    phone?: string;
    location?: string;
    email?: string;
    address?: string;
    profileImage?: string;
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

    const checkAuth = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/auth/user");
            if (!isMounted.current) return;

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
    }, []);

    useEffect(() => {
        isMounted.current = true;

        // Initial auth check
        checkAuth();

        // Re-check auth when user returns to the tab (detects server-side session loss)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkAuth();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Also re-check periodically (every 5 minutes) to catch stale sessions
        const interval = setInterval(checkAuth, 5 * 60 * 1000);

        return () => {
            isMounted.current = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
        };
    }, [checkAuth]);

    // Axios response interceptor: detect 401 on any API call → clear stale user state
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401 && user) {
                    // Session expired server-side — clear client state immediately
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [user]);

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
