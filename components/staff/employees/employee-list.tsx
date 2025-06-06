"use client"

import { useEffect, useMemo, useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash, UserCog, Building, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"
import { EmployeeForm } from "./employee-form"
import { EmployeeFilterForm } from "./employee-filter-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEmployee } from "@/components/context/EmployeeContext"
import { NhanVienRoles, NhanVienInToaNha, NhanVienPhongBan, GetDSNhanVienDto } from "@/components/type/Staff"
import { useRole } from "@/components/context/RoleContext"
import { useDepartment } from "@/components/context/DepartmentContext"
import { useBuilding } from "@/components/context/BuildingContext"
import { Input } from "@/components/ui/input"
import { get } from "http"
import { set } from "date-fns"


function RoleBadges({ roles }: { roles: NhanVienRoles[] }) {
  const maxVisible = 1
  const visibleRoles = roles.slice(0, maxVisible)
  const remainingCount = roles.length - maxVisible
  if (roles.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {role.roleName}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleRoles.map((role, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {role.roleName}
        </Badge>
      ))}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="text-xs cursor-help">
              +{remainingCount}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {roles.slice(maxVisible).map((role, index) => (
                <div key={index} className="text-sm">
                  {role.roleName}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function BuildingBadges({ buildings }: { buildings: NhanVienInToaNha[] }) {
  const maxVisible = 1
  const visibleBuildings = buildings.slice(0, maxVisible)
  const remainingCount = buildings.length - maxVisible

  if (buildings.length === 0) {
    return <span className="text-muted-foreground text-sm">Chưa phân công</span>
  }

  if (buildings.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {buildings.map((building, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {building.tenTN}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleBuildings.map((building, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {building.tenTN}
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
              {buildings.slice(maxVisible).map((building, index) => (
                <div key={index} className="text-sm">
                  {building.tenTN}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function DepartmentBadge({ departments }: { departments: NhanVienPhongBan[] }) {
  const maxVisible = 1
  const visibleDepartment = departments.slice(0, maxVisible)
  const remainingCount = departments.length - maxVisible
  // console.log(departments)
  if (departments.length === 0) {
    return <span className="text-muted-foreground text-sm">Chưa phân công</span>
  }

  if (departments.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {departments.map((department, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {department.tenPB}, tòa nhà {department.tenTN}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleDepartment.map((department, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {department.tenPB}, tòa nhà {department.tenTN}
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
              {departments.slice(maxVisible).map((department, index) => (
                <div key={index} className="text-sm">
                  {department.tenPB}, tòa nhà {department.tenTN}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

interface EmployeeListProps {
  filteredEmployees?: GetDSNhanVienDto[];
}

export function EmployeeList({ filteredEmployees }: EmployeeListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<any>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<Number[]>([])
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [isBuildingDialogOpen, setIsBuildingDialogOpen] = useState(false)
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const { employees, updateEmployeeRoles, updateEmployeeDepartments, updateEmployeeBuildings, getListEmployee } = useEmployee()
  useEffect(() => {
    console.log('Employees updated in context:', employees.length);
    // Force re-render khi employees thay đổi
    setForceUpdate(prev => prev + 1);
  }, [employees]);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getListEmployee();
      } catch (error) {
        console.error('Error loading initial employee data:', error);
      }
    };

    // Chỉ load nếu chưa có data
    if (employees.length === 0) {
      loadInitialData();
    }
  }, []);
  const [localFilteredEmployees, setLocalFilteredEmployees] = useState<GetDSNhanVienDto[]>([])
  const { roles } = useRole();
  const { departments } = useDepartment()
  const { buildingDetails } = useBuilding()


  const [isInfoTabEditing, setIsInfoTabEditing] = useState(false)
  const [isDepartmentTabEditing, setIsDepartmentTabEditing] = useState(false)
  const [isBuildingTabEditing, setIsBuildingTabEditing] = useState(false)
  const [isRoleTabEditing, setIsRoleTabEditing] = useState(false)
  const [editedEmployeeInfo, setEditedEmployeeInfo] = useState({
    maNV: '',
    tenNV: '',
    userName: '',
    email: '',
    sdt: '',
    ngaySinh: '',
    diaChiThuongTru: ''
  })

  // State để lưu các lựa chọn của nhân viên
  const [selectedEmployeeDepartments, setSelectedEmployeeDepartments] = useState<number[]>([])
  const [selectedEmployeeBuildings, setSelectedEmployeeBuildings] = useState<number[]>([])
  const [selectedEmployeeRoles, setSelectedEmployeeRoles] = useState<number[]>([])
  // Sử dụng filteredEmployees từ props nếu có, không thì dùng all employees

  // Function để toggle trạng thái chỉnh sửa thông tin cá nhân
  const handleEmployeeRoleToggle = (roleId: number) => {
    if (selectedEmployeeRoles.includes(roleId)) {
      setSelectedEmployeeRoles(selectedEmployeeRoles.filter((id) => id !== roleId))
    } else {
      setSelectedEmployeeRoles([...selectedEmployeeRoles, roleId])
    }
  }
  // Thay đổi điều kiện để chỉ dùng filteredEmployees khi có dữ liệu thực sự

  // Function save roles

  // Update function view employee
  const handleEmployeeDepartmentToggle = (deptId: number) => {
    if (selectedEmployeeDepartments.includes(deptId)) {
      setSelectedEmployeeDepartments(selectedEmployeeDepartments.filter((id) => id !== deptId))
    } else {
      setSelectedEmployeeDepartments([...selectedEmployeeDepartments, deptId])
    }
  }

  const handleEmployeeBuildingToggle = (buildingId: number) => {
    if (selectedEmployeeBuildings.includes(buildingId)) {
      setSelectedEmployeeBuildings(selectedEmployeeBuildings.filter((id) => id !== buildingId))
    } else {
      setSelectedEmployeeBuildings([...selectedEmployeeBuildings, buildingId])
    }
  }


  // Function để save thông tin cá nhân:
  const handleSaveEmployeeInfo = () => {
    // TODO: Implement API call
    console.log('Saving employee info:', editedEmployeeInfo)
    setIsInfoTabEditing(false)
    toast.success(`Thông tin của ${editedEmployeeInfo.tenNV} đã được cập nhật thành công.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

    // Cập nhật selectedEmployee với thông tin mới
    if (selectedEmployee) {
      setSelectedEmployee({
        ...selectedEmployee,
        ...editedEmployeeInfo
      })
    }
  }

  // Function để save phòng ban:
  const handleSaveEmployeeDepartments = () => {
    // TODO: Implement API call với selectedEmployeeDepartments
    console.log('Saving departments for employee:', selectedEmployee?.maNV, 'Departments:', selectedEmployeeDepartments)

    setIsDepartmentTabEditing(false)
    toast.success(`phòng ban đã được cập nhật thành công.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  // Function để save tòa nhà:
  const handleSaveEmployeeBuildings = () => {
    // TODO: Implement API call với selectedEmployeeBuildings
    console.log('Saving buildings for employee:', selectedEmployee?.maNV, 'Buildings:', selectedEmployeeBuildings)

    setIsBuildingTabEditing(false)
    toast.success(`Nhân viên đã được cập nhật thành công.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  // Function để save roles:
  const handleSaveEmployeeRoles = () => {
    // TODO: Implement API call với selectedEmployeeRoles
    console.log('Saving roles for employee:', selectedEmployee?.maNV, 'Roles:', selectedEmployeeRoles)

    setIsRoleTabEditing(false)
    toast.success(`tòa nhà của nhân viên đã được cập nhật thành công.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  // Update function view employee:
  const handleViewEmployeeUpdated = (employee: any) => {
    setSelectedEmployee(employee)
    setIsReturningFromDetailView(false);

    // Khởi tạo các states với dữ liệu hiện tại
    setEditedEmployeeInfo({
      maNV: employee.maNV,
      tenNV: employee.tenNV,
      userName: employee.userName,
      email: employee.email,
      sdt: employee.sdt,
      ngaySinh: employee.ngaySinh,
      diaChiThuongTru: employee.diaChiThuongTru
    })

    setSelectedEmployeeDepartments(employee.phongBans.map((dept: any) => dept.maPB))
    setSelectedEmployeeBuildings(employee.toaNhas.map((building: any) => Number(building.MaTN)))
    setSelectedEmployeeRoles(employee.roles.map((role: any) => role.roleID))

    // Reset editing states
    setIsInfoTabEditing(false)
    setIsDepartmentTabEditing(false)
    setIsBuildingTabEditing(false)
    setIsRoleTabEditing(false)
  }
  const handleDeleteEmployee = (id: number) => {
    // Implementation for delete
    toast.success(`Nhân viên đã được cập nhật thành công.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleManageRoles = (employee: any) => {
    setCurrentEmployee(employee)
    setSelectedRoles(employee.roles.map((role: any) => role.roleName))
    setIsRoleDialogOpen(true)
  }

  const handleSaveRoles = async () => {
    if (!selectedEmployee) return;

    try {
      // Lấy roleIds từ selectedRoles (cần map từ roleName sang roleID)

      await updateEmployeeRoles(selectedEmployee.maNV, selectedEmployeeRoles);
      const updatedEmployees = await getListEmployee();

      const updatedEmployee = updatedEmployees.find(
        (emp: any) => emp.maNV === selectedEmployee.maNV
      );
      if (updatedEmployee) {
        setSelectedEmployee(updatedEmployee);
        setSelectedRoles(updatedEmployee.roles.map((role: any) => Number(role.roleID)));
      }
      setIsRoleDialogOpen(false);
      setIsRoleTabEditing(false);
      toast.success(`Role của ${selectedEmployee.tenNV} đã được cập nhật thành công.`, {
        position: "top-right",
        autoClose: 500
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật role!");
      console.error('Error updating roles:', error);
    }
  }

  const handleRoleToggle = (role: number) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleManageDepartments = (employee: any) => {
    setCurrentEmployee(employee)
    setSelectedDepartments(employee.phongBans.map((dept: any) => dept.maPB))
    setIsDepartmentDialogOpen(true)
  }

  const handleDepartmentToggle = (deptId: number) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(selectedDepartments.filter((id) => id !== deptId))
    } else {
      setSelectedDepartments([...selectedDepartments, deptId])
    }
  }

  const handleSaveDepartments = async () => {
    if (!selectedEmployee)
      return;

    try {

      await updateEmployeeDepartments(selectedEmployee.maNV, selectedEmployeeDepartments);
      const updatedEmployees = await getListEmployee();

      // 3. Tìm nhân viên đã cập nhật trong danh sách mới
      const updatedEmployee = updatedEmployees.find(
        (emp: any) => emp.maNV === selectedEmployee.maNV
      );

      // 4. Cập nhật state cho chi tiết nhân viên
      if (updatedEmployee) {
        setSelectedEmployee(updatedEmployee);
        // Cũng cập nhật danh sách tòa nhà được chọn
        setSelectedEmployeeDepartments(
          updatedEmployee.phongBans.map((dept: any) => Number(dept.maPB))
        );
        setIsDepartmentDialogOpen(false);
        setIsDepartmentTabEditing(false);
        toast.success(`Phòng ban của ${selectedEmployee.tenNV} đã được cập nhật thành công.`, {
          position: "top-right",
          autoClose: 500
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật phòng ban!");
      console.error('Error updating departments:', error);
    }
  }

  const handleManageBuildings = (employee: any) => {
    setCurrentEmployee(employee)
    setSelectedBuildings(employee.toaNhas.map((building: any) => building.TenTN))
    setIsBuildingDialogOpen(true)
  }

  const handleBuildingToggle = (building: string) => {
    if (selectedBuildings.includes(building)) {
      setSelectedBuildings(selectedBuildings.filter((b) => b !== building))
    } else {
      setSelectedBuildings([...selectedBuildings, building])
    }
  }

  const handleSaveBuildings = async () => {
    if (!selectedEmployee) return;

    try {
      console.log("Cập nhật tòa nhà:", selectedEmployeeBuildings);

      // 1. Gọi API cập nhật
      await updateEmployeeBuildings(selectedEmployee.maNV, selectedEmployeeBuildings);

      const updatedEmployees = await getListEmployee();

      const updatedEmployee = updatedEmployees.find(
        (emp: any) => emp.maNV === selectedEmployee.maNV
      );

      if (updatedEmployee) {
        setSelectedEmployee(updatedEmployee);
        setSelectedEmployeeBuildings(
          updatedEmployee.toaNhas.map((building: any) => Number(building.maTN))
        );
      }

      // 6. Đóng dialog chỉnh sửa 
      setIsBuildingTabEditing(false);

      toast.success(`Tòa nhà của ${selectedEmployee.tenNV} đã được cập nhật thành công.`, {
        position: "top-right",
        autoClose: 500
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật tòa nhà!");
      console.error('Error updating buildings:', error);
    }
  }

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee)
  }

  const [forceUpdate, setForceUpdate] = useState(0);
  const [isReturningFromDetailView, setIsReturningFromDetailView] = useState(false); // State mới

  useEffect(() => {
    if (filteredEmployees && filteredEmployees.length > 0) {
      setLocalFilteredEmployees(filteredEmployees);
    }
  }, [filteredEmployees, employees, forceUpdate]);

  const displayEmployees = useMemo(() => {
    if (isReturningFromDetailView) {
      return employees;
    }
    if (filteredEmployees && filteredEmployees.length > 0) {
      return filteredEmployees;
    }
    return employees;
  }, [employees, filteredEmployees, forceUpdate, isReturningFromDetailView]);
  useEffect(() => {
    if (isReturningFromDetailView) {
      setIsReturningFromDetailView(false);
    }
  }, [isReturningFromDetailView]);

  const handleBackToList = async () => {
    try {
      console.log('Quay lại danh sách - bắt đầu cập nhật');
      setSelectedEmployee(null);
      setIsReturningFromDetailView(true);
      setForceUpdate(prev => prev + 1);
      console.log('Quay lại danh sách - hoàn thành');
    } catch (error) {
      console.error('Lỗi khi cập nhật danh sách:', error);
      // Vẫn quay lại dù có lỗi
      setSelectedEmployee(null);
      setForceUpdate(prev => prev + 1);
      setIsReturningFromDetailView(true);
    }
  };
  return (
    <div className="space-y-4">
      {!selectedEmployee ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Danh sách Nhân viên</h3>
              <p className="text-sm text-muted-foreground">
                Hiển thị {displayEmployees.length} / {employees.length} nhân viên
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentEmployee(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{currentEmployee ? "Chỉnh sửa Nhân viên" : "Thêm Nhân viên mới"}</DialogTitle>
                  <DialogDescription>
                    {currentEmployee
                      ? "Chỉnh sửa thông tin nhân viên hiện tại."
                      : "Thêm nhân viên mới vào hệ thống. Nhấn lưu khi hoàn tất."}
                  </DialogDescription>
                </DialogHeader>
                <EmployeeForm
                  employee={currentEmployee}
                  onSave={(employee) => {
                    if (currentEmployee) {
                      toast.success(`Nhân viên ${employee.tenNV} đã được cập nhật thành công.`, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    } else {
                      toast.success(`Nhân viên ${employee.name} đã được thêm thành công.`, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    }
                    setIsDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Role Management Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Role</DialogTitle>
                  <DialogDescription>Quản lý role cho nhân viên {currentEmployee?.tenNV}</DialogDescription>
                </DialogHeader>
                {/* <div className="py-4">
                  <div className="space-y-2">
                    {selectedEmployee.roles.map((role:any) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <Label htmlFor={`role-${role}`} className="text-sm font-medium">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div> */}
                <DialogFooter>
                  <Button onClick={handleSaveRoles}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Department Management Dialog */}
            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Phòng ban</DialogTitle>
                  <DialogDescription>Chọn phòng ban cho nhân viên {currentEmployee?.tenNV}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tính năng đang được phát triển</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveDepartments}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Building Management Dialog */}
            <Dialog open={isBuildingDialogOpen} onOpenChange={setIsBuildingDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Tòa nhà</DialogTitle>
                  <DialogDescription>Chọn tòa nhà cho nhân viên {currentEmployee?.tenNV}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tính năng đang được phát triển</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveBuildings}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Employee Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Tên nhân viên</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[120px]">Số điện thoại</TableHead>
                  <TableHead className="w-[200px]">Phòng ban</TableHead>
                  <TableHead className="w-[200px]">Role</TableHead>
                  <TableHead className="w-[200px]">Tòa nhà</TableHead>
                  <TableHead className="w-[100px] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.maNV} className="cursor-pointer" onClick={() => handleViewEmployeeUpdated(employee)}>
                      <TableCell className="font-medium">{employee.tenNV}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={employee.email}>
                          {employee.email}
                        </div>
                      </TableCell>
                      <TableCell>{employee.sdt}</TableCell>
                      <TableCell className="max-w-[150px]">
                        <DepartmentBadge departments={employee.phongBans} />
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <RoleBadges roles={employee.roles} />
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <BuildingBadges buildings={employee.toaNhas} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEmployee(employee)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleManageRoles(employee)
                              }}
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              Quản lý role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleManageDepartments(employee)
                              }}
                            >
                              <Building className="mr-2 h-4 w-4" />
                              Quản lý phòng ban
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleManageBuildings(employee)
                              }}
                            >
                              <Building className="mr-2 h-4 w-4" />
                              Quản lý tòa nhà
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEmployee(employee.maNV)
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy nhân viên nào phù hợp với điều kiện lọc
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        // Employee Detail View (existing code)
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBackToList}
            >
              Quay lại
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                    <UserCog className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold">{selectedEmployee.tenNV}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.userName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span>{selectedEmployee.sdt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Ngày sinh:</span>
                    <span>{new Date(selectedEmployee.ngaySinh).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Roles</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.roles.map((role: any) => (
                      <Badge key={role.roleID} variant="outline">
                        {role.roleName}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Phòng ban</div>
                  <div className="flex flex-wrap gap-1">
                    {[...new Map(selectedEmployee.phongBans.map((d: any) => [d.tenPB, d])).values()].map(
                      (department: any) => (
                        <Badge key={department.maPB} variant="secondary">
                          {department.tenPB}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Tòa nhà</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.toaNhas.length > 0 ? (
                      selectedEmployee.toaNhas.map((tn: any) => (
                        <Badge key={tn.maTN} variant="secondary">
                          {tn.tenTN}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">Chưa phân công</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-5 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="info">Thông tin</TabsTrigger>
                      <TabsTrigger value="departments">Phòng ban</TabsTrigger>
                      <TabsTrigger value="buildings">Tòa nhà</TabsTrigger>
                      <TabsTrigger value="roles">Roles</TabsTrigger>
                    </TabsList>
                    <TabsContent value="roles" className="pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Quản lý Roles</h3>
                        {!isRoleTabEditing ? (
                          <Button size="sm" onClick={() => {
                            setIsRoleTabEditing(true)
                            setSelectedEmployeeRoles(selectedEmployee.roles.map((role: any) => Number(role.roleID)))
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa roles
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsRoleTabEditing(false)
                                // Reset về roles ban đầu
                                setSelectedEmployeeRoles(selectedEmployee.roles.map((role: any) => role.roleID))
                              }}
                            >
                              Hủy
                            </Button>
                            <Button size="sm" onClick={handleSaveRoles}>
                              Lưu
                            </Button>
                          </div>
                        )}
                      </div>

                      {!isRoleTabEditing ? (
                        // Hiển thị roles hiện tại
                        <div className="space-y-2">
                          {selectedEmployee.roles.length > 0 ? (
                            selectedEmployee.roles.map((role: any) => (
                              <div key={role.roleID} className="p-4 border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{role.roleName}</p>
                                    <p className="text-sm text-muted-foreground">Role ID: {role.roleID}</p>
                                  </div>
                                  <Badge variant="outline">Đang có</Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              Nhân viên chưa có role nào
                            </div>
                          )}
                        </div>
                      ) : (
                        // Form chỉnh sửa roles
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Chọn các roles cho nhân viên {selectedEmployee.tenNV}:
                          </p>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {roles.map((role) => (
                              <div key={role.roleID} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50">
                                <Checkbox
                                  id={`employee-role-${role.roleID}`}
                                  checked={selectedEmployeeRoles.includes(Number(role.roleID))}
                                  onCheckedChange={() => handleEmployeeRoleToggle(role.roleID)}
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`employee-role-${role.roleID}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {role.roleName}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">Role ID: {role.roleID}</p>
                                </div>
                                {selectedEmployeeRoles.includes(role.roleID) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Đã chọn
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          {roles.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              Không có roles nào trong hệ thống
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="info" className="space-y-4 pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Thông tin cá nhân</h3>
                        {!isInfoTabEditing ? (
                          <Button size="sm" onClick={() => setIsInfoTabEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa thông tin
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsInfoTabEditing(false)
                                // Reset về thông tin ban đầu
                                setEditedEmployeeInfo({
                                  maNV: selectedEmployee.maNV,
                                  tenNV: selectedEmployee.tenNV,
                                  userName: selectedEmployee.userName,
                                  email: selectedEmployee.email,
                                  sdt: selectedEmployee.sdt,
                                  ngaySinh: selectedEmployee.ngaySinh,
                                  diaChiThuongTru: selectedEmployee.diaChiThuongTru
                                })
                              }}
                            >
                              Hủy
                            </Button>
                            <Button size="sm" onClick={handleSaveEmployeeInfo}>
                              Lưu
                            </Button>
                          </div>
                        )}
                      </div>

                      {!isInfoTabEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Họ và tên</div>
                            <div>{selectedEmployee.tenNV}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Tên đăng nhập</div>
                            <div>{selectedEmployee.userName}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                            <div>{selectedEmployee.email}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Số điện thoại</div>
                            <div>{selectedEmployee.sdt}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Ngày sinh</div>
                            <div>{new Date(selectedEmployee.ngaySinh).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Địa chỉ</div>
                            <div>{selectedEmployee.diaChiThuongTru}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-tenNV">Họ và tên</Label>
                            <Input
                              id="edit-tenNV"
                              value={editedEmployeeInfo.tenNV}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, tenNV: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-userName">Tên đăng nhập</Label>
                            <Input
                              id="edit-userName"
                              value={editedEmployeeInfo.userName}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, userName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editedEmployeeInfo.email}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-sdt">Số điện thoại</Label>
                            <Input
                              id="edit-sdt"
                              value={editedEmployeeInfo.sdt}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, sdt: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-ngaySinh">Ngày sinh</Label>
                            <Input
                              id="edit-ngaySinh"
                              type="date"
                              value={editedEmployeeInfo.ngaySinh ? new Date(editedEmployeeInfo.ngaySinh).toISOString().split('T')[0] : ''}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, ngaySinh: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-diaChiThuongTru">Địa chỉ</Label>
                            <Input
                              id="edit-diaChiThuongTru"
                              value={editedEmployeeInfo.diaChiThuongTru}
                              onChange={(e) => setEditedEmployeeInfo({ ...editedEmployeeInfo, diaChiThuongTru: e.target.value })}
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="departments" className="pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Phòng ban</h3>
                        {!isDepartmentTabEditing ? (
                          <Button size="sm" onClick={() => {
                            setIsDepartmentTabEditing(true)
                            setSelectedEmployeeDepartments(
                              selectedEmployee.phongBans.map((dept: any) => Number(dept.maPB))
                            );
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa phòng ban
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsDepartmentTabEditing(false)
                                setSelectedEmployeeDepartments(selectedEmployee.phongBans.map((dept: any) => dept.maPB))
                              }}
                            >
                              Hủy
                            </Button>
                            <Button size="sm" onClick={handleSaveDepartments}>
                              Lưu
                            </Button>
                          </div>
                        )}
                      </div>

                      {!isDepartmentTabEditing ? (
                        selectedEmployee.phongBans.length > 0 ? (
                          <div className="space-y-2">
                            {selectedEmployee.phongBans.map((dept: any) => (
                              <div key={dept.maPB} className="p-4 border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{dept.tenPB}</p>
                                    <p className="text-sm text-muted-foreground">Mã PB: {dept.maPB}, Tòa nhà {dept.tenTN}</p>
                                  </div>
                                  <Badge variant="outline">Đang thuộc</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">Nhân viên chưa thuộc phòng ban nào</div>
                        )
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Chọn các phòng ban cho nhân viên {selectedEmployee.tenNV}:
                          </p>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {departments.map((dept) => (
                              <div key={dept.maPB} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50">
                                <Checkbox
                                  id={`employee-dept-${dept.maPB}`}
                                  checked={selectedEmployeeDepartments.includes(Number(dept.maPB))}
                                  onCheckedChange={() => handleEmployeeDepartmentToggle(dept.maPB)}
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`employee-dept-${dept.maPB}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {dept.tenPB}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">MaPB: {dept.maPB} , Tòa nhà: {dept.tenTN}</p>
                                </div>
                                {selectedEmployeeDepartments.includes(dept.maPB) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Đã chọn
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="buildings" className="pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Tòa nhà được phân công</h3>
                        {!isBuildingTabEditing ? (
                          <Button size="sm" onClick={() => {
                            setIsBuildingTabEditing(true)
                            setSelectedEmployeeBuildings(
                              selectedEmployee.toaNhas.map((building: any) => Number(building.maTN))
                            );
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa tòa nhà
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsBuildingTabEditing(false)
                                setSelectedEmployeeBuildings(selectedEmployee.toaNhas.map((building: any) => Number(building.maTN)))
                                console.log(selectedEmployeeBuildings) // Reset về tòa nhà ban đầu
                              }}
                            >
                              Hủy
                            </Button>
                            <Button size="sm" onClick={handleSaveBuildings}>
                              Lưu
                            </Button>
                          </div>
                        )}
                      </div>

                      {!isBuildingTabEditing ? (
                        selectedEmployee.toaNhas.length > 0 ? (
                          <div className="space-y-2">
                            {selectedEmployee.toaNhas.map((building: any) => (
                              <div key={building.maTN} className="p-4 border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{building.tenTN}</p>
                                    <p className="text-sm text-muted-foreground">Mã TN: {building.maTN}</p>
                                  </div>
                                  <Badge variant="outline">Đang quản lý</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Nhân viên chưa được phân công vào tòa nhà nào
                          </div>
                        )
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Chọn các tòa nhà cho nhân viên {selectedEmployee.tenNV}:
                          </p>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {buildingDetails.map((building) => (
                              <div key={building.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50">
                                <Checkbox
                                  id={`employee-building-${building.id}`}
                                  checked={selectedEmployeeBuildings.includes(Number(building.id))}
                                  onCheckedChange={() => handleEmployeeBuildingToggle(building.id)}
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`employee-building-${building.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {building.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">Mã TN: {building.id}</p>
                                </div>
                                {selectedEmployeeBuildings.includes(Number(building.id)) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Đã chọn
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}