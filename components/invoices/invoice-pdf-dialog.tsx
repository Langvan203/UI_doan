"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { FileDown, Mail, Printer } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface InvoicePdfDialogProps {
  invoice: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendEmail: () => void
}

export function InvoicePdfDialog({ invoice, open, onOpenChange, onSendEmail }: InvoicePdfDialogProps) {
  const [isLoading, setIsLoading] = useState(true)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      // Simulate PDF generation delay
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsLoading(true)
    }
  }, [open])

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow && pdfContainerRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-id { font-size: 24px; font-weight: bold; }
              .qr-code { text-align: center; margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f8f9fa; }
              .total-row { font-weight: bold; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${pdfContainerRef.current.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF file
    alert("PDF download functionality would be implemented here")
  }

  // Generate payment data for QR code
  const paymentData = JSON.stringify({
    invoiceId: invoice.id,
    amount: invoice.amount,
    resident: invoice.resident,
    dueDate: invoice.dueDate,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hóa đơn PDF</DialogTitle>
          <DialogDescription>Xem mã QR thanh toán</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p>Đang tạo file PDF...</p>
            </div>
          </div>
        ) : (
          <div ref={pdfContainerRef} className="invoice-container space-y-6 rounded-md border p-6">
            <div className="header flex justify-between">
              <div>
                <div className="invoice-id text-2xl font-bold">Hóa đơn: {invoice.id}</div>
                <div className="text-sm text-muted-foreground">Ngày: {new Date().toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">
                  Tới hạn: {new Date(invoice.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">Quản lý hệ thống tòa nhà</div>
                <div className="text-sm">Địa chỉ: </div>
                <div className="text-sm">Đường: </div>
                <div className="text-sm">Số điện thoại</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-md border p-4">
                <div className="mb-2 text-sm font-medium text-muted-foreground">Hóa đơn đến:</div>
                <div className="font-medium">{invoice.resident}</div>
                <div>{invoice.premise}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="mb-2 text-sm font-medium text-muted-foreground">Chi tiết thanh toán:</div>
                <div>
                  Status:{" "}
                  <span
                    className={
                      invoice.status === "paid"
                        ? "text-green-600"
                        : invoice.status === "overdue"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
                <div>Phương thức thanh toán: Chuyển khoản</div>
                <div>Số tài khoản: 3901553564</div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Danh mục</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Mô tả</th>
                    <th className="py-2 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="total-row border-t-2 font-bold">
                    <td className="py-2">Total</td>
                    <td className="py-2 text-right">{formatCurrency(invoice.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="qr-code flex flex-col items-center justify-center">
              <h3 className="mb-2 text-lg font-medium">Quét để thanh toán</h3>
              <div className="rounded-md border p-4">
                <QRCodeSVG value={paymentData} size={150} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Quét mã QR để thanh toán</p>
            </div>

            <div className="footer mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
              <p>Cảm ơn quý khách đã sử dụng dịch vụ </p>
              <p>Nếu có bất cứ vấn đề gì, vui lòng liên hệ bộ phận hỗ trợ</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={isLoading}>
              <Printer className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
              <FileDown className="mr-2 h-4 w-4" />
              Tải xuống PDF
            </Button>
            <Button onClick={onSendEmail} disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              Gửi qua email
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
