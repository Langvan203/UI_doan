import type { Metadata } from "next"
import { EmployeeList } from "@/components/staff/employees/employee-list"
import { EmployeeFilterForm } from "@/components/staff/employees/employee-filter-form"
import StaffMangementPage from "@/components/staff/page"

export const metadata: Metadata = {
  title: "Staff Management | Building Management System",
  description: "Manage staff members in the system",
}

export default function StaffPage() {
  return <StaffMangementPage />
}
