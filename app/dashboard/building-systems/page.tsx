import type { Metadata } from "next"
import { BuildingSystemManagement } from "@/components/building-systems/building-system-management"

export const metadata: Metadata = {
  title: "Building Systems | Building Management System",
  description: "Manage building systems and maintenance",
}

export default function BuildingSystemsPage() {
  return <BuildingSystemManagement />
}
