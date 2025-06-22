"use client"

import { addMonths, format, isAfter, isBefore } from "date-fns";
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Droplets, Wifi, Car, Dumbbell, CheckCircle2, XCircle, MoreVertical, Eye, Scroll, ChevronLeft, ChevronRight } from "lucide-react"
import { useBuilding } from "../context/BuildingContext"
import { useServicesUsage, } from "../context/ServiceUsage"
import { BlockDetail } from "@/services/building-service"
import { useAuth } from "../context/AuthContext"
import { ppid } from "process"
import { GetDSYeuCauSuDung } from "../type/serviceUsage"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { get } from "http"
import { Label } from "@/components/ui/label"
import { date } from "zod";
// Sample data for services


export function ServiceApproval() {

  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  // Thêm vào đầu component ServiceApproval
  const [dateRange, setDateRange] = useState({
    startDate: new Date(), // Ngày hiện tại
    endDate: addMonths(new Date(), 1) // Ngày hiện tại + 1 tháng
  });
  const { buildingListForDropdown, blockListForDropdown, floorListForDropdown,
    getBuildingListForDropdown,
    getBlockListForDropdown,
    getFloorListForDropdown } = useBuilding();
  const { danhSachYeuCauSuDung, getDanhSachYeuCauSuDung, duyetYeuCauSuDung, tuChoiYeuCauSuDung } = useServicesUsage();

  const { token } = useAuth();
  useEffect(() => {
    if (token) {
      // Fetch initial data when token is available
      getBuildingListForDropdown();
      getBlockListForDropdown();
      getFloorListForDropdown();
      getDanhSachYeuCauSuDung(1, dateRange.startDate, dateRange.endDate);
    } // Fetch the first page of service requests
  }, [token, dateRange])


  const handleApproveRequest = async (id: number) => {
    await duyetYeuCauSuDung(id,dateRange.startDate, dateRange.endDate)
  }

  const handleRejectRequest = async (id: number) => {
    // setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
    await tuChoiYeuCauSuDung(id, dateRange.startDate, dateRange.endDate)
  }

  const handlePageChange = (page: number) => {
     getDanhSachYeuCauSuDung(page, dateRange.startDate, dateRange.endDate);
  };
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

  const currentRequest: GetDSYeuCauSuDung[] = useMemo(() => {
    return danhSachYeuCauSuDung?.data || []
  }, [danhSachYeuCauSuDung]);
  // Filter requests based on active tab and filters

  const filteredRequests = currentRequest.filter((request) => {
    const matchesSearch =
      (request.tenKH?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (request.maVT?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesBuilding = selectedBuilding === null || request.maTN === selectedBuilding
    const matchesBlock = selectedBlock === null || request.maKN === selectedBlock
    const matchesFloor = selectedFloor === null || request.maTL === selectedFloor
    const matchesFilters = matchesBuilding && matchesBlock && matchesFloor

    const matchesTab =
      (activeTab === "pending" && request.trangThai === 0) ||
      (activeTab === "approved" && request.trangThai === 1) ||
      (activeTab === "rejected" && request.trangThai === -1) ||
      activeTab === "all"

    return matchesSearch && matchesFilters && matchesTab
  })
  const statusCounts = useMemo(() => {
    const baseFiltered = currentRequest.filter((request) => {
      const matchesSearch =
        (request.tenKH?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (request.maVT?.toLowerCase() || "").includes(searchQuery.toLowerCase())

      const matchesBuilding = selectedBuilding === null || request.maTN === selectedBuilding
      const matchesBlock = selectedBlock === null || request.maKN === selectedBlock
      const matchesFloor = selectedFloor === null || request.maTL === selectedFloor

      return matchesSearch && matchesBuilding && matchesBlock && matchesFloor
    })

    return {
      pending: baseFiltered.filter(r => r.trangThai === 0).length,
      approved: baseFiltered.filter(r => r.trangThai === 1).length,
      rejected: baseFiltered.filter(r => r.trangThai === -1).length,
      all: baseFiltered.length
    }
  }, [currentRequest, searchQuery, selectedBuilding, selectedBlock, selectedFloor])

  // Thêm validation function
  const isValidDateRange = () => {
    return dateRange.startDate <= dateRange.endDate;
  };

  // Thêm error state
  const [dateError, setDateError] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Tìm kiếm theo tên cư dân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={selectedBuilding?.toString() || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedBuilding(null)
              } else {
                setSelectedBuilding(Number.parseInt(value))
              }
              setSelectedBlock(null)
              setSelectedFloor(null)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tất cả tòa nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildingListForDropdown.map((building, index) => (
                <SelectItem key={index} value={building.id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedBlock?.toString() || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedBlock(null)
              } else {
                setSelectedBlock(Number.parseInt(value))
              }
              setSelectedFloor(null)
            }}
            disabled={selectedBuilding === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tất cả khối nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khối nhà</SelectItem>
              {filteredBlocks.map((block, index) => (
                <SelectItem key={index} value={block.maKN.toString()}>
                  {block.tenKN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedFloor?.toString() || ""}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedFloor(null)
              } else {
                setSelectedFloor(Number.parseInt(value))
              }
            }}
            disabled={selectedBlock === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tất cả tầng lầu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tầng lầu</SelectItem>
              {filteredFloors.map((floor, index) => (
                <SelectItem key={index} value={floor.maTL.toString()}>
                  {floor.tenTL}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thêm Date Range Filter */}
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

                    console.log(newDateRange)
                    
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
                    setDateRange(prev => ({
                      ...prev,
                      endDate: newEndDate
                    }));
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
                7 ngày
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
                30 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                  setDateRange({
                    startDate: today,
                    endDate: nextMonth
                  });
                }}
              >
                30 ngày tới
              </Button>
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Hiển thị yêu cầu từ{" "}
              <span className="font-medium">
                {format(dateRange.startDate, 'dd/MM/yyyy')}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {format(dateRange.endDate, 'dd/MM/yyyy')}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Đang chờ duyệt
            <Badge variant="secondary">{statusCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            Đã duyệt
            <Badge variant="secondary">{statusCounts.approved}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            Đã từ chối
            <Badge variant="secondary">{statusCounts.rejected}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            Tất cả yêu cầu
            <Badge variant="secondary">{statusCounts.all}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu</CardTitle>
          <CardDescription>Danh sách yêu cầu sử dụng dịch vụ gửi đến từ cư dân</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            {/* Fixed Header */}
            <div className="border-b bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Cư dân</TableHead>
                    <TableHead className="w-[90px]">Vị trí</TableHead>
                    <TableHead className="w-[180px]">Dịch vụ</TableHead>
                    <TableHead className="w-[130px]">Ngày yêu cầu</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                    <TableHead className="w-[200px]">Ghi chú</TableHead>
                    <TableHead className="w-[150px] text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="h-[500px] w-full">
              <Table>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow className="hover:bg-muted/50" key={request.maDVSD}>
                        <TableCell className="w-[150px] font-medium">
                          <div className="max-w-[140px] truncate" title={request.tenKH}>
                            {request.tenKH}
                          </div>
                        </TableCell>
                        <TableCell className="w-[90px]">
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {request.maVT}
                          </div>
                        </TableCell>
                        <TableCell className="w-[180px]">
                          <div className="flex items-center space-x-2">

                            <div className="max-w-[140px] truncate" title={request.tenDV}>
                              {request.tenDV}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[130px] text-sm">
                          <div className="space-y-1">
                            <div>{format(new Date(request.requestDate), "dd/MM/yyyy")}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(request.requestDate), "HH:mm")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <Badge
                            variant="outline"
                            className={
                              request.trangThai === 0
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : request.trangThai === 1
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {request.trangThai === 0
                              ? "Chờ duyệt"
                              : request.trangThai === 1
                                ? "Đã duyệt"
                                : "Từ chối"
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div className="max-w-[180px] truncate text-sm" title={request.ghiChu}>
                            {request.ghiChu || <span className="text-muted-foreground italic">Không có ghi chú</span>}
                          </div>
                        </TableCell>
                        <TableCell className="w-[150px] text-right">
                          <div className="flex justify-end space-x-2">
                            {request.trangThai === 0 && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handleApproveRequest(request.maDVSD)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Duyệt
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRejectRequest(request.maDVSD)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Từ chối
                                </Button>
                              </>
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
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {request.trangThai === 0 && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleApproveRequest(request.maDVSD)}
                                      className="text-green-600"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Duyệt yêu cầu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRejectRequest(request.maDVSD)}
                                      className="text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Từ chối yêu cầu
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="rounded-full bg-muted p-3">
                            <Scroll className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Không có yêu cầu nào</p>
                            <p className="text-xs text-muted-foreground">
                              Không tìm thấy yêu cầu sử dụng dịch vụ nào phù hợp với bộ lọc hiện tại
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Pagination */}
            <div className="border-t bg-background">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Pagination Info */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>
                    Hiển thị{" "}
                    <span className="font-medium">
                      {((danhSachYeuCauSuDung?.pageNumber || 1) - 1) *
                        (danhSachYeuCauSuDung?.pageSize || 10) + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(
                        (danhSachYeuCauSuDung?.pageNumber || 1) *
                        (danhSachYeuCauSuDung?.pageSize || 10),
                        danhSachYeuCauSuDung?.totalCount || 0
                      )}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">
                      {danhSachYeuCauSuDung?.totalCount || 0}
                    </span>{" "}
                    yêu cầu
                  </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange((danhSachYeuCauSuDung?.pageNumber || 1) - 1)}
                    disabled={!(danhSachYeuCauSuDung?.hasPreviousPage)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      {
                        length: Math.min(5, danhSachYeuCauSuDung?.totalPages || 1)
                      },
                      (_, i) => {
                        const currentPage = danhSachYeuCauSuDung?.pageNumber || 1;
                        const totalPages = danhSachYeuCauSuDung?.totalPages || 1;

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
                    onClick={() => handlePageChange((danhSachYeuCauSuDung?.pageNumber || 1) + 1)}
                    disabled={!(danhSachYeuCauSuDung?.hasNextPage)}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
