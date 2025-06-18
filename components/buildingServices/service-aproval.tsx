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
import { Zap, Droplets, Wifi, Car, Dumbbell, CheckCircle2, XCircle, MoreVertical, Eye } from "lucide-react"
import { useBuilding } from "../context/BuildingContext"
import { useServicesUsage } from "../context/ServiceUsage"
import { BlockDetail } from "@/services/building-service"

// Sample data for buildings
// const buildings = [
//   { id: 1, name: "Building A" },
//   { id: 2, name: "Building B" },
//   { id: 3, name: "Building C" },
// ]

// Sample data for blocks
// const blocks = [
//   { id: 1, buildingId: 1, name: "Block A1" },
//   { id: 2, buildingId: 1, name: "Block A2" },
//   { id: 3, buildingId: 2, name: "Block B1" },
//   { id: 4, buildingId: 3, name: "Block C1" },
// ]

// Sample data for floors
// const floors = [
//   { id: 1, blockId: 1, name: "Floor 1" },
//   { id: 2, blockId: 1, name: "Floor 2" },
//   { id: 3, blockId: 2, name: "Floor 1" },
//   { id: 4, blockId: 3, name: "Floor 1" },
//   { id: 5, blockId: 4, name: "Floor 1" },
// ]

// Sample data for residents
// const residents = [
//   { id: 1, name: "Nguyen Van A", unit: "A1-101", buildingId: 1, blockId: 1, floorId: 1 },
//   { id: 2, name: "Tran Thi B", unit: "A1-102", buildingId: 1, blockId: 1, floorId: 1 },
//   { id: 3, name: "Le Van C", unit: "A1-201", buildingId: 1, blockId: 1, floorId: 2 },
//   { id: 4, name: "Pham Thi D", unit: "A2-101", buildingId: 1, blockId: 2, floorId: 3 },
//   { id: 5, name: "Hoang Van E", unit: "B1-101", buildingId: 2, blockId: 3, floorId: 4 },
//   { id: 6, name: "Nguyen Thi F", unit: "C1-101", buildingId: 3, blockId: 4, floorId: 5 },
// ]

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

// Sample data for service requests
const initialRequests = [
  {
    id: 1,
    residentId: 1,
    serviceId: 6,
    requestDate: "2023-05-01",
    status: "pending",
    notes: "Requesting basic internet package",
  },
  {
    id: 2,
    residentId: 2,
    serviceId: 8,
    requestDate: "2023-05-02",
    status: "pending",
    notes: "Need parking for my new car",
  },
  {
    id: 3,
    residentId: 3,
    serviceId: 10,
    requestDate: "2023-05-03",
    status: "pending",
    notes: "Would like to use the gym facilities",
  },
  {
    id: 4,
    residentId: 4,
    serviceId: 4,
    requestDate: "2023-05-04",
    status: "pending",
    notes: "Need water service for my unit",
  },
  {
    id: 5,
    residentId: 5,
    serviceId: 1,
    requestDate: "2023-05-05",
    status: "pending",
    notes: "Requesting electricity service",
  },
]

export function ServiceApproval() {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const {buildingDetails,blocks,floors, getBlockDetail} = useBuilding();
  const block: BlockDetail = getBlockDetail();
  const { serviceUsages } = useServicesUsage();
  console.log(blocks);

  const handleApproveRequest = (id: number) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))
  }

  const handleRejectRequest = (id: number) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
  }

  // Filter blocks based on selected building
  const filteredBlocks = blocks.filter((block) => selectedBuilding === null || block.maTN === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floors.filter((floor) => selectedBlock === null || floor.maKN === selectedBlock)

  // Get resident by ID
  const getResidentById = (id: number) => {
    return serviceUsages.find((resident) => resident.maKH === id)
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

  // Filter requests based on active tab and filters
  const filteredRequests = requests.filter((request) => {
    const resident = getResidentById(request.residentId)
    if (!resident) return false

    const matchesSearch =
      resident.tenKH.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.maVT.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilters =
      (selectedBuilding === null || resident.maTN === selectedBuilding) &&
      (selectedBlock === null || resident.maKN === selectedBlock) &&
      (selectedFloor === null || resident.maTL === selectedFloor)

    const matchesTab =
      (activeTab === "pending" && request.status === "pending") ||
      (activeTab === "approved" && request.status === "approved") ||
      (activeTab === "rejected" && request.status === "rejected") ||
      activeTab === "all"

    return matchesSearch && matchesFilters && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search residents..."
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
              {buildingDetails.map((building,index) => (
                <SelectItem key={index} value={building.id.toString()}>
                  {building.name  }
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
              {filteredBlocks.map((block,index) => (
                <SelectItem key={index} value={block.maKN.toString()}>
                  {block.tenKN}
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
              <SelectItem value="all">Tất cả tầng lầu</SelectItem>
              {filteredFloors.map((floor,index) => (
                <SelectItem key={index} value={floor.maTL.toString()}>
                  {floor.tenTL}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="secondary">{requests.filter((r) => r.status === "pending").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            Approved
            <Badge variant="secondary">{requests.filter((r) => r.status === "approved").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            Rejected
            <Badge variant="secondary">{requests.filter((r) => r.status === "rejected").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Requests
            <Badge variant="secondary">{requests.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>Review and approve service requests from residents</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const resident = getResidentById(request.residentId)
                  const service = getServiceById(request.serviceId)

                  if (!resident || !service) return null

                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{resident.tenKH}</TableCell>
                      <TableCell>{resident.maVT}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {service.icon}
                          <span>{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                              : request.status === "approved"
                                ? "bg-green-50 text-green-700 hover:bg-green-50"
                                : "bg-red-50 text-red-700 hover:bg-red-50"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.notes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {request.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRejectRequest(request.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">No service requests found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
