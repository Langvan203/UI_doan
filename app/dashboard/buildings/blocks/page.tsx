import type { Metadata } from "next"
import { BlockManagement } from "@/components/buildings/blocks/block-management"

export const metadata: Metadata = {
  title: "Block Management | Building Management System",
  description: "Manage building blocks in the system",
}

export default function BlocksPage() {
  return <BlockManagement />
}
