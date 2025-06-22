"use client"

import { addMonths, format } from "date-fns";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Droplets,
  Wifi,
  Building,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Download, // Thêm icon này
} from "lucide-react"
import { useBuilding } from "../context/BuildingContext"
import { useAuth } from "../context/AuthContext"
import { useServicesUsage } from "../context/ServiceUsage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetThongKeSuDung } from "../type/serviceUsage"
import { ServiceUsageDetailDialog } from "./service-usage-detail-dialog"

export function ServiceUsageStatistics() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // State cho dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedUsageData, setSelectedUsageData] = useState<GetThongKeSuDung | null>(null)

  // Thêm state cho date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(), // Ngày hiện tại
    endDate: addMonths(new Date(), 1) // Ngày hiện tại + 1 tháng
  });

  // Thêm error state cho validation
  const [dateError, setDateError] = useState("")

  // auth
  const { token } = useAuth();

  const { danhsachThongKeSuDung, getDanhSachThongKeSuDung, exportToExcel } = useServicesUsage();

  // bộ lọc tòa nhà, khối nhà, tầng lầu
  const { buildingListForDropdown, blockListForDropdown, floorListForDropdown,
    getBlockListForDropdown,
    getBuildingListForDropdown,
    getFloorListForDropdown
  } = useBuilding();

  // get building, block, floor list for dropdown
  useEffect(() => {
    if (token) {
      getBuildingListForDropdown();
      getBlockListForDropdown();
      getFloorListForDropdown();
      // Sử dụng date range khi fetch data
      getDanhSachThongKeSuDung(1, dateRange.startDate, dateRange.endDate);

    }
  }, [token, dateRange]) // Thêm dateRange vào dependency

  console.log("danhsachThongKeSuDung", danhsachThongKeSuDung);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handlePageChange = (page: number) => {
    getDanhSachThongKeSuDung(page, dateRange.startDate, dateRange.endDate);
  };

  // Handle view detail
  const handleViewDetail = (usageData: GetThongKeSuDung) => {
    setSelectedUsageData(usageData)
    setDetailDialogOpen(true)
  }

  // Handle export Excel
  const handleExportExcel = async () => {
    try {
      await exportToExcel(dateRange.startDate, dateRange.endDate);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Có thể thêm toast notification ở đây
    }
  };

  // Filter blocks based on selected building
  const filteredBlocks = blockListForDropdown.filter((block) => selectedBuilding === null || block.maTN === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floorListForDropdown.filter((floor) => selectedBlock === null || floor.maKN === selectedBlock)
  
  const getServiceType = (maLDV: number): number => {
    // This logic should match your service type mapping
    // You might need to adjust this based on your actual service ID ranges
    if (maLDV === 1 ) return 1; // Electricity
    if (maLDV === 2 ) return 2; // Water
    if (maLDV === 3) return 3; // Internet
    return 4; // Other
  }

  const getServiceIcon = (maDV: number) => {
    const serviceType = getServiceType(maDV);
    switch (serviceType) {
      case 1: return <Zap className="h-4 w-4 text-yellow-500" />;
      case 2: return <Droplets className="h-4 w-4 text-blue-500" />;
      case 3: return <Wifi className="h-4 w-4 text-purple-500" />;
      default: return <Building className="h-4 w-4 text-gray-500" />;
    }
  }
  
  // Filter statistics based on active tab and filters
  const filteredStatistics = danhsachThongKeSuDung?.data?.filter((item) => {
    const matchesSearch =
      (item.tenKH?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.maVT?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.tenDV?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesFilters =
      (selectedBuilding === null || item.maTN === selectedBuilding) &&
      (selectedBlock === null || item.maKN === selectedBlock) &&
      (selectedFloor === null || item.maTL === selectedFloor)

    // Determine service type based on maDV (adjust logic as needed)
    const serviceType = getServiceType(item.maLDV);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "electricity" && serviceType === 1) ||
      (activeTab === "water" && serviceType === 2) ||
      (activeTab === "internet" && serviceType === 3) ||
      (activeTab === "other" && ![1, 2, 3].includes(serviceType))

    return matchesSearch && matchesFilters && matchesTab
  }) || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Controls Section - Responsive */}
      <div className="flex flex-col gap-4">
        {/* Search and Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Label htmlFor="search" className="text-sm font-medium">
              Tìm kiếm
            </Label>
            <Input
              id="search"
              placeholder="Nhập tên cư dân, căn hộ hoặc dịch vụ..."
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
        </div>

        {/* Date Range Filter */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="grid gap-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Từ ngày
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newStartDate = new Date(e.target.value);
                      const newDateRange = {
                        ...dateRange,
                        startDate: newStartDate
                      };

                      if (newStartDate > dateRange.endDate) {
                        setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                      } else {
                        setDateError("");
                        setDateRange(newDateRange);
                      }
                    }}
                    className="w-full sm:w-[160px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Đến ngày
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newEndDate = new Date(e.target.value);
                      const newDateRange = {
                        ...dateRange,
                        endDate: newEndDate
                      };

                      if (dateRange.startDate > newEndDate) {
                        setDateError("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
                      } else {
                        setDateError("");
                        setDateRange(newDateRange);
                      }
                    }}
                    min={dateRange.startDate.toISOString().split('T')[0]}
                    className="w-full sm:w-[160px]"
                  />
                </div>
              </div>

              {/* Quick Date Range Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setDateRange({
                      startDate: lastWeek,
                      endDate: today
                    });
                  }}
                >
                  7 ngày qua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setDateRange({
                      startDate: lastMonth,
                      endDate: today
                    });
                  }}
                >
                  30 ngày qua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const nextMonth = addMonths(today, 1);
                    setDateRange({
                      startDate: today,
                      endDate: nextMonth
                    });
                  }}
                >
                  Tháng tới
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      startDate: today,
                      endDate: addMonths(today, 1)
                    });
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Error message */}
            {dateError && (
              <div className="mt-2 text-sm text-red-600">
                {dateError}
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Hiển thị thống kê từ{" "}
                <span className="font-medium">
                  {format(dateRange.startDate, 'dd/MM/yyyy')}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {format(dateRange.endDate, 'dd/MM/yyyy')}
                </span>
                {" "}({Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} ngày)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs với nút Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-max">
              <TabsTrigger value="all" className="flex items-center gap-2 text-xs sm:text-sm">
                <span>Tất cả</span>
                <Badge variant="secondary" className="text-xs">
                  {danhsachThongKeSuDung?.totalCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="electricity" className="flex items-center gap-2 text-xs sm:text-sm">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                <span className="hidden sm:inline">Điện</span>
                <span className="sm:hidden">⚡</span>
                <Badge variant="secondary" className="text-xs">
                  {danhsachThongKeSuDung?.data?.filter(item => getServiceType(item.maLDV) === 1).length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center gap-2 text-xs sm:text-sm">
                <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                <span className="hidden sm:inline">Nước</span>
                <span className="sm:hidden">💧</span>
                <Badge variant="secondary" className="text-xs">
                  {danhsachThongKeSuDung?.data?.filter(item => getServiceType(item.maLDV) === 2).length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="internet" className="flex items-center gap-2 text-xs sm:text-sm">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                <span className="hidden sm:inline">Internet</span>
                <span className="sm:hidden">📶</span>
                <Badge variant="secondary" className="text-xs">
                  {danhsachThongKeSuDung?.data?.filter(item => getServiceType(item.maLDV) === 3).length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="other" className="flex items-center gap-2 text-xs sm:text-sm">
                <span>Khác</span>
                <Badge variant="secondary" className="text-xs">
                  {danhsachThongKeSuDung?.data?.filter(item => ![1, 2, 3].includes(getServiceType(item.maDV))).length || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Export Button */}
        {/* <div className="flex items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            disabled={!danhsachThongKeSuDung?.data || danhsachThongKeSuDung.data.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div> */}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Thống kê sử dụng dịch vụ</CardTitle>
            <CardDescription>
              Thống kê chi tiết về việc sử dụng dịch vụ của cư dân ({danhsachThongKeSuDung?.totalCount || 0} bản ghi)
            </CardDescription>
          </div>
          
          {/* Alternative: Export button in card header */}
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={!danhsachThongKeSuDung?.data || danhsachThongKeSuDung.data.length === 0}
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {(filteredStatistics ?? []).length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto w-full">
                  <div className="min-w-[1400px]">
                    {/* Fixed Header */}
                    <div className="border-b bg-background sticky top-0 z-10">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px] min-w-[180px]">Cư dân</TableHead>
                            <TableHead className="w-[120px] min-w-[120px]">Vị trí</TableHead>
                            <TableHead className="w-[200px] min-w-[200px]">Dịch vụ</TableHead>
                            <TableHead className="w-[140px] min-w-[140px]">Ngày bắt đầu</TableHead>
                            <TableHead className="w-[140px] min-w-[140px]">Ngày đến hạn</TableHead>
                            <TableHead className="w-[120px] min-w-[120px] text-right">VAT</TableHead>
                            <TableHead className="w-[120px] min-w-[120px] text-right">BVMT</TableHead>
                            <TableHead className="w-[140px] min-w-[140px] text-right">Thành tiền</TableHead>
                            <TableHead className="w-[120px] min-w-[120px]">Trạng thái</TableHead>
                            <TableHead className="w-[100px] min-w-[100px] text-right">Hành động</TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                    </div>

                    {/* Scrollable Body với cả vertical và horizontal scroll */}
                    <div className="relative">
                      <ScrollArea className="h-[500px] w-full">
                        <Table>
                          <TableBody>
                            {filteredStatistics?.map((item) => (
                              <TableRow key={item.maDVSD} className="hover:bg-muted/50">
                                <TableCell className="w-[180px] min-w-[180px] font-medium">
                                  <div className="max-w-[170px] truncate" title={item.tenKH?.toString()}>
                                    {item.tenKH}
                                  </div>
                                </TableCell>
                                <TableCell className="w-[120px] min-w-[120px]">
                                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded max-w-[110px] truncate">
                                    {item.maVT}
                                  </div>
                                </TableCell>
                                <TableCell className="w-[200px] min-w-[200px]">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      {getServiceIcon(item.maLDV)}
                                    </div>
                                    <div className="max-w-[160px] truncate" title={item.tenDV?.toString()}>
                                      {item.tenDV}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="w-[140px] min-w-[140px] text-sm">
                                  <div className="space-y-1">
                                    <div>{format(new Date(item.ngayBatDauSuDung), "dd/MM/yyyy")}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {format(new Date(item.ngayBatDauSuDung), "HH:mm")}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="w-[140px] min-w-[140px] text-sm">
                                  <div className="space-y-1">
                                    <div>{format(new Date(item.ngayDenHanThanhToan), "dd/MM/yyyy")}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {format(new Date(item.ngayDenHanThanhToan), "HH:mm")}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="w-[120px] min-w-[120px] text-right">
                                  <div className="font-medium">
                                    {formatPrice(item.tienVAT)}
                                  </div>
                                </TableCell>
                                <TableCell className="w-[120px] min-w-[120px] text-right">
                                  <div className="font-medium">
                                    {formatPrice(item.tienBVMT)}
                                  </div>
                                </TableCell>
                                <TableCell className="w-[140px] min-w-[140px] text-right">
                                  <div className="font-bold text-primary">
                                    {formatPrice(item.thanhTien)}
                                  </div>
                                </TableCell>
                                <TableCell className="w-[120px] min-w-[120px]">
                                  <Badge
                                    variant="outline"
                                    className={
                                      item.isDuyetHoaDon === 1
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    }
                                  >
                                    {item.isDuyetHoaDon === 1 ? (
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Đã duyệt</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        <span>Chờ duyệt</span>
                                      </div>
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell className="w-[100px] min-w-[100px] text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Xem chi tiết
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Tạo hóa đơn
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
                  </div>
                </div>

                {/* Pagination - outside scrollable area */}
                <div className="border-t bg-background">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Pagination Info */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>
                        Hiển thị{" "}
                        <span className="font-medium">
                          {((danhsachThongKeSuDung?.pageNumber || 1) - 1) *
                            (danhsachThongKeSuDung?.pageSize || 10) + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-medium">
                          {Math.min(
                            (danhsachThongKeSuDung?.pageNumber || 1) *
                            (danhsachThongKeSuDung?.pageSize || 10),
                            danhsachThongKeSuDung?.totalCount || 0
                          )}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-medium">
                          {danhsachThongKeSuDung?.totalCount || 0}
                        </span>{" "}
                        bản ghi
                      </span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange((danhsachThongKeSuDung?.pageNumber || 1) - 1)}
                        disabled={!(danhsachThongKeSuDung?.hasPreviousPage)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          {
                            length: Math.min(5, danhsachThongKeSuDung?.totalPages || 1)
                          },
                          (_, i) => {
                            const currentPage = danhsachThongKeSuDung?.pageNumber || 1;
                            const totalPages = danhsachThongKeSuDung?.totalPages || 1;

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
                        onClick={() => handlePageChange((danhsachThongKeSuDung?.pageNumber || 1) + 1)}
                        disabled={!(danhsachThongKeSuDung?.hasNextPage)}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-4 p-4">
                    {filteredStatistics?.map((item) => (
                      <Card key={item.maDVSD} className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium truncate max-w-[200px]">{item.tenKH}</div>
                              <Badge variant="outline" className="text-xs">
                                {item.maVT}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Tạo hóa đơn
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Service */}
                          <div className="flex items-center space-x-2">
                            {getServiceIcon(item.maDV)}
                            <span className="text-sm">{item.tenDV}</span>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Ngày bắt đầu:</span>
                              <div className="font-medium">
                                {format(new Date(item.ngayBatDauSuDung), "dd/MM/yyyy")}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Đến hạn:</span>
                              <div className="font-medium">
                                {format(new Date(item.ngayDenHanThanhToan), "dd/MM/yyyy")}
                              </div>
                            </div>
                          </div>

                          {/* Financial Info */}
                          <div className="grid grid-cols-3 gap-4 text-xs border-t pt-2">
                            <div>
                              <span className="text-muted-foreground">VAT:</span>
                              <div className="font-medium">{formatPrice(item.tienVAT)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">BVMT:</span>
                              <div className="font-medium">{formatPrice(item.tienBVMT)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Thành tiền:</span>
                              <div className="font-bold text-primary">{formatPrice(item.thanhTien)}</div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <Badge
                              variant="outline"
                              className={
                                item.isDuyetHoaDon === 1
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {item.isDuyetHoaDon === 1 ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Đã duyệt</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  <span>Chờ duyệt</span>
                                </div>
                              )}
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
                    Trang {danhsachThongKeSuDung?.pageNumber || 1} / {danhsachThongKeSuDung?.totalPages || 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((danhsachThongKeSuDung?.pageNumber || 1) - 1)}
                      disabled={!(danhsachThongKeSuDung?.hasPreviousPage)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((danhsachThongKeSuDung?.pageNumber || 1) + 1)}
                      disabled={!(danhsachThongKeSuDung?.hasNextPage)}
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
                <p className="text-sm font-medium">Không có dữ liệu thống kê</p>
                <p className="text-xs text-muted-foreground">
                  Không tìm thấy dữ liệu nào phù hợp với bộ lọc hiện tại
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                filteredStatistics.reduce((sum, item) => sum + item.thanhTien, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ {filteredStatistics.length} dịch vụ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng VAT</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                filteredStatistics.reduce((sum, item) => sum + item.tienVAT, 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng BVMT</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                filteredStatistics.reduce((sum, item) => sum + item.tienBVMT, 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStatistics.filter(item => item.isDuyetHoaDon === 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              / {filteredStatistics.length} tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Usage Detail Dialog */}
      <ServiceUsageDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        usageData={selectedUsageData}
      />
    </div>
  )
}
