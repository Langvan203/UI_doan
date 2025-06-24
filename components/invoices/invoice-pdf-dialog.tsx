"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDown, Printer, Mail } from "lucide-react"
import { GetDSHoaDon } from "../type/invoices"

interface InvoicePdfDialogProps {
  invoice: GetDSHoaDon
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoicePdfDialog({ invoice, open, onOpenChange }: InvoicePdfDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const formatVietnameseCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleGeneratePdf = async () => {
    setIsGenerating(true)
    try {
      // TODO: Implement PDF generation logic
      console.log("Generating PDF for invoice:", invoice.maHD)
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically:
      // 1. Call API to generate PDF
      // 2. Download the generated file
      // 3. Or open in new tab
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    // Generate print-friendly version
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa Đơn Thanh Toán - HD-${invoice.maHD.toString().padStart(4, '0')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            .services-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .services-table th, .services-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .services-table th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN THANH TOÁN</h1>
            <h2>HD-${invoice.maHD.toString().padStart(4, '0')}</h2>
          </div>

          <div class="company-info">
            <h3>CÔNG TY QUẢN LÝ TÒA NHÀ</h3>
            <p>Địa chỉ: [Địa chỉ công ty]</p>
            <p>Điện thoại: [Số điện thoại] | Email: [Email]</p>
          </div>

          <div class="invoice-details">
            <p><strong>Ngày thanh toán:</strong> ${new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái:</strong> ${invoice.isThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          </div>

          <div class="customer-info">
            <h3>THÔNG TIN KHÁCH HÀNG</h3>
            <p><strong>Tên khách hàng:</strong> ${invoice.tenKhachHang}</p>
            <p><strong>Vị trí:</strong> ${invoice.tenTN}, ${invoice.tenTL}, ${invoice.tenKN}</p>
            <p><strong>Mặt bằng:</strong> ${invoice.maVT}</p>
          </div>

          <table class="services-table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Tiền VAT</th>
                <th>Tiền BVMT</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.hoaDonDetails?.map(detail => `
                <tr>
                  <td>${detail.tenDichVu}</td>
                  <td>${formatVietnameseCurrency(detail.tienVAT)} (${detail.thueVAT}%)</td>
                  <td>${formatVietnameseCurrency(detail.tienBVMT)} (${detail.thueBVMT}%)</td>
                  <td>${formatVietnameseCurrency(detail.thanhTien)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">Không có chi tiết dịch vụ</td></tr>'}
              <tr class="total-row">
                <td colspan="3"><strong>TỔNG CỘNG</strong></td>
                <td><strong>${formatVietnameseCurrency(invoice.phaiThu)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p>Vui lòng liên hệ với chúng tôi nếu có bất kỳ thắc mắc nào.</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Tạo PDF Hóa Đơn
          </DialogTitle>
          <DialogDescription>
            Xem trước và tạo file PDF cho hóa đơn HD-{invoice.maHD.toString().padStart(4, '0')}
          </DialogDescription>
        </DialogHeader>

        {/* PDF Preview */}
        <div className="border rounded-lg p-6 bg-white">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold">HÓA ĐƠN THANH TOÁN</h1>
            <h2 className="text-xl">HD-{invoice.maHD.toString().padStart(4, '0')}</h2>
          </div>

          {/* Company Info */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">CÔNG TY QUẢN LÝ TÒA NHÀ</h3>
            <p>Địa chỉ: [Địa chỉ công ty]</p>
            <p>Điện thoại: [Số điện thoại] | Email: [Email]</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p><strong>Ngày thanh toán:</strong> {new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}</p>
              <p>
                <strong>
                  Trạng thái:
                  </strong>
                <Badge className="ml-2" variant={invoice.isThanhToan ? "default" : "secondary"}>
                  {invoice.isThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">THÔNG TIN KHÁCH HÀNG</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Tên khách hàng:</strong> {invoice.tenKhachHang}</p>
                <p><strong>Vị trí:</strong> {invoice.tenTN}, {invoice.tenTL}</p>
              </div>
              <div>
                <p><strong>Khối nhà:</strong> {invoice.tenKN}</p>
                <p><strong>Mặt bằng:</strong> {invoice.maVT}</p>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">CHI TIẾT DỊCH VỤ</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Dịch vụ</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Tiền VAT</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Tiền BVMT</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.hoaDonDetails?.map((detail, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{detail.tenDichVu}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatVietnameseCurrency(detail.tienVAT)}
                      <div className="text-xs text-gray-600">({detail.thueVAT}%)</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatVietnameseCurrency(detail.tienBVMT)}
                      <div className="text-xs text-gray-600">({detail.thueBVMT}%)</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                      {formatVietnameseCurrency(detail.thanhTien)}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      Không có chi tiết dịch vụ
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 px-4 py-2" colSpan={3}>TỔNG CỘNG</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatVietnameseCurrency(invoice.phaiThu)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p>Vui lòng liên hệ với chúng tôi nếu có bất kỳ thắc mắc nào.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Đóng
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={isGenerating}>
            <Printer className="mr-2 h-4 w-4" />
            In hóa đơn
          </Button>
          <Button onClick={handleGeneratePdf} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Đang tạo PDF...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Tạo & Tải PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
