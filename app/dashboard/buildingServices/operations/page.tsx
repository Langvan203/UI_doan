import type { Metadata } from "next"
import { ServiceOperationsMain } from "@/components/buildingServices/service-operations-main"

export const metadata: Metadata = {
  title: "Service Operations | Building Management System",
  description: "Manage service assignments, approvals and usage tracking",
}

export default function ServiceOperationsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ sử dụng</h1>
        <p className="text-muted-foreground">Quản lý các nhiệm vụ dịch vụ, phê duyệt và theo dõi việc sử dụng</p>
      </div>
      <ServiceOperationsMain />
    </div>
  )
}
