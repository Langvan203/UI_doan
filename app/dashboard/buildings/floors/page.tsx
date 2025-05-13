import type { Metadata } from "next"
import { FloorManagement } from "@/components/buildings/floors/floor-management"

export const metadata: Metadata = {
  title: "Floor Management | Building Management System",
  description: "Manage building floors in the system",
}

export default function FloorsPage() {
  return <FloorManagement />
}
