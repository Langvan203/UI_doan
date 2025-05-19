import type React from "react"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Header } from "@/components/dashboard/header"
import { getCurrentUser, hasRole } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }
  
  // Determine the primary role for navigation
  let primaryRole = "Cư dân"; // Default role
  if (user.roleName && user.roleName.length > 0) {
    // Prioritize admin roles
    if (user.roleName.includes("Quản lý tòa nhà")) {
      primaryRole = "Quản lý tòa nhà";
    } else {
      primaryRole = user.roleName[0];
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <DashboardNav role={primaryRole} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
