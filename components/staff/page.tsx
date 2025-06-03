"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleList } from "./roles/role-list"
import { EmployeeList } from "./employees/employee-list"
import { DepartmentList } from "./departments/department-list"
import { EmployeeFilterForm } from "./employees/employee-filter-form"
import { DepartmentFilterForm } from "./departments/department-filter-form"
import { RoleFilterForm } from "./roles/role-filter-form"
import { useState, useEffect } from "react"
import { useEmployee } from "@/components/context/EmployeeContext"
import { GetDSNhanVienDto } from "@/components/type/Staff"

export default function StaffMangementPage() {
  const { employees } = useEmployee();
  const [filteredEmployees, setFilteredEmployees] = useState<GetDSNhanVienDto[]>(employees);

  // Cập nhật filteredEmployees khi employees thay đổi và chưa có filter nào
  useEffect(() => {
    if (employees.length > 0 && filteredEmployees.length === 0) {
      setFilteredEmployees(employees);
    }
  }, [employees]);

  const handleEmployeeFilterChange = (filtered: GetDSNhanVienDto[]) => {
    setFilteredEmployees(filtered);
  };

  return (  
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên & Phòng ban</h2>
        </div>
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Quản lý Nhân viên</TabsTrigger>
            <TabsTrigger value="departments">Quản lý Phòng ban</TabsTrigger>
            <TabsTrigger value="roles">Quản lý Role</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <EmployeeFilterForm onFilterChange={handleEmployeeFilterChange} />
            <EmployeeList filteredEmployees={filteredEmployees} />
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <DepartmentFilterForm />
            <DepartmentList />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RoleFilterForm />
            <RoleList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}