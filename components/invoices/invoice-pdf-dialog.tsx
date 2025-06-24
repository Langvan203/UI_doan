"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, Printer, Mail, QrCode, CreditCard, Building2 } from "lucide-react"
import { GetDSHoaDon } from "../type/invoices"
import { BuildingInfo, BankInfo } from "../type/invoices"
import { usePayment } from "../context/PaymentContext"
import { SaveFileDialog } from "../context/SaveFileDialog"
import { toast } from "react-toastify"
import { Label } from "../ui/label"

interface InvoicePdfDialogProps {
  invoice: GetDSHoaDon
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoicePdfDialog({ invoice, open, onOpenChange }: InvoicePdfDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreatingQR, setIsCreatingQR] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [qrCode, setQrCode] = useState<string>("")
  const [paymentLink, setPaymentLink] = useState<string>("")
  const [orderCode, setOrderCode] = useState<string>("")
  const [currentPdfBlob, setCurrentPdfBlob] = useState<Blob | null>(null)
  
  const { createPaymentLink, checkPaymentStatus } = usePayment()

  // Mock building info - thực tế sẽ lấy từ API
  const [buildingInfo] = useState<BuildingInfo>({
    tenCongTy: "CÔNG TY TNHH QUẢN LÝ TÒA NHÀ ABC",
    diaChi: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    dienThoai: "(028) 3123 4567",
    email: "info@toanha-abc.com",
    website: "www.toanha-abc.com",
    maSoThue: "0123456789",
    nguoiDaiDien: "Nguyễn Văn A",
    chucVu: "Giám đốc",
    footer: "Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!"
  })

  const [bankInfo] = useState<BankInfo>({
    tenNganHang: invoice.nganHangThanhToan || "Vietcombank",
    soTaiKhoan: invoice.soTaiKhoan || "1234567890",
    tenTaiKhoan: invoice.tenTaiKhoan || "CONG TY TNHH QUAN LY TOA NHA ABC",
    acqId: invoice.acqId || "970436"
  })

  const formatVietnameseCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleCreateQRCode = async () => {
    setIsCreatingQR(true)
    try {
      const description = `Thanh toan hoa don HD-${invoice.maHD.toString().padStart(4, '0')} - ${invoice.tenKhachHang}`
      
      const paymentInfo = await createPaymentLink(
        invoice.maHD,
        invoice.phaiThu,
        description
      )

      if (paymentInfo) {
        setQrCode(paymentInfo.qrCode)
        setPaymentLink(paymentInfo.checkoutUrl)
        setOrderCode(paymentInfo.orderCode)
        
        toast.success("Tạo mã QR thanh toán thành công!", {
          position: "top-right",
          autoClose: 2000,
        })
      }
    } catch (error) {
      console.error("Error creating QR code:", error)
      toast.error("Lỗi khi tạo mã QR thanh toán", {
        position: "top-right",
        autoClose: 2000,
      })
    } finally {
      setIsCreatingQR(false)
    }
  }

  const generatePDFContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Hóa Đơn Thanh Toán - HD-${invoice.maHD.toString().padStart(4, '0')}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 20px; 
              line-height: 1.4;
              font-size: 14px;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #000; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .company-info { 
              text-align: center; 
              margin-bottom: 30px; 
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              color: #e74c3c;
              margin: 15px 0;
            }
            .invoice-code {
              font-size: 20px;
              font-weight: bold;
              color: #3498db;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              display: inline-block;
              width: 140px;
            }
            .services-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .services-table th, 
            .services-table td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left; 
            }
            .services-table th { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-weight: bold;
              text-align: center;
            }
            .services-table tbody tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .services-table tbody tr:hover {
              background-color: #e3f2fd;
            }
            .total-row { 
              font-weight: bold; 
              background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
              color: white;
            }
            .amount-cell {
              text-align: right;
              font-weight: bold;
            }
            .payment-section {
              background: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .qr-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin: 20px 0;
            }
            .qr-code {
              text-align: center;
              flex: 0 0 200px;
            }
            .qr-code img {
              max-width: 180px;
              max-height: 180px;
              border: 2px solid #3498db;
              border-radius: 8px;
            }
            .payment-info {
              flex: 1;
              margin-left: 30px;
              text-align: left;
            }
            .bank-info {
              background: #e8f5e8;
              padding: 15px;
              border-radius: 5px;
              margin: 10px 0;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .status-badge {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-paid {
              background-color: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .status-pending {
              background-color: #fff3cd;
              color: #856404;
              border: 1px solid #ffeeba;
            }
            .highlight-amount {
              font-size: 18px;
              color: #e74c3c;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-title">HÓA ĐƠN THANH TOÁN</div>
            <div class="invoice-code">HD-${invoice.maHD.toString().padStart(4, '0')}</div>
          </div>

          <div class="company-info">
            <div class="company-name">${buildingInfo.tenCongTy}</div>
            <div><strong>Địa chỉ:</strong> ${buildingInfo.diaChi}</div>
            <div><strong>Điện thoại:</strong> ${buildingInfo.dienThoai} | <strong>Email:</strong> ${buildingInfo.email}</div>
            ${buildingInfo.website ? `<div><strong>Website:</strong> ${buildingInfo.website}</div>` : ''}
            ${buildingInfo.maSoThue ? `<div><strong>Mã số thuế:</strong> ${buildingInfo.maSoThue}</div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">THÔNG TIN HÓA ĐƠN</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Ngày thanh toán:</span>
                  ${new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}
                </div>
                <div class="info-item">
                  <span class="info-label">Trạng thái:</span>
                  <span class="status-badge ${invoice.isThanhToan ? 'status-paid' : 'status-pending'}">
                    ${invoice.isThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Tổng tiền:</span>
                  <span class="highlight-amount">${formatVietnameseCurrency(invoice.phaiThu)}</span>
                </div>
                ${orderCode ? `
                <div class="info-item">
                  <span class="info-label">Mã thanh toán:</span>
                  ${orderCode}
                </div>` : ''}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">THÔNG TIN KHÁCH HÀNG</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Tên khách hàng:</span>
                  ${invoice.tenKhachHang}
                </div>
                <div class="info-item">
                  <span class="info-label">Tòa nhà:</span>
                  ${invoice.tenTN}
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Tầng lầu:</span>
                  ${invoice.tenTL}
                </div>
                <div class="info-item">
                  <span class="info-label">Khối nhà:</span>
                  ${invoice.tenKN}
                </div>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">Mặt bằng:</span>
              ${invoice.maVT}
            </div>
          </div>

          <div class="section">
            <div class="section-title">CHI TIẾT DỊCH VỤ</div>
            <table class="services-table">
              <thead>
                <tr>
                  <th style="width: 40%">Dịch vụ</th>
                  <th style="width: 20%">Tiền VAT</th>
                  <th style="width: 20%">Tiền BVMT</th>
                  <th style="width: 20%">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.hoaDonDetails?.map(detail => `
                  <tr>
                    <td><strong>${detail.tenDichVu}</strong></td>
                    <td class="amount-cell">
                      ${formatVietnameseCurrency(detail.tienVAT)}
                      <div style="font-size: 11px; color: #666;">(${detail.thueVAT}%)</div>
                    </td>
                    <td class="amount-cell">
                      ${formatVietnameseCurrency(detail.tienBVMT)}
                      <div style="font-size: 11px; color: #666;">(${detail.thueBVMT}%)</div>
                    </td>
                    <td class="amount-cell"><strong>${formatVietnameseCurrency(detail.thanhTien)}</strong></td>
                  </tr>
                `).join('') || '<tr><td colspan="4" style="text-align: center; color: #666;">Không có chi tiết dịch vụ</td></tr>'}
                <tr class="total-row">
                  <td colspan="3" style="text-align: center;"><strong>TỔNG CỘNG</strong></td>
                  <td class="amount-cell"><strong>${formatVietnameseCurrency(invoice.phaiThu)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          ${qrCode && !invoice.isThanhToan ? `
          <div class="payment-section">
            <div class="section-title" style="color: #856404; border-bottom-color: #ffc107;">
              THANH TOÁN QUA QR CODE
            </div>
            <div class="qr-container">
              <div class="qr-code">
                <img src="${qrCode}" alt="QR Code thanh toán" />
                <div style="margin-top: 10px; font-weight: bold; color: #3498db;">
                  Quét mã QR để thanh toán
                </div>
              </div>
              <div class="payment-info">
                <div class="bank-info">
                  <div style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">
                    THÔNG TIN CHUYỂN KHOẢN
                  </div>
                  <div class="info-item">
                    <span class="info-label">Ngân hàng:</span>
                    ${bankInfo.tenNganHang}
                  </div>
                  <div class="info-item">
                    <span class="info-label">Số tài khoản:</span>
                    <strong>${bankInfo.soTaiKhoan}</strong>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Tên tài khoản:</span>
                    ${bankInfo.tenTaiKhoan}
                  </div>
                  <div class="info-item">
                    <span class="info-label">Số tiền:</span>
                    <strong style="color: #e74c3c;">${formatVietnameseCurrency(invoice.phaiThu)}</strong>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nội dung CK:</span>
                    <strong>HD${invoice.maHD.toString().padStart(4, '0')} ${invoice.tenKhachHang}</strong>
                  </div>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #d1ecf1; border-radius: 5px;">
                  <div style="font-size: 12px; color: #0c5460;">
                    <strong>Lưu ý:</strong><br>
                    • Vui lòng chuyển khoản đúng số tiền và nội dung<br>
                    • Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận thanh toán<br>
                    • Liên hệ ${buildingInfo.dienThoai} nếu cần hỗ trợ
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${buildingInfo.nguoiDaiDien ? `
          <div style="margin-top: 30px; text-align: right;">
            <div style="display: inline-block; text-align: center; margin-right: 50px;">
              <div style="font-weight: bold; margin-bottom: 60px;">
                ${buildingInfo.chucVu || 'Người đại diện'}
              </div>
              <div style="border-top: 1px solid #000; padding-top: 5px; font-weight: bold;">
                ${buildingInfo.nguoiDaiDien}
              </div>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <div style="font-weight: bold; margin-bottom: 10px;">
              ${buildingInfo.footer || 'Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!'}
            </div>
            <div>
              Hóa đơn này được tạo tự động bởi hệ thống quản lý tòa nhà
            </div>
            <div style="margin-top: 10px; font-size: 11px;">
              Thời gian tạo: ${new Date().toLocaleString('vi-VN')}
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handleGeneratePdf = async () => {
    setIsGenerating(true)
    try {
      const htmlContent = generatePDFContent()
      
      // Tạo PDF từ HTML content
      const blob = await generatePdfFromHtml(htmlContent)
      setCurrentPdfBlob(blob)
      
      // Mở dialog để nhập tên file
      setIsSaveDialogOpen(true)
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Lỗi khi tạo PDF", {
        position: "top-right",
        autoClose: 2000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePdfFromHtml = async (htmlContent: string): Promise<Blob> => {
    // Sử dụng window.print API hoặc thư viện như jsPDF, puppeteer
    // Đây là ví dụ đơn giản tạo blob từ HTML
    return new Promise((resolve) => {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Simulate PDF generation
        setTimeout(() => {
          const blob = new Blob([htmlContent], { type: 'application/pdf' })
          resolve(blob)
          printWindow.close()
        }, 1000)
      }
    })
  }

  const handleSaveFile = async (fileName: string) => {
    if (!currentPdfBlob) return

    try {
      // Tạo URL từ blob và download
      const url = URL.createObjectURL(currentPdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`File ${fileName}.pdf đã được lưu thành công!`, {
        position: "top-right",
        autoClose: 2000,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving file:", error)
      toast.error("Lỗi khi lưu file", {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }

  const handlePrint = () => {
    const htmlContent = generatePDFContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getDefaultFileName = () => {
    const date = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    return `HoaDon_HD-${invoice.maHD.toString().padStart(4, '0')}_${invoice.tenKhachHang.replace(/[^a-zA-Z0-9]/g, '_')}_${date}`
  }

  // Polling để check payment status
  useEffect(() => {
    if (orderCode && !invoice.isThanhToan) {
      const interval = setInterval(async () => {
        const status = await checkPaymentStatus(orderCode)
        if (status === 'PAID') {
          toast.success("Thanh toán thành công! Hóa đơn đã được cập nhật.", {
            position: "top-right",
            autoClose: 3000,
          })
          clearInterval(interval)
          // Refresh invoice data
          window.location.reload()
        }
      }, 10000) // Check every 10 seconds

      return () => clearInterval(interval)
    }
  }, [orderCode, invoice.isThanhToan, checkPaymentStatus])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Tạo PDF Hóa Đơn với QR Thanh Toán
            </DialogTitle>
            <DialogDescription>
              Xem trước và tạo file PDF cho hóa đơn HD-{invoice.maHD.toString().padStart(4, '0')}<br/>
              {!invoice.isThanhToan && "Tạo mã QR để khách hàng có thể thanh toán trực tiếp"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán QR</TabsTrigger>
              <TabsTrigger value="building">Thông tin tòa nhà</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-6 bg-white max-h-[500px] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: generatePDFContent() }} />
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-4">
              <div className="space-y-4">
                {!qrCode && !invoice.isThanhToan ? (
                  <div className="text-center py-8">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Tạo mã QR thanh toán</h3>
                    <p className="text-muted-foreground mb-4">
                      Tạo mã QR để khách hàng có thể thanh toán trực tiếp qua ngân hàng
                    </p>
                    <Button onClick={handleCreateQRCode} disabled={isCreatingQR}>
                      {isCreatingQR ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                          Đang tạo QR...
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Tạo mã QR thanh toán
                        </>
                      )}
                    </Button>
                  </div>
                ) : invoice.isThanhToan ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-green-600 mb-2">Đã thanh toán</h3>
                    <p className="text-muted-foreground">
                      Hóa đơn này đã được thanh toán thành công
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Mã QR thanh toán đã được tạo</h3>
                      {orderCode && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Mã thanh toán: <strong>{orderCode}</strong>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="border rounded-lg p-4">
                        <img src={qrCode} alt="QR Code thanh toán" className="w-48 h-48" />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Thông tin chuyển khoản:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Ngân hàng:</strong> {bankInfo.tenNganHang}</div>
                        <div><strong>Số TK:</strong> {bankInfo.soTaiKhoan}</div>
                        <div><strong>Tên TK:</strong> {bankInfo.tenTaiKhoan}</div>
                        <div><strong>Số tiền:</strong> {formatVietnameseCurrency(invoice.phaiThu)}</div>
                      </div>
                      <div className="mt-2">
                        <strong>Nội dung:</strong> HD{invoice.maHD.toString().padStart(4, '0')} {invoice.tenKhachHang}
                      </div>
                    </div>

                    {paymentLink && (
                      <div className="text-center">
                        <Button variant="outline" asChild>
                          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Mở trang thanh toán
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="building" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Thông tin tòa nhà</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tên công ty</Label>
                    <p className="font-medium">{buildingInfo.tenCongTy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mã số thuế</Label>
                    <p className="font-medium">{buildingInfo.maSoThue}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Địa chỉ</Label>
                    <p className="font-medium">{buildingInfo.diaChi}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Điện thoại</Label>
                    <p className="font-medium">{buildingInfo.dienThoai}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{buildingInfo.email}</p>
                  </div>
                  {buildingInfo.website && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                      <p className="font-medium">{buildingInfo.website}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Người đại diện</Label>
                    <p className="font-medium">{buildingInfo.nguoiDaiDien}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Chức vụ</Label>
                    <p className="font-medium">{buildingInfo.chucVu}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Thông tin ngân hàng thanh toán:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Ngân hàng</Label>
                      <p className="font-medium">{bankInfo.tenNganHang}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Số tài khoản</Label>
                      <p className="font-medium">{bankInfo.soTaiKhoan}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">Tên tài khoản</Label>
                      <p className="font-medium">{bankInfo.tenTaiKhoan}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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

      <SaveFileDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveFile}
        defaultFileName={getDefaultFileName()}
        fileType="pdf"
        title="Lưu hóa đơn PDF"
        description="Nhập tên file để lưu hóa đơn có mã QR thanh toán"
      />
    </>
  )
}