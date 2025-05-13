"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { FileDown, Mail, Printer } from "lucide-react"

interface InvoiceDetailsDialogProps {
  invoice: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailsDialog({ invoice, open, onOpenChange }: InvoiceDetailsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>Detailed information about invoice {invoice.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">{invoice.id}</h3>
              <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>{getStatusBadge(invoice.status)}</div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Resident</h4>
              <p className="font-medium">{invoice.resident}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Premise</h4>
              <p className="font-medium">{invoice.premise}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Invoice Items</h4>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-right text-sm">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="px-4 py-2 text-sm">Total</td>
                    <td className="px-4 py-2 text-right text-sm">{formatCurrency(invoice.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
