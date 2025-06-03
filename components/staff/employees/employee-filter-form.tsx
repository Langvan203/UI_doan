"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useBuilding } from "@/components/context/BuildingContext"
import { useDepartment } from "@/components/context/DepartmentContext"  
import { useEmployee } from "@/components/context/EmployeeContext"
import { useState, useCallback } from "react"
import { GetDSNhanVienDto } from "@/components/type/Staff"

interface EmployeeFilterFormProps {
  onFilterChange?: (filteredEmployees: GetDSNhanVienDto[]) => void;
}

export function EmployeeFilterForm({ onFilterChange }: EmployeeFilterFormProps) {
  const { departments } = useDepartment()
  const { buildingDetails } = useBuilding()
  const { employees } = useEmployee()
  
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  // Lọc phòng ban unique
  const departmentUnique = departments.filter((dep, index, self) => {
    return index === self.findIndex(d => d.tenPB === dep.tenPB)
  })

  // Function để filter employees
  const filterEmployees = useCallback((currentSearch = searchTerm, currentBuilding = selectedBuilding, currentDepartment = selectedDepartment) => {
    let filtered = [...employees]

    // Filter theo search term
    if (currentSearch.trim()) {
      filtered = filtered.filter(employee => 
        employee.tenNV.toLowerCase().includes(currentSearch.toLowerCase()) ||
        employee.userName.toLowerCase().includes(currentSearch.toLowerCase()) ||
        employee.email.toLowerCase().includes(currentSearch.toLowerCase())
      )
    }

    // Filter theo tòa nhà
    if (currentBuilding !== "all" && currentBuilding) {
      const buildingId = parseInt(currentBuilding)
      if (!isNaN(buildingId)) {
        filtered = filtered.filter(employee => 
          employee.toaNhas && employee.toaNhas.some(building => building.MaTN === buildingId)
        )
      }
    }

    // Filter theo phòng ban
    if (currentDepartment !== "all" && currentDepartment) {
      filtered = filtered.filter(employee => 
        employee.phongBans && employee.phongBans.some(dept => 
          dept.tenPB?.toLowerCase().trim() === currentDepartment.toLowerCase().trim()
        )
      )
    }

    return filtered
  }, [employees, searchTerm, selectedBuilding, selectedDepartment])

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Apply filter với giá trị mới
    const filtered = filterEmployees(value, selectedBuilding, selectedDepartment)
    onFilterChange?.(filtered)
  }

  // Handle building change
  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
    
    // Apply filter với giá trị mới
    const filtered = filterEmployees(searchTerm, value, selectedDepartment)
    onFilterChange?.(filtered)
  }

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    console.log(selectedDepartment)
    
    // Apply filter với giá trị mới
    const filtered = filterEmployees(searchTerm, selectedBuilding, value)
    onFilterChange?.(filtered)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedBuilding("all")
    setSelectedDepartment("all")
    
    // Return all employees khi clear filters
    onFilterChange?.(employees)
  }

  const hasActiveFilters = searchTerm.trim() || selectedBuilding !== "all" || selectedDepartment !== "all"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Tìm kiếm nhân viên..." 
              className="pl-8" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <Select value={selectedBuilding} onValueChange={handleBuildingChange}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo tòa nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildingDetails.map((building, index) => (
                <SelectItem key={building.id || index} value={building.id?.toString() || ""}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {departmentUnique.map((department, index) => (
                <SelectItem key={department.maPB || index} value={department.tenPB || ""}>
                  {department.tenPB}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Hiển thị số lượng kết quả */}
          {/* <div className="flex items-center text-sm text-muted-foreground">
            {hasActiveFilters && (
              <span>
                Đang lọc...
              </span>
            )}
          </div> */}
        </div>

        {/* Hiển thị các filter đang active */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm.trim() && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>Tìm kiếm: "{searchTerm}"</span>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    const filtered = filterEmployees("", selectedBuilding, selectedDepartment)
                    onFilterChange?.(filtered)
                  }}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedBuilding !== "all" && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                <span>
                  Tòa nhà: {buildingDetails.find(b => b.id?.toString() === selectedBuilding)?.name}
                </span>
                <button
                  onClick={() => handleBuildingChange("all")}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedDepartment !== "all" && (
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                <span>
                  Phòng ban: {departmentUnique.find(d => d.tenPB?.toString() === selectedDepartment)?.tenPB}
                </span>
                <button
                  onClick={() => handleDepartmentChange("all")}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}