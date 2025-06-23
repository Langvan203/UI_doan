"use client"

import { addMonths, format } from "date-fns";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CraeteDichVuSuDung } from "../type/serviceUsage"
import {
  Zap,
  Droplets,
  Wifi,
  Car,
  Dumbbell,
  Trash2,
  Edit,
  MoreVertical,
  Plus,
  Building,
  Home,
  Users,
  Gauge,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileX,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useBuilding } from "../context/BuildingContext"
import { useAuth } from "../context/AuthContext"
import { useServicesUsage } from "../context/ServiceUsage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useServices } from "../context/ServicesContext"
import { useResident } from "../context/ResidentContext"
import { useApartment } from "../context/ApartmentContext"

const initialAssignments = [
  { id: 1, residentId: 1, serviceId: 1, meterId: 1, startDate: "2023-01-01", status: "active" },
  { id: 2, residentId: 1, serviceId: 4, meterId: 2, startDate: "2023-01-01", status: "active" },
  { id: 3, residentId: 1, serviceId: 6, meterId: null, startDate: "2023-01-01", status: "active" },
  { id: 4, residentId: 2, serviceId: 1, meterId: 3, startDate: "2023-01-15", status: "active" },
  { id: 5, residentId: 3, serviceId: 1, meterId: 5, startDate: "2023-02-01", status: "active" },
  { id: 6, residentId: 4, serviceId: 2, meterId: 7, startDate: "2023-02-15", status: "active" },
  { id: 7, residentId: 5, serviceId: 1, meterId: 9, startDate: "2023-03-01", status: "active" },
  { id: 8, residentId: 6, serviceId: 1, meterId: null, startDate: "2023-03-15", status: "pending" },
]

// Get unit ID by resident ID
export function ServiceAssignment() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    residentId: 0,
    serviceId: 0,
    meterId: null as number | null,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    buildingId: null as number | null,
    blockId: null as number | null,
    floorId: null as number | null,
    note: "",
  })
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Thêm state cho date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(), // Ngày hiện tại
    endDate: addMonths(new Date(), 1) // Ngày hiện tại + 1 tháng
  });

  // Thêm error state cho validation
  const [dateError, setDateError] = useState("")

  // auth
  const { token } = useAuth();

  const { danhSachDangSuDung, getDanhSachDangSuDung,
    createDichVuSuDung,
    ngungSuDungDichVu,
    tiepTucSuDungDichVu } = useServicesUsage();

  // bộ lọc tòa nhà, khối nhà, tầng lầu
  const { buildingListForDropdown, blockListForDropdown, floorListForDropdown,
    getBlockListForDropdown,
    getBuildingListForDropdown,
    getFloorListForDropdown
  } = useBuilding();


  // bộ lọc dịch vụ
  const { services, fetchServices } = useServices();
  // bộ lọc mặt bằng
  const { matBang, getDSMatBang } = useApartment();
  // get building, block, floor list for dropdown
  useEffect(() => {
    if (token) {
      getBuildingListForDropdown();
      getBlockListForDropdown();
      getFloorListForDropdown();
      // Sử dụng date range khi fetch data
      getDanhSachDangSuDung(1);
      fetchServices()
      getDSMatBang()
    }
  }, [token, dateRange]) // Thêm dateRange vào dependency

  console.log(services)

  // Helper function to get selected resident data
  const getSelectedResidentData = () => {
    if (!newAssignment.residentId) return null
    return matBang.find(r => r.maMB === newAssignment.residentId)
  }

  // Helper function to get selected service data
  const getSelectedServiceData = () => {
    if (!newAssignment.serviceId) return null
    return services.find(s => s.id === newAssignment.serviceId)
  }

  // Validation function
  const isFormValid = () => {
    return newAssignment.buildingId &&
      newAssignment.blockId &&
      newAssignment.floorId &&
      newAssignment.residentId &&
      newAssignment.serviceId &&
      newAssignment.startDate &&
      newAssignment.endDate &&
      new Date(newAssignment.endDate) >= new Date(newAssignment.startDate)
  }

  const handleAddAssignment = async () => {
    if (!newAssignment.buildingId ||
      !newAssignment.blockId ||
      !newAssignment.floorId ||
      !newAssignment.residentId ||
      !newAssignment.serviceId ||
      !newAssignment.startDate ||
      !newAssignment.endDate) {
      return
    }

    try {
      // Find selected resident and service
      const selectedResident = matBang.find(r => r.maMB === newAssignment.residentId)
      const selectedService = services.find(s => s.id === newAssignment.serviceId)

      if (!selectedResident || !selectedService) {
        console.error("Không tìm thấy cư dân hoặc dịch vụ được chọn")
        return
      }

      // Calculate prices
      const donGia = selectedService.donGia || 0
      const tienVAT = Math.round(donGia * (selectedService.tyLeVAT || 0) / 100)
      const tienBVMT = Math.round(donGia * (selectedService.tyLeBVMT || 0) / 100)
      const thanhTien = donGia + tienVAT + tienBVMT

      // Prepare data for API
      const serviceUsageData: CraeteDichVuSuDung = {
        ngayBatDauTinhPhi: new Date(newAssignment.startDate),
        ngayKetThucTinhPhi: new Date(newAssignment.endDate),
        thanhTien: thanhTien,
        ghiChu: newAssignment.note || `Phí sử dụng ${selectedService.tenDV}`,
        tienBVMT: tienBVMT,
        tienVAT: tienVAT,
        maDV: selectedService.id,
        maKH: selectedResident.maKH,
        maMB: selectedResident.maMB,
        maKN: newAssignment.blockId,
        maTL: newAssignment.floorId,
        maTN: newAssignment.buildingId,
      }

      console.log("Data to be sent:", serviceUsageData)

      // Call API
      await createDichVuSuDung(serviceUsageData)

      // Refresh data với date range hiện tại
      getDanhSachDangSuDung(1)

      // Reset form and close dialog
      setNewAssignment({
        residentId: 0,
        serviceId: 0,
        meterId: null,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        buildingId: null,
        blockId: null,
        floorId: null,
        note: "",
      })
      setIsAddDialogOpen(false)

      console.log("Thêm dịch vụ sử dụng thành công!")

    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ sử dụng:", error)
    }
  }

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id))
  }


  const filteredApartments = matBang.filter(
    (resident) =>
      (selectedBuilding === null || resident.maTN === selectedBuilding) &&
      (selectedBlock === null || resident.maKN === selectedBlock) &&
      (selectedFloor === null || resident.maTL === selectedFloor)
  )

  // Filter blocks based on selected building
  const filteredBlocks = blockListForDropdown.filter((block) => selectedBuilding === null || block.maTN === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floorListForDropdown.filter((floor) => selectedBlock === null || floor.maKN === selectedBlock)

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }
  const handlePageChange = (page: number) => {
    getDanhSachDangSuDung(page);
  };

  // Filter assignments based on active tab
  // Filter assignments based on active tab
  const filteredAssignments = danhSachDangSuDung?.data?.filter((assignment) => {
    const matchesSearch =
      (assignment.tenKH?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (assignment.maVT?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesFilters =
      (selectedBuilding === null || assignment.maTN === selectedBuilding) &&
      (selectedBlock === null || assignment.maKN === selectedBlock) &&
      (selectedFloor === null || assignment.maTL === selectedFloor)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "electricity" && assignment.maLDV === 1) ||
      (activeTab === "water" && assignment.maLDV === 2) ||
      (activeTab === "internet" && assignment.maLDV === 3) ||
      (activeTab === "other" && ![1, 2, 3].includes(assignment.maLDV))

    return matchesSearch && matchesFilters && matchesTab
  }) || []


  return (
    <div className="space-y-6 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Yêu cầu đồng hồ đo</AlertTitle>
        <AlertDescription>
          Các dịch vụ điện và nước cần phải được chỉ định một đồng hồ đo. Hãy đảm bảo chọn một đồng hồ đo khi chỉ định
          các dịch vụ này.
        </AlertDescription>
      </Alert>

      {/* Controls Section - Responsive */}
      <div className="flex flex-col gap-4">
        {/* Search and Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Label htmlFor="search" className="text-sm font-medium">
              Tìm kiếm cư dân
            </Label>
            <Input
              id="search"
              placeholder="Nhập tên cư dân hoặc căn hộ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-1">
            <div className="flex-1 min-w-[160px]">
              <Label htmlFor="building" className="text-sm font-medium">
                Tòa nhà
              </Label>
              <Select
                value={selectedBuilding?.toString() || "0"}
                onValueChange={(value) => {
                  if (value === "0") {
                    setSelectedBuilding(null)
                  } else {
                    setSelectedBuilding(value ? Number.parseInt(value) : null)
                  }
                  setSelectedBlock(null)
                  setSelectedFloor(null)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tất cả tòa nhà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả tòa nhà</SelectItem>
                  {buildingListForDropdown.map((building) => (
                    <SelectItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[160px]">
              <Label htmlFor="block" className="text-sm font-medium">
                Khối nhà
              </Label>
              <Select
                value={selectedBlock?.toString() || "0"}
                onValueChange={(value) => {
                  setSelectedBlock(value === "0" ? null : Number.parseInt(value))
                  setSelectedFloor(null)
                }}
                disabled={selectedBuilding === null}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tất cả khối nhà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả khối nhà</SelectItem>
                  {filteredBlocks.map((block) => (
                    <SelectItem key={block.maKN} value={block.maKN.toString()}>
                      {block.tenKN}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[160px]">
              <Label htmlFor="floor" className="text-sm font-medium">
                Tầng lầu
              </Label>
              <Select
                value={selectedFloor?.toString() || "0"}
                onValueChange={(value) => setSelectedFloor(value === "0" ? null : Number.parseInt(value))}
                disabled={selectedBlock === null}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tất cả tầng lầu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả tầng lầu</SelectItem>
                  {filteredFloors.map((floor) => (
                    <SelectItem key={floor.maTL} value={floor.maTL.toString()}>
                      {floor.tenTL}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Button */}
          <div className="lg:flex-shrink-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Thêm dịch vụ</span>
                  <span className="sm:hidden">Thêm</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm dịch vụ sử dụng cho cư dân</DialogTitle>
                  <DialogDescription>Thêm một dịch vụ cho cư dân trong tòa nhà</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Row 1: Building, Block, Floor */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dialogBuilding">Tòa nhà *</Label>
                      <Select
                        value={newAssignment.buildingId?.toString() || ""}
                        onValueChange={(value) => {
                          const buildingId = value ? Number.parseInt(value) : null
                          setNewAssignment({
                            ...newAssignment,
                            buildingId,
                            blockId: null,
                            floorId: null,
                            residentId: 0,
                          })
                        }}
                      >
                        <SelectTrigger id="dialogBuilding">
                          <SelectValue placeholder="Chọn tòa nhà" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingListForDropdown.map((building) => (
                            <SelectItem key={building.id} value={building.id.toString()}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="dialogBlock">Khối nhà *</Label>
                      <Select
                        value={newAssignment.blockId?.toString() || ""}
                        onValueChange={(value) => {
                          const blockId = value ? Number.parseInt(value) : null
                          setNewAssignment({
                            ...newAssignment,
                            blockId,
                            floorId: null,
                            residentId: 0,
                          })
                        }}
                        disabled={!newAssignment.buildingId}
                      >
                        <SelectTrigger id="dialogBlock">
                          <SelectValue placeholder="Chọn khối nhà" />
                        </SelectTrigger>
                        <SelectContent>
                          {blockListForDropdown
                            .filter(block => newAssignment.buildingId === null || block.maTN === newAssignment.buildingId)
                            .map((block) => (
                              <SelectItem key={block.maKN} value={block.maKN.toString()}>
                                {block.tenKN}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="dialogFloor">Tầng lầu *</Label>
                      <Select
                        value={newAssignment.floorId?.toString() || ""}
                        onValueChange={(value) => {
                          const floorId = value ? Number.parseInt(value) : null
                          setNewAssignment({
                            ...newAssignment,
                            floorId,
                            residentId: 0,
                          })
                        }}
                        disabled={!newAssignment.blockId}
                      >
                        <SelectTrigger id="dialogFloor">
                          <SelectValue placeholder="Chọn tầng lầu" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorListForDropdown
                            .filter(floor => newAssignment.blockId === null || floor.maKN === newAssignment.blockId)
                            .map((floor) => (
                              <SelectItem key={floor.maTL} value={floor.maTL.toString()}>
                                {floor.tenTL}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Resident */}
                  <div className="grid gap-2">
                    <Label htmlFor="resident">Khách hàng *</Label>
                    <Select
                      value={newAssignment.residentId ? newAssignment.residentId.toString() : ""}
                      onValueChange={(value) => {
                        const residentId = Number.parseInt(value)
                        setNewAssignment({
                          ...newAssignment,
                          residentId,
                        })
                      }}
                      disabled={!newAssignment.floorId}
                    >
                      <SelectTrigger id="resident">
                        <SelectValue placeholder="Chọn khách hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {matBang
                          .filter(resident =>
                            (newAssignment.buildingId === null || resident.maTN === newAssignment.buildingId) &&
                            (newAssignment.blockId === null || resident.maKN === newAssignment.blockId) &&
                            (newAssignment.floorId === null || resident.maTL === newAssignment.floorId)
                          )
                          .map((resident) => (
                            <SelectItem key={resident.maMB} value={resident.maMB.toString()}>
                              {resident.maVT} - {resident.tenKH}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Row 3: Service */}
                  <div className="grid gap-2">
                    <Label htmlFor="service">Dịch vụ *</Label>
                    <Select
                      value={newAssignment.serviceId ? newAssignment.serviceId.toString() : ""}
                      onValueChange={(value) => {
                        const serviceId = Number.parseInt(value)
                        setNewAssignment({
                          ...newAssignment,
                          serviceId,
                        })
                      }}
                    >
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{service.tenDV}</span>
                              <span className="text-sm text-muted-foreground">
                                Đơn giá: {formatPrice(service.donGia)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Price Summary */}
                  {newAssignment.serviceId > 0 && (() => {
                    const selectedService = services.find(s => s.id === newAssignment.serviceId)
                    if (!selectedService) return null

                    const donGia = selectedService.donGia || 0
                    const tienVAT = Math.round(donGia * (selectedService.tyLeVAT || 0) / 100)
                    const tienBVMT = Math.round(donGia * (selectedService.tyLeBVMT || 0) / 100)
                    const thanhTien = donGia + tienVAT + tienBVMT

                    return (
                      <div className="grid gap-2">
                        <Label>Chi tiết giá dịch vụ</Label>
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>Đơn giá:</span>
                              <span className="font-medium">{formatPrice(donGia)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>VAT ({selectedService.tyLeVAT || 0}%):</span>
                              <span className="font-medium">{formatPrice(tienVAT)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>BVMT ({selectedService.tyLeBVMT || 0}%):</span>
                              <span className="font-medium">{formatPrice(tienBVMT)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-semibold text-base">
                              <span>Thành tiền:</span>
                              <span className="text-primary">{formatPrice(thanhTien)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Row 4: Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newAssignment.startDate}
                        onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">Ngày kết thúc *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newAssignment.endDate}
                        onChange={(e) => setNewAssignment({ ...newAssignment, endDate: e.target.value })}
                        min={newAssignment.startDate}
                      />
                    </div>
                  </div>

                  {/* Row 5: Note */}
                  <div className="grid gap-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Input
                      id="note"
                      placeholder="Nhập ghi chú (tùy chọn)"
                      value={newAssignment.note}
                      onChange={(e) => setNewAssignment({ ...newAssignment, note: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false)
                    // Reset form
                    setNewAssignment({
                      residentId: 0,
                      serviceId: 0,
                      meterId: null,
                      startDate: new Date().toISOString().split("T")[0],
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      buildingId: null,
                      blockId: null,
                      floorId: null,
                      note: "",
                    })
                  }}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddAssignment}
                    disabled={
                      !newAssignment.buildingId ||
                      !newAssignment.blockId ||
                      !newAssignment.floorId ||
                      !newAssignment.residentId ||
                      !newAssignment.serviceId ||
                      !newAssignment.startDate ||
                      !newAssignment.endDate
                    }
                  >
                    Thêm dịch vụ sử dụng
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-max">
            <TabsTrigger value="all" className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Tất cả</span>
              <Badge variant="secondary" className="text-xs">
                {danhSachDangSuDung?.totalCount || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="electricity" className="flex items-center gap-2 text-xs sm:text-sm">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              <span className="hidden sm:inline">Điện</span>
              <span className="sm:hidden">⚡</span>
              <Badge variant="secondary" className="text-xs">
                {danhSachDangSuDung?.data?.filter(a => a.maLDV === 1).length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-2 text-xs sm:text-sm">
              <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="hidden sm:inline">Nước</span>
              <span className="sm:hidden">💧</span>
              <Badge variant="secondary" className="text-xs">
                {danhSachDangSuDung?.data?.filter(a => a.maLDV === 2).length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="internet" className="flex items-center gap-2 text-xs sm:text-sm">
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              <span className="hidden sm:inline">Internet</span>
              <span className="sm:hidden">📶</span>
              <Badge variant="secondary" className="text-xs">
                {danhSachDangSuDung?.data?.filter(a => a.maLDV === 3).length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Khác</span>
              <Badge variant="secondary" className="text-xs">
                {danhSachDangSuDung?.data?.filter(a => ![1, 2, 3].includes(a.maLDV)).length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách dịch vụ đang sử dụng</CardTitle>
          <CardDescription>
            Quản lý các dịch vụ được cung cấp cho cư dân ({danhSachDangSuDung?.totalCount || 0} dịch vụ)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {(filteredAssignments ?? []).length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              {/* Desktop Table */}
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="border rounded-lg overflow-hidden">
                  {/* Fixed Header */}
                  <div className="border-b bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Cư dân</TableHead>
                          <TableHead className="w-[90px]">Vị trí</TableHead>
                          <TableHead className="w-[180px]">Dịch vụ</TableHead>
                          <TableHead className="w-[130px]">Ngày bắt đầu</TableHead>
                          <TableHead className="w-[130px]">Ngày đến hạn</TableHead>
                          <TableHead className="w-[120px]">Trạng thái</TableHead>
                          <TableHead className="w-[150px] text-right">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                    </Table>
                  </div>

                  {/* Scrollable Body */}
                  <ScrollArea className="h-[500px] w-full">
                    <Table>
                      <TableBody>
                        {filteredAssignments?.map((assignment) => (
                          <TableRow key={assignment.maDVSD} className="hover:bg-muted/50">
                            <TableCell className="w-[200px] font-medium">
                              <div className="max-w-[190px] truncate" title={assignment.tenKH}>
                                {assignment.tenKH}
                              </div>
                            </TableCell>
                            <TableCell className="w-[90px]">
                              <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                {assignment.maVT}
                              </div>
                            </TableCell>
                            <TableCell className="w-[180px]">
                              <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  {assignment.maLDV === 1 && <Zap className="h-4 w-4 text-yellow-500" />}
                                  {assignment.maLDV === 2 && <Droplets className="h-4 w-4 text-blue-500" />}
                                  {assignment.maLDV === 3 && <Wifi className="h-4 w-4 text-purple-500" />}
                                  {![1, 2, 3].includes(assignment.maLDV) && <Building className="h-4 w-4 text-gray-500" />}
                                </div>
                                <div className="max-w-[140px] truncate" title={assignment.tenDV}>
                                  {assignment.tenDV}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[130px] text-sm">
                              <div className="space-y-1">
                                <div>{format(new Date(assignment.ngayBatDauSuDung), "dd/MM/yyyy")}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(assignment.ngayBatDauSuDung), "HH:mm")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[130px] text-sm">
                              <div className="space-y-1">
                                <div>{format(new Date(assignment.ngayDenHanThanhToan), "dd/MM/yyyy")}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(assignment.ngayDenHanThanhToan), "HH:mm")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[120px]">
                              <Badge
                                variant="outline"
                                className={
                                  assignment.trangThai === true
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {assignment.trangThai === true ? "Hoạt động" : "Tạm dừng"}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[150px] text-right">
                              <div className="flex justify-end space-x-2">
                                {assignment.trangThai === true ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => ngungSuDungDichVu(assignment.maDVSD)}
                                  >
                                    <FileX className="h-4 w-4 mr-1" />
                                    Ngưng
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => tiepTucSuDungDichVu(assignment.maDVSD)}
                                  >
                                    <Building className="h-4 w-4 mr-1" />
                                    Tiếp tục
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {/* Pagination - outside scrollable area */}
                  <div className="border-t bg-background">
                    <div className="flex items-center justify-between px-4 py-3">
                      {/* Pagination Info */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>
                          Hiển thị{" "}
                          <span className="font-medium">
                            {((danhSachDangSuDung?.pageNumber || 1) - 1) *
                              (danhSachDangSuDung?.pageSize || 10) + 1}
                          </span>{" "}
                          đến{" "}
                          <span className="font-medium">
                            {Math.min(
                              (danhSachDangSuDung?.pageNumber || 1) *
                              (danhSachDangSuDung?.pageSize || 10),
                              danhSachDangSuDung?.totalCount || 0
                            )}
                          </span>{" "}
                          trong tổng số{" "}
                          <span className="font-medium">
                            {danhSachDangSuDung?.totalCount || 0}
                          </span>{" "}
                          dịch vụ
                        </span>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange((danhSachDangSuDung?.pageNumber || 1) - 1)}
                          disabled={!(danhSachDangSuDung?.hasPreviousPage)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Trước
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            {
                              length: Math.min(5, danhSachDangSuDung?.totalPages || 1)
                            },
                            (_, i) => {
                              const currentPage = danhSachDangSuDung?.pageNumber || 1;
                              const totalPages = danhSachDangSuDung?.totalPages || 1;

                              let pageNumber;
                              if (totalPages <= 5) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                              } else {
                                pageNumber = currentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNumber}
                                  variant={pageNumber === currentPage ? "default" : "outline"}
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => handlePageChange(pageNumber)}
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
                          onClick={() => handlePageChange((danhSachDangSuDung?.pageNumber || 1) + 1)}
                          disabled={!(danhSachDangSuDung?.hasNextPage)}
                        >
                          Sau
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Cards - unchanged */}
              <div className="lg:hidden">
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-4 p-4">
                    {filteredAssignments?.map((assignment) => (
                      <Card key={assignment.maDVSD} className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium truncate max-w-[200px]">{assignment.tenKH}</div>
                              <Badge variant="outline" className="text-xs">
                                {assignment.maVT}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => ngungSuDungDichVu(assignment.maDVSD)}
                                  className="text-red-600"
                                >
                                  <FileX className="mr-2 h-4 w-4" />
                                  Ngưng sử dụng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Service */}
                          <div className="flex items-center space-x-2">
                            {assignment.maLDV === 1 && <Zap className="h-4 w-4 text-yellow-500" />}
                            {assignment.maLDV === 2 && <Droplets className="h-4 w-4 text-blue-500" />}
                            {assignment.maLDV === 3 && <Wifi className="h-4 w-4 text-purple-500" />}
                            {![1, 2, 3].includes(assignment.maLDV) && <Building className="h-4 w-4 text-gray-500" />}
                            <span className="text-sm">{assignment.tenDV}</span>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Ngày bắt đầu:</span>
                              <div className="font-medium">
                                {format(new Date(assignment.ngayBatDauSuDung), "dd/MM/yyyy")}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Đến hạn:</span>
                              <div className="font-medium">
                                {format(new Date(assignment.ngayDenHanThanhToan), "dd/MM/yyyy")}
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <Badge
                              variant="outline"
                              className={
                                assignment.trangThai === true
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {assignment.trangThai === true ? "Hoạt động" : "Tạm dừng"}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Mobile Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Trang {danhSachDangSuDung?.pageNumber || 1} / {danhSachDangSuDung?.totalPages || 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((danhSachDangSuDung?.pageNumber || 1) - 1)}
                      disabled={!(danhSachDangSuDung?.hasPreviousPage)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((danhSachDangSuDung?.pageNumber || 1) + 1)}
                      disabled={!(danhSachDangSuDung?.hasNextPage)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed m-4">
              <div className="text-center space-y-2">
                <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Không có dịch vụ nào</p>
                <p className="text-xs text-muted-foreground">
                  Không tìm thấy dịch vụ nào phù hợp với bộ lọc hiện tại
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
