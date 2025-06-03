"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import useDepartmentStore from "@/lib/departmentStore";
import { useDepartment } from "@/components/context/DepartmentContext"
import { useBuilding } from "@/components/context/BuildingContext"
import { BuildingDetail } from "@/components/buildings/building-detail"
import { UpdateDepartment } from "@/components/type/department"
import { useEmployee } from "@/components/context/EmployeeContext"


export function DepartmentList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<any>(null)
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const { departments, RefreshDepartment,createDepartment, deleteDepartment, updateDepartment, filteredDepartments, RemoveEmployeeFromDepartment } = useDepartment()
  const {buildingDetails} = useBuilding() 
  const { employees, getListEmployee, addEmployeeToDepartment } = useEmployee()

  // Thêm state để lưu danh sách nhân viên có thể thêm
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([])

  
  const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const building = formData.get('building') as string

    try {
      if (currentDepartment) {
        // Update existing department
        const updatedDepartment: UpdateDepartment = {
          maPB: parseInt(currentDepartment.maPB),
          tenPB: name,
          maTN: parseInt(building)
        }
        await updateDepartment(updatedDepartment)
        await RefreshDepartment()
        toast.success("Phòng ban đã được cập nhật thành công", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        })
      } else {
        // Create new department
        const newDepartment = {
          tenPB: name,
          maTN: parseInt(building)
        }
        await createDepartment(newDepartment)
        await RefreshDepartment()
        toast.success("Phòng ban đã được thêm thành công", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        })
      }

      setIsDialogOpen(false)
      setCurrentDepartment(null)
    } catch (error) {
      toast.error(currentDepartment ? "Không thể cập nhật phòng ban. Vui lòng thử lại" : "Không thể thêm phòng ban. Vui lòng thử lại", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }
  }

  const handleEditDepartment = (department: any) => {
    setCurrentDepartment(department)
    setIsDialogOpen(true)
  }

  const handleDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartment(id)
      
      toast.success("Phòng ban đã được xóa thành công", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
    } catch (error) {
      toast.error("Không thể xóa phòng ban. Vui lòng thử lại", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }
  }

  const handleViewEmployees = (department: any) => {
    setSelectedDepartment(department)
  }

  const handleRemoveEmployee = async (departmentId: number, employeeId: number) => {
    try {
      await RemoveEmployeeFromDepartment(departmentId, employeeId)
      await RefreshDepartment()
      
      // Cập nhật lại selectedDepartment sau khi refresh
      const updatedDepartment = departments.find(d => d.maPB === departmentId)
      if (updatedDepartment) {
        // Cập nhật lại danh sách nhân viên của phòng ban
        const updatedEmployees = updatedDepartment.nhanVienInPhongBans.filter(
          (emp: any) => emp.maNV !== employeeId
        )
        setSelectedDepartment({
          ...updatedDepartment,
          nhanVienInPhongBans: updatedEmployees
        })
      }
      
      toast.success("Nhân viên đã được xóa khỏi phòng ban", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
    } catch (error) {
      toast.error("Không thể xóa nhân viên khỏi phòng ban. Vui lòng thử lại", {
        position: "top-right",
        autoClose: 500,
      })
    }
  }

  const handleAddEmployeeToDepartment = async () => {
    if (!selectedDepartment) return
    
    // Lấy danh sách nhân viên đã thuộc phòng ban
    const existingEmployeeIds = selectedDepartment.nhanVienInPhongBans.map((emp: any) => emp.maNV)
    
    // Lọc ra những nhân viên chưa thuộc phòng ban
    const available = employees.filter(emp => !existingEmployeeIds.includes(emp.maNV))
    setAvailableEmployees(available)
    
    setIsAddEmployeeDialogOpen(true)
  }

  const handleAddEmployee = async (employeeId: number, departmentId: number) => {
    try {
      const response = await addEmployeeToDepartment(departmentId, employeeId)
      
      // Lấy dữ liệu mới trực tiếp từ RefreshDepartment
      const freshDepartments = await RefreshDepartment()
      
      // Tìm department được cập nhật từ dữ liệu mới
      const updatedDepartment = freshDepartments.find(d => d.maPB === departmentId)
      
      if (updatedDepartment) {
        setSelectedDepartment(updatedDepartment)
        
        const existingEmployeeIds = updatedDepartment.nhanVienInPhongBans.map((emp: any) => emp.maNV)
        const available = employees.filter(emp => !existingEmployeeIds.includes(emp.maNV))
        setAvailableEmployees(available)
      }
      
      setIsAddEmployeeDialogOpen(false)
      toast.success("Nhân viên đã được thêm thành công!", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      })
    } catch (error) {
      toast.error("Không thể thêm nhân viên vào phòng ban.")
    }
  }

  // Lọc nhân viên chưa thuộc phòng ban được chọn
  

  return (
    <div className="space-y-4">
      {!selectedDepartment ? (
        <>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Danh sách Phòng ban</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentDepartment(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Phòng ban
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{currentDepartment ? "Chỉnh sửa Phòng ban" : "Thêm Phòng ban mới"}</DialogTitle>
                  <DialogDescription>
                    {currentDepartment
                      ? "Chỉnh sửa thông tin phòng ban hiện tại."
                      : "Thêm phòng ban mới vào hệ thống. Nhấn lưu khi hoàn tất."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDepartment}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Tên phòng ban
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={currentDepartment?.tenPB || ""}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="building" className="text-right">
                        Tòa nhà
                      </Label>
                      <Select name="building" defaultValue={currentDepartment?.maTN?.toString() || ""}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn tòa nhà" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingDetails.map((building) => (
                            <SelectItem key={building.id} value={building.id.toString()}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{currentDepartment ? "Cập nhật" : "Thêm mới"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((department) => (
              <Card
                key={department.maPB}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  handleViewEmployees(department)
                  
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{department.tenPB}</CardTitle>
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
                            handleEditDepartment(department)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDepartment(department.maPB)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    <Badge variant="outline">{department.tenTN}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm">
                    <span className="font-medium">{department.nhanVienInPhongBans?.length || 0}</span> nhân viên
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Xem nhân viên
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDepartment(null)}>
                Quay lại
              </Button>
              <h3 className="text-lg font-medium">{selectedDepartment.tenPB}</h3>
              <Badge variant="outline">{selectedDepartment.tenTN}</Badge>
            </div>
            <Button onClick={handleAddEmployeeToDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách nhân viên</CardTitle>
              <CardDescription>Nhân viên thuộc phòng ban {selectedDepartment.tenPB}</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDepartment.nhanVienInPhongBans?.length ? (
                <div className="text-center py-4 text-muted-foreground">Không có nhân viên nào trong phòng ban này</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên nhân viên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDepartment.nhanVienInPhongBans.map((employee: any) => (
                      <TableRow key={employee.maNV}>
                        <TableCell className="font-medium">{employee.tenNV}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.sdt}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEmployee(selectedDepartment.maPB, employee.maNV)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên vào {selectedDepartment?.tenPB}</DialogTitle>
            <DialogDescription>Chọn nhân viên để thêm vào phòng ban</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {availableEmployees.length === 0 ? (
                  <p className="text-center text-muted-foreground">Không có nhân viên khả dụng</p>
                ) : (
                  availableEmployees.map((employee) => (
                    <div key={employee.maNV} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{employee.tenNV}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddEmployee(employee.maNV, selectedDepartment.maPB)}>
                        Thêm
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
