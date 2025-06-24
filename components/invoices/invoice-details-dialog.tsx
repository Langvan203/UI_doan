"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDown, Mail, Printer } from "lucide-react"
import { GetDSHoaDon } from "../type/invoices"

interface InvoiceDetailsDialogProps {
  invoice: GetDSHoaDon
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailsDialog({ invoice, open, onOpenChange }: InvoiceDetailsDialogProps) {
  const getStatusBadge = (invoice: GetDSHoaDon) => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const paymentDate = new Date(invoice.ngayThanhToan)

    if (invoice.isThanhToan) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Đã thanh toán
        </Badge>
      )
    } else if (paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear && 
               paymentDate < today) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Hết hạn
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          Chờ thanh toán
        </Badge>
      )
    }
  }

  const formatVietnameseCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hóa đơn HD-{invoice.maHD.toString().padStart(4, '0')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">HD-{invoice.maHD.toString().padStart(4, '0')}</h3>
              <p className="text-sm text-muted-foreground">
                Ngày thanh toán: {new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>{getStatusBadge(invoice)}</div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Khách hàng</h4>
              <p className="font-medium">{invoice.tenKhachHang}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Vị trí</h4>
              <div className="text-sm">
                <p className="font-medium">{invoice.tenTN}, {invoice.tenTL}</p>
                <p className="text-muted-foreground">{invoice.tenKN}, {invoice.maVT}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Tổng phải thu</h4>
              <p className="font-medium text-lg">{formatVietnameseCurrency(invoice.phaiThu)}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Trạng thái thanh toán</h4>
              <p className="font-medium">{invoice.isThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Chi tiết dịch vụ</h4>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Dịch vụ</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Tiền VAT</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Tiền BVMT</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.hoaDonDetails?.map((detail, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-4 py-3 text-sm font-medium">{detail.tenDichVu}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        {formatVietnameseCurrency(detail.tienVAT)}
                        <div className="text-xs text-muted-foreground">
                          ({detail.thueVAT}%)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        {formatVietnameseCurrency(detail.tienBVMT)}
                        <div className="text-xs text-muted-foreground">
                          ({detail.thueBVMT}%)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {formatVietnameseCurrency(detail.thanhTien)}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-sm text-muted-foreground">
                        Không có chi tiết dịch vụ
                      </td>
                    </tr>
                  )}
                  <tr className="bg-muted/50 font-medium border-t-2">
                    <td className="px-4 py-3 text-sm font-bold" colSpan={3}>Tổng cộng</td>
                    <td className="px-4 py-3 text-right text-sm font-bold">
                      {formatVietnameseCurrency(invoice.phaiThu)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Gửi Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
