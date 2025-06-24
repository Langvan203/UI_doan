"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area" // Thêm import ScrollArea
import { Eye, FileDown, Mail, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { GetDSHoaDon, HoaDonPaged } from "../type/invoices"

interface InvoiceListProps {
  invoices: GetDSHoaDon[]
  pagination?: HoaDonPaged
  currentPage: number
  onPageChange: (page: number) => void
  onViewDetails: (invoice: GetDSHoaDon) => void
  onGeneratePdf: (invoice: GetDSHoaDon) => void
  onSendEmail: (invoice: GetDSHoaDon) => void
}

export function InvoiceList({
  invoices,
  pagination,
  currentPage,
  onPageChange,
  onViewDetails,
  onGeneratePdf,
  onSendEmail,
}: InvoiceListProps) {
  
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
    <Card>
      <CardHeader>
        <CardTitle>Danh sách hóa đơn</CardTitle>
        <CardDescription>
          Hiển thị {invoices.length} hóa đơn
          {pagination && ` trong tổng số ${pagination.totalCount} hóa đơn`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có hóa đơn nào</h3>
            <p className="text-muted-foreground">
              Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              {/* Fixed Table Header */}
              <div className="border-b bg-background sticky top-0 z-10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Mã hóa đơn</TableHead>
                      <TableHead className="w-[200px]">Khách hàng</TableHead>
                      <TableHead className="w-[200px]">Vị trí</TableHead>
                      <TableHead className="w-[130px]">Ngày thanh toán</TableHead>
                      <TableHead className="w-[150px] text-right">Số tiền</TableHead>
                      <TableHead className="w-[120px]">Trạng thái</TableHead>
                      <TableHead className="w-[100px] text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Table Body */}
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.maHD}>
                        <TableCell className="w-[120px] font-medium">
                          HD-{invoice.maHD.toString().padStart(4, '0')}
                        </TableCell>
                        <TableCell className="w-[200px]">{invoice.tenKhachHang}</TableCell>
                        <TableCell className="w-[200px]">
                          <div className="text-sm">
                            <div className="font-medium">{invoice.tenTN}</div>
                            <div className="text-muted-foreground">{invoice.tenTL}, {invoice.tenKN}</div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[130px]">
                          {new Date(invoice.ngayThanhToan).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="w-[150px] text-right font-medium">
                          {formatVietnameseCurrency(invoice.phaiThu)}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          {getStatusBadge(invoice)}
                        </TableCell>
                        <TableCell className="w-[100px] text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onGeneratePdf(invoice)}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Tạo PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onSendEmail(invoice)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Gửi Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalCount > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị <span className="font-medium">{((pagination.pageNumber || 1) - 1) * (pagination.pageSize || 10) + 1}</span> đến{" "}
                  <span className="font-medium">
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                  </span>{" "}
                  trong tổng số <span className="font-medium">{pagination.totalCount}</span> hóa đơn
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages || 1) },
                      (_, i) => {
                        const currentPageNumber = pagination.pageNumber || 1;
                        const totalPages = pagination.totalPages || 1;

                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPageNumber <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPageNumber >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPageNumber - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === currentPageNumber ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => onPageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
