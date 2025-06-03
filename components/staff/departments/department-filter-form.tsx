"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useBuilding } from "@/components/context/BuildingContext"
import { useDepartment } from "@/components/context/DepartmentContext"
import { useState } from "react"

export function DepartmentFilterForm() {
  const { buildingDetails } = useBuilding()
  const { filterDepartments } = useDepartment()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all")

  const handleFilter = () => {
    filterDepartments({
      buildingId: selectedBuilding === "all" ? undefined : parseInt(selectedBuilding),
      searchTerm: searchTerm.trim() || undefined
    })
  }

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
    filterDepartments({
      buildingId: value === "all" ? undefined : parseInt(value),
      searchTerm: searchTerm.trim() || undefined
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Chỉ filter khi người dùng ngừng gõ sau 500ms
    const timeoutId = setTimeout(() => {
      filterDepartments({
        buildingId: selectedBuilding === "all" ? undefined : parseInt(selectedBuilding),
        searchTerm: e.target.value.trim() || undefined
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Tìm kiếm phòng ban..." 
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
              {buildingDetails.map((building) => (
                <SelectItem key={building.id} value={building.id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleFilter}>Lọc</Button>
        </div>
      </CardContent>
    </Card>
  )
}
