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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Zap,
  Droplets,
  MoreVertical,
  Plus,
  Trash2,
  History,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

// Sample data for units
const units = [
  { id: 1, floorId: 1, name: "A1-101", residentId: 1 },
  { id: 2, floorId: 1, name: "A1-102", residentId: 2 },
  { id: 3, floorId: 2, name: "A1-201", residentId: 3 },
  { id: 4, floorId: 3, name: "A2-101", residentId: 4 },
  { id: 5, floorId: 4, name: "B1-101", residentId: 5 },
  { id: 6, floorId: 5, name: "C1-101", residentId: 6 },
]

// Sample data for residents
const residents = [
  { id: 1, name: "Nguyen Van A", unitId: 1 },
  { id: 2, name: "Tran Thi B", unitId: 2 },
  { id: 3, name: "Le Van C", unitId: 3 },
  { id: 4, name: "Pham Thi D", unitId: 4 },
  { id: 5, name: "Hoang Van E", unitId: 5 },
  { id: 6, name: "Nguyen Thi F", unitId: 6 },
]

// Sample data for meter types
const meterTypes = [
  { id: 1, name: "Electricity", icon: <Zap className="h-5 w-5 text-yellow-500" />, unit: "kWh" },
  { id: 2, name: "Water", icon: <Droplets className="h-5 w-5 text-blue-500" />, unit: "m³" },
]

// Sample data for meters
const initialMeters = [
  {
    id: 1,
    serialNumber: "E-A1-101",
    typeId: 1,
    unitId: 1,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 1250,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 1000, consumption: 0, verified: true },
      { date: "2023-02-15", value: 1080, consumption: 80, verified: true },
      { date: "2023-03-15", value: 1170, consumption: 90, verified: true },
      { date: "2023-04-15", value: 1250, consumption: 80, verified: true },
    ],
  },
  {
    id: 2,
    serialNumber: "W-A1-101",
    typeId: 2,
    unitId: 1,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 38,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 0, consumption: 0, verified: true },
      { date: "2023-02-15", value: 8, consumption: 8, verified: true },
      { date: "2023-03-15", value: 25, consumption: 17, verified: true },
      { date: "2023-04-15", value: 38, consumption: 13, verified: true },
    ],
  },
  {
    id: 3,
    serialNumber: "E-A1-102",
    typeId: 1,
    unitId: 2,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 950,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 700, consumption: 0, verified: true },
      { date: "2023-02-15", value: 780, consumption: 80, verified: true },
      { date: "2023-03-15", value: 870, consumption: 90, verified: true },
      { date: "2023-04-15", value: 950, consumption: 80, verified: true },
    ],
  },
  {
    id: 4,
    serialNumber: "W-A1-102",
    typeId: 2,
    unitId: 2,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 32,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 0, consumption: 0, verified: true },
      { date: "2023-02-15", value: 7, consumption: 7, verified: true },
      { date: "2023-03-15", value: 20, consumption: 13, verified: true },
      { date: "2023-04-15", value: 32, consumption: 12, verified: true },
    ],
  },
  {
    id: 5,
    serialNumber: "E-A1-201",
    typeId: 1,
    unitId: 3,
    installDate: "2023-01-15",
    lastReadingDate: "2023-04-15",
    lastReading: 1100,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 800, consumption: 0, verified: true },
      { date: "2023-02-15", value: 890, consumption: 90, verified: true },
      { date: "2023-03-15", value: 990, consumption: 100, verified: true },
      { date: "2023-04-15", value: 1100, consumption: 110, verified: true },
    ],
  },
  {
    id: 6,
    serialNumber: "W-A1-201",
    typeId: 2,
    unitId: 3,
    installDate: "2023-01-15",
    lastReadingDate: "2023-04-15",
    lastReading: 45,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 0, consumption: 0, verified: true },
      { date: "2023-02-15", value: 12, consumption: 12, verified: true },
      { date: "2023-03-15", value: 28, consumption: 16, verified: true },
      { date: "2023-04-15", value: 45, consumption: 17, verified: true },
    ],
  },
  {
    id: 7,
    serialNumber: "E-A2-101",
    typeId: 1,
    unitId: 4,
    installDate: "2023-02-01",
    lastReadingDate: "2023-04-15",
    lastReading: 1500,
    status: "active",
    readings: [
      { date: "2023-02-15", value: 1200, consumption: 0, verified: true },
      { date: "2023-03-15", value: 1350, consumption: 150, verified: true },
      { date: "2023-04-15", value: 1500, consumption: 150, verified: true },
    ],
  },
  {
    id: 8,
    serialNumber: "W-A2-101",
    typeId: 2,
    unitId: 4,
    installDate: "2023-02-01",
    lastReadingDate: "2023-04-15",
    lastReading: 30,
    status: "active",
    readings: [
      { date: "2023-02-15", value: 0, consumption: 0, verified: true },
      { date: "2023-03-15", value: 15, consumption: 15, verified: true },
      { date: "2023-04-15", value: 30, consumption: 15, verified: true },
    ],
  },
  {
    id: 9,
    serialNumber: "E-B1-101",
    typeId: 1,
    unitId: 5,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 2200,
    status: "maintenance",
    readings: [
      { date: "2023-01-15", value: 1800, consumption: 0, verified: true },
      { date: "2023-02-15", value: 1950, consumption: 150, verified: true },
      { date: "2023-03-15", value: 2100, consumption: 150, verified: true },
      { date: "2023-04-15", value: 2200, consumption: 100, verified: true },
    ],
  },
  {
    id: 10,
    serialNumber: "W-B1-101",
    typeId: 2,
    unitId: 5,
    installDate: "2023-01-01",
    lastReadingDate: "2023-04-15",
    lastReading: 60,
    status: "active",
    readings: [
      { date: "2023-01-15", value: 0, consumption: 0, verified: true },
      { date: "2023-02-15", value: 18, consumption: 18, verified: true },
      { date: "2023-03-15", value: 40, consumption: 22, verified: true },
      { date: "2023-04-15", value: 60, consumption: 20, verified: true },
    ],
  },
]

export function MeterManagement() {
  const [activeTab, setActiveTab] = useState("electricity")
  const [meters, setMeters] = useState(initialMeters)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isReadingDialogOpen, setIsReadingDialogOpen] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<any>(null)
  const [newMeter, setNewMeter] = useState({
    serialNumber: "",
    typeId: 1,
    unitId: 0,
    installDate: new Date().toISOString().split("T")[0],
  })
  const [newReading, setNewReading] = useState({
    date: new Date().toISOString().split("T")[0],
    value: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)

  const handleAddMeter = () => {
    if (newMeter.unitId === 0) return

    const newId = Math.max(...meters.map((meter) => meter.id)) + 1
    const newMeterItem = {
      id: newId,
      serialNumber: newMeter.serialNumber,
      typeId: newMeter.typeId,
      unitId: newMeter.unitId,
      installDate: newMeter.installDate,
      lastReadingDate: newMeter.installDate,
      lastReading: 0,
      status: "active",
      readings: [
        {
          date: newMeter.installDate,
          value: 0,
          consumption: 0,
          verified: true,
        },
      ],
    }

    setMeters([...meters, newMeterItem])
    setNewMeter({
      serialNumber: "",
      typeId: 1,
      unitId: 0,
      installDate: new Date().toISOString().split("T")[0],
    })
    setIsAddDialogOpen(false)
  }

  const handleAddReading = () => {
    if (!selectedMeter) return

    const updatedMeter = { ...selectedMeter }
    const lastReading = updatedMeter.readings[updatedMeter.readings.length - 1]
    const consumption = Math.max(0, newReading.value - lastReading.value)

    updatedMeter.readings.push({
      date: newReading.date,
      value: newReading.value,
      consumption,
      verified: false,
    })

    updatedMeter.lastReadingDate = newReading.date
    updatedMeter.lastReading = newReading.value

    setMeters(meters.map((meter) => (meter.id === selectedMeter.id ? updatedMeter : meter)))
    setNewReading({
      date: new Date().toISOString().split("T")[0],
      value: 0,
    })
    setIsReadingDialogOpen(false)
  }

  const handleVerifyReading = (meterId: number, readingIndex: number) => {
    const updatedMeters = meters.map((meter) => {
      if (meter.id === meterId) {
        const updatedReadings = [...meter.readings]
        updatedReadings[readingIndex] = { ...updatedReadings[readingIndex], verified: true }
        return { ...meter, readings: updatedReadings }
      }
      return meter
    })
    setMeters(updatedMeters)
  }

  const handleDeleteMeter = (id: number) => {
    setMeters(meters.filter((meter) => meter.id !== id))
  }

  const handleChangeMeterStatus = (id: number, status: string) => {
    setMeters(meters.map((meter) => (meter.id === id ? { ...meter, status } : meter)))
  }

  // Filter blocks based on selected building
  const filteredBlocks = blocks.filter((block) => selectedBuilding === null || block.buildingId === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floors.filter((floor) => selectedBlock === null || floor.blockId === selectedBlock)

  // Filter units based on selected floor
  const filteredUnits = units.filter((unit) => selectedFloor === null || unit.floorId === selectedFloor)

  // Get unit by ID
  const getUnitById = (id: number) => {
    return units.find((unit) => unit.id === id)
  }

  // Get resident by unit ID
  const getResidentByUnitId = (unitId: number) => {
    return residents.find((resident) => resident.unitId === unitId)
  }

  // Get meter type by ID
  const getMeterTypeById = (id: number) => {
    return meterTypes.find((type) => type.id === id)
  }

  // Get unit location (building, block, floor)
  const getUnitLocation = (unitId: number) => {
    const unit = getUnitById(unitId)
    if (!unit) return ""

    const floor = floors.find((f) => f.id === unit.floorId)
    if (!floor) return unit.name

    const block = blocks.find((b) => b.id === floor.blockId)
    if (!block) return `${unit.name}, ${floor.name}`

    const building = buildings.find((b) => b.id === block.buildingId)
    if (!building) return `${unit.name}, ${floor.name}, ${block.name}`

    return `${unit.name}, ${floor.name}, ${block.name}, ${building.name}`
  }

  // Filter meters based on search query, selected building, block, floor, and active tab
  const filteredMeters = meters.filter((meter) => {
    const unit = getUnitById(meter.unitId)
    if (!unit) return false

    const floor = floors.find((f) => f.id === unit.floorId)
    if (!floor) return false

    const block = blocks.find((b) => b.id === floor.blockId)
    if (!block) return false

    const building = buildings.find((b) => b.id === block.buildingId)
    if (!building) return false

    const resident = getResidentByUnitId(meter.unitId)
    const meterType = getMeterTypeById(meter.typeId)

    const matchesSearch =
      meter.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resident && resident.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters =
      (selectedBuilding === null || building.id === selectedBuilding) &&
      (selectedBlock === null || block.id === selectedBlock) &&
      (selectedFloor === null || floor.id === selectedFloor)

    const matchesTab =
      (activeTab === "electricity" && meter.typeId === 1) || (activeTab === "water" && meter.typeId === 2)

    return matchesSearch && matchesFilters && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search meters..."
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Meter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Meter</DialogTitle>
              <DialogDescription>Register a new meter for a unit.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={newMeter.serialNumber}
                  onChange={(e) => setNewMeter({ ...newMeter, serialNumber: e.target.value })}
                  placeholder="e.g., E-A1-101, W-B2-203"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meterType">Meter Type</Label>
                <Select
                  value={newMeter.typeId.toString()}
                  onValueChange={(value) => setNewMeter({ ...newMeter, typeId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="meterType">
                    <SelectValue placeholder="Select meter type" />
                  </SelectTrigger>
                  <SelectContent>
                    {meterTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={newMeter.unitId ? newMeter.unitId.toString() : ""}
                  onValueChange={(value) => setNewMeter({ ...newMeter, unitId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => {
                      const resident = getResidentByUnitId(unit.id)
                      return (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.name} - {resident ? resident.name : "Unoccupied"}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="installDate">Installation Date</Label>
                <Input
                  id="installDate"
                  type="date"
                  value={newMeter.installDate}
                  onChange={(e) => setNewMeter({ ...newMeter, installDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeter}>Add Meter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReadingDialogOpen} onOpenChange={setIsReadingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Meter Reading</DialogTitle>
              <DialogDescription>Record a new reading for meter {selectedMeter?.serialNumber || ""}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="readingDate">Reading Date</Label>
                <Input
                  id="readingDate"
                  type="date"
                  value={newReading.date}
                  onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="readingValue">
                  Reading Value ({selectedMeter?.typeId === 1 ? "kWh" : selectedMeter?.typeId === 2 ? "m³" : "units"})
                </Label>
                <Input
                  id="readingValue"
                  type="number"
                  value={newReading.value || ""}
                  onChange={(e) => setNewReading({ ...newReading, value: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Current meter reading"
                />
              </div>
              {selectedMeter && (
                <div className="rounded-md bg-muted p-4">
                  <div className="text-sm font-medium">Last Reading</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>
                      {selectedMeter.lastReading}{" "}
                      {selectedMeter.typeId === 1 ? "kWh" : selectedMeter.typeId === 2 ? "m³" : "units"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      on {new Date(selectedMeter.lastReadingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReadingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReading}>Add Reading</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Electricity Meters</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Water Meters</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Electricity Meters</CardTitle>
              <CardDescription>Manage electricity meters and readings</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMeters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Last Reading</TableHead>
                      <TableHead>Last Reading Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.map((meter) => {
                      const unit = getUnitById(meter.unitId)
                      const resident = unit ? getResidentByUnitId(unit.id) : null
                      const meterType = getMeterTypeById(meter.typeId)

                      return (
                        <TableRow key={meter.id}>
                          <TableCell className="font-medium">{meter.serialNumber}</TableCell>
                          <TableCell>{unit?.name || "Unknown"}</TableCell>
                          <TableCell>{resident?.name || "Unoccupied"}</TableCell>
                          <TableCell>
                            {meter.lastReading} {meterType?.unit || "units"}
                          </TableCell>
                          <TableCell>{meter.lastReadingDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                meter.status === "active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : meter.status === "maintenance"
                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                    : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {meter.status}
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMeter(meter)
                                    setNewReading({
                                      date: new Date().toISOString().split("T")[0],
                                      value: meter.lastReading,
                                    })
                                    setIsReadingDialogOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Reading
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="mr-2 h-4 w-4" />
                                  View History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Usage
                                </DropdownMenuItem>
                                {meter.status === "active" ? (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.id, "maintenance")}>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                                    Mark for Maintenance
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.id, "active")}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Mark as Active
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteMeter(meter.id)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  Delete
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
                  <p className="text-sm text-muted-foreground">No electricity meters found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Meters</CardTitle>
              <CardDescription>Manage water meters and readings</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMeters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Last Reading</TableHead>
                      <TableHead>Last Reading Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.map((meter) => {
                      const unit = getUnitById(meter.unitId)
                      const resident = unit ? getResidentByUnitId(unit.id) : null
                      const meterType = getMeterTypeById(meter.typeId)

                      return (
                        <TableRow key={meter.id}>
                          <TableCell className="font-medium">{meter.serialNumber}</TableCell>
                          <TableCell>{unit?.name || "Unknown"}</TableCell>
                          <TableCell>{resident?.name || "Unoccupied"}</TableCell>
                          <TableCell>
                            {meter.lastReading} {meterType?.unit || "units"}
                          </TableCell>
                          <TableCell>{meter.lastReadingDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                meter.status === "active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : meter.status === "maintenance"
                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                    : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {meter.status}
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMeter(meter)
                                    setNewReading({
                                      date: new Date().toISOString().split("T")[0],
                                      value: meter.lastReading,
                                    })
                                    setIsReadingDialogOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Reading
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="mr-2 h-4 w-4" />
                                  View History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Usage
                                </DropdownMenuItem>
                                {meter.status === "active" ? (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.id, "maintenance")}>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                                    Mark for Maintenance
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.id, "active")}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Mark as Active
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteMeter(meter.id)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  Delete
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
                  <p className="text-sm text-muted-foreground">No water meters found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>Recent meter readings that need verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meters
              .filter((meter) => meter.readings.some((reading) => !reading.verified))
              .map((meter) => {
                const unit = getUnitById(meter.unitId)
                const resident = unit ? getResidentByUnitId(unit.id) : null
                const meterType = getMeterTypeById(meter.typeId)
                const unverifiedReadings = meter.readings.filter((reading) => !reading.verified)

                return (
                  <Card key={meter.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {meterType?.icon}
                          <CardTitle className="text-lg">{meter.serialNumber}</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {unverifiedReadings.length} unverified
                        </Badge>
                      </div>
                      <CardDescription>
                        {unit?.name || "Unknown"} - {resident?.name || "Unoccupied"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        {unverifiedReadings.map((reading, index) => {
                          const readingIndex = meter.readings.findIndex(
                            (r) => r.date === reading.date && r.value === reading.value,
                          )
                          return (
                            <div key={index} className="flex items-center justify-between rounded-md border p-3">
                              <div>
                                <p className="font-medium">
                                  {reading.value} {meterType?.unit || "units"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {reading.date} - Consumption: {reading.consumption} {meterType?.unit || "units"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyReading(meter.id, readingIndex)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Verify
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            {!meters.some((meter) => meter.readings.some((reading) => !reading.verified)) && (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No unverified readings found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Consumption statistics by meter type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {meterTypes.map((type) => {
              const typeMeters = meters.filter((meter) => meter.typeId === type.id)
              const totalConsumption = typeMeters.reduce((total, meter) => {
                return (
                  total +
                  meter.readings.reduce((sum, reading) => {
                    return sum + reading.consumption
                  }, 0)
                )
              }, 0)

              const averageConsumption = typeMeters.length > 0 ? totalConsumption / typeMeters.length : 0

              // Find the meter with highest consumption
              let highestConsumptionMeter = null
              let highestConsumption = 0

              typeMeters.forEach((meter) => {
                const consumption = meter.readings.reduce((sum, reading) => sum + reading.consumption, 0)
                if (consumption > highestConsumption) {
                  highestConsumption = consumption
                  highestConsumptionMeter = meter
                }
              })

              return (
                <Card key={type.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <CardTitle className="text-lg">{type.name} Usage</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Consumption:</span>
                          <span className="font-medium">
                            {totalConsumption} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Average per Meter:</span>
                          <span className="font-medium">
                            {averageConsumption.toFixed(2)} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Active Meters:</span>
                          <span className="font-medium">
                            {typeMeters.filter((meter) => meter.status === "active").length}
                          </span>
                        </div>
                      </div>

                      {highestConsumptionMeter && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm font-medium">Highest Consumption</p>
                          <p className="text-xs text-muted-foreground">
                            {/* {highestConsumptionMeter.serialNumber} -{" "}
                            {getUnitById(highestConsumptionMeter.unitId)?.name || "Unknown"} */}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm">
                              {highestConsumption} {type.unit}
                            </span>
                            <Progress value={(highestConsumption / (totalConsumption || 1)) * 100} className="w-1/2" />
                          </div>
                        </div>
                      )}
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
