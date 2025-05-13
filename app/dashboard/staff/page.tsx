import type { Metadata } from "next"
import { StaffManagement } from "@/components/staff/staff-management"

export const metadata: Metadata = {
  title: "Staff Management | Building Management System",
  description: "Manage staff members in the system",
}

export default function StaffPage() {
  return <StaffManagement />
}
