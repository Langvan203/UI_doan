"use client"

import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpdateNhanVien } from "@/components/type/Staff"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { useDepartment } from "@/components/context/DepartmentContext"
import { useBuilding } from "@/components/context/BuildingContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import { useEmployee } from "@/components/context/EmployeeContext"

interface EmployeeFormProps {
  employee?: any
  onSave: (employee: any) => void
}

export function EmployeeForm({ employee, onSave }: EmployeeFormProps) {
  const { departments } = useDepartment();
  const {buildingDetails} = useBuilding();
  const [selectedBuildings, setSelectedBuildings] = useState<number[]>(
    employee?.toaNhas?.map((tn: { MaTN: number }) => tn.MaTN) || []
  );
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>(
    employee?.phongBans?.map((pb: { maPB: number }) => pb.maPB) || []
  );
  const { updateEmployeeInfo, updateEmployeeBuildings, updateEmployeeDepartments } = useEmployee();
  const handleBuildingToggle = (buildingId: number) => {
    setSelectedBuildings(prev => {
      if (prev.includes(buildingId)) {
        return prev.filter(id => id !== buildingId);
      } else {
        return [...prev, buildingId];
      }
    });
  };

  const handleDepartmentToggle = (departmentId: number) => {
    setSelectedDepartments(prev => {
      if (prev.includes(departmentId)) {
        return prev.filter(id => id !== departmentId);
      } else {
        return [...prev, departmentId];
      }
    });
  };

  console.log(selectedDepartments)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      if (employee) {
        // Cập nhật thông tin cơ bản
        const updateData: UpdateNhanVien = {
          maNV: employee.maNV,
          hoTen: formData.get("name") as string,
          tenDangNhap: formData.get("username") as string,
          email: formData.get("email") as string,
          soDienThoai: formData.get("phone") as string,
          ngaySinh: employee.ngaySinh, // Giữ nguyên ngày sinh
          diaChi: employee.diaChiThuongTru, // Giữ nguyên địa chỉ
        }
  
        await updateEmployeeInfo(updateData);
  
        // Cập nhật tòa nhà
        if (selectedBuildings.length > 0) {
          await updateEmployeeBuildings(employee.maNV, selectedBuildings);
        }
  
        // Cập nhật phòng ban
        if (selectedDepartments.length > 0) {
          await updateEmployeeDepartments(employee.maNV, selectedDepartments);
        }
  
        toast.success("Thông tin nhân viên đã được cập nhật thành công!");
      } else {
        // Logic tạo mới nhân viên (giữ nguyên)
        const employeeData = {
          name: formData.get("name") as string,
          username: formData.get("username") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          departments: selectedDepartments,
          buildings: selectedBuildings,
        }
      }
  
      onSave(employee || {});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin nhân viên!");
      console.error('Error updating employee:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhân viên</Label>
            <Input id="name" name="name" defaultValue={employee?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input id="username" name="username" defaultValue={employee?.username || ""} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={employee?.email || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" defaultValue={employee?.phone || ""} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phòng ban</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedDepartments.length > 0
                  ? `${selectedDepartments.length} phòng ban đã chọn`
                  : "Chọn phòng ban..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm phòng ban..." />
                <CommandEmpty>Không tìm thấy phòng ban.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {departments.map((department) => (
                    <CommandItem
                      key={department.maPB}
                      onSelect={() => handleDepartmentToggle(department.maPB)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`department-${department.maPB}`}
                          checked={selectedDepartments.includes(department.maPB)}
                          onCheckedChange={() => handleDepartmentToggle(department.maPB)}
                        />
                        <Label
                          htmlFor={`department-${department.maPB}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {department.tenPB + ", tòa nhà " + department.tenTN}
                        </Label>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Tòa nhà</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {employee?.toaNhas?.length > 0
                  ? `${employee.toaNhas.length} tòa nhà đã chọn`
                  : "Chọn tòa nhà..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm tòa nhà..." />
                <CommandEmpty>Không tìm thấy tòa nhà.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {buildingDetails.map((building) => (
                    <CommandItem
                      key={building.id}
                      onSelect={() => {
                        // Handle selection logic here
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`building-${building.id}`}
                          checked={selectedBuildings.includes(building.id)}
                          onCheckedChange={() => handleBuildingToggle(building.id)}
                        />
                        <Label
                          htmlFor={`building-${building.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {building.name}
                        </Label>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {!employee && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">Lưu</Button>
      </DialogFooter>
    </form>
  )
}
