"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useBuilding } from "../context/BuildingContext"
import { useAuth } from "@/components/context/AuthContext"
import { get } from "http"


interface InvoiceFiltersProps {
  filters: {
    status: string
    dateRange: string
    building: string
    resident: string
    startDate: Date
    endDate: Date
  }
  onFiltersChange: (filters: any) => void
}

export function InvoiceFilters({ filters, onFiltersChange }: InvoiceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {buildingListForDropdown, getBuildingListForDropdown} = useBuilding()
  const {token} = useAuth()
  useEffect(() => {
    if(token)
    {
      // Fetch building list when token is available
      getBuildingListForDropdown()
    }
  },[token])
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    
    // Auto-set date range based on selection
    if (key === "dateRange") {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth()
      
      switch (value) {
        case "thisMonth":
          newFilters.startDate = new Date(currentYear, currentMonth, 1)
          newFilters.endDate = new Date(currentYear, currentMonth + 1, 0)
          break
        case "lastMonth":
          newFilters.startDate = new Date(currentYear, currentMonth - 1, 1)
          newFilters.endDate = new Date(currentYear, currentMonth, 0)
          break
        case "thisYear":
          newFilters.startDate = new Date(currentYear, 0, 1)
          newFilters.endDate = new Date(currentYear, 11, 31)
          break
        case "last30Days":
          newFilters.startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          newFilters.endDate = today
          break
        case "custom":
          // Keep current dates for custom range
          break
        default:
          // "all" - set wide range
          newFilters.startDate = new Date(currentYear - 1, 0, 1)
          newFilters.endDate = today
      }
    }
    
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const today = new Date()
    const resetFilters = {
      status: "all",
      dateRange: "thisMonth",
      building: "all",
      resident: "",
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today,
    }
    onFiltersChange(resetFilters)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Bộ lọc</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Thu gọn" : "Mở rộng"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Status Filter */}
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label htmlFor="dateRange">Khoảng thời gian</Label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="thisMonth">Tháng này</SelectItem>
                <SelectItem value="lastMonth">Tháng trước</SelectItem>
                <SelectItem value="last30Days">30 ngày qua</SelectItem>
                <SelectItem value="thisYear">Năm nay</SelectItem>
                <SelectItem value="custom">Tùy chọn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Building Filter */}
          <div>
            <Label htmlFor="building">Tòa nhà</Label>
            <Select value={filters.building} onValueChange={(value) => handleFilterChange("building", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                {buildingListForDropdown.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
                {/* If buildingListForDropdown is empty, fetch it */}
              </SelectContent>
            </Select>
          </div>

          {/* Resident Search */}
          <div>
            <Label htmlFor="resident">Tên khách hàng</Label>
            <Input
              id="resident"
              placeholder="Tìm theo tên khách hàng"
              value={filters.resident}
              onChange={(e) => handleFilterChange("resident", e.target.value)}
            />
          </div>
        </div>

        {/* Custom Date Range */}
        {(isExpanded || filters.dateRange === "custom") && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label>Từ ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.startDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => date && handleFilterChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Đến ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.endDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => date && handleFilterChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
