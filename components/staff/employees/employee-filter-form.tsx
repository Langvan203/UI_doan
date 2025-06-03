"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useBuilding } from "@/components/context/BuildingContext"
import { useDepartment } from "@/components/context/DepartmentContext"  
import { useState } from "react"
export function EmployeeFilterForm() {
  const {departments} = useDepartment()
  const { buildingDetails } = useBuilding()
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const departmentUnique = departments.filter((dep, index,self) => {
    return index === self.findIndex(d => d.tenPB === dep.tenPB)
  })

  // const handleDepartmentChange = (value: string) => {
  //   setSelectedDepartment(value)
  //   fi({
  //     buildingId: value === "all" ? undefined : parseInt(value),
  //     searchTerm: searchTerm.trim() || undefined
  //   })
  // }
  console.log(departmentUnique)
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Tìm kiếm nhân viên..." className="pl-8" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo tòa nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildingDetails.map((building,index) => (
                <SelectItem key={index} value={building.id?.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {departmentUnique.map((department,index) => (
                <SelectItem key={index} value={department.maPB?.toString()}>
                  {department.tenPB}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Lọc</Button>
        </div>
      </CardContent>
    </Card>
  )
}
