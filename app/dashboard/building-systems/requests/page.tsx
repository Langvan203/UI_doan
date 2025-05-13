import type { Metadata } from "next"
import { MaintenanceRequestManagement } from "@/components/building-systems/maintenance-request-management"

export const metadata: Metadata = {
  title: "Maintenance Requests | Building Management System",
  description: "Manage maintenance requests from tenants",
}

export default function MaintenanceRequestsPage() {
  return <MaintenanceRequestManagement />
}
