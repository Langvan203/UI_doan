"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface InvoiceFiltersProps {
  filters: {
    status: string
    dateRange: string
    building: string
    resident: string
  }
  setFilters: (filters: any) => void
}

export function InvoiceFilters({ filters, setFilters }: InvoiceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleResidentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, resident: e.target.value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value })
  }

  const handleDateRangeChange = (value: string) => {
    setFilters({ ...filters, dateRange: value })
  }

  const handleBuildingChange = (value: string) => {
    setFilters({ ...filters, building: value })
  }

  const handleReset = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      building: "all",
      resident: "",
    })
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resident..."
          className="w-full pl-8"
          value={filters.resident}
          onChange={handleResidentSearch}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Filter by</h4>
              <div className="grid gap-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-sm">
                    Status
                  </label>
                  <Select value={filters.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="date" className="text-sm">
                    Date
                  </label>
                  <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="building" className="text-sm">
                    Building
                  </label>
                  <Select value={filters.building} onValueChange={handleBuildingChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All buildings</SelectItem>
                      <SelectItem value="a">Building A</SelectItem>
                      <SelectItem value="b">Building B</SelectItem>
                      <SelectItem value="c">Building C</SelectItem>
                      <SelectItem value="d">Building D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button onClick={handleReset}>Reset Filters</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
