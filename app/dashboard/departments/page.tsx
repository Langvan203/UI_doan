import DepartmentsPages from "@/components/staff/departments/page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Department Management | Building Management System",
  description: "Manage departments in the system",
}

export default function DepartmentsPage() {
  return <DepartmentsPages />
}
