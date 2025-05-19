"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AUTH_API } from "@/lib/env"
import { setCookie, deleteCookie } from "cookies-next"
import { toast, Bounce } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface User {
  tenNV: string
  userName: string
  email: string
  sdt: string
  accessToken: string
  roleName: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  getToken: () => string | null
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Sending login request to:", AUTH_API.LOGIN);
      const response = await fetch(AUTH_API.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error("Login failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error('Đăng nhập thất bại');
      }

      const userData = await response.json();
      console.log("Login successful, user data:", userData);
      
      // Ensure userData has the expected structure
      if (!userData.accessToken) {
        throw new Error('Dữ liệu người dùng không hợp lệ');
      }
      
      setUser(userData);
      
      // Store in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store in cookie for server components
      setCookie('auth-token', userData.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
      
      // Store minimal user data in a separate cookie for server components
      const serverUser = {
        tenNV: userData.tenNV,
        userName: userData.userName,
        email: userData.email,
        sdt: userData.sdt,
        roleName: userData.roleName,
      };
      setCookie('user-data', JSON.stringify(serverUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    
    // Clear cookies
    deleteCookie('auth-token');
    deleteCookie('user-data');
    
    // Hiển thị thông báo đăng xuất thành công
    toast.info('Đăng xuất thành công', {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    
    // Chuyển hướng đến trang chủ
    router.push('http://localhost:3000');
  }

  const getToken = () => {
    return user?.accessToken || null
  }

  const hasRole = (role: string) => {
    if (!user || !user.roleName) return false;
    return user.roleName.includes(role);
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, getToken, hasRole }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
