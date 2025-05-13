"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface ResidentFiltersProps {
  filters: {
    buildingId: string
    blockId: string
    floorId: string
    searchQuery: string
    status: string
    type: string
  }
  onFilterChange: (key: string, value: string) => void
  buildings: Array<{ id: number; name: string }>
  blocks: Array<{ id: number; name: string }>
  floors: Array<{ id: number; number: number }>
}

export function ResidentFilters({ filters, onFilterChange, buildings, blocks, floors }: ResidentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Count active filters (excluding searchQuery)
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchQuery" && value !== "",
  ).length

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange("buildingId", "")
    onFilterChange("blockId", "")
    onFilterChange("floorId", "")
    onFilterChange("status", "")
    onFilterChange("type", "")
  }

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter className="h-3.5 w-3.5" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={clearAllFilters}>
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            {filters.buildingId && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                <span className="truncate max-w-[140px]">
                  Tòa nhà: {buildings.find((b) => b.id === Number.parseInt(filters.buildingId))?.name}
                </span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFilterChange("buildingId", "")
                  }}
                />
              </Badge>
            )}
            {filters.blockId && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                Khối: {blocks.find((b) => b.id === Number.parseInt(filters.blockId))?.name}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFilterChange("blockId", "")
                  }}
                />
              </Badge>
            )}
            {filters.floorId && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                Tầng: {floors.find((f) => f.id === Number.parseInt(filters.floorId))?.number}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFilterChange("floorId", "")
                  }}
                />
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                Loại: {filters.type === "personal" ? "Cá nhân" : "Tổ chức"}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFilterChange("type", "")
                  }}
                />
              </Badge>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <Select value={filters.buildingId} onValueChange={(value) => onFilterChange("buildingId", value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn tòa nhà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tòa nhà</SelectLabel>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.blockId}
                onValueChange={(value) => onFilterChange("blockId", value)}
                disabled={!filters.buildingId || blocks.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn khối nhà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Khối nhà</SelectLabel>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id.toString()}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.floorId}
                onValueChange={(value) => onFilterChange("floorId", value)}
                disabled={!filters.blockId || floors.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn tầng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tầng</SelectLabel>
                    {floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id.toString()}>
                        Tầng {floor.number}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filters.type} onValueChange={(value) => onFilterChange("type", value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Loại khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại khách hàng</SelectLabel>
                    <SelectItem value="personal">Cá nhân</SelectItem>
                    <SelectItem value="company">Tổ chức</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
