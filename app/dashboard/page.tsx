import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardSuperAdmin } from "@/components/dashboard/dashboard-super-admin"
import { DashboardBuildingManager } from "@/components/dashboard/dashboard-building-manager"
import { DashboardServiceManager } from "@/components/dashboard/dashboard-service-manager"
import { DashboardFinancialManager } from "@/components/dashboard/dashboard-financial-manager"
import { DashboardCustomerService } from "@/components/dashboard/dashboard-customer-service"
import { DashboardTenant } from "@/components/dashboard/dashboard-tenant"

export const metadata: Metadata = {
  title: "Dashboard | Building Management System",
  description: "Dashboard for the Building Management System",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Render different dashboard based on user role
  switch (user.role) {
    case "SUPER_ADMIN":
      return <DashboardSuperAdmin />
    case "BUILDING_MANAGER":
      return <DashboardBuildingManager />
    case "SERVICE_MANAGER":
      return <DashboardServiceManager />
    case "FINANCIAL_MANAGER":
      return <DashboardFinancialManager />
    case "CUSTOMER_SERVICE":
      return <DashboardCustomerService />
    case "TENANT":
      return <DashboardTenant />
    default:
      return <div>Unknown role</div>
  }
}
