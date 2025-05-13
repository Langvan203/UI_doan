"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Mail, MoreHorizontal, Printer, QrCode, Trash } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { InvoiceDetailsDialog } from "./invoice-details-dialog"
import { InvoicePdfDialog } from "./invoice-pdf-dialog"
import { SendEmailDialog } from "./send-email-dialog"

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-001",
    resident: "John Doe",
    premise: "Block A, Floor 5, Unit 501",
    amount: 1250.75,
    status: "pending",
    dueDate: "2023-06-15",
    items: [
      { name: "Electricity", amount: 450.25 },
      { name: "Water", amount: 320.5 },
      { name: "Maintenance", amount: 480.0 },
    ],
  },
  {
    id: "INV-002",
    resident: "Jane Smith",
    premise: "Block B, Floor 3, Unit 302",
    amount: 980.5,
    status: "paid",
    dueDate: "2023-06-10",
    items: [
      { name: "Electricity", amount: 380.0 },
      { name: "Water", amount: 220.5 },
      { name: "Maintenance", amount: 380.0 },
    ],
  },
  {
    id: "INV-003",
    resident: "Robert Johnson",
    premise: "Block C, Floor 7, Unit 703",
    amount: 1450.0,
    status: "overdue",
    dueDate: "2023-05-30",
    items: [
      { name: "Electricity", amount: 520.0 },
      { name: "Water", amount: 350.0 },
      { name: "Maintenance", amount: 580.0 },
    ],
  },
  {
    id: "INV-004",
    resident: "Emily Davis",
    premise: "Block A, Floor 2, Unit 201",
    amount: 1100.25,
    status: "pending",
    dueDate: "2023-06-20",
    items: [
      { name: "Electricity", amount: 420.25 },
      { name: "Water", amount: 280.0 },
      { name: "Maintenance", amount: 400.0 },
    ],
  },
  {
    id: "INV-005",
    resident: "Michael Wilson",
    premise: "Block D, Floor 4, Unit 405",
    amount: 1320.75,
    status: "paid",
    dueDate: "2023-06-05",
    items: [
      { name: "Electricity", amount: 480.75 },
      { name: "Water", amount: 340.0 },
      { name: "Maintenance", amount: 500.0 },
    ],
  },
]

interface InvoiceListProps {
  status: string
  filters: {
    status: string
    dateRange: string
    building: string
    resident: string
  }
}

export function InvoiceList({ status, filters }: InvoiceListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)

  // Filter invoices based on status and other filters
  const filteredInvoices = mockInvoices.filter((invoice) => {
    if (status !== "all" && invoice.status !== status) return false
    if (filters.resident && !invoice.resident.toLowerCase().includes(filters.resident.toLowerCase())) return false
    return true
  })

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsDetailsOpen(true)
  }

  const handleViewPdf = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsPdfOpen(true)
  }

  const handleSendEmail = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsEmailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Paid
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Resident</TableHead>
            <TableHead>Premise</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.resident}</TableCell>
                <TableCell>{invoice.premise}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewPdf(invoice)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate PDF with QR
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedInvoice && (
        <>
          <InvoiceDetailsDialog invoice={selectedInvoice} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
          <InvoicePdfDialog
            invoice={selectedInvoice}
            open={isPdfOpen}
            onOpenChange={setIsPdfOpen}
            onSendEmail={() => {
              setIsPdfOpen(false)
              setIsEmailOpen(true)
            }}
          />
          <SendEmailDialog invoice={selectedInvoice} open={isEmailOpen} onOpenChange={setIsEmailOpen} />
        </>
      )}
    </div>
  )
}
