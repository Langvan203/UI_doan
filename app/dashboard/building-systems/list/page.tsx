import type { Metadata } from "next"
import { BuildingSystemList } from "@/components/building-systems/building-system-list"

export const metadata: Metadata = {
  title: "Systems List | Building Management System",
  description: "View and manage all building systems",
}

export default function BuildingSystemsListPage() {
  return <BuildingSystemList />
}
