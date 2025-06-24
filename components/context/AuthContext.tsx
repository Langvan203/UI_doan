"use client"

import { UserLogin } from "@/components/type/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: UserLogin | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    token: string | null;
    hasRole: (role: string) => boolean;     
    hasPermissions: (permission: string) => boolean;
    isLoading: boolean; // Thêm loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const [user, setUser] = useState<UserLogin | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm loading state
    const router = useRouter();

    // Khởi tạo auth state từ localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem("user");
                const storedToken = localStorage.getItem("token");
                
                console.log("Stored user:", storedUser);
                console.log("Stored token:", storedToken ? "exists" : "not found");
                
                if (storedToken && storedUser) {
                    // Kiểm tra token có hết hạn không
                    const decodedToken: any = jwtDecode(storedToken);
                    const currentTime = Date.now() / 1000;
                    
                    if (decodedToken.exp && decodedToken.exp > currentTime) {
                        // Token vẫn còn hạn
                        const userData = JSON.parse(storedUser);
                        console.log("User data:", userData);
                        console.log("User role:", userData.RoleName);
                        setUser(userData);
                    } else {
                        // Token đã hết hạn
                        console.log("Token expired, clearing auth data");
                        clearAuthData();
                    }
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const clearAuthData = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        deleteCookie('user-data');
        deleteCookie('auth-token');
        setUser(null);
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Login failed: ${errorData}`);
            }

            const data: UserLogin = await res.json();
            console.log("Login response:", data);
            console.log("User role from login:", data.RoleName);
            
            // Lưu user data
            setUser(data);
            localStorage.setItem("token", data.AccessToken);
            localStorage.setItem("user", JSON.stringify(data));
            
            // Set cookies
            setCookie('user-data', JSON.stringify(data), {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });
            setCookie('auth-token', data.AccessToken, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });
            
            // Chuyển hướng
            console.log("Redirecting to dashboard...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 100);
            
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        clearAuthData();
        router.push("/login");
    };

    const hasRole = (role: string) => {
        if (!user || !user.RoleName) {
            console.log("No user or role found:", { user: !!user, roleName: user?.RoleName });
            return false;
        }
        
        const hasRoleResult = user.RoleName.includes(role);
        console.log(`Checking role '${role}':`, hasRoleResult, "Available roles:", user.RoleName);
        return hasRoleResult;
    };

    const hasPermissions = (permission: string) => {
        if (!user || !user.Permissions) {
            console.log("No user or permissions found");
            return false;
        }
        return user.Permissions.includes(permission);
    };

    // Debug log khi user state thay đổi
    useEffect(() => {
        console.log("Auth state changed:", {
            isAuthenticated: !!user,
            user: user ? {
                email: user.Email,
                roleName: user.RoleName,
                permissions: user.Permissions
            } : null
        });
    }, [user]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            isAuthenticated: !!user, 
            token: user?.AccessToken || null, 
            hasRole, 
            hasPermissions,
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};