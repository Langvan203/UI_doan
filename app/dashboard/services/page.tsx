import type { Metadata } from "next"
import { ServiceManagement } from "@/components/services/service-management"

export const metadata: Metadata = {
  title: "Service Management | Building Management System",
  description: "Manage services for residents in the building management system",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">Manage service types, services, and assign services to residents</p>
      </div>
      <ServiceManagement />
    </div>
  )
}
