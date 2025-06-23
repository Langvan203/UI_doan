"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  ListChecks,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCog,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useStatusMaintance } from "../context/StatusMaintance"
import { useMaintancePlan } from "../context/MaintancePlan"
import { useAuth } from "../context/AuthContext"
import { useBuildingSystem } from "../context/BuildingSystemContext"
import { useStaff } from "../context/StaffContext"
import { GetDSNhanVien } from "../type/employee"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GetKeHoachBaoTriDetail, CreateKeHoachBaoTri, chiTietKeHoachBaoTri, GiaoViecChoNhanVien } from "../type/maintancePlan"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

function BuildingBadges({ staffs }: { staffs: GetDSNhanVien[] }) {
  const maxVisible = 2
  const visibleStaff = staffs.slice(0, maxVisible)
  const remainingCount = staffs.length - maxVisible

  if (staffs.length === 0) {
    return <span className="text-muted-foreground text-sm">Chưa phân công</span>
  }

  if (staffs.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {staffs.map((staff, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {staff.tenNV}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleStaff.map((staff, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {staff.tenNV}
        </Badge>
      ))}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-xs cursor-help">
              +{remainingCount}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {staffs.slice(maxVisible).map((staff, index) => (
                <div key={index} className="text-sm">
                  {staff.tenNV}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Component multi-select cho nhân viên
function StaffMultiSelect({
  staffList,
  selectedStaff,
  onStaffChange
}: {
  staffList: GetDSNhanVien[]
  selectedStaff: number[]
  onStaffChange: (staffIds: number[]) => void
}) {
  const [open, setOpen] = useState(false)

  const handleStaffToggle = (staffId: number) => {
    if (selectedStaff.includes(staffId)) {
      onStaffChange(selectedStaff.filter(id => id !== staffId))
    } else {
      onStaffChange([...selectedStaff, staffId])
    }
  }

  const selectedStaffNames = staffList
    .filter(staff => selectedStaff.includes(staff.maNV))
    .map(staff => staff.tenNV)
    .join(", ")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="truncate">
              {selectedStaff.length === 0
                ? "Chọn nhân viên..."
                : selectedStaff.length === 1
                  ? selectedStaffNames
                  : `${selectedStaff.length} nhân viên được chọn`
              }
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm nhân viên..." />
          <CommandEmpty>Không tìm thấy nhân viên nào.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {staffList.map((staff) => (
                <CommandItem
                  key={staff.maNV}
                  onSelect={() => handleStaffToggle(staff.maNV)}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={selectedStaff.includes(staff.maNV)}
                    onChange={() => handleStaffToggle(staff.maNV)}
                  />
                  <span>{staff.tenNV}</span>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function MaintenancePlanManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<GetKeHoachBaoTriDetail>()
  const [isViewPlanDialogOpen, setIsViewPlanDialogOpen] = useState(false)
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false)
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [reassignStaff, setReassignStaff] = useState<number[]>([])
  const [notifyOldStaff, setNotifyOldStaff] = useState(true)
  const [notifyNewStaff, setNotifyNewStaff] = useState(true)
  // State cho form thêm mới kế hoạch
  const [newPlan, setNewPlan] = useState<CreateKeHoachBaoTri>({
    tenKeHoach: "",
    loaiBaoTri: 1,
    maHeThong: 0,
    maTrangThai: 1,
    tanSuat: 1,
    moTaCongViec: "",
    ngayBaoTri: new Date(),
    chiTietBaoTris: [],
    danhSachNhanVien: []
  })


  // State cho danh sách công việc mới
  const [newPlanTasks, setNewPlanTasks] = useState<chiTietKeHoachBaoTri[]>([])

  // Thêm state cho form sửa kế hoạch
  const [editPlan, setEditPlan] = useState<CreateKeHoachBaoTri>({
    tenKeHoach: "",
    loaiBaoTri: 1,
    maHeThong: 0,
    maTrangThai: 1,
    tanSuat: 1,
    moTaCongViec: "",
    ngayBaoTri: new Date(),
    chiTietBaoTris: [],
    danhSachNhanVien: []
  })


  const [editPlanTasks, setEditPlanTasks] = useState<chiTietKeHoachBaoTri[]>([])

  const frequencies = [
    { value: 1, label: "Một lần" },
    { value: 2, label: "Hàng ngày" },
    { value: 3, label: "Hàng tuần" },
    { value: 4, label: "Hàng tháng" },
    { value: 5, label: "Hàng quý" },
    { value: 6, label: "Hàng năm" },
  ]

  const maintenanceTypes = [
    { value: 1, label: "Định kỳ" },
    { value: 2, label: "Phòng ngừa" },
    { value: 3, label: "Sửa chữa" },
    { value: 4, label: "Khẩn cấp" },
  ]

  const { token } = useAuth()
  // danh sách trạng thái bảo trì
  const { statusMaintance, getStatusMaintance } = useStatusMaintance()
  // danh sách kế hoạch bảo trì
  const { danhSachKeHoachBaoTri, getDanhSachKeHoachBaoTri,
    addMaintancePlan, giaoViecNhanVien,
    batDauKeHoachBaoTri,
    hoanThanhKeHoachBaoTri,
    huyKeHoachBaoTri,
    deleteMaintancePlan,
  } = useMaintancePlan()
  // danh sách hệ thống
  const { heThong, getDanhSachHeThong } = useBuildingSystem()
  // danh sách nhân viên
  const { staffList, getStaffList } = useStaff()

  // khởi tạo
  useEffect(() => {
    if (token) {
      // Lấy danh sách trạng thái bảo trì
      getStatusMaintance()
      // Lấy danh sách hệ thống
      getDanhSachHeThong(0)
      // Lấy danh sách kế hoạch bảo trì
      getDanhSachKeHoachBaoTri(currentPage)
      // Lấy danh sách nhân viên
      getStaffList()
    }
  }, [token, currentPage])

  const currentSystem = heThong?.data || []

  // Filter plans based on search and status filter
  const filteredPlans = danhSachKeHoachBaoTri?.data.filter((plan) => {
    const matchesSearch =
      plan.tenHeThong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.tenKeHoach.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.nhanVienInBaoTris.some(x => x.tenNV.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === "all" || plan.trangThai.toString() === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Function to add a new task to the list when creating a plan
  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      const newTask: chiTietKeHoachBaoTri = {
        ghiChu: newTaskDescription.trim(),
        maTrangThai: 1 // Chưa thực hiện
      }
      setNewPlanTasks([...newPlanTasks, newTask])
      setNewTaskDescription("")
    }
  }

  // Function to remove a task from the list when creating a plan
  const handleRemoveTask = (index: number) => {
    setNewPlanTasks(newPlanTasks.filter((_, i) => i !== index))
  }

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case 1: return "secondary" // Chưa thực hiện
      case 2: return "default"   // Đang thực hiện
      case 3: return "success"   // Hoàn thành
      case 4: return "destructive" // Đã hủy
      default: return "outline"
    }
  }

  // Function to format status for display
  const formatStatus = (status: number) => {
    const statusItem = statusMaintance?.find(s => s.maTrangThai === status)
    return statusItem?.tenTrangThai || "Không xác định"
  }

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle form submission for new plan
  const handleAddPlan = async () => {
    try {
      const planToSubmit = {
        ...newPlan,
        chiTietBaoTris: newPlanTasks
      }
      console.log("Submitting new plan:", planToSubmit)
      await addMaintancePlan(planToSubmit)
      setIsAddPlanDialogOpen(false)
      // Reset form
      setNewPlan({
        tenKeHoach: "",
        loaiBaoTri: 1,
        maHeThong: 0,
        maTrangThai: 1,
        tanSuat: 1,
        moTaCongViec: "",
        ngayBaoTri: new Date(),
        chiTietBaoTris: [],
        danhSachNhanVien: []
      })
      setNewPlanTasks([])
      // Refresh data
      getDanhSachKeHoachBaoTri(currentPage)
    } catch (error) {
      console.error("Error adding maintenance plan:", error)
    }
  }

  // Hàm xử lý khi mở form sửa
  const handleEditPlan = (plan: GetKeHoachBaoTriDetail) => {
    setEditPlan({
      tenKeHoach: plan.tenKeHoach,
      loaiBaoTri: plan.loaiBaoTri || 1,
      maHeThong: plan.maHeThong,
      maTrangThai: plan.trangThai,
      tanSuat: plan.tanSuat,
      moTaCongViec: plan.moTa || "",
      ngayBaoTri: new Date(plan.ngayBaoTri),
      chiTietBaoTris: plan.chiTietInKeHoachBaoTris || [],
      danhSachNhanVien: plan.nhanVienInBaoTris.map(nv => nv.maNV) || []
    })
    setEditPlanTasks(plan.chiTietInKeHoachBaoTris || [])
    setIsEditPlanDialogOpen(true)
  }

  const handleGiaoViec = async () => {
    if (!selectedPlan || reassignStaff.length === 0) {
      console.error("Chưa chọn kế hoạch hoặc nhân viên")
      return
    }

    const giaoViecData: GiaoViecChoNhanVien = {
      maKeHoach: selectedPlan.maKeHoach,
      maNV: reassignStaff,
      isThongBaoNhanVienCu: notifyOldStaff,
      isThongBaoNhanVienMoi: notifyNewStaff
    }

    try {
      console.log("Giao việc cho nhân viên:", giaoViecData)
      await giaoViecNhanVien(giaoViecData)

      // Reset và đóng dialog
      setReassignStaff([])
      setIsReassignDialogOpen(false)

      // Refresh data
      getDanhSachKeHoachBaoTri(currentPage)

      // Thông báo thành công (nếu có toast)
      // toast.success("Giao việc thành công!")
    } catch (error) {
      console.error("Error assigning staff:", error)
      // toast.error("Lỗi khi giao việc!")
    }
  }

  async function batDau(maKeHoach: number) {
    await batDauKeHoachBaoTri(maKeHoach)
    setIsViewPlanDialogOpen(false)
  }
  async function hoanThanh(maKeHoach: number) {
    await hoanThanhKeHoachBaoTri(maKeHoach)
    setIsViewPlanDialogOpen(false)
  }
  async function huyKeHoach(maKeHoach: number) {
    await huyKeHoachBaoTri(maKeHoach)
    setIsViewPlanDialogOpen(false)
  }

  async function handleDeleteKeHoach(maKeHoach: number) {
    await deleteMaintancePlan(maKeHoach)
    setIsViewPlanDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kế hoạch bảo trì</h1>
        <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm kế hoạch mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Thêm mới kế hoạch bảo trì</DialogTitle>
              <DialogDescription>
                Thiết lập các thông tin cần thiết cho kế hoạch bảo trì mới, bao gồm tiêu đề, hệ thống, tần suất và ngày dự kiến.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 py-4 pr-1 pl-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề kế hoạch bảo trì"
                      value={newPlan.tenKeHoach}
                      onChange={(e) => setNewPlan({ ...newPlan, tenKeHoach: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="system">Hệ thống <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.maHeThong.toString()}
                      onValueChange={(value) => setNewPlan({ ...newPlan, maHeThong: Number(value) })}
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
                    <Label htmlFor="type">Loại bảo trì <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.loaiBaoTri.toString()}
                      onValueChange={(value) => setNewPlan({ ...newPlan, loaiBaoTri: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bảo trì" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value.toString()}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="frequency">Tần suất <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.tanSuat.toString()}
                      onValueChange={(value) => setNewPlan({ ...newPlan, tanSuat: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tần suất" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((frequency) => (
                          <SelectItem key={frequency.value} value={frequency.value.toString()}>
                            {frequency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduledDate">Ngày bảo trì <span className="text-red-500">*</span></Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={newPlan.ngayBaoTri instanceof Date ? newPlan.ngayBaoTri.toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewPlan({ ...newPlan, ngayBaoTri: new Date(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Trạng thái <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.maTrangThai.toString()}
                      onValueChange={(value) => setNewPlan({ ...newPlan, maTrangThai: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
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
                    <Label htmlFor="assignedTo">Giao việc cho <span className="text-red-500">*</span></Label>
                    <StaffMultiSelect
                      staffList={staffList || []}
                      selectedStaff={newPlan.danhSachNhanVien}
                      onStaffChange={(staffIds) => setNewPlan({ ...newPlan, danhSachNhanVien: staffIds })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả kế hoạch bảo trì"
                      value={newPlan.moTaCongViec}
                      onChange={(e) => setNewPlan({ ...newPlan, moTaCongViec: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Danh sách công việc</Label>
                      <span className="text-xs text-muted-foreground">Thêm chi tiết công việc cho kế hoạch bảo trì này</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        placeholder="Nhập mô tả công việc"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddTask()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTask} size="sm">
                        Thêm
                      </Button>
                    </div>
                    <div className="rounded-md border">
                      {newPlanTasks.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          Chưa có công việc nào được thêm vào. Vui lòng nhập mô tả công việc và nhấn "Thêm".
                        </div>
                      ) : (
                        <ul className="divide-y">
                          {newPlanTasks.map((task, index) => (
                            <li key={index} className="flex items-center justify-between p-3">
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{task.ghiChu}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveTask(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-shrink-0 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewPlanTasks([])
                  setIsAddPlanDialogOpen(false)
                }}
              >
                Hủy
              </Button>
              <Button type="submit" onClick={handleAddPlan}>
                Thêm kế hoạch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả kế hoạch bảo trì</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả các kế hoạch bảo trì hệ thống trong tòa nhà của bạn. Tìm kiếm, lọc và xem chi tiết từng kế hoạch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters - Cải thiện UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm kế hoạch bảo trì..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {statusMaintance?.map((status) => (
                      <SelectItem key={status.maTrangThai} value={status.maTrangThai.toString()}>
                        {status.tenTrangThai}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Maintenance Plans Table with Fixed Header and ScrollArea */}
            <div className="rounded-md border">
              {/* Fixed Table Header */}
              <div className="border-b bg-background sticky top-0 z-10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Tên kế hoạch</TableHead>
                      <TableHead className="w-[150px]">Hệ thống</TableHead>
                      <TableHead className="w-[120px]">Ngày bảo trì</TableHead>
                      <TableHead className="w-[100px]">Tần suất</TableHead>
                      <TableHead className="w-[180px]">Nhân viên thực hiện</TableHead>
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
                    {filteredPlans?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Filter className="h-10 w-10 mb-2" />
                            <p>Không có kế hoạch bảo trì nào phù hợp với tìm kiếm của bạn.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlans?.map((plan) => (
                        <TableRow key={plan.maKeHoach}>
                          <TableCell className="w-[200px] font-medium">{plan.tenKeHoach}</TableCell>
                          <TableCell className="w-[150px]">{plan.tenHeThong}</TableCell>
                          <TableCell className="w-[120px]">{new Date(plan.ngayBaoTri).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell className="w-[100px]">
                            {frequencies.find(f => f.value === plan.tanSuat)?.label || plan.tanSuat}
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <BuildingBadges staffs={plan.nhanVienInBaoTris} />
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <Badge variant={getStatusBadgeVariant(plan.trangThai) as any}>
                              {formatStatus(plan.trangThai)}
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
                                    setSelectedPlan(plan)
                                    setIsViewPlanDialogOpen(true)
                                  }}
                                >
                                  <ListChecks className="mr-2 h-4 w-4" />
                                  Xem chi tiết kế hoạch
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setIsReassignDialogOpen(true)
                                  }}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Giao việc cho nhân viên
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setIsRescheduleDialogOpen(true)
                                  }}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Đặt lại lịch bảo trì
                                </DropdownMenuItem> */}
                                <DropdownMenuItem onClick={() => handleDeleteKeHoach(plan.maKeHoach)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa kế hoạch
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
              {danhSachKeHoachBaoTri && danhSachKeHoachBaoTri.totalCount > 0 && (
                <div className="border-t bg-background px-4 py-3 flex items-center justify-between">
                  {/* Pagination Info */}
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium">{((danhSachKeHoachBaoTri.pageNumber || 1) - 1) * (danhSachKeHoachBaoTri.pageSize || 10) + 1}</span> đến{" "}
                    <span className="font-medium">
                      {Math.min(danhSachKeHoachBaoTri.pageNumber * danhSachKeHoachBaoTri.pageSize, danhSachKeHoachBaoTri.totalCount)}
                    </span>{" "}
                    trong tổng số <span className="font-medium">{danhSachKeHoachBaoTri.totalCount}</span> kế hoạch
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!danhSachKeHoachBaoTri.hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, danhSachKeHoachBaoTri.totalPages || 1) },
                        (_, i) => {
                          const currentPageNumber = danhSachKeHoachBaoTri.pageNumber || 1;
                          const totalPages = danhSachKeHoachBaoTri.totalPages || 1;

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
                      disabled={!danhSachKeHoachBaoTri.hasNextPage}
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

      {/* View Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={isViewPlanDialogOpen} onOpenChange={setIsViewPlanDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{selectedPlan.tenKeHoach}</DialogTitle>
              <DialogDescription>
                Chi tiết kế hoạch bảo trì cho hệ thống {selectedPlan.tenHeThong}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="details" className="w-full h-full flex flex-col">
                <TabsList className="w-full flex-shrink-0">
                  <TabsTrigger value="details" className="flex-1">Chi tiết</TabsTrigger>
                  <TabsTrigger value="tasks" className="flex-1">Danh sách công việc</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">Lịch sử</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="details" className="space-y-4 pt-4 h-full">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Hệ thống</Label>
                        <p className="font-medium">{selectedPlan.tenHeThong}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tần suất</Label>
                        <p className="font-medium">
                          {frequencies.find(f => f.value === selectedPlan.tanSuat)?.label || selectedPlan.tanSuat}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ngày bảo trì</Label>
                        <p className="font-medium">{new Date(selectedPlan.ngayBaoTri).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trạng thái</Label>
                        <div className="pt-1">
                          <Badge variant={getStatusBadgeVariant(selectedPlan.trangThai) as any}>
                            {formatStatus(selectedPlan.trangThai)}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Nhân viên được giao</Label>
                        <div className="pt-1">
                          {selectedPlan.nhanVienInBaoTris.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedPlan.nhanVienInBaoTris.map((staff, index) => (
                                <Badge key={index} variant="secondary">
                                  {staff.tenNV}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Chưa phân công</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Mô tả</Label>
                        <p className="font-medium">{selectedPlan.moTa || "Không có mô tả"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="pt-4 h-full">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-2 flex-shrink-0">
                        <CardTitle>Danh sách công việc</CardTitle>
                        <CardDescription>Danh sách công việc để hoàn thành kế hoạch bảo trì</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                          {selectedPlan.chiTietInKeHoachBaoTris.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <ListChecks className="h-12 w-12 mx-auto mb-2" />
                              <p>Chưa có công việc nào được thiết lập</p>
                            </div>
                          ) : (
                            <ul className="space-y-2">
                              {selectedPlan.chiTietInKeHoachBaoTris.map((task, index) => (
                                <li key={index} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                                  <div className={`mt-0.5 h-5 w-5 flex-shrink-0 ${task.maTrangThai === 3 ? "text-green-500" : task.maTrangThai === 2 ? "text-blue-500" : "text-muted-foreground"}`}>
                                    {task.maTrangThai === 3 ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : task.maTrangThai === 2 ? (
                                      <Clock className="h-5 w-5" />
                                    ) : (
                                      <Clock className="h-5 w-5" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`${task.maTrangThai === 3 ? "line-through text-muted-foreground" : ""}`}>
                                      {index + 1}. {task.ghiChu}
                                    </p>
                                    <div className="mt-1">
                                      <Badge
                                        variant={getStatusBadgeVariant(task.maTrangThai) as any}
                                        className="text-xs"
                                      >
                                        {formatStatus(task.maTrangThai)}
                                      </Badge>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="flex-shrink-0">
                        <div className="text-sm text-muted-foreground">
                          {selectedPlan.chiTietInKeHoachBaoTris.filter((t: any) => t.trangThai === 3).length} của {selectedPlan.chiTietInKeHoachBaoTris.length} công việc đã hoàn thành
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="pt-4 h-full">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-2 flex-shrink-0">
                        <CardTitle>Lịch sử bảo trì</CardTitle>
                        <CardDescription>
                          Danh sách các lần bảo trì đã thực hiện cho kế hoạch này
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                          {(selectedPlan?.lichSuBaoTriKeHoaches?.length || 0) === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <p>Chưa có lịch sử bảo trì nào</p>
                            </div>
                          ) : (
                            <ul className="space-y-3">
                              {selectedPlan?.lichSuBaoTriKeHoaches?.map((history, index) => (
                                <li key={index} className="flex items-start space-x-3 border-b pb-3 last:border-b-0">
                                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div className="flex-1">
                                    <p className="font-medium">{history.tieuDe}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(history.ngayCapNhat).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-sm mt-1">{history.noiDung}</p>
                                  </div>
                                </li>
                              )) || []}
                            </ul>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <DialogFooter className="flex-shrink-0 border-t pt-4 flex justify-between items-center sm:justify-between">
              <Button variant="outline" onClick={() => setIsViewPlanDialogOpen(false)}>
                Đóng
              </Button>
              <div className="flex space-x-2">
                {selectedPlan.trangThai === 1 && (
                  <Button onClick={() => batDau(selectedPlan.maKeHoach)} variant="default">
                    <Wrench className="mr-2 h-4 w-4" />
                    Bắt đầu kế hoạch
                  </Button>
                )}
                {selectedPlan.trangThai === 2 && (
                  <div className="flex space-x-2">
                    <Button onClick={() => hoanThanh(selectedPlan.maKeHoach)} variant="default">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Đánh dấu hoàn thành
                    </Button>
                    <Button onClick={() => huyKeHoach(selectedPlan.maKeHoach)} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hủy kế hoạch
                    </Button>
                  </div>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reassign Dialog */}
      {/* Reassign Dialog */}
      {selectedPlan && (
        <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Giao việc cho nhân viên: {selectedPlan.tenKeHoach}</DialogTitle>
              <DialogDescription>
                Chọn nhân viên mới để giao kế hoạch bảo trì này và cung cấp lý do cho việc giao việc lại.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-4">
                  <div className="font-medium">Kế hoạch hiện tại: {selectedPlan.tenKeHoach}</div>
                  <div className="text-sm text-muted-foreground">Cho {selectedPlan.tenHeThong}</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="reassign-current">Nhân viên hiện tại</Label>
                    <div className="mt-1 p-2 border rounded-md bg-muted">
                      {selectedPlan.nhanVienInBaoTris.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedPlan.nhanVienInBaoTris.map((staff, index) => (
                            <Badge key={index} variant="secondary">
                              {staff.tenNV}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Chưa phân công</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reassign-new">Giao việc cho nhân viên mới</Label>
                    <StaffMultiSelect
                      staffList={staffList || []}
                      selectedStaff={reassignStaff} // Sử dụng state mới
                      onStaffChange={setReassignStaff} // Cập nhật state
                    />
                  </div>
                  <div>
                    <Label>Thông báo</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notify-old"
                          checked={notifyOldStaff}
                          onCheckedChange={(checked) => setNotifyOldStaff(!!checked)}
                        />
                        <Label htmlFor="notify-old" className="text-sm">
                          Thông báo nhân viên cũ
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notify-new"
                          checked={notifyNewStaff}
                          onCheckedChange={(checked) => setNotifyNewStaff(!!checked)}
                        />
                        <Label htmlFor="notify-new" className="text-sm">
                          Thông báo nhân viên mới
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsReassignDialogOpen(false)
                setReassignStaff([]) // Reset state
              }}>
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleGiaoViec}
                disabled={reassignStaff.length === 0} // Disable nếu chưa chọn nhân viên
              >
                Giao việc
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog - Giữ nguyên như cũ */}
      {selectedPlan && (
        <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Đặt lại lịch bảo trì: {selectedPlan.tenKeHoach}</DialogTitle>
              <DialogDescription>
                Chọn ngày mới cho kế hoạch bảo trì này và cung cấp lý do cho việc đặt lại lịch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-4">
                  <div className="font-medium">Kế hoạch hiện tại: {selectedPlan.tenKeHoach}</div>
                  <div className="text-sm text-muted-foreground">Cho {selectedPlan.tenHeThong}</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="current-date">Ngày hiện tại</Label>
                    <Input
                      id="current-date"
                      type="date"
                      value={selectedPlan.ngayBaoTri.split("T")[0]}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-date">Ngày mới</Label>
                    <Input id="new-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="reschedule-reason">Lý do đặt lại lịch</Label>
                    <Textarea
                      id="reschedule-reason"
                      placeholder="Cung cấp lý do cho việc đặt lại lịch kế hoạch bảo trì này"
                    />
                  </div>
                  <div>
                    <Label>Điều chỉnh ngày bảo trì</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="adjust-future" />
                      <Label htmlFor="adjust-future" className="text-sm">
                        Điều chỉnh ngày bảo trì trong tương lai
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Label>Thông báo</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify-assigned" defaultChecked />
                        <Label htmlFor="notify-assigned" className="text-sm">
                          Thông báo nhân viên được giao
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify-manager" defaultChecked />
                        <Label htmlFor="notify-manager" className="text-sm">
                          Thông báo quản lý
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={() => setIsRescheduleDialogOpen(false)}>
                Đặt lại lịch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
