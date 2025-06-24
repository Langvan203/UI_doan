"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Send } from "lucide-react"
import { GetDSHoaDon } from "../type/invoices"

interface SendEmailDialogProps {
  invoice: GetDSHoaDon
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendEmailDialog({ invoice, open, onOpenChange }: SendEmailDialogProps) {
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState(`Hóa đơn HD-${invoice.maHD.toString().padStart(4, '0')} cho ${invoice.tenKhachHang}`)
  const [message, setMessage] = useState(
    `Kính gửi ${invoice.tenKhachHang},\n\nVui lòng xem hóa đơn đính kèm HD-${invoice.maHD.toString().padStart(4, '0')} cho mặt bằng tại ${invoice.tenTN}, ${invoice.tenTL}, ${invoice.tenKN}. Tổng số tiền cần thanh toán là ${formatVietnameseCurrency(invoice.phaiThu)} và hạn thanh toán là ${new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}.\n\nVui lòng liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào.\n\nTrân trọng,\nBan Quản lý Tòa nhà`
  )
  const [attachPdf, setAttachPdf] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  function formatVietnameseCurrency(amount: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleSendEmail = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement email sending logic
      console.log("Sending email:", {
        recipient,
        subject,
        message,
        attachPdf,
        invoiceId: invoice.maHD
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onOpenChange(false)
      // Show success notification
    } catch (error) {
      console.error("Error sending email:", error)
      // Show error notification
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gửi hóa đơn qua Email
          </DialogTitle>
          <DialogDescription>
            Gửi hóa đơn HD-{invoice.maHD.toString().padStart(4, '0')} cho khách hàng {invoice.tenKhachHang}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Người nhận</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="Nhập địa chỉ email người nhận"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="subject">Tiêu đề</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Nội dung email</Label>
            <Textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="attachPdf"
              checked={attachPdf}
              onCheckedChange={(checked) => setAttachPdf(!!checked)}
            />
            <Label htmlFor="attachPdf">
              Đính kèm file PDF hóa đơn
            </Label>
          </div>

          {/* Invoice Summary */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="font-medium mb-2">Thông tin hóa đơn</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Mã hóa đơn:</span>
                <span className="ml-2 font-medium">HD-{invoice.maHD.toString().padStart(4, '0')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Khách hàng:</span>
                <span className="ml-2 font-medium">{invoice.tenKhachHang}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Vị trí:</span>
                <span className="ml-2 font-medium">{invoice.tenTN}, {invoice.tenTL}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="ml-2 font-medium">{formatVietnameseCurrency(invoice.phaiThu)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hạn thanh toán:</span>
                <span className="ml-2 font-medium">{new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="ml-2 font-medium">{invoice.isThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSendEmail} disabled={!recipient || isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Gửi Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
