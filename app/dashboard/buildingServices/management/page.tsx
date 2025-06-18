import type { Metadata } from "next"
import { ServiceManagementMain } from "@/components/buildingServices/service-management-main"

export const metadata: Metadata = {
  title: "Quản lý dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý các loại dịch vụ, dịch vụ, giá cước và đồng hồ đo",
}

export default function ServiceManagementPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">Manage service types, services, rates and meters</p>
      </div>
      <ServiceManagementMain />
    </div>
  )
}
