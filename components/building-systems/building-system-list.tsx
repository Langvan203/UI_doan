"use client"

import { useEffect, useState, FormEvent } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Pencil, Trash2, MoreHorizontal, Eye, Wrench, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useBuilding } from "../context/BuildingContext"
import { useBuildingSystem } from "../context/BuildingSystemContext"
import { useAuth } from "../context/AuthContext"
import { HeThong, HeThongPaged, HeThongUpdate, CreateHeThong } from "../type/systems"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStatusMaintance } from "../context/StatusMaintance"
import { useMaintancePlan } from "../context/MaintancePlan"
import { CreateKeHoachBaoTri, CreateMaintancePlan } from "../type/maintancePlan"

// Status options for the new status codes
const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "0", label: "Không hoạt động" },
  { value: "1", label: "Đang hoạt động" },
  { value: "2", label: "Đang bảo trì" }
]

export function BuildingSystemList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<HeThong | null>(null)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  // Form state cho thêm mới
  const [newSystem, setNewSystem] = useState<CreateHeThong>({
    tenHeThong: "",
    maTN: 0,
    ghiChu: "",
    model: "",
    nhanHieu: "",
    trangThai: 1,
    serialNumber: ""
  })

  // Form state cho chỉnh sửa
  const [editedSystem, setEditedSystem] = useState<HeThongUpdate>({
    maHeThong: 0,
    tenHeThong: "",
    maTN: 0,
    nhanHieu: "",
    model: "",
    trangThai: 1,
    serialNumber: "",
    ghiChu: "",
    ngayLapDat: new Date()
  })

  // auth
  const { token } = useAuth()

  // bộ lọc danh sách tòa nhà
  const { buildingListForDropdown, getBuildingListForDropdown } = useBuilding()
  // danh sách thiết bị tòa nhà
  const { heThong, getDanhSachHeThong, updateHeThong, xoaHeThong, addHeThong } = useBuildingSystem()

  // form load trang thai
  const { statusMaintance, getStatusMaintance } = useStatusMaintance();

  // ham them ke hoach bao tri cho he thong 
  const { addMaintancePlan } = useMaintancePlan();

  // Thêm vào phần state declarations ở đầu component
  const [maintenancePlan, setMaintenancePlan] = useState<CreateKeHoachBaoTri>({
    tenKeHoach: "",
    loaiBaoTri: 1, // Mặc định: Bảo trì định kỳ
    maHeThong: 0,
    maTrangThai: 1, // Mặc định: Lên kế hoạch
    tanSuat: 1,
    moTaCongViec: "",
    ngayBaoTri: new Date(),
    chiTietBaoTris: [],
    danhSachNhanVien: []
  });

  useEffect(() => {
    if (token) {
      // Fetch building list for dropdown
      getBuildingListForDropdown()
      // Fetch status maintenance options
      getStatusMaintance()
      // Fetch building systems with pagination
      getDanhSachHeThong(currentPage)
    }
  }, [token])

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Function to filter systems based on search and filters
  const filteredSystems = heThong?.data?.filter((system) => {
    const matchesSearch =
      (system.tenHeThong?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (system.ghiChu?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (system.nhanHieu?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (system.model?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesLocation = selectedLocation === "all" || system.maTN.toString() === selectedLocation
    const matchesStatus = selectedStatus === "all" || system.trangThai.toString() === selectedStatus

    return matchesSearch && matchesLocation && matchesStatus
  }) || []

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case 1:
        return "default" // Changed from "success"
      case 2:
        return "secondary" // Changed from "warning"
      case 0:
        return "destructive"
      default:
        return "outline"
    }
  }

  // Function to format status for display
  const formatStatus = (status: number) => {
    switch (status) {
      case 0: return "Không hoạt động"
      case 1: return "Đang hoạt động"
      case 2: return "Đang bảo trì"
      default: return "Không xác định"
    }
  }

  // Hàm format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Xử lý khi người dùng nhấn nút chỉnh sửa
  const handleEditClick = (system: HeThong) => {
    setSelectedSystem(system)
    setEditedSystem({
      maHeThong: system.maHeThong,
      tenHeThong: system.tenHeThong,
      maTN: system.maTN,
      nhanHieu: system.nhanHieu || "",
      model: system.model || "",
      trangThai: system.trangThai,
      serialNumber: system.serialNumber || "",
      ghiChu: system.ghiChu || "",
      ngayLapDat: system.installationDate ? new Date(system.installationDate) : new Date()
    })
    setIsEditDialogOpen(true)
  }

  // Xử lý thêm mới
  const handleAddSystem = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addHeThong(newSystem)
      setIsAddDialogOpen(false)
      // Reset form
      setNewSystem({
        tenHeThong: "",
        maTN: 0,
        ghiChu: "",
        model: "",
        nhanHieu: "",
        trangThai: 1,
        serialNumber: ""
      })
      // Reload data
      getDanhSachHeThong(currentPage)
      toast({
        title: "Thành công",
        description: "Đã thêm hệ thống mới",
        variant: "default",
      })
    } catch (error) {
      console.error("Error adding system:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm hệ thống. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý cập nhật
  const handleUpdateSystem = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateHeThong(editedSystem)
      setIsEditDialogOpen(false)
      // Reload data
      getDanhSachHeThong(currentPage)
      toast({
        title: "Thành công",
        description: "Đã cập nhật hệ thống",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating system:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hệ thống. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý xóa
  const handleDeleteSystem = async () => {
    if (!selectedSystem) return
    setIsSubmitting(true)

    try {
      await xoaHeThong(selectedSystem.maHeThong)
      setConfirmDeleteDialogOpen(false)
      // Reload data
      getDanhSachHeThong(currentPage)
      toast({
        title: "Thành công",
        description: "Đã xóa hệ thống",
        variant: "default",
      })
    } catch (error) {
      console.error("Error deleting system:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa hệ thống. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý thêm lịch bảo trì
  const handleAddMaintenancePlan = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addMaintancePlan(maintenancePlan);
      setIsScheduleMaintenanceOpen(false);

      // Reset form
      setMaintenancePlan({
        tenKeHoach: "",
        loaiBaoTri: 1,
        maHeThong: 0,
        maTrangThai: 1,
        tanSuat: 1,
        moTaCongViec: "",
        ngayBaoTri: new Date(),
        chiTietBaoTris: [],
        danhSachNhanVien: []
      });

      // Refresh data
      getDanhSachHeThong(currentPage);

      toast({
        title: "Thành công",
        description: "Đã thêm kế hoạch bảo trì mới",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding maintenance plan:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm kế hoạch bảo trì. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hệ thống thiết bị tòa nhà</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hệ thống mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleAddSystem}>
              <DialogHeader>
                <DialogTitle>Thêm hệ thống thiết bị mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết cho hệ thống thiết bị mới của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Tên hệ thống <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên hệ thống"
                      value={newSystem.tenHeThong}
                      onChange={(e) => setNewSystem({ ...newSystem, tenHeThong: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Tòa nhà <span className="text-red-500">*</span></Label>
                    <Select
                      value={newSystem.maTN.toString()}
                      onValueChange={(value) => setNewSystem({ ...newSystem, maTN: Number(value) })}
                      required
                    >
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="status">Trạng thái <span className="text-red-500">*</span></Label>
                    <Select
                      value={newSystem.trangThai.toString()}
                      onValueChange={(value) => setNewSystem({ ...newSystem, trangThai: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Đang hoạt động</SelectItem>
                        <SelectItem value="2">Đang bảo trì</SelectItem>
                        <SelectItem value="0">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">Nhãn hiệu</Label>
                    <Input
                      id="manufacturer"
                      placeholder="Nhập nhãn hiệu"
                      value={newSystem.nhanHieu}
                      onChange={(e) => setNewSystem({ ...newSystem, nhanHieu: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Nhập model"
                      value={newSystem.model}
                      onChange={(e) => setNewSystem({ ...newSystem, model: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      placeholder="Nhập serial number"
                      value={newSystem.serialNumber}
                      onChange={(e) => setNewSystem({ ...newSystem, serialNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Ghi chú</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả hệ thống"
                      value={newSystem.ghiChu}
                      onChange={(e) => setNewSystem({ ...newSystem, ghiChu: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu hệ thống'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả hệ thống tòa nhà</CardTitle>
          <CardDescription>Xem và quản lý tất cả các hệ thống tòa nhà</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters - Cải thiện UI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm hệ thống..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Building filter */}
              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Tòa nhà" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                    {buildingListForDropdown.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Trạng thái" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Systems Table with Fixed Header */}
            <div className="rounded-md border">
              {/* Fixed Table Header */}
              <div className="border-b bg-background sticky top-0 z-10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Tên hệ thống</TableHead>
                      <TableHead className="w-[150px]">Nhãn hiệu</TableHead>
                      <TableHead className="w-[150px]">Tòa nhà</TableHead>
                      <TableHead className="w-[150px]">Lần bảo trì cuối</TableHead>
                      <TableHead className="w-[150px]">Lần bảo trì tiếp theo</TableHead>
                      <TableHead className="w-[120px]">Trạng thái</TableHead>
                      <TableHead className="w-[100px] text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Table Body */}
              <ScrollArea className="h-[460px]">
                <Table>
                  <TableBody>
                    {filteredSystems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Filter className="h-10 w-10 mb-2" />
                            <p>Không có hệ thống nào phù hợp với bộ lọc của bạn.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSystems.map((system) => (
                        <TableRow key={system.maHeThong}>
                          <TableCell className="w-[200px] font-medium">{system.tenHeThong}</TableCell>
                          <TableCell className="w-[150px]">{system.nhanHieu}</TableCell>
                          <TableCell className="w-[150px]">{system.tenTN}</TableCell>
                          <TableCell className="w-[150px]">{formatDate(system.lastMaintenanceDate)}</TableCell>
                          <TableCell className="w-[150px]">{formatDate(system.nextMaintenanceDate)}</TableCell>
                          <TableCell className="w-[120px]">
                            <Badge variant={getStatusBadgeVariant(system.trangThai)}>
                              {formatStatus(system.trangThai)}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[100px] text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSystem(system)
                                    setIsViewDialogOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(system)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSystem(system)
                                    setMaintenancePlan(prev => ({
                                      ...prev,
                                      maHeThong: system.maHeThong,
                                      tenKeHoach: `Bảo trì định kỳ cho ${system.tenHeThong}`
                                    }));
                                    setIsScheduleMaintenanceOpen(true)
                                  }}
                                >
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Lịch bảo trì
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedSystem(system)
                                    setConfirmDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa hệ thống
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Pagination */}
              {(heThong?.totalCount ?? 0) > 0 && (
                <div className="border-t bg-background px-4 py-3 flex items-center justify-between">
                  {/* Pagination Info */}
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium">{((heThong?.pageNumber || 1) - 1) * (heThong?.pageSize || 10) + 1}</span> đến{" "}
                    <span className="font-medium">
                      {Math.min((heThong?.pageNumber || 1) * (heThong?.pageSize || 10), (heThong?.totalCount || 0))}
                    </span>{" "}
                    trong tổng số <span className="font-medium">{heThong?.totalCount || 0}</span> hệ thống
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!heThong?.hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, heThong?.totalPages || 1) },
                        (_, i) => {
                          const currentPageNumber = heThong?.pageNumber || 1;
                          const totalPages = heThong?.totalPages || 1;

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
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!heThong?.hasNextPage}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View System Details Dialog */}
      {selectedSystem && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSystem.tenHeThong}</DialogTitle>
              <DialogDescription>Thông tin chi tiết về hệ thống thiết bị này</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã hệ thống</Label>
                  <p className="font-medium">{selectedSystem.maHeThong}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tòa nhà</Label>
                  <p className="font-medium">{selectedSystem.tenTN}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày lắp đặt</Label>
                  <p className="font-medium">{formatDate(selectedSystem.installationDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="pt-1">
                    <Badge variant={getStatusBadgeVariant(selectedSystem.trangThai)}>
                      {formatStatus(selectedSystem.trangThai)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nhãn hiệu</Label>
                  <p className="font-medium">{selectedSystem.nhanHieu || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="font-medium">{selectedSystem.model || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="font-medium">{selectedSystem.serialNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lần bảo trì cuối</Label>
                  <p className="font-medium">{formatDate(selectedSystem.lastMaintenanceDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lần bảo trì tiếp theo</Label>
                  <p className="font-medium">{formatDate(selectedSystem.nextMaintenanceDate)}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Ghi chú</Label>
                  <p className="font-medium">{selectedSystem.ghiChu || "Không có ghi chú"}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Đóng
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false)
                  handleEditClick(selectedSystem)
                }}
              >
                Chỉnh sửa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit System Dialog */}
      {selectedSystem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleUpdateSystem}>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa hệ thống thiết bị</DialogTitle>
                <DialogDescription>Cập nhật thông tin chi tiết của hệ thống thiết bị này</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="edit-name">Tên hệ thống <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-name"
                      value={editedSystem.tenHeThong}
                      onChange={(e) => setEditedSystem({ ...editedSystem, tenHeThong: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Tòa nhà <span className="text-red-500">*</span></Label>
                    <Select
                      value={editedSystem.maTN.toString()}
                      onValueChange={(value) => setEditedSystem({ ...editedSystem, maTN: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <div>
                    <Label htmlFor="edit-installationDate">Ngày lắp đặt <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-installationDate"
                      type="date"
                      value={editedSystem.ngayLapDat instanceof Date ? editedSystem.ngayLapDat.toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditedSystem({ ...editedSystem, ngayLapDat: new Date(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Trạng thái <span className="text-red-500">*</span></Label>
                    <Select
                      value={editedSystem.trangThai.toString()}
                      onValueChange={(value) => setEditedSystem({ ...editedSystem, trangThai: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Đang hoạt động</SelectItem>
                        <SelectItem value="2">Đang bảo trì</SelectItem>
                        <SelectItem value="0">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-manufacturer">Nhãn hiệu</Label>
                    <Input
                      id="edit-manufacturer"
                      value={editedSystem.nhanHieu}
                      onChange={(e) => setEditedSystem({ ...editedSystem, nhanHieu: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-model">Model</Label>
                    <Input
                      id="edit-model"
                      value={editedSystem.model}
                      onChange={(e) => setEditedSystem({ ...editedSystem, model: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-serialNumber">Serial Number</Label>
                    <Input
                      id="edit-serialNumber"
                      value={editedSystem.serialNumber}
                      onChange={(e) => setEditedSystem({ ...editedSystem, serialNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-description">Ghi chú</Label>
                    <Textarea
                      id="edit-description"
                      value={editedSystem.ghiChu}
                      onChange={(e) => setEditedSystem({ ...editedSystem, ghiChu: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Maintenance Dialog */}
      {selectedSystem && (
        <Dialog open={isScheduleMaintenanceOpen} onOpenChange={setIsScheduleMaintenanceOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleAddMaintenancePlan}>
              <DialogHeader>
                <DialogTitle>Lịch bảo trì</DialogTitle>
                <DialogDescription>Lên lịch bảo trì cho {selectedSystem.tenHeThong}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="maintenance-title">Tiêu đề bảo trì <span className="text-red-500">*</span></Label>
                    <Input
                      id="maintenance-title"
                      placeholder={`Bảo trì định kỳ cho ${selectedSystem.tenHeThong}`}
                      value={maintenancePlan.tenKeHoach}
                      onChange={(e) => setMaintenancePlan({ ...maintenancePlan, tenKeHoach: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maintenance-type">Loại bảo trì <span className="text-red-500">*</span></Label>
                    <Select
                      value={maintenancePlan.loaiBaoTri.toString()}
                      onValueChange={(value) => setMaintenancePlan({ ...maintenancePlan, loaiBaoTri: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Định kỳ</SelectItem>
                        <SelectItem value="2">Phòng ngừa</SelectItem>
                        <SelectItem value="3">Sửa chữa</SelectItem>
                        <SelectItem value="4">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenance-status">Trạng thái <span className="text-red-500">*</span></Label>
                    <Select
                      value={maintenancePlan.maTrangThai.toString()}
                      onValueChange={(value) => setMaintenancePlan({ ...maintenancePlan, maTrangThai: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusMaintance?.map((status) => (
                          <SelectItem key={status.maTrangThai} value={status.maTrangThai.toString()}>
                            {status.tenTrangThai}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenance-frequency">Tần suất <span className="text-red-500">*</span></Label>
                    <Select
                      value={maintenancePlan.tanSuat.toString()}
                      onValueChange={(value) => setMaintenancePlan({ ...maintenancePlan, tanSuat: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Một lần</SelectItem>
                        <SelectItem value="2">Hàng ngày</SelectItem>
                        <SelectItem value="3">Hàng tuần</SelectItem>
                        <SelectItem value="4">Hàng tháng</SelectItem>
                        <SelectItem value="5">Hàng quý</SelectItem>
                        <SelectItem value="6">Hàng năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenance-date">Ngày bảo trì <span className="text-red-500">*</span></Label>
                    <Input
                      id="maintenance-date"
                      type="date"
                      value={maintenancePlan.ngayBaoTri instanceof Date ? maintenancePlan.ngayBaoTri.toISOString().split('T')[0] : ''}
                      onChange={(e) => setMaintenancePlan({ ...maintenancePlan, ngayBaoTri: new Date(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="maintenance-description">Mô tả công việc <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="maintenance-description"
                      placeholder="Mô tả công việc bảo trì cần thực hiện"
                      value={maintenancePlan.moTaCongViec}
                      onChange={(e) => setMaintenancePlan({ ...maintenancePlan, moTaCongViec: e.target.value })}
                      required
                    />
                  </div>

                  {/* Danh sách công việc */}

                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsScheduleMaintenanceOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lên lịch bảo trì'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Delete Dialog */}
      {selectedSystem && (
        <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa hệ thống</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa hệ thống "{selectedSystem.tenHeThong}"?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cảnh báo</AlertTitle>
                <AlertDescription>
                  Hành động này không thể hoàn tác. Việc xóa hệ thống sẽ xóa tất cả dữ liệu liên quan.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteSystem}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xóa...' : 'Xóa hệ thống'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
