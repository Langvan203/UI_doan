import type { Metadata } from "next"
import { ServiceManagement } from "@/components/buildingServices/service-management"

export const metadata: Metadata = {
  title: "Quản lý dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý dịch vụ cho cư dân trong hệ thống quản lý tòa nhà",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h1>
        <p className="text-muted-foreground">Quản lý các loại dịch vụ, dịch vụ và phân công dịch vụ cho cư dân</p>
      </div>
      <ServiceManagement />
    </div>
  )
}
