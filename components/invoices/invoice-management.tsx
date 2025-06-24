"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileDown, TrendingUp, TrendingDown, Clock, CheckCircle2 } from "lucide-react"
import { InvoiceFilters } from "./invoice-filters"
import { InvoiceList } from "./invoice-list"
import { InvoiceDetailsDialog } from "./invoice-details-dialog"
import { InvoicePdfDialog } from "./invoice-pdf-dialog"
import { SendEmailDialog } from "./send-email-dialog"
import { useInvoiceContext } from "../context/InvoiceContext"
import { GetDSHoaDon } from "../type/invoices"

export function InvoiceManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoice, setSelectedInvoice] = useState<GetDSHoaDon | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "thisMonth",
    building: "all",
    resident: "",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Đầu tháng
    endDate: new Date(), // Hôm nay
  })

  const { hoaDon, getDanhSachHoaDon } = useInvoiceContext()

  // Fetch data khi component mount và khi filters thay đổi
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      getDanhSachHoaDon(currentPage, filters.startDate, filters.endDate)
    }
  }, [currentPage, filters.startDate, filters.endDate])

  // Tính toán statistics từ dữ liệu thực
  const calculateStats = () => {
    if (!hoaDon?.data || hoaDon.data.length === 0) {
      return {
        total: 0,
        pending: 0,
        paid: 0,
        overdue: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
      }
    }

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const stats = hoaDon.data.reduce((acc, invoice) => {
      acc.total++
      acc.totalAmount += invoice.phaiThu || 0
      
      if (invoice.isThanhToan) {
        acc.paid++
        acc.paidAmount += invoice.phaiThu || 0
      } else {
        // Kiểm tra hết hạn: ngày thanh toán trong hóa đơn của tháng hiện tại đã qua
        const paymentDate = new Date(invoice.ngayThanhToan)
        
        if (paymentDate.getMonth() === currentMonth && 
            paymentDate.getFullYear() === currentYear && 
            paymentDate < today) {
          acc.overdue++
        } else {
          acc.pending++
        }
        acc.pendingAmount += invoice.phaiThu || 0
      }
      
      return acc
    }, { 
      total: 0, 
      pending: 0, 
      paid: 0, 
      overdue: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0
    })

    return stats
  }

  const stats = calculateStats()

  // Filter invoices based on current filters
  const getFilteredInvoices = () => {
    if (!hoaDon?.data) return []

    return hoaDon.data.filter((invoice) => {
      // Status filter
      if (filters.status !== "all") {
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const paymentDate = new Date(invoice.ngayThanhToan)

        switch (filters.status) {
          case "paid":
            if (!invoice.isThanhToan) return false
            break
          case "pending":
            if (invoice.isThanhToan) return false
            if (paymentDate.getMonth() === currentMonth && 
                paymentDate.getFullYear() === currentYear && 
                paymentDate < today) return false
            break
          case "overdue":
            if (invoice.isThanhToan) return false
            if (!(paymentDate.getMonth() === currentMonth && 
                  paymentDate.getFullYear() === currentYear && 
                  paymentDate < today)) return false
            break
        }
      }

      // Resident filter
      if (filters.resident && !invoice.tenKhachHang?.toLowerCase().includes(filters.resident.toLowerCase())) {
        return false
      }

      return true
    })
  }

  const filteredInvoices = getFilteredInvoices()

  const formatVietnameseCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleViewDetails = (invoice: GetDSHoaDon) => {
    setSelectedInvoice(invoice)
    setIsDetailsDialogOpen(true)
  }

  const handleGeneratePdf = (invoice: GetDSHoaDon) => {
    setSelectedInvoice(invoice)
    setIsPdfDialogOpen(true)
  }

  const handleSendEmail = (invoice: GetDSHoaDon) => {
    setSelectedInvoice(invoice)
    setIsEmailDialogOpen(true)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hóa đơn</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các hóa đơn thanh toán của cư dân
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          {/* <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo hóa đơn mới
          </Button> */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatVietnameseCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">
              {formatVietnameseCurrency(stats.paidAmount)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {formatVietnameseCurrency(stats.pendingAmount)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <InvoiceFilters 
        filters={filters} 
        onFiltersChange={handleFilterChange}
      />

      {/* Invoice List */}
      <InvoiceList
        invoices={filteredInvoices}
        pagination={hoaDon}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onGeneratePdf={handleGeneratePdf}
        onSendEmail={handleSendEmail}
      />

      {/* Dialogs */}
      {selectedInvoice && (
        <>
          <InvoiceDetailsDialog
            invoice={selectedInvoice}
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          />
          
          <InvoicePdfDialog
            invoice={selectedInvoice}
            open={isPdfDialogOpen}
            onOpenChange={setIsPdfDialogOpen}
          />
          
          <SendEmailDialog
            invoice={selectedInvoice}
            open={isEmailDialogOpen}
            onOpenChange={setIsEmailDialogOpen}
          />
        </>
      )}
    </div>
  )
}
