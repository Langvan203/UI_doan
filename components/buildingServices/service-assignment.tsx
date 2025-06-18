"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Droplets,
  Wifi,
  Car,
  Dumbbell,
  Trash2,
  Edit,
  MoreVertical,
  Plus,
  Building,
  Home,
  Users,
  Gauge,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    requiresMeter: true,
  },
  {
    id: 2,
    name: "Commercial Electricity",
    typeId: 1,
    typeName: "Electricity",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    price: 4200,
    requiresMeter: true,
  },
  {
    id: 4,
    name: "Residential Water",
    typeId: 2,
    typeName: "Water",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    price: 15000,
    requiresMeter: true,
  },
  {
    id: 6,
    name: "Basic Internet",
    typeId: 3,
    typeName: "Internet",
    icon: <Wifi className="h-5 w-5 text-purple-500" />,
    price: 200000,
    requiresMeter: false,
  },
  {
    id: 8,
    name: "Car Parking",
    typeId: 4,
    typeName: "Parking",
    icon: <Car className="h-5 w-5 text-gray-500" />,
    price: 1200000,
    requiresMeter: false,
  },
  {
    id: 10,
    name: "Gym Membership",
    typeId: 5,
    typeName: "Gym",
    icon: <Dumbbell className="h-5 w-5 text-green-500" />,
    price: 500000,
    requiresMeter: false,
  },
]

// Sample data for meters
const meters = [
  {
    id: 1,
    serialNumber: "E-A1-101",
    typeId: 1,
    unitId: 1,
    status: "active",
  },
  {
    id: 2,
    serialNumber: "W-A1-101",
    typeId: 2,
    unitId: 1,
    status: "active",
  },
  {
    id: 3,
    serialNumber: "E-A1-102",
    typeId: 1,
    unitId: 2,
    status: "active",
  },
  {
    id: 4,
    serialNumber: "W-A1-102",
    typeId: 2,
    unitId: 2,
    status: "active",
  },
  {
    id: 5,
    serialNumber: "E-A1-201",
    typeId: 1,
    unitId: 3,
    status: "active",
  },
  {
    id: 6,
    serialNumber: "W-A1-201",
    typeId: 2,
    unitId: 3,
    status: "active",
  },
  {
    id: 7,
    serialNumber: "E-A2-101",
    typeId: 1,
    unitId: 4,
    status: "active",
  },
  {
    id: 8,
    serialNumber: "W-A2-101",
    typeId: 2,
    unitId: 4,
    status: "active",
  },
  {
    id: 9,
    serialNumber: "E-B1-101",
    typeId: 1,
    unitId: 5,
    status: "maintenance",
  },
  {
    id: 10,
    serialNumber: "W-B1-101",
    typeId: 2,
    unitId: 5,
    status: "active",
  },
]

// Sample data for service assignments
const initialAssignments = [
  { id: 1, residentId: 1, serviceId: 1, meterId: 1, startDate: "2023-01-01", status: "active" },
  { id: 2, residentId: 1, serviceId: 4, meterId: 2, startDate: "2023-01-01", status: "active" },
  { id: 3, residentId: 1, serviceId: 6, meterId: null, startDate: "2023-01-01", status: "active" },
  { id: 4, residentId: 2, serviceId: 1, meterId: 3, startDate: "2023-01-15", status: "active" },
  { id: 5, residentId: 3, serviceId: 1, meterId: 5, startDate: "2023-02-01", status: "active" },
  { id: 6, residentId: 4, serviceId: 2, meterId: 7, startDate: "2023-02-15", status: "active" },
  { id: 7, residentId: 5, serviceId: 1, meterId: 9, startDate: "2023-03-01", status: "active" },
  { id: 8, residentId: 6, serviceId: 1, meterId: null, startDate: "2023-03-15", status: "pending" },
]

// Get unit ID by resident ID
const getUnitIdByResidentId = (residentId: number) => {
  const resident = residents.find((r) => r.id === residentId)
  if (!resident) return null

  const unit = resident.unit
  return unit
}

export function ServiceAssignment() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    residentId: 0,
    serviceId: 0,
    meterId: null as number | null,
    startDate: new Date().toISOString().split("T")[0],
  })
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleAddAssignment = () => {
    if (newAssignment.residentId === 0 || newAssignment.serviceId === 0) return

    const service = services.find((s) => s.id === newAssignment.serviceId)
    if (service?.requiresMeter && newAssignment.meterId === null) {
      alert("This service requires a meter. Please select a meter.")
      return
    }

    const newId = Math.max(...assignments.map((assignment) => assignment.id)) + 1
    const newAssignmentItem = {
      id: newId,
      residentId: newAssignment.residentId,
      serviceId: newAssignment.serviceId,
      meterId: newAssignment.meterId,
      startDate: newAssignment.startDate,
      status: "active",
    }

    setAssignments([...assignments, newAssignmentItem])
    setNewAssignment({
      residentId: 0,
      serviceId: 0,
      meterId: null,
      startDate: new Date().toISOString().split("T")[0],
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id))
  }

  // Filter residents based on selected building, block, floor
  const filteredResidents = residents.filter(
    (resident) =>
      (selectedBuilding === null || resident.buildingId === selectedBuilding) &&
      (selectedBlock === null || resident.blockId === selectedBlock) &&
      (selectedFloor === null || resident.floorId === selectedFloor) &&
      (resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.unit.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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

  // Get meter by ID
  const getMeterById = (id: number | null) => {
    if (id === null) return null
    return meters.find((meter) => meter.id === id)
  }

  // Get available meters for a resident and service type
  const getAvailableMeters = (residentId: number, serviceTypeId: number) => {
    const resident = getResidentById(residentId)
    if (!resident) return []

    // Find meters that match the service type and are assigned to the resident's unit
    return meters.filter(
      (meter) =>
        meter.typeId === serviceTypeId &&
        meter.status === "active" &&
        // Check if the meter is not already assigned to another service
        !assignments.some((a) => a.meterId === meter.id && a.status === "active"),
    )
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Filter assignments based on active tab
  const filteredAssignments = assignments.filter((assignment) => {
    const resident = getResidentById(assignment.residentId)
    if (!resident) return false

    const service = getServiceById(assignment.serviceId)
    if (!service) return false

    const matchesSearch =
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.unit.toLowerCase().includes(searchQuery.toLowerCase())

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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Yêu cầu phân công mét</AlertTitle>
        <AlertDescription>
          Các dịch vụ điện và nước cần phải được chỉ định một đồng hồ đo. Hãy đảm bảo chọn một đồng hồ đo khi chỉ định
          các dịch vụ này.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Tìm kiếm cư dân"
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
              <SelectValue placeholder="Tất cả tòa nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả tòa nhà</SelectItem>
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
              <SelectValue placeholder="Tất cả khối nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả khối nhà</SelectItem>
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
              <SelectValue placeholder="Tất cả tầng lầu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả tầng lầu</SelectItem>
              {filteredFloors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id.toString()}>
                  {floor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ sử dụng mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ sử dụng cho cư dân</DialogTitle>
              <DialogDescription>Thêm một dịch vụ cho cư dân trong tòa nhà</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="resident">Căn hộ</Label>
                <Select
                  value={newAssignment.residentId ? newAssignment.residentId.toString() : ""}
                  onValueChange={(value) => {
                    const residentId = Number.parseInt(value)
                    setNewAssignment({
                      ...newAssignment,
                      residentId,
                      meterId: null, // Reset meter when resident changes
                    })
                  }}
                >
                  <SelectTrigger id="resident">
                    <SelectValue placeholder="Select resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {residents.map((resident) => (
                      <SelectItem key={resident.id} value={resident.id.toString()}>
                        {resident.name} - {resident.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Dịch vụ</Label>
                <Select
                  value={newAssignment.serviceId ? newAssignment.serviceId.toString() : ""}
                  onValueChange={(value) => {
                    const serviceId = Number.parseInt(value)
                    setNewAssignment({
                      ...newAssignment,
                      serviceId,
                      meterId: null, // Reset meter when service changes
                    })
                  }}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        <div className="flex items-center">
                          {service.icon}
                          <span className="ml-2">
                            {service.name} - {formatPrice(service.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newAssignment.residentId > 0 &&
                newAssignment.serviceId > 0 &&
                services.find((s) => s.id === newAssignment.serviceId)?.requiresMeter && (
                  <div className="grid gap-2">
                    <Label htmlFor="meter">
                      Meter <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newAssignment.meterId ? newAssignment.meterId.toString() : ""}
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, meterId: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="meter">
                        <SelectValue placeholder="Select meter" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableMeters(
                          newAssignment.residentId,
                          services.find((s) => s.id === newAssignment.serviceId)?.typeId || 0,
                        ).map((meter) => (
                          <SelectItem key={meter.id} value={meter.id.toString()}>
                            <div className="flex items-center">
                              <Gauge className="h-4 w-4 mr-2" />
                              {meter.serialNumber}
                            </div>
                          </SelectItem>
                        ))}
                        {getAvailableMeters(
                          newAssignment.residentId,
                          services.find((s) => s.id === newAssignment.serviceId)?.typeId || 0,
                        ).length === 0 && (
                            <SelectItem value="no-meter" disabled>
                              No available meters
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    {getAvailableMeters(
                      newAssignment.residentId,
                      services.find((s) => s.id === newAssignment.serviceId)?.typeId || 0,
                    ).length === 0 && (
                        <p className="text-sm text-red-500">
                          Không có đồng hồ nào khả dụng cho dịch vụ này. Vui lòng thêm đồng hồ mới hoặc chọn một đồng hồ khác.
                        </p>
                      )}
                  </div>
                )}

              <div className="grid gap-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newAssignment.startDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAssignment}>Thêm dịch vụ sử dụng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Tất cả dịch vụ
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
            Dịch vụ khác
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Thêm dịch vụ sử dụng</CardTitle>
          <CardDescription>Thêm dịch vụ sử dụng cho cư dân </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cư dân</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Đồng hồ</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const resident = getResidentById(assignment.residentId)
                  const service = getServiceById(assignment.serviceId)
                  const meter = getMeterById(assignment.meterId)

                  if (!resident || !service) return null

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell>{resident.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {service.icon}
                          <span>{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {service.requiresMeter ? (
                          meter ? (
                            <div className="flex items-center space-x-2">
                              <Gauge className="h-4 w-4" />
                              <span>{meter.serialNumber}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                              Không có đồng hồ
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                            Không yêu cầu đồng hồ
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{assignment.startDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            assignment.status === "active"
                              ? "bg-green-50 text-green-700 hover:bg-green-50"
                              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                          }
                        >
                          {assignment.status}
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
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteAssignment(assignment.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
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
              <p className="text-sm text-muted-foreground">Không có dịch vụ nào được tìm thấy</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cư dân không có dịch vụ</CardTitle>
          <CardDescription>Cư dân không được cung cấp bất kỳ dịch vụ nào</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResidents
              .filter((resident) => !assignments.some((a) => a.residentId === resident.id))
              .map((resident) => (
                <Card key={resident.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{resident.name}</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewAssignment({ ...newAssignment, residentId: resident.id })
                        setIsAddDialogOpen(true)
                      }}
                    >
                      Assign
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span>{resident.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>
                          {buildings.find((b) => b.id === resident.buildingId)?.name},
                          {blocks.find((b) => b.id === resident.blockId)?.name},
                          {floors.find((f) => f.id === resident.floorId)?.name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {filteredResidents.filter((resident) => !assignments.some((a) => a.residentId === resident.id)).length ===
            0 && (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">Tất cả cư dân đều được cung cấp dịch vụ</p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
