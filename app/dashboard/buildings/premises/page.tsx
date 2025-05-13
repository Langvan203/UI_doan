import type { Metadata } from "next"
import { PremiseManagement } from "@/components/buildings/premises/premise-management"

export const metadata: Metadata = {
  title: "Premise Management | Building Management System",
  description: "Manage building premises in the system",
}

export default function PremisesPage() {
  return <PremiseManagement />
}
