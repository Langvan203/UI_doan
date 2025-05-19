"use client"

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface BuildingDetailed {
  id: number
  name: string
  address: string
  occupancyRate: number
  constructionYear: number
  status: string
  soTangHam: number
  soTangNoi: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
  nganHangThanhToan: string
  soTaiKhoan: string
  noiDungChuyenKhoan: string
}

interface BuildingDetailedListProps {
  buildings: BuildingDetailed[]
  onEdit: (building: BuildingDetailed) => void
  onDelete: (building: BuildingDetailed) => void
  onSelect: (building: BuildingDetailed) => void
}

export function BuildingDetailedList({ buildings, onEdit, onDelete, onSelect }: BuildingDetailedListProps) {
  // Hàm để hiển thị badge trạng thái với màu sắc phù hợp
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "Không hoạt động":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "Bảo trì":
        return <Badge className="bg-yellow-500">Đang bảo trì</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Cập nhật bảng để responsive tốt hơn trên điện thoại
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Tên tòa nhà</TableHead>
            <TableHead className="hidden md:table-cell">Địa chỉ</TableHead>
            <TableHead className="hidden sm:table-cell">Tầng nổi</TableHead>
            <TableHead className="hidden sm:table-cell">Tầng hầm</TableHead>
            <TableHead className="hidden lg:table-cell">Diện tích xây dựng (m²)</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Không có dữ liệu tòa nhà
              </TableCell>
            </TableRow>
          ) : (
            buildings.map((building, index) => (
              <TableRow key={building.id} className="cursor-pointer" onClick={() => onSelect(building)}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {building.name}
                  <div className="md:hidden text-xs text-muted-foreground mt-1">{building.address}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{building.address}</TableCell>
                <TableCell className="hidden sm:table-cell">{building.soTangNoi}</TableCell>
                <TableCell className="hidden sm:table-cell">{building.soTangHam}</TableCell>
                <TableCell className="hidden lg:table-cell">{building.dienTichXayDung.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(building.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect(building)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(building)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(building)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
