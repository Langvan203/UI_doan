import type { Metadata } from "next"
import { DepartmentManagement } from "@/components/staff/department-management"

export const metadata: Metadata = {
  title: "Department Management | Building Management System",
  description: "Manage departments in the system",
}

export default function DepartmentsPage() {
  return <DepartmentManagement />
}
