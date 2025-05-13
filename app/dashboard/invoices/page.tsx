import type { Metadata } from "next"
import { InvoiceManagement } from "@/components/invoices/invoice-management"

export const metadata: Metadata = {
  title: "Invoices | Building Management System",
  description: "Manage invoices for residents in the building management system",
}

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Invoices Management</h1>
      <InvoiceManagement />
    </div>
  )
}
