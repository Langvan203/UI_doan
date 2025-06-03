"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash, UserCog, Building } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import { EmployeeForm } from "./employee-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEmployee } from "@/components/context/EmployeeContext"
import { NhanVienRoles,NhanVienInToaNha,NhanVienPhongBan } from "@/components/type/Staff/Staff"



function RoleBadges({ roles }: { roles: NhanVienRoles[] }) {
  const maxVisible = 1
  const visibleRoles = roles.slice(0, maxVisible)
  console.log(visibleRoles)
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
              {roles.slice(maxVisible).map((role,index) => (
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
        {buildings.map((building) => (
          <Badge key={building.MaTN} variant="secondary" className="text-xs">
            {building.TenTN}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleBuildings.map((building) => (
        <Badge key={building.MaTN} variant="secondary" className="text-xs">
          {building.TenTN}
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
              {buildings.slice(maxVisible).map((building) => (
                <div key={building.MaTN} className="text-sm">
                  {building.TenTN}
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
  const uniqueDepartment = departments.filter((dept, index, self) => {
    return index === self.findIndex(d => d.tenPB == dept.tenPB)
  })
  const visibleDepartment = uniqueDepartment.slice(0, maxVisible)
  const remainingCount = uniqueDepartment.length - maxVisible

  if (uniqueDepartment.length === 0) {
    return <span className="text-muted-foreground text-sm">Chưa phân công</span>
  }

  if (uniqueDepartment.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-1">
        {uniqueDepartment.map((deparments,index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {deparments.tenPB}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleDepartment.map((department,index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {department.tenPB}
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
              {uniqueDepartment.slice(maxVisible).map((department,index) => (
                <div key={index} className="text-sm">
                  {department.tenPB}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function EmployeeList() {
  // const [employees, setEmployees] = useState(employeeData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<any>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [isBuildingDialogOpen, setIsBuildingDialogOpen] = useState(false)
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const {employees} = useEmployee();
  console.log(employees)

  const handleDeleteEmployee = (id: number) => {
    // setEmployees(employees.filter((employee) => employee.id !== id))
    // toast({
    //   title: "Nhân viên đã được xóa",
    //   description: "Nhân viên đã được xóa thành công.",
    // })
  }

  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleManageRoles = (employee: any) => {
    setCurrentEmployee(employee)
    setSelectedRoles([...employee.roles])
    setIsRoleDialogOpen(true)
  }

  const handleSaveRoles = () => {
    // setEmployees(employees.map((emp) => (emp.id === currentEmployee.id ? { ...emp, roles: selectedRoles } : emp)))
    // setIsRoleDialogOpen(false)
    // toast({
    //   title: "Role đã được cập nhật",
    //   description: `Role của ${currentEmployee.name} đã được cập nhật thành công.`,
    // })
  }

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleManageDepartments = (employee: any) => {
    setCurrentEmployee(employee)
    // Giả định rằng employee.department là tên phòng ban
    // const deptIds = departmentData.filter((dept) => dept.name === employee.department).map((dept) => dept.id)
    // setSelectedDepartments(deptIds)
    setIsDepartmentDialogOpen(true)
  }

  const handleDepartmentToggle = (deptId: number) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(selectedDepartments.filter((id) => id !== deptId))
    } else {
      setSelectedDepartments([...selectedDepartments, deptId])
    }
  }

  const handleSaveDepartments = () => {
    //const selectedDeptNames = departmentData
    //   .filter((dept) => selectedDepartments.includes(dept.id))
    //   .map((dept) => dept.name)

    // setEmployees(
    //   employees.map((emp) =>
    //     emp.id === currentEmployee.id
    //       ? { ...emp, department: selectedDeptNames.length > 0 ? selectedDeptNames[0] : null }
    //       : emp,
    //   ),
    //)

    setIsDepartmentDialogOpen(false)
    toast({
      title: "Phòng ban đã được cập nhật",
      description: `Phòng ban của ${currentEmployee.name} đã được cập nhật thành công.`,
    })
  }

  const handleManageBuildings = (employee: any) => {
    setCurrentEmployee(employee)
    setSelectedBuildings([...employee.buildings])
    setIsBuildingDialogOpen(true)
  }

  const handleBuildingToggle = (building: string) => {
    if (selectedBuildings.includes(building)) {
      setSelectedBuildings(selectedBuildings.filter((b) => b !== building))
    } else {
      setSelectedBuildings([...selectedBuildings, building])
    }
  }

  const handleSaveBuildings = () => {
    // setEmployees(
    //   employees.map((emp) => (emp.id === currentEmployee.id ? { ...emp, buildings: selectedBuildings } : emp)),
    // )

    setIsBuildingDialogOpen(false)
    toast({
      title: "Tòa nhà đã được cập nhật",
      description: `Tòa nhà của ${currentEmployee.name} đã được cập nhật thành công.`,
    })
  }

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee)
  }

  return (
    <div className="space-y-4">
      {!selectedEmployee ? (
        <>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Danh sách Nhân viên</h3>
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
                      // setEmployees(
                      //   employees.map((emp) => (emp.id === currentEmployee.id ? { ...emp, ...employee } : emp)),
                      // )
                      toast({
                        title: "Nhân viên đã được cập nhật",
                        description: `Thông tin của ${employee.name} đã được cập nhật thành công.`,
                      })
                    } else {
                      const newEmployee = {
                        id: employees.length + 1,
                        ...employee,
                        roles: ["Staff"],
                        buildings: [],
                      }
                      // setEmployees([...employees, newEmployee])
                      // toast({
                      //   title: "Nhân viên mới đã được tạo",
                      //   description: `Nhân viên ${employee.name} đã được tạo thành công.`,
                      // })
                    }
                    setIsDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Role</DialogTitle>
                  <DialogDescription>Quản lý role cho nhân viên {currentEmployee?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    {["Admin", "Manager", "Staff"].map((role) => (
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
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveRoles}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Phòng ban</DialogTitle>
                  <DialogDescription>Chọn phòng ban cho nhân viên {currentEmployee?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {/* <div className="space-y-2">
                    {departmentData.map((dept) => (
                      <div key={dept.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dept-${dept.id}`}
                          checked={selectedDepartments.includes(dept.id)}
                          onCheckedChange={() => handleDepartmentToggle(dept.id)}
                        />
                        <Label htmlFor={`dept-${dept.id}`} className="text-sm font-medium">
                          {dept.name} ({dept.building})
                        </Label>
                      </div>
                    ))}
                  </div> */}
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveDepartments}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isBuildingDialogOpen} onOpenChange={setIsBuildingDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quản lý Tòa nhà</DialogTitle>
                  <DialogDescription>Chọn tòa nhà cho nhân viên {currentEmployee?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {/* <div className="space-y-2">
                    {buildingData.map((building) => (
                      <div key={building.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`building-${building.id}`}
                          checked={selectedBuildings.includes(building.name)}
                          onCheckedChange={() => handleBuildingToggle(building.name)}
                        />
                        <Label htmlFor={`building-${building.id}`} className="text-sm font-medium">
                          {building.name}
                        </Label>
                      </div>
                    ))}
                  </div> */}
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveBuildings}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                {employees.map((employee) => (
                  <TableRow key={employee.maNV} className="cursor-pointer" onClick={() => handleViewEmployee(employee)}>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
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
                    {selectedEmployee.phongBans.map((pb: any) => (
                      <Badge key={pb.maPB} variant="secondary">
                        {pb.tenPB}
                      </Badge>
                    ))}
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
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Thông tin</TabsTrigger>
                      <TabsTrigger value="departments">Phòng ban</TabsTrigger>
                      <TabsTrigger value="buildings">Tòa nhà</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="space-y-4 pt-4">
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
                          <div className="text-sm font-medium text-muted-foreground mb-1">Roles</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedEmployee.roles.map((role: any) => (
                              <Badge key={role.roleID} variant="outline">
                                {role.roleName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="departments" className="pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Phòng ban</h3>
                        <Button size="sm" onClick={() => handleManageDepartments(selectedEmployee)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm vào phòng ban
                        </Button>
                      </div>
                      {selectedEmployee.department ? (
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{selectedEmployee.department}</p>
                              <p className="text-sm text-muted-foreground">
                                {/* {departmentData.find((d) => d.name === selectedEmployee.department)?.building} */}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManageDepartments(selectedEmployee)}
                            >
                              Thay đổi
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">Nhân viên chưa thuộc phòng ban nào</div>
                      )}
                    </TabsContent>
                    <TabsContent value="buildings" className="pt-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium">Tòa nhà được phân công</h3>
                        <Button size="sm" onClick={() => handleManageBuildings(selectedEmployee)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm vào tòa nhà
                        </Button>
                      </div>
                      {selectedEmployee.buildings.length > 0 ? (
                        <div className="space-y-2">
                          {selectedEmployee.buildings.map((building: string) => (
                            <div key={building} className="p-4 border rounded-md">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{building}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBuildings(
                                      selectedEmployee.buildings.filter((b: string) => b !== building),
                                    )
                                    setCurrentEmployee(selectedEmployee)
                                    handleSaveBuildings()
                                  }}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Nhân viên chưa được phân công vào tòa nhà nào
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
