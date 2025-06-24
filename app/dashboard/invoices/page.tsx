import type { Metadata } from "next"
import { InvoiceManagement } from "@/components/invoices/invoice-management"

export const metadata: Metadata = {
  title: "Hóa đơn | Quản lý hóa đơn của hệ thống tòa nhà",
  description: "Quản lý hóa đơn của hệ thống tòa nhà",
}

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Quản lý hóa đơn</h1>
      <InvoiceManagement />
    </div>
  )
}
