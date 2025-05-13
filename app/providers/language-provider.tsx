"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (language: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    dashboard: "Dashboard",
    buildings: "Buildings",
    premises: "Premises",
    logout: "Logout",
  },
  vi: {
    welcome: "Xin chào",
    dashboard: "Trang chủ",
    buildings: "Tòa nhà",
    premises: "Mặt bằng",
    logout: "Đăng xuất",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en")

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage) {
      setLanguageState(storedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string) => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
