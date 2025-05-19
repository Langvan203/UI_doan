import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/app/providers/language-provider"
import { AuthProvider } from "@/app/providers/auth-provider"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer } from "react-toastify"
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
            <AuthProvider>{children}
              <ToastContainer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
