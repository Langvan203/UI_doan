"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Droplets, Wifi, Car, Dumbbell, MoreVertical, Eye, FileText, Ban } from "lucide-react"

// Sample data for buildings
const buildings = [
  { id: 1, name: "Building A" },
  { id: 2, name: "Building B" },
  { id: 3, name: "Building C" },
]

// Sample data for blocks
const blocks = [
  { id: 1, buildingId: 1, name: "Block A1" },
  { id: 2, buildingId: 1, name: "Block A2" },
  { id: 3, buildingId: 2, name: "Block B1" },
  { id: 4, buildingId: 3, name: "Block C1" },
]

// Sample data for floors
const floors = [
  { id: 1, blockId: 1, name: "Floor 1" },
  { id: 2, blockId: 1, name: "Floor 2" },
  { id: 3, blockId: 2, name: "Floor 1" },
  { id: 4, blockId: 3, name: "Floor 1" },
  { id: 5, blockId: 4, name: "Floor 1" },
]

// Sample data for residents
const residents = [
  { id: 1, name: "Nguyen Van A", unit: "A1-101", buildingId: 1, blockId: 1, floorId: 1 },
  { id: 2, name: "Tran Thi B", unit: "A1-102", buildingId: 1, blockId: 1, floorId: 1 },
  { id: 3, name: "Le Van C", unit: "A1-201", buildingId: 1, blockId: 1, floorId: 2 },
  { id: 4, name: "Pham Thi D", unit: "A2-101", buildingId: 1, blockId: 2, floorId: 3 },
  { id: 5, name: "Hoang Van E", unit: "B1-101", buildingId: 2, blockId: 3, floorId: 4 },
  { id: 6, name: "Nguyen Thi F", unit: "C1-101", buildingId: 3, blockId: 4, floorId: 5 },
]

// Sample data for services
const services = [
  {
    id: 1,
    name: "Residential Electricity",
    typeId: 1,
    typeName: "Electricity",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    price: 3500,
  },
  {
    id: 2,
    name: "Commercial Electricity",
    typeId: 1,
    typeName: "Electricity",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    price: 4200,
  },
  {
    id: 4,
    name: "Residential Water",
    typeId: 2,
    typeName: "Water",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    price: 15000,
  },
  {
    id: 6,
    name: "Basic Internet",
    typeId: 3,
    typeName: "Internet",
    icon: <Wifi className="h-5 w-5 text-purple-500" />,
    price: 200000,
  },
  {
    id: 8,
    name: "Car Parking",
    typeId: 4,
    typeName: "Parking",
    icon: <Car className="h-5 w-5 text-gray-500" />,
    price: 1200000,
  },
  {
    id: 10,
    name: "Gym Membership",
    typeId: 5,
    typeName: "Gym",
    icon: <Dumbbell className="h-5 w-5 text-green-500" />,
    price: 500000,
  },
]

// Sample data for service usage
const initialUsage = [
  {
    id: 1,
    residentId: 1,
    serviceId: 1,
    startDate: "2023-01-01",
    endDate: null,
    lastBillingDate: "2023-04-01",
    status: "active",
    usageData: [
      { month: "Jan", year: 2023, amount: 120, unit: "kWh", billed: true },
      { month: "Feb", year: 2023, amount: 135, unit: "kWh", billed: true },
      { month: "Mar", year: 2023, amount: 142, unit: "kWh", billed: true },
      { month: "Apr", year: 2023, amount: 128, unit: "kWh", billed: false },
    ],
  },
  {
    id: 2,
    residentId: 1,
    serviceId: 4,
    startDate: "2023-01-01",
    endDate: null,
    lastBillingDate: "2023-04-01",
    status: "active",
    usageData: [
      { month: "Jan", year: 2023, amount: 8, unit: "m³", billed: true },
      { month: "Feb", year: 2023, amount: 10, unit: "m³", billed: true },
      { month: "Mar", year: 2023, amount: 9, unit: "m³", billed: true },
      { month: "Apr", year: 2023, amount: 11, unit: "m³", billed: false },
    ],
  },
  {
    id: 3,
    residentId: 1,
    serviceId: 6,
    startDate: "2023-01-01",
    endDate: null,
    lastBillingDate: "2023-04-01",
    status: "active",
    usageData: [
      { month: "Jan", year: 2023, amount: 1, unit: "month", billed: true },
      { month: "Feb", year: 2023, amount: 1, unit: "month", billed: true },
      { month: "Mar", year: 2023, amount: 1, unit: "month", billed: true },
      { month: "Apr", year: 2023, amount: 1, unit: "month", billed: false },
    ],
  },
  {
    id: 4,
    residentId: 2,
    serviceId: 1,
    startDate: "2023-01-15",
    endDate: null,
    lastBillingDate: "2023-04-01",
    status: "active",
    usageData: [
      { month: "Jan", year: 2023, amount: 80, unit: "kWh", billed: true },
      { month: "Feb", year: 2023, amount: 95, unit: "kWh", billed: true },
      { month: "Mar", year: 2023, amount: 102, unit: "kWh", billed: true },
      { month: "Apr", year: 2023, amount: 98, unit: "kWh", billed: false },
    ],
  },
  {
    id: 5,
    residentId: 3,
    serviceId: 1,
    startDate: "2023-02-01",
    endDate: null,
    lastBillingDate: "2023-04-01",
    status: "active",
    usageData: [
      { month: "Feb", year: 2023, amount: 110, unit: "kWh", billed: true },
      { month: "Mar", year: 2023, amount: 125, unit: "kWh", billed: true },
      { month: "Apr", year: 2023, amount: 118, unit: "kWh", billed: false },
    ],
  },
]

export function ServiceUsage() {
  const [usage, setUsage] = useState(initialUsage)
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleSuspendService = (id: number) => {
    setUsage(usage.map((item) => (item.id === id ? { ...item, status: "suspended" } : item)))
  }

  // Filter blocks based on selected building
  const filteredBlocks = blocks.filter((block) => selectedBuilding === null || block.buildingId === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floors.filter((floor) => selectedBlock === null || floor.blockId === selectedBlock)

  // Get resident by ID
  const getResidentById = (id: number) => {
    return residents.find((resident) => resident.id === id)
  }

  // Get service by ID
  const getServiceById = (id: number) => {
    return services.find((service) => service.id === id)
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate total usage for a service
  const calculateTotalUsage = (usageData: any[]) => {
    return usageData.reduce((total, data) => total + data.amount, 0)
  }

  // Calculate total cost for a service
  const calculateTotalCost = (usageData: any[], serviceId: number) => {
    const service = getServiceById(serviceId)
    if (!service) return 0

    return usageData.reduce((total, data) => {
      return total + data.amount * service.price
    }, 0)
  }

  // Filter usage based on active tab and filters
  const filteredUsage = usage.filter((item) => {
    const resident = getResidentById(item.residentId)
    if (!resident) return false

    const service = getServiceById(item.serviceId)
    if (!service) return false

    const matchesSearch =
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilters =
      (selectedBuilding === null || resident.buildingId === selectedBuilding) &&
      (selectedBlock === null || resident.blockId === selectedBlock) &&
      (selectedFloor === null || resident.floorId === selectedFloor)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "electricity" && service.typeId === 1) ||
      (activeTab === "water" && service.typeId === 2) ||
      (activeTab === "internet" && service.typeId === 3) ||
      (activeTab === "other" && ![1, 2, 3].includes(service.typeId))

    return matchesSearch && matchesFilters && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search residents or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={selectedBuilding?.toString() || ""}
            onValueChange={(value) => {
              setSelectedBuilding(value ? Number.parseInt(value) : null)
              setSelectedBlock(null)
              setSelectedFloor(null)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Buildings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building.id} value={building.id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedBlock?.toString() || ""}
            onValueChange={(value) => {
              setSelectedBlock(value ? Number.parseInt(value) : null)
              setSelectedFloor(null)
            }}
            disabled={selectedBuilding === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {filteredBlocks.map((block) => (
                <SelectItem key={block.id} value={block.id.toString()}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedFloor?.toString() || ""}
            onValueChange={(value) => setSelectedFloor(value ? Number.parseInt(value) : null)}
            disabled={selectedBlock === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {filteredFloors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id.toString()}>
                  {floor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Services
          </TabsTrigger>
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Electricity</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Water</span>
          </TabsTrigger>
          <TabsTrigger value="internet" className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-purple-500" />
            <span>Internet</span>
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-2">
            Other Services
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Active Services</CardTitle>
          <CardDescription>Services currently being used by residents</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsage.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Total Usage</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsage.map((item) => {
                  const resident = getResidentById(item.residentId)
                  const service = getServiceById(item.serviceId)

                  if (!resident || !service) return null

                  const totalUsage = calculateTotalUsage(item.usageData)
                  const totalCost = calculateTotalCost(item.usageData, item.serviceId)

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell>{resident.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {service.icon}
                          <span>{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell>
                        {totalUsage} {item.usageData[0]?.unit}
                      </TableCell>
                      <TableCell>{formatPrice(totalCost)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "active"
                              ? "bg-green-50 text-green-700 hover:bg-green-50"
                              : "bg-red-50 text-red-700 hover:bg-red-50"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Generate Invoice
                            </DropdownMenuItem>
                            {item.status === "active" && (
                              <DropdownMenuItem onClick={() => handleSuspendService(item.id)}>
                                <Ban className="mr-2 h-4 w-4 text-red-600" />
                                Suspend Service
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">No active services found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
          <CardDescription>Summary of service usage by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                typeId: 1,
                name: "Electricity",
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                unit: "kWh",
                color: "bg-yellow-100 border-yellow-300",
              },
              {
                typeId: 2,
                name: "Water",
                icon: <Droplets className="h-8 w-8 text-blue-500" />,
                unit: "m³",
                color: "bg-blue-100 border-blue-300",
              },
              {
                typeId: 3,
                name: "Internet",
                icon: <Wifi className="h-8 w-8 text-purple-500" />,
                unit: "month",
                color: "bg-purple-100 border-purple-300",
              },
              {
                typeId: 4,
                name: "Other Services",
                icon: <Dumbbell className="h-8 w-8 text-green-500" />,
                unit: "",
                color: "bg-green-100 border-green-300",
              },
            ].map((type) => {
              const typeUsage = usage.filter((item) => {
                const service = getServiceById(item.serviceId)
                if (!service) return false

                if (type.typeId === 4) {
                  return ![1, 2, 3].includes(service.typeId)
                }

                return service.typeId === type.typeId
              })

              const totalUsage = typeUsage.reduce((total, item) => {
                return total + calculateTotalUsage(item.usageData)
              }, 0)

              const totalCost = typeUsage.reduce((total, item) => {
                return total + calculateTotalCost(item.usageData, item.serviceId)
              }, 0)

              return (
                <Card key={type.typeId} className={`border-2 ${type.color}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    {type.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Usage:</span>
                        <span className="font-medium">
                          {totalUsage} {type.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Cost:</span>
                        <span className="font-medium">{formatPrice(totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Services:</span>
                        <span className="font-medium">{typeUsage.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
