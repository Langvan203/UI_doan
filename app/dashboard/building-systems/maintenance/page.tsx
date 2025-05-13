import type { Metadata } from "next"
import { MaintenancePlanManagement } from "@/components/building-systems/maintenance-plan-management"

export const metadata: Metadata = {
  title: "Maintenance Plans | Building Management System",
  description: "Manage maintenance plans for building systems",
}

export default function MaintenancePlansPage() {
  return <MaintenancePlanManagement />
}
