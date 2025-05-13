"use client"

import { Building, Building2, Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BuildingDetailed {
  id: number
  tenTN: string
  diaChi: string
  soTangNoi: number
  soTangHam: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
  nganHangThanhToan: string
  soTaiKhoan: string
  noiDungChuyenKhoan: string
  status: string
  constructionYear: number
}

interface BuildingOverviewCardProps {
  building: BuildingDetailed
  onEdit: () => void
  onDelete: () => void
  onSelect: () => void
}

export function BuildingOverviewCard({ building, onEdit, onDelete, onSelect }: BuildingOverviewCardProps) {
  // Hàm để hiển thị badge trạng thái với màu sắc phù hợp
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Đang bảo trì</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{building.tenTN}</CardTitle>
          {getStatusBadge(building.status)}
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {building.diaChi}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Tầng nổi: {building.soTangNoi}</span>
          </div>
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Tầng hầm: {building.soTangHam}</span>
          </div>
          <div className="flex items-center col-span-2">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Năm xây dựng: {building.constructionYear}</span>
          </div>
          <div className="flex items-center col-span-2">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Diện tích xây dựng: {building.dienTichXayDung.toLocaleString()} m²</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="ghost" size="sm" onClick={onSelect}>
          Xem chi tiết
        </Button>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Chỉnh sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa tòa nhà này?")) {
                onDelete()
              }
            }}
          >
            Xóa
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
