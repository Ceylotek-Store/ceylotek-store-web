"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types/auth";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    axios.defaults.withCredentials = true;

    // 1. Check for existing session on load
    useEffect(() => {
        const storedUser = sessionStorage.getItem("ceylotek_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        // 2. Get the Backend URL from .env.local (Should be http://localhost:5000)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        try {
            if (!backendUrl) throw new Error("Backend URL not found");

            // 3. REAL API CALL
            // This sends exactly { "email": "...", "password": "..." }
            const res = await axios.post(`${backendUrl}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const data = res.data;

            // 4. Map the response to your Frontend User Type
            // Based on your previous JSON snippet, the structure is data.user and data.accessToken
            const newUser: User = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                token: data.accessToken,
            };

            // 5. Save to State and Local Storage
            setUser(newUser);
            sessionStorage.setItem("ceylotek_user", JSON.stringify(newUser));
            return true;

        } catch (error) {
            console.error("Login failed:", error);
            // Optional: You could return specific error messages here instead of just false
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // --- REGISTER LOGIC (FIXED) ---
    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        try {
            // 1. Send Register Request
            const res = await axios.post(`${backendUrl}/auth/register`, {
                name,
                email,
                password
            });

            // 2. CAPTURE THE DATA (This was missing before!)
            // Since your backend now sends { user, accessToken }, we use it.
            const data = res.data;

            const newUser: User = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role || 'CUSTOMER',
                token: data.accessToken,
            };

            // 3. SAVE TO STATE (This logs the user in on the frontend)
            setUser(newUser);
            sessionStorage.setItem("ceylotek_user", JSON.stringify(newUser));

            return true;

        } catch (error) {
            console.error("Registration failed:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        try {
            // 1. (NEW) Call Backend Logout Endpoint
            // We must send { withCredentials: true } so the server gets the cookie to invalidate
            await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
            console.log("✅ Server-side logout successful");

        } catch (error) {
            console.error("❌ Server-side logout failed:", error);
            // We continue to clear client state even if server fails, 
            // to ensure the user doesn't feel "stuck".
        } finally {
            // 2. Clear Client State & Storage
            setUser(null);
            sessionStorage.removeItem("ceylotek_user");
            setIsLoading(false);

            // 3. Redirect to home
            // Using window.location.href is good here as it forces a full page reload,
            // which clears any other lingering in-memory application state.
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};