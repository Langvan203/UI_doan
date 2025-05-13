"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, LayoutGrid, Plus, Search, User, Users } from "lucide-react"
import { ResidentFilters } from "@/components/residents/resident-filters"
import { ResidentDetail } from "@/components/residents/resident-detail"

// Sample data for buildings, blocks, floors, and residents
export const buildingsData = [
  { id: 1, name: "Sunrise Tower", address: "123 Main St", totalUnits: 120, occupiedUnits: 98 },
  { id: 2, name: "Ocean View", address: "456 Beach Rd", totalUnits: 80, occupiedUnits: 65 },
  { id: 3, name: "Mountain Heights", address: "789 Hill Ave", totalUnits: 150, occupiedUnits: 142 },
]

export const blocksData = [
  { id: 1, buildingId: 1, name: "Block A", totalUnits: 40 },
  { id: 2, buildingId: 1, name: "Block B", totalUnits: 40 },
  { id: 3, buildingId: 1, name: "Block C", totalUnits: 40 },
  { id: 4, buildingId: 2, name: "Block A", totalUnits: 40 },
  { id: 5, buildingId: 2, name: "Block B", totalUnits: 40 },
  { id: 6, buildingId: 3, name: "Block A", totalUnits: 50 },
  { id: 7, buildingId: 3, name: "Block B", totalUnits: 50 },
  { id: 8, buildingId: 3, name: "Block C", totalUnits: 50 },
]

export const floorsData = [
  { id: 1, blockId: 1, number: 1, totalUnits: 10 },
  { id: 2, blockId: 1, number: 2, totalUnits: 10 },
  { id: 3, blockId: 1, number: 3, totalUnits: 10 },
  { id: 4, blockId: 1, number: 4, totalUnits: 10 },
  { id: 5, blockId: 2, number: 1, totalUnits: 10 },
  { id: 6, blockId: 2, number: 2, totalUnits: 10 },
  { id: 7, blockId: 2, number: 3, totalUnits: 10 },
  { id: 8, blockId: 2, number: 4, totalUnits: 10 },
]

export const premisesData = [
  {
    id: 1,
    maVT: "MB001",
    floorId: 1,
    dienTichBG: 75.5,
    dienTichThongThuy: 70.2,
    dienTichTimTuong: 80.0,
    isBanGiao: true,
    soHopDong: "HD001-2023",
    ngayBanGiao: "2023-05-15",
    ngayHetHanChoThue: "2025-05-14",
    maTL: 1,
    maKH: 1,
    maLMB: 1,
    maTrangThai: 1,
    maTN: 1,
  },
  {
    id: 2,
    maVT: "MB002",
    floorId: 1,
    dienTichBG: 60.0,
    dienTichThongThuy: 55.5,
    dienTichTimTuong: 65.0,
    isBanGiao: true,
    soHopDong: "HD002-2023",
    ngayBanGiao: "2023-06-01",
    ngayHetHanChoThue: "2025-06-01",
    maTL: 1,
    maKH: 2,
    maLMB: 1,
    maTrangThai: 1,
    maTN: 1,
  },
  {
    id: 3,
    maVT: "MB003",
    floorId: 2,
    dienTichBG: 90.0,
    dienTichThongThuy: 85.5,
    dienTichTimTuong: 95.0,
    isBanGiao: true,
    soHopDong: "HD003-2023",
    ngayBanGiao: "2023-04-10",
    ngayHetHanChoThue: "2025-04-09",
    maTL: 2,
    maKH: 3,
    maLMB: 2,
    maTrangThai: 1,
    maTN: 1,
  },
  {
    id: 4,
    maVT: "MB004",
    floorId: 5,
    dienTichBG: 120.0,
    dienTichThongThuy: 115.0,
    dienTichTimTuong: 125.0,
    isBanGiao: false,
    soHopDong: "",
    ngayBanGiao: null,
    ngayHetHanChoThue: null,
    maTL: 5,
    maKH: null,
    maLMB: 3,
    maTrangThai: 2,
    maTN: 2,
  },
]

export const electricMetersData = [
  { id: 1, code: "DH001", customerId: 1, lastReading: 1250, currentReading: 1380, unit: "kWh" },
  { id: 2, code: "DH002", customerId: 2, lastReading: 980, currentReading: 1050, unit: "kWh" },
  { id: 3, code: "DH003", customerId: 3, lastReading: 2100, currentReading: 2250, unit: "kWh" },
]

export const waterMetersData = [
  { id: 1, code: "NH001", customerId: 1, lastReading: 45, currentReading: 52, unit: "m³" },
  { id: 2, code: "NH002", customerId: 2, lastReading: 30, currentReading: 35, unit: "m³" },
  { id: 3, code: "NH003", customerId: 3, lastReading: 65, currentReading: 72, unit: "m³" },
]

export const parkingCardsData = [
  { id: 1, cardNumber: "XE001", customerId: 1, vehicleType: "Ô tô", licensePlate: "51A-12345", parkingSpace: "P45" },
  { id: 2, cardNumber: "XE002", customerId: 1, vehicleType: "Xe máy", licensePlate: "59P2-34567", parkingSpace: "M12" },
  { id: 3, cardNumber: "XE003", customerId: 2, vehicleType: "Ô tô", licensePlate: "51G-56789", parkingSpace: "P22" },
  { id: 4, cardNumber: "XE004", customerId: 3, vehicleType: "Ô tô", licensePlate: "51F-98765", parkingSpace: "P33" },
  { id: 5, cardNumber: "XE005", customerId: 3, vehicleType: "Ô tô", licensePlate: "51H-54321", parkingSpace: "P34" },
]

export const maintenanceRequestsData = [
  {
    id: 1,
    customerId: 1,
    date: "2023-05-10",
    type: "Sửa chữa",
    description: "Vòi nước bị rò rỉ trong bếp",
    status: "Đã hoàn thành",
  },
  {
    id: 2,
    customerId: 1,
    date: "2023-06-15",
    type: "Khiếu nại",
    description: "Tiếng ồn từ căn hộ tầng trên",
    status: "Đang xử lý",
  },
  {
    id: 3,
    customerId: 2,
    date: "2023-04-20",
    type: "Sửa chữa",
    description: "Máy lạnh không hoạt động đúng",
    status: "Đã hoàn thành",
  },
  {
    id: 4,
    customerId: 3,
    date: "2023-03-05",
    type: "Cải tạo",
    description: "Yêu cầu cải tạo nhà bếp",
    status: "Đã duyệt",
  },
  {
    id: 5,
    customerId: 3,
    date: "2023-05-22",
    type: "Sửa chữa",
    description: "Máy nước nóng không hoạt động",
    status: "Đã lên lịch",
  },
]

export const servicesUsageData = [
  {
    id: 1,
    customerId: 1,
    serviceType: "Điện",
    month: "04/2023",
    usage: 130,
    unit: "kWh",
    amount: 390000,
    status: "Đã thanh toán",
  },
  {
    id: 2,
    customerId: 1,
    serviceType: "Nước",
    month: "04/2023",
    usage: 7,
    unit: "m³",
    amount: 140000,
    status: "Đã thanh toán",
  },
  {
    id: 3,
    customerId: 1,
    serviceType: "Phí quản lý",
    month: "04/2023",
    usage: 1,
    unit: "tháng",
    amount: 500000,
    status: "Đã thanh toán",
  },
  {
    id: 4,
    customerId: 2,
    serviceType: "Điện",
    month: "04/2023",
    usage: 70,
    unit: "kWh",
    amount: 210000,
    status: "Đã thanh toán",
  },
  {
    id: 5,
    customerId: 2,
    serviceType: "Nước",
    month: "04/2023",
    usage: 5,
    unit: "m³",
    amount: 100000,
    status: "Đã thanh toán",
  },
]

export const residentsData = [
  {
    maKH: 1,
    hoTen: "Nguyễn Văn An",
    cccd: "079123456789",
    ngayCap: "2020-01-15",
    noiCap: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
    gioiTinh: true,
    taiKhoanCuDan: "nguyenvanan",
    matKhauMaHoa: "********",
    dienThoai: "0901234567",
    email: "nguyenvanan@example.com",
    isCaNhan: true,
    maSoThue: "8765432109",
    diaChiThuongTru: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    quocTich: "Việt Nam",
    ctyTen: "",
    soFax: "",
    maTN: 1,
    maKN: 1,
    maTL: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    maKH: 2,
    hoTen: "Trần Thị Bình",
    cccd: "079987654321",
    ngayCap: "2021-03-20",
    noiCap: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
    gioiTinh: false,
    taiKhoanCuDan: "tranthibinh",
    matKhauMaHoa: "********",
    dienThoai: "0912345678",
    email: "tranthibinh@example.com",
    isCaNhan: true,
    maSoThue: "9876543210",
    diaChiThuongTru: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    quocTich: "Việt Nam",
    ctyTen: "",
    soFax: "",
    maTN: 1,
    maKN: 1,
    maTL: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    maKH: 3,
    hoTen: "Công ty TNHH Phát Đạt",
    cccd: "",
    ngayCap: "",
    noiCap: "",
    gioiTinh: true,
    taiKhoanCuDan: "phatdat",
    matKhauMaHoa: "********",
    dienThoai: "0283456789",
    email: "contact@phatdat.com",
    isCaNhan: false,
    maSoThue: "0123456789",
    diaChiThuongTru: "789 Đường Lê Duẩn, Quận 1, TP.HCM",
    quocTich: "Việt Nam",
    ctyTen: "Công ty TNHH Phát Đạt",
    soFax: "0283456790",
    maTN: 1,
    maKN: 2,
    maTL: 5,
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    maKH: 4,
    hoTen: "Lê Văn Cường",
    cccd: "079456789123",
    ngayCap: "2019-05-10",
    noiCap: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
    gioiTinh: true,
    taiKhoanCuDan: "levancuong",
    matKhauMaHoa: "********",
    dienThoai: "0978123456",
    email: "levancuong@example.com",
    isCaNhan: true,
    maSoThue: "7654321098",
    diaChiThuongTru: "101 Đường Điện Biên Phủ, Quận 3, TP.HCM",
    quocTich: "Việt Nam",
    ctyTen: "",
    soFax: "",
    maTN: 2,
    maKN: 4,
    maTL: 9,
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    maKH: 5,
    hoTen: "Công ty Cổ phần Minh Phú",
    cccd: "",
    ngayCap: "",
    noiCap: "",
    gioiTinh: true,
    taiKhoanCuDan: "minhphu",
    matKhauMaHoa: "********",
    dienThoai: "0284567890",
    email: "info@minhphu.com",
    isCaNhan: false,
    maSoThue: "2345678901",
    diaChiThuongTru: "202 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
    quocTich: "Việt Nam",
    ctyTen: "Công ty Cổ phần Minh Phú",
    soFax: "0284567891",
    maTN: 3,
    maKN: 6,
    maTL: 15,
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
]

export function ResidentManagement() {
  const [filters, setFilters] = useState({
    buildingId: "",
    blockId: "",
    floorId: "",
    searchQuery: "",
    status: "",
    type: "",
  })
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get filtered residents
  const filteredResidents = residentsData.filter((resident) => {
    // Apply building filter
    if (filters.buildingId && resident.maTN !== Number.parseInt(filters.buildingId)) {
      return false
    }

    // Apply block filter
    if (filters.blockId && resident.maKN !== Number.parseInt(filters.blockId)) {
      return false
    }

    // Apply floor filter
    if (filters.floorId && resident.maTL !== Number.parseInt(filters.floorId)) {
      return false
    }

    // Apply type filter
    if (filters.type) {
      if (filters.type === "personal" && !resident.isCaNhan) return false
      if (filters.type === "company" && resident.isCaNhan) return false
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        resident.hoTen.toLowerCase().includes(query) ||
        resident.email.toLowerCase().includes(query) ||
        resident.dienThoai.includes(query) ||
        (resident.cccd && resident.cccd.includes(query)) ||
        (resident.maSoThue && resident.maSoThue.includes(query))
      )
    }

    return true
  })

  // Get selected resident
  const selectedResident = selectedResidentId
    ? residentsData.find((resident) => resident.maKH === selectedResidentId)
    : null

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    // Reset dependent filters when parent filter changes
    if (key === "buildingId") {
      setFilters({
        ...filters,
        buildingId: value,
        blockId: "",
        floorId: "",
      })
    } else if (key === "blockId") {
      setFilters({
        ...filters,
        blockId: value,
        floorId: "",
      })
    } else {
      setFilters({
        ...filters,
        [key]: value,
      })
    }
  }

  // Get available blocks based on selected building
  const availableBlocks = filters.buildingId
    ? blocksData.filter((block) => block.buildingId === Number.parseInt(filters.buildingId))
    : []

  // Get available floors based on selected block
  const availableFloors = filters.blockId
    ? floorsData.filter((floor) => floor.blockId === Number.parseInt(filters.blockId))
    : []

  // Get premises for a resident
  const getResidentPremises = (residentId: number) => {
    return premisesData.filter((premise) => premise.maKH === residentId)
  }

  // Get electric meter for a resident
  const getResidentElectricMeter = (residentId: number) => {
    return electricMetersData.find((meter) => meter.customerId === residentId)
  }

  // Get water meter for a resident
  const getResidentWaterMeter = (residentId: number) => {
    return waterMetersData.find((meter) => meter.customerId === residentId)
  }

  // Get parking cards for a resident
  const getResidentParkingCards = (residentId: number) => {
    return parkingCardsData.filter((card) => card.customerId === residentId)
  }

  // Get maintenance requests for a resident
  const getResidentMaintenanceRequests = (residentId: number) => {
    return maintenanceRequestsData.filter((request) => request.customerId === residentId)
  }

  // Get services usage for a resident
  const getResidentServicesUsage = (residentId: number) => {
    return servicesUsageData.filter((service) => service.customerId === residentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      <ResidentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        buildings={buildingsData}
        blocks={availableBlocks}
        floors={availableFloors}
      />

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-12 lg:col-span-7">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>{filteredResidents.length} khách hàng</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {viewMode === "grid" ? (
                        <LayoutGrid className="mr-2 h-4 w-4" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      Chế độ xem
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewMode("grid")}>
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Dạng lưới
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setViewMode("list")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Dạng danh sách
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-8"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                />
              </div>

              {filteredResidents.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredResidents.map((resident) => {
                      // Get building, block, and floor names
                      const building = buildingsData.find((b) => b.id === resident.maTN)
                      const block = blocksData.find((b) => b.id === resident.maKN)
                      const floor = floorsData.find((f) => f.id === resident.maTL)
                      const premises = getResidentPremises(resident.maKH)

                      return (
                        <div
                          key={resident.maKH}
                          className={`cursor-pointer rounded-lg border p-3 sm:p-4 transition-colors hover:bg-accent ${
                            selectedResidentId === resident.maKH ? "border-primary bg-accent" : ""
                          }`}
                          onClick={() => {
                            setSelectedResidentId(resident.maKH)
                            setIsDetailOpen(true)
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                              <AvatarImage src={resident.avatar || "/placeholder.svg"} alt={resident.hoTen} />
                              <AvatarFallback>{resident.hoTen.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{resident.hoTen}</h4>
                                <Badge
                                  variant={resident.isCaNhan ? "default" : "secondary"}
                                  className="capitalize ml-2 shrink-0"
                                >
                                  {resident.isCaNhan ? "Cá nhân" : "Tổ chức"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{resident.email}</p>
                              <p className="text-sm text-muted-foreground truncate">{resident.dienThoai}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {building && (
                                  <Badge variant="outline" className="text-xs">
                                    {building.name}
                                  </Badge>
                                )}
                                {premises.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {premises.length} mặt bằng
                                  </Badge>
                                )}
                                {resident.maSoThue && (
                                  <Badge variant="outline" className="text-xs">
                                    MST: {resident.maSoThue}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-3 font-medium border-b bg-muted/50">
                      <div className="col-span-5">Khách hàng</div>
                      <div className="col-span-3 hidden sm:block">Liên hệ</div>
                      <div className="col-span-2 hidden md:block">Loại</div>
                      <div className="col-span-4 sm:col-span-2">Mặt bằng</div>
                    </div>
                    {filteredResidents.map((resident) => {
                      const premises = getResidentPremises(resident.maKH)

                      return (
                        <div
                          key={resident.maKH}
                          className={`grid grid-cols-12 gap-2 p-3 items-center border-b last:border-0 hover:bg-accent cursor-pointer ${
                            selectedResidentId === resident.maKH ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            setSelectedResidentId(resident.maKH)
                            setIsDetailOpen(true)
                          }}
                        >
                          <div className="col-span-5 flex items-center gap-2">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={resident.avatar || "/placeholder.svg"} alt={resident.hoTen} />
                              <AvatarFallback>{resident.hoTen.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{resident.hoTen}</div>
                              <div className="text-xs text-muted-foreground truncate sm:hidden">
                                {resident.dienThoai}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3 hidden sm:block">
                            <div className="text-sm truncate">{resident.dienThoai}</div>
                            <div className="text-xs text-muted-foreground truncate">{resident.email}</div>
                          </div>
                          <div className="col-span-2 hidden md:block">
                            <Badge variant={resident.isCaNhan ? "default" : "secondary"} className="capitalize">
                              {resident.isCaNhan ? "Cá nhân" : "Tổ chức"}
                            </Badge>
                          </div>
                          <div className="col-span-4 sm:col-span-2 text-right sm:text-center">
                            <Badge variant="outline">{premises.length} mặt bằng</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center px-4">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">Không tìm thấy khách hàng</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() =>
                        setFilters({
                          buildingId: "",
                          blockId: "",
                          floorId: "",
                          searchQuery: "",
                          status: "",
                          type: "",
                        })
                      }
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* On mobile, only show details when a resident is selected */}
        <Card
          className={`md:col-span-12 lg:col-span-5 ${selectedResident && isDetailOpen ? "block" : "hidden lg:block"}`}
        >
          {selectedResident ? (
            <ResidentDetail
              resident={selectedResident}
              isOpen={isDetailOpen}
              onClose={() => {
                setIsDetailOpen(false)
                // On mobile, we might want to go back to the list view
                if (window.innerWidth < 1024) {
                  setSelectedResidentId(null)
                }
              }}
              buildings={buildingsData}
              blocks={blocksData}
              floors={floorsData}
              premises={getResidentPremises(selectedResident.maKH)}
              electricMeter={getResidentElectricMeter(selectedResident.maKH)}
              waterMeter={getResidentWaterMeter(selectedResident.maKH)}
              parkingCards={getResidentParkingCards(selectedResident.maKH)}
              maintenanceRequests={getResidentMaintenanceRequests(selectedResident.maKH)}
              servicesUsage={getResidentServicesUsage(selectedResident.maKH)}
            />
          ) : (
            <div className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>Chi tiết khách hàng</CardTitle>
                <CardDescription>Chọn một khách hàng để xem chi tiết</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Chưa chọn khách hàng</p>
                </div>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
