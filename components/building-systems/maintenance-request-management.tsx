"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ThumbsUp,
  UserCog,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { useBuildingSystem } from "../context/BuildingSystemContext"
import { useAuth } from "../context/AuthContext"
import { useMaintanceRequest } from "../context/MaintanceRequest"
import { useStaff } from "../context/StaffContext"
import { GiaoViecYeuCauChoNhanVien, YeuCauSuaChuaDTO } from "../type/maintanceRequest"
import { Checkbox } from "@/components/ui/checkbox"

// Component multi-select cho nhân viên (cải tiến)
function StaffMultiSelect({ 
  staffList, 
  selectedStaff, 
  onStaffChange 
}: { 
  staffList: any[]
  selectedStaff: number[]
  onStaffChange: (staffIds: number[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleStaff = (staffId: number) => {
    const updatedSelection = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId]
    onStaffChange(updatedSelection)
  }

  const getSelectedStaffNames = () => {
    if (selectedStaff.length === 0) return "Chọn nhân viên..."
    if (selectedStaff.length === 1) {
      const staff = staffList.find(s => s.maNV === selectedStaff[0])
      return staff?.tenNV || "Nhân viên không tồn tại"
    }
    return `Đã chọn ${selectedStaff.length} nhân viên`
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getSelectedStaffNames()}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {staffList?.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Không có nhân viên nào
            </div>
          ) : (
            staffList?.map((staff) => (
              <div
                key={staff.maNV}
                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => toggleStaff(staff.maNV)}
              >
                <Checkbox 
                  checked={selectedStaff.includes(staff.maNV)}
                  onChange={() => toggleStaff(staff.maNV)}
                />
                <span className="flex-1">{staff.tenNV}</span>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Selected staff display */}
      {selectedStaff.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedStaff.map((staffId) => {
            const staff = staffList.find(s => s.maNV === staffId)
            return staff ? (
              <Badge key={staffId} variant="secondary" className="text-xs">
                {staff.tenNV}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => toggleStaff(staffId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

export function MaintenanceRequestManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("0")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false)
  const [isViewRequestOpen, setIsViewRequestOpen] = useState(false)
  const [isAssignRequestOpen, setIsAssignRequestOpen] = useState(false)
  const [isUpdateRequestOpen, setIsUpdateRequestOpen] = useState(false)
  
  // Selected request and form states
  const [selectedRequest, setSelectedRequest] = useState<YeuCauSuaChuaDTO | null>(null)
  const [newNote, setNewNote] = useState("")
  const [assignedStaff, setAssignedStaff] = useState<number[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [sendNotification, setSendNotification] = useState(true) // Thêm state cho notification

  // New request form state
  const [newRequest, setNewRequest] = useState({
    tieuDe: "",
    maHeThong: 0,
    mucDoYeuCau: 1,
    moTa: "",
    maVT: "",
    imagePath: ""
  })

  // Context hooks
  const { token } = useAuth()
  const { heThong, getDanhSachHeThong } = useBuildingSystem()
  const { 
    yeuCauSuaChua, 
    trangThaiYeuCau,
    getDanhSachYeuCauSuaChua, 
    addYeuCauSuaChua,
    updateYeuCauSuaChua,
    getTrangThaiYeuCau,
    duyetYeuCauSuaChua,
    tuChoiYeuCauSuaChua,
    danhDauDaHoanThanh,
    giaoViecYeuCauChoNhanVien
  } = useMaintanceRequest()
  const { staffList, getStaffList } = useStaff()

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      getDanhSachHeThong(0)
      getDanhSachYeuCauSuaChua(currentPage)
      getTrangThaiYeuCau()
      getStaffList()
    }
  }, [token, currentPage])

  const currentSystem = heThong?.data || []
  const currentRequest = yeuCauSuaChua?.data || []

  // Priority options (cập nhật theo yêu cầu mới)
  const priorityOptions = [
    { value: "all", label: "Tất cả mức độ" },
    { value: "1", label: "Thấp" },
    { value: "2", label: "Bình thường" },
    { value: "3", label: "Cao" },
    { value: "4", label: "Khẩn cấp" }
  ]

  // Status options từ API
  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...(trangThaiYeuCau?.map(status => ({
      value: status.maTrangThai.toString(),
      label: status.tenTrangThai
    })) || [])
  ]

  console.log(statusOptions)
  // Filter requests based on search, filters, and active tab
  const filteredRequests = currentRequest.filter((request) => {
    // Filter by tab
    if (activeTab === "pending" && request.idTrangThai !== 1) return false
    if (activeTab === "approved" && request.idTrangThai !== 2) return false
    if (activeTab === "inProgress" && request.idTrangThai !== 3) return false
    if (activeTab === "completed" && request.idTrangThai !== 4) return false

    // Filter by search
    const matchesSearch =
      request.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.moTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.nguoiYeuCau.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by category, priority, and status
    const matchesCategory = selectedCategory === "0" || request.maHeThong.toString() === selectedCategory
    const matchesPriority = selectedPriority === "all" || request.mucDoYeuCau?.toString() === selectedPriority
    const matchesStatus = selectedStatus === "all" || request.idTrangThai.toString() === selectedStatus

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  // Function to get priority badge variant
  const getPriorityBadgeVariant = (priority: number | null | undefined) => {
    switch (priority) {
      case 1: return "outline"    // Chờ duyệt
      case 2: return "secondary"  // Đã duyệt  
      case 3: return "default"    // Đang thực hiện
      case 4: return "success"    // Đã hoàn thành
      default: return "outline"
    }
  }

  // Function to get status badge variant
  const getStatusBadgeVariant = (statusId: number) => {
    switch (statusId) {
      case 1: return "outline"     // Chờ duyệt
      case 2: return "secondary"   // Đã duyệt
      case 3: return "default"     // Đang thực hiện
      case 4: return "success"// Đã hoàn thành
      case 6: return "destructive" // Từ chối
      default: return "outline"
    }
  }

  // Function to format priority for display
  const formatPriority = (priority: number | null | undefined) => {
    const priorityItem = priorityOptions.find(p => p.value === priority?.toString())
    return priorityItem?.label || "Không xác định"
  }

  // Handler functions for request actions
  const handleApproveRequest = async (requestId: number) => {
    try {
      // Cập nhật trạng thái thành "Đã duyệt" (2)
      if (duyetYeuCauSuaChua) {
        await duyetYeuCauSuaChua(requestId)
      } else {
        console.error("duyetYeuCauSuaChua function is undefined")
      }
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    try {
      // Cập nhật trạng thái thành "Đã duyệt" (2)
      if (tuChoiYeuCauSuaChua) {
        await tuChoiYeuCauSuaChua(requestId)
      } else {
        console.error("duyetYeuCauSuaChua function is undefined")
      }
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  const handleCompleteRequest = async (requestId: number) => {
    try {
      // Cập nhật trạng thái thành "Đã duyệt" (2)
      if (danhDauDaHoanThanh) {
        await danhDauDaHoanThanh(requestId)
      } else {
        console.error("duyetYeuCauSuaChua function is undefined")
      }
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  // Cập nhật hàm handleAssignRequest
  const handleAssignRequest = async () => {
    try {
      if (!selectedRequest || assignedStaff.length === 0) {
        console.error("Chưa chọn yêu cầu hoặc nhân viên")
        return
      }
      
      // Sử dụng interface GiaoViecYeuCauChoNhanVien
      const assignData: GiaoViecYeuCauChoNhanVien = {
        maYC: selectedRequest.maYC,
        danhSachNhanVien: assignedStaff,
        isSendNotification: sendNotification
      }
      
      // Gọi API giao việc từ context
      if (giaoViecYeuCauChoNhanVien) {
        await giaoViecYeuCauChoNhanVien(assignData)
        
        // Reset form và đóng dialog
        setIsAssignRequestOpen(false)
        setAssignedStaff([])
        setScheduledDate("")
        setSendNotification(true)
        
        // Refresh data
        getDanhSachYeuCauSuaChua(currentPage)
        
        console.log("Giao việc thành công!")
      } else {
        console.error("giaoViecYeuCauChoNhanVien function is undefined")
      }
    } catch (error) {
      console.error("Error assigning request:", error)
    }
  }

  const handleCreateRequest = async () => {
    try {
      await addYeuCauSuaChua(newRequest)
      setIsCreateRequestOpen(false)
      setNewRequest({
        tieuDe: "",
        maHeThong: 0,
        mucDoYeuCau: 1,
        moTa: "",
        maVT: "",
        imagePath: ""
      })
      getDanhSachYeuCauSuaChua(currentPage)
    } catch (error) {
      console.error("Error creating request:", error)
    }
  }

  // Calculate counts for tabs
  const pendingCount = currentRequest.filter((req) => req.idTrangThai === 1).length
  const approvedCount = currentRequest.filter((req) => req.idTrangThai === 2).length
  const inProgressCount = currentRequest.filter((req) => req.idTrangThai === 3).length
  const completedCount = currentRequest.filter((req) => req.idTrangThai === 4).length

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yêu cầu sửa chữa</h1>
        <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo yêu cầu sửa chữa</DialogTitle>
              <DialogDescription>
                Vui lòng điền đầy đủ thông tin để gửi yêu cầu sửa chữa. Các trường bắt buộc được đánh dấu sao (*).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Tiêu đề yêu cầu <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="Mô tả ngắn gọn về vấn đề" 
                    value={newRequest.tieuDe}
                    onChange={(e) => setNewRequest({ ...newRequest, tieuDe: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Hệ thống <span className="text-red-500">*</span></Label>
                  <Select 
                    value={newRequest.maHeThong.toString()}
                    onValueChange={(value) => setNewRequest({ ...newRequest, maHeThong: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hệ thống" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSystem.map((system) => (
                        <SelectItem key={system.maHeThong} value={system.maHeThong.toString()}>
                          {system.tenHeThong}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Mức độ ưu tiên <span className="text-red-500">*</span></Label>
                  <Select 
                    value={newRequest.mucDoYeuCau.toString()}
                    onValueChange={(value) => setNewRequest({ ...newRequest, mucDoYeuCau: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.slice(1).map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="location">Vị trí</Label>
                  <Input 
                    id="location" 
                    placeholder="Tòa nhà, tầng, đơn vị hoặc khu vực cụ thể" 
                    value={newRequest.maVT}
                    onChange={(e) => setNewRequest({ ...newRequest, maVT: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Vui lòng cung cấp thông tin chi tiết về vấn đề..."
                    rows={4}
                    value={newRequest.moTa}
                    onChange={(e) => setNewRequest({ ...newRequest, moTa: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="attachment">Tệp đính kèm (nếu có)</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      id="attachment" 
                      type="file" 
                      className="flex-1"
                      onChange={(e) => {
                        // Handle file upload
                        const file = e.target.files?.[0]
                        if (file) {
                          // Logic upload file và lấy path
                          setNewRequest({ ...newRequest, imagePath: file.name })
                        }
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bạn có thể đính kèm hình ảnh hoặc tài liệu liên quan đến yêu cầu sửa chữa.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateRequestOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                onClick={handleCreateRequest}
                disabled={!newRequest.tieuDe || !newRequest.moTa || newRequest.maHeThong === 0}
              >
                Gửi yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý yêu cầu sửa chữa</CardTitle>
          <CardDescription>
            Quản lý tất cả yêu cầu sửa chữa từ cư dân, bao gồm duyệt, phân công, cập nhật trạng thái và ghi chú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
              <TabsTrigger value="pending">
                Chờ duyệt <Badge variant="outline" className="ml-1">{pendingCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Đã duyệt <Badge variant="outline" className="ml-1">{approvedCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="inProgress">
                Đang thực hiện <Badge variant="outline" className="ml-1">{inProgressCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Hoàn thành <Badge variant="outline" className="ml-1">{completedCount}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm yêu cầu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Hệ thống" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tất cả hệ thống</SelectItem>
                    {currentSystem.map((system) => (
                      <SelectItem key={system.maHeThong} value={system.maHeThong.toString()}>
                        {system.tenHeThong}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Trạng thái" />
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

            {/* Request Table */}
            <div className="rounded-md border">
              {/* Fixed Table Header */}
              <div className="border-b bg-background sticky top-0 z-10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Tiêu đề</TableHead>
                      <TableHead className="w-[150px]">Hệ thống</TableHead>
                      <TableHead className="w-[120px]">Người yêu cầu</TableHead>
                      <TableHead className="w-[120px]">Ngày yêu cầu</TableHead>
                      <TableHead className="w-[100px]">Mức độ</TableHead>
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
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Filter className="h-10 w-10 mb-2" />
                            <p>Không có yêu cầu nào phù hợp với tìm kiếm của bạn.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.maYC}>
                          <TableCell className="w-[200px] font-medium">{request.tieuDe}</TableCell>
                          <TableCell className="w-[150px]">{request.tenHeThong}</TableCell>
                          <TableCell className="w-[120px]">{request.nguoiYeuCau}</TableCell>
                          <TableCell className="w-[120px]">
                            {new Date(request.ngayYeuCau).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            <Badge variant={getPriorityBadgeVariant(request.mucDoYeuCau) as any}>
                              {formatPriority(request.mucDoYeuCau)}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <Badge variant={getStatusBadgeVariant(request.idTrangThai) as any}>
                              {request.tenTrangThai}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[100px] text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Hành động</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsViewRequestOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {request.idTrangThai === 1 && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveRequest(request.maYC)}>
                                      <ThumbsUp className="mr-2 h-4 w-4" />
                                      Duyệt yêu cầu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleRejectRequest(request.maYC)}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Từ chối yêu cầu
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {request.idTrangThai === 2 && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedRequest(request)
                                      setIsAssignRequestOpen(true)
                                    }}
                                  >
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Giao cho nhân viên
                                  </DropdownMenuItem>
                                )}
                                {request.idTrangThai === 3 && (
                                  <DropdownMenuItem onClick={() => handleCompleteRequest(request.maYC)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Đánh dấu hoàn thành
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsUpdateRequestOpen(true)
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Cập nhật yêu cầu
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
              {yeuCauSuaChua && yeuCauSuaChua.totalCount > 0 && (
                <div className="border-t bg-background px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium">{((yeuCauSuaChua.pageNumber || 1) - 1) * (yeuCauSuaChua.pageSize || 10) + 1}</span> đến{" "}
                    <span className="font-medium">
                      {Math.min(yeuCauSuaChua.pageNumber * yeuCauSuaChua.pageSize, yeuCauSuaChua.totalCount)}
                    </span>{" "}
                    trong tổng số <span className="font-medium">{yeuCauSuaChua.totalCount}</span> yêu cầu
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!yeuCauSuaChua.hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, yeuCauSuaChua.totalPages || 1) },
                        (_, i) => {
                          const currentPageNumber = yeuCauSuaChua.pageNumber || 1;
                          const totalPages = yeuCauSuaChua.totalPages || 1;

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
                      disabled={!yeuCauSuaChua.hasNextPage}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isViewRequestOpen} onOpenChange={setIsViewRequestOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRequest.tieuDe}</DialogTitle>
              <DialogDescription>
                Chi tiết yêu cầu sửa chữa từ {selectedRequest.nguoiYeuCau} vào{" "}
                {new Date(selectedRequest.ngayYeuCau).toLocaleString('vi-VN')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Hệ thống</Label>
                  <p className="font-medium">{selectedRequest.tenHeThong}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vị trí</Label>
                  <p className="font-medium">{selectedRequest.maVT || "Chưa xác định"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Người yêu cầu</Label>
                  <p className="font-medium">{selectedRequest.nguoiYeuCau}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày yêu cầu</Label>
                  <p className="font-medium">{new Date(selectedRequest.ngayYeuCau).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mức độ</Label>
                  <div className="pt-1">
                    <Badge variant={getPriorityBadgeVariant(selectedRequest.mucDoYeuCau) as any}>
                      {formatPriority(selectedRequest.mucDoYeuCau)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="pt-1">
                    <Badge variant={getStatusBadgeVariant(selectedRequest.idTrangThai) as any}>
                      {selectedRequest.tenTrangThai}
                    </Badge>
                  </div>
                </div>

                {selectedRequest.nhanVienInYeuCaus && selectedRequest.nhanVienInYeuCaus.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Nhân viên được giao</Label>
                    <div className="pt-1">
                      <div className="flex flex-wrap gap-1">
                        {selectedRequest.nhanVienInYeuCaus.map((staff, index) => (
                          <Badge key={index} variant="secondary">
                            {staff.tenNV}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-muted-foreground">Mô tả yêu cầu</Label>
                  <p className="mt-1 whitespace-pre-line">{selectedRequest.moTa}</p>
                </div>

                {selectedRequest.imagePath && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Tệp đính kèm</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="relative rounded-md border p-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">{selectedRequest.imagePath}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.ghiChu && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Ghi chú</Label>
                    <p className="mt-1">{selectedRequest.ghiChu}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsViewRequestOpen(false)}>
                Đóng
              </Button>
              <div className="flex gap-2">
                {selectedRequest.idTrangThai === 1 && (
                  <>
                    <Button onClick={() => handleApproveRequest(selectedRequest.maYC)}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Duyệt yêu cầu
                    </Button>
                    <Button variant="destructive" onClick={() => handleRejectRequest(selectedRequest.maYC)}>
                      <X className="mr-2 h-4 w-4" />
                      Từ chối
                    </Button>
                  </>
                )}
                {selectedRequest.idTrangThai === 2 && (
                  <Button 
                    onClick={() => {
                      setIsAssignRequestOpen(true)
                      setIsViewRequestOpen(false)
                    }}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Giao việc
                  </Button>
                )}
                {selectedRequest.idTrangThai === 3 && (
                  <Button onClick={() => handleCompleteRequest(selectedRequest.maYC)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Request Dialog */}
      {selectedRequest && (
        <Dialog open={isAssignRequestOpen} onOpenChange={setIsAssignRequestOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Giao việc cho nhân viên</DialogTitle>
              <DialogDescription>
                Chọn nhân viên và thiết lập thông báo cho yêu cầu sửa chữa này.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="font-medium">Yêu cầu: {selectedRequest.tieuDe}</div>
                <div className="text-sm text-muted-foreground">
                  Hệ thống: {selectedRequest.tenHeThong}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vị trí: {selectedRequest.maVT || "Chưa xác định"}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="current-staff">Nhân viên hiện tại</Label>
                  <div className="mt-1 p-2 border rounded-md bg-muted">
                    {selectedRequest.nhanVienInYeuCaus && selectedRequest.nhanVienInYeuCaus.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedRequest.nhanVienInYeuCaus.map((staff, index) => (
                          <Badge key={index} variant="secondary">
                            {staff.tenNV}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Chưa có nhân viên được giao</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="assignedTo">Giao việc cho nhân viên <span className="text-red-500">*</span></Label>
                  <StaffMultiSelect
                    staffList={staffList || []}
                    selectedStaff={assignedStaff}
                    onStaffChange={setAssignedStaff}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledDate">Lịch sửa chữa dự kiến</Label>
                  <Input 
                    id="scheduledDate" 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Thời gian dự kiến để nhân viên thực hiện sửa chữa
                  </p>
                </div>

                <div>
                  <Label>Thông báo</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="sendNotification" 
                      checked={sendNotification}
                      onCheckedChange={(checked) => setSendNotification(!!checked)}
                    />
                    <Label htmlFor="sendNotification" className="text-sm">
                      Gửi thông báo cho nhân viên được giao việc
                    </Label>
                  </div>
                </div>

                {scheduledDate && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-sm">
                      <strong>Thông tin giao việc:</strong>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      • Nhân viên: {assignedStaff.length} người được chọn<br/>
                      • Thời gian: {new Date(scheduledDate).toLocaleString('vi-VN')}<br/>
                      • Thông báo: {sendNotification ? "Có" : "Không"}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAssignRequestOpen(false)
                  setAssignedStaff([])
                  setScheduledDate("")
                  setSendNotification(true)
                }}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                onClick={handleAssignRequest}
                disabled={assignedStaff.length === 0}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Giao yêu cầu ({assignedStaff.length} nhân viên)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Request Dialog */}
      {selectedRequest && (
        <Dialog open={isUpdateRequestOpen} onOpenChange={setIsUpdateRequestOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cập nhật yêu cầu</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin yêu cầu bảo trì để phản ánh tình trạng hiện tại.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="update-title">Tiêu đề yêu cầu</Label>
                  <Input id="update-title" defaultValue={selectedRequest.tieuDe} />
                </div>
                <div>
                  <Label htmlFor="update-category">Hệ thống</Label>
                  <Select defaultValue={selectedRequest.maHeThong.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSystem.map((system) => (
                        <SelectItem key={system.maHeThong} value={system.maHeThong.toString()}>
                          {system.tenHeThong}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="update-priority">Mức độ</Label>
                  <Select defaultValue={selectedRequest.mucDoYeuCau?.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.slice(1).map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="update-location">Vị trí</Label>
                  <Input id="update-location" defaultValue={selectedRequest.maVT} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="update-description">Chi tiết mô tả</Label>
                  <Textarea id="update-description" defaultValue={selectedRequest.moTa} rows={4} />
                </div>
                <div>
                  <Label htmlFor="update-status">Trạng thái</Label>
                  <Select defaultValue={selectedRequest.idTrangThai.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.slice(1).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateRequestOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={() => setIsUpdateRequestOpen(false)}>
                Cập nhật yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
