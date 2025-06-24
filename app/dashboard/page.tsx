import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardSuperAdmin from "@/components/dashboard/dashboard-super-admin"
import { DashboardBuildingManager } from "@/components/dashboard/dashboard-building-manager"
import { DashboardServiceManager } from "@/components/dashboard/dashboard-service-manager"
import { DashboardFinancialManager } from "@/components/dashboard/dashboard-financial-manager"
import { DashboardCustomerService } from "@/components/dashboard/dashboard-customer-service"
import { DashboardTenant } from "@/components/dashboard/dashboard-tenant"
import { PaymentNotificationBell } from  "@/components/invoices/PaymennotificationBell"
export const metadata: Metadata = {
  title: "Dashboard | Building Management System",
  description: "Dashboard for the Building Management System",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // roleName is now an array, so we need to check if it includes specific roles
  // Priority order for dashboard display
  if (user.roleName?.includes("Quản lý tòa nhà")) {
    return <DashboardSuperAdmin />
  } else if (user.roleName?.includes("Kế toán")) {
    return <DashboardFinancialManager />
  } else if (user.roleName?.includes("Nhân viên kỹ thuật")) {
    return <DashboardServiceManager />
  } else if (user.roleName?.includes("Nhân viên tòa nhà")) {
    return <DashboardCustomerService />
  } else if (user.roleName?.includes("Cư dân")) {
    return <DashboardTenant />
  } else {
    // Fallback for unknown roles
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chào mừng đến với Hệ thống Quản lý tòa nhà</h1>
        <p>Vai trò của bạn: {user.roleName?.join(", ")}</p>
      </div>
    )
  }
}
