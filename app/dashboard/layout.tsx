import type React from "react"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Header } from "@/components/dashboard/header"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <DashboardNav role={user.role} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
