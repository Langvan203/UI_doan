"use client"

import { UserLogin } from "../type/User/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";

interface AuthContextType {
    user: UserLogin | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    token: string | null;
    hasRole: (role: string) => boolean;     
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const [user, setUser] = useState<UserLogin | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data: UserLogin = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setCookie('auth-token', data.accessToken, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });
        
        // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
        router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/login");
    };

    const hasRole = (role: string) => {
        if (!user || !user.roleName) return false;
        return user.roleName.includes(role);
      }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, token: user?.accessToken || null, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};