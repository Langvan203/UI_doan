
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Đăng nhập | Quản lý tòa nhà chung cư",
  description: "Đăng nhập vào hệ thống quản lý tòa nhà chung cư",
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 z-0" />

      {/* Building silhouette background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-blue-900/10 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[url('/images/buildings-silhouette.png')] bg-bottom bg-repeat-x opacity-20" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Quản lý tòa nhà chung cư</h1>
          <p className="text-blue-700">Hệ thống quản lý hiện đại và tiện lợi</p>
        </div>

        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
