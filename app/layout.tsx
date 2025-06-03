import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/app/providers/language-provider"
import { AuthProvider } from "@/components/context/AuthContext"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer } from "react-toastify"
import { DepartmentProvider } from "@/components/context/DepartmentContext"
import { BuildingProvider } from "@/components/context/BuildingContext"
import { EmployeeProvider } from "@/components/context/EmployeeContext"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Building Management System",
  description: "A comprehensive building management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <AuthProvider>
              <BuildingProvider>
                <DepartmentProvider>
                  <EmployeeProvider>
                    {children}
                    <ToastContainer />
                  </EmployeeProvider>
                </DepartmentProvider>
              </BuildingProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
