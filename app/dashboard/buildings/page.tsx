import type { Metadata } from "next"
import { BuildingManagement } from "@/components/buildings/building-management"

export const metadata: Metadata = {
  title: "Building Management | Building Management System",
  description: "Manage all buildings in the system",
}

export default function BuildingsPage() {
  return <BuildingManagement />
}
