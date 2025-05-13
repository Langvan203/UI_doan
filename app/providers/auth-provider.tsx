"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, you would call your API to check auth status
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
      // In a real app, you would call your API to authenticate
      // and get a JWT token

      // Mock login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on email
      let mockUser: User

      if (email.includes("admin")) {
        mockUser = {
          id: "1",
          name: "Super Admin",
          email: email,
          role: "SUPER_ADMIN",
        }
      } else if (email.includes("building")) {
        mockUser = {
          id: "2",
          name: "Building Manager",
          email: email,
          role: "BUILDING_MANAGER",
        }
      } else if (email.includes("service")) {
        mockUser = {
          id: "3",
          name: "Service Manager",
          email: email,
          role: "SERVICE_MANAGER",
        }
      } else if (email.includes("finance")) {
        mockUser = {
          id: "4",
          name: "Financial Manager",
          email: email,
          role: "FINANCIAL_MANAGER",
        }
      } else if (email.includes("customer")) {
        mockUser = {
          id: "5",
          name: "Customer Service",
          email: email,
          role: "CUSTOMER_SERVICE",
        }
      } else {
        mockUser = {
          id: "6",
          name: "Nguyễn Văn A",
          email: email,
          role: "TENANT",
        }
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
