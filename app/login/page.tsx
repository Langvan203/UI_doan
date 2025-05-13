import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Building Management System",
  description: "Login to the Building Management System",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  )
}
