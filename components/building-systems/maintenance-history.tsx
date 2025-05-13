"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownToLine,
  Calendar,
  Filter,
  FileText,
  Search,
  Eye,
  PenToolIcon as Tool,
  Clock,
  User,
} from "lucide-react"

// Mock data for maintenance history
const maintenanceHistoryData = [
  {
    id: 1,
    systemId: 1,
    systemName: "Central HVAC System",
    maintenanceType: "Scheduled",
    maintenancePlan: "HVAC Quarterly Maintenance",
    performedBy: "Nguyễn Văn A",
    startDate: "2025-04-01T09:00:00",
    endDate: "2025-04-01T14:30:00",
    status: "completed",
    findings: "All components are in good working condition. Replaced air filters and cleaned condenser coils.",
    recommendations: "No immediate action required. Continue regular maintenance schedule.",
    cost: 2500000,
    parts: [
      { name: "Air filters", quantity: 4, cost: 800000 },
      { name: "Cleaning supplies", quantity: 1, cost: 200000 },
    ],
    labor: { hours: 5, rate: 300000, cost: 1500000 },
  },
  {
    id: 2,
    systemId: 6,
    systemName: "Elevator #2",
    maintenanceType: "Repair",
    maintenancePlan: "Elevator #2 Repair",
    performedBy: "OTIS Service Technician",
    startDate: "2025-03-05T08:00:00",
    endDate: "2025-03-05T12:00:00",
    status: "completed",
    findings: "Identified worn out pulley in the door mechanism causing noise during operation.",
    recommendations: "Replaced pulley system. Recommend checking other elevators for similar wear patterns.",
    cost: 4200000,
    parts: [
      { name: "Door pulley system", quantity: 1, cost: 2700000 },
      { name: "Lubricant", quantity: 1, cost: 300000 },
    ],
    labor: { hours: 4, rate: 300000, cost: 1200000 },
  },
  {
    id: 3,
    systemId: 2,
    systemName: "Emergency Generator",
    maintenanceType: "Scheduled",
    maintenancePlan: "Emergency Generator Monthly Test",
    performedBy: "Trần Văn B",
    startDate: "2025-03-15T10:00:00",
    endDate: "2025-03-15T11:30:00",
    status: "completed",
    findings: "Generator started and ran for 30 minutes without issues. Fuel levels are adequate.",
    recommendations: "Continue regular testing schedule.",
    cost: 600000,
    parts: [],
    labor: { hours: 1.5, rate: 400000, cost: 600000 },
  },
  {
    id: 4,
    systemId: 4,
    systemName: "Water Supply System",
    maintenanceType: "Scheduled",
    maintenancePlan: "Water Pump Semi-annual Maintenance",
    performedBy: "Plumbing Team",
    startDate: "2025-02-28T09:00:00",
    endDate: "2025-02-28T13:00:00",
    status: "completed",
    findings: "Inspected pump system. Pressure settings normal. Cleaned filters. Backup pump tested and operational.",
    recommendations: "Replace pressure sensor within next 3 months as it's showing signs of wear.",
    cost: 1500000,
    parts: [{ name: "Filter replacements", quantity: 2, cost: 300000 }],
    labor: { hours: 4, rate: 300000, cost: 1200000 },
  },
  {
    id: 5,
    systemId: 3,
    systemName: "Fire Alarm System",
    maintenanceType: "Inspection",
    maintenancePlan: "Fire Alarm System Annual Certification",
    performedBy: "Certified External Contractor",
    startDate: "2025-04-20T08:00:00",
    endDate: "2025-04-20T16:00:00",
    status: "completed",
    findings:
      "All components tested and functioning correctly. Sensors properly calibrated. System meets all required standards.",
    recommendations: "Update system firmware in the next month for enhanced features.",
    cost: 5000000,
    parts: [],
    labor: { hours: 8, rate: 625000, cost: 5000000 },
  },
  {
    id: 6,
    systemId: 7,
    systemName: "CCTV System",
    maintenanceType: "Repair",
    maintenancePlan: null,
    performedBy: "Security Team",
    startDate: "2025-03-10T13:00:00",
    endDate: "2025-03-10T15:00:00",
    status: "completed",
    findings: "Camera #12 in Block C lobby was not functioning due to power supply issue. Replaced power adapter.",
    recommendations: "None. All cameras now operational.",
    cost: 800000,
    parts: [{ name: "Camera power adapter", quantity: 1, cost: 500000 }],
    labor: { hours: 2, rate: 150000, cost: 300000 },
  },
  {
    id: 7,
    systemId: 10,
    systemName: "Sewage Treatment System",
    maintenanceType: "Emergency",
    maintenancePlan: null,
    performedBy: "Veolia Technician",
    startDate: "2025-03-25T07:00:00",
    endDate: "2025-03-25T16:00:00",
    status: "completed",
    findings: "Pump failure caused backup. Replaced main pump and cleared blockage in output pipe.",
    recommendations: "Install additional alarm system to detect early signs of pump failure.",
    cost: 7500000,
    parts: [
      { name: "Submersible pump", quantity: 1, cost: 5500000 },
      { name: "Pipe fittings", quantity: 3, cost: 300000 },
    ],
    labor: { hours: 9, rate: 350000, cost: 3150000 },
  },
  {
    id: 8,
    systemId: 5,
    systemName: "Elevator #1",
    maintenanceType: "Scheduled",
    maintenancePlan: "Elevator #1 Bi-monthly Maintenance",
    performedBy: "OTIS Service Technician",
    startDate: "2025-04-10T09:00:00",
    endDate: "2025-04-10T12:00:00",
    status: "completed",
    findings: "All components in good condition. Lubricated moving parts and tested safety features.",
    recommendations: "None. Next maintenance scheduled for June 10, 2025.",
    cost: 1800000,
    parts: [{ name: "Lubricant", quantity: 1, cost: 300000 }],
    labor: { hours: 3, rate: 500000, cost: 1500000 },
  },
]

// Building systems for filtering
const systemsForFiltering = [
  { id: 0, name: "All Systems" },
  { id: 1, name: "Central HVAC System" },
  { id: 2, name: "Emergency Generator" },
  { id: 3, name: "Fire Alarm System" },
  { id: 4, name: "Water Supply System" },
  { id: 5, name: "Elevator #1" },
  { id: 6, name: "Elevator #2" },
  { id: 7, name: "CCTV System" },
  { id: 8, name: "Access Control System" },
  { id: 9, name: "Solar Panel System" },
  { id: 10, name: "Sewage Treatment System" },
]

// Maintenance types for filtering
const maintenanceTypes = ["All Types", "Scheduled", "Repair", "Inspection", "Emergency"]

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

export function MaintenanceHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSystem, setSelectedSystem] = useState("0")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // Filter maintenance history
  const filteredHistory = maintenanceHistoryData.filter((record) => {
    // Filter by search
    const matchesSearch =
      record.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.findings && record.findings.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.recommendations && record.recommendations.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by system
    const matchesSystem = selectedSystem === "0" || record.systemId.toString() === selectedSystem

    // Filter by maintenance type
    const matchesType = selectedType === "All Types" || record.maintenanceType === selectedType

    // Filter by date range
    let matchesDateRange = true
    const recordDate = new Date(record.startDate)

    if (selectedDateRange === "custom") {
      const start = startDate ? new Date(startDate) : new Date(0)
      const end = endDate ? new Date(endDate) : new Date()
      matchesDateRange = recordDate >= start && recordDate <= end
    } else if (selectedDateRange === "last30") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      matchesDateRange = recordDate >= thirtyDaysAgo
    } else if (selectedDateRange === "last90") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      matchesDateRange = recordDate >= ninetyDaysAgo
    }

    return matchesSearch && matchesSystem && matchesType && matchesDateRange
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance History</h1>
        <Button variant="outline">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
          <CardDescription>
            Historical records of all maintenance activities performed on building systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="System" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemsForFiltering.map((system) => (
                        <SelectItem key={system.id} value={system.id.toString()}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <Tool className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Maintenance Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {maintenanceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedDateRange}
                    onValueChange={(value) => {
                      setSelectedDateRange(value)
                      // Reset custom dates if not selecting custom
                      if (value !== "custom") {
                        setStartDate("")
                        setEndDate("")
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last30">Last 30 Days</SelectItem>
                      <SelectItem value="last90">Last 90 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedDateRange === "custom" && (
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="startDate" className="text-xs">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endDate" className="text-xs">
                      End Date
                    </Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Maintenance History Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No maintenance records found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.systemName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.maintenanceType === "Scheduled"
                                ? "secondary"
                                : record.maintenanceType === "Repair"
                                  ? "default"
                                  : record.maintenanceType === "Emergency"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {record.maintenanceType}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(record.startDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.cost)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record)
                              setIsViewDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Maintenance Details Dialog */}
      {selectedRecord && (
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Maintenance Record Details</DialogTitle>
              <DialogDescription>Details of maintenance performed on {selectedRecord.systemName}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="findings" className="flex-1">
                  Findings
                </TabsTrigger>
                <TabsTrigger value="costs" className="flex-1">
                  Costs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">System</Label>
                    <p className="font-medium">{selectedRecord.systemName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <div className="pt-1">
                      <Badge
                        variant={
                          selectedRecord.maintenanceType === "Scheduled"
                            ? "secondary"
                            : selectedRecord.maintenanceType === "Repair"
                              ? "default"
                              : selectedRecord.maintenanceType === "Emergency"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {selectedRecord.maintenanceType}
                      </Badge>
                    </div>
                  </div>

                  {selectedRecord.maintenancePlan && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Maintenance Plan</Label>
                      <p className="font-medium">{selectedRecord.maintenancePlan}</p>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-muted-foreground">Performed By</Label>
                      <p className="font-medium">{selectedRecord.performedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-muted-foreground">Duration</Label>
                      <p className="font-medium">
                        {new Date(selectedRecord.startDate).toLocaleString()} to{" "}
                        {new Date(selectedRecord.endDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Total Cost</Label>
                    <p className="font-medium text-lg">{formatCurrency(selectedRecord.cost)}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Findings</Label>
                    <p className="mt-1 whitespace-pre-line">{selectedRecord.findings}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Recommendations</Label>
                    <p className="mt-1 whitespace-pre-line">{selectedRecord.recommendations}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="costs" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground mb-2">Parts Used</Label>
                    {selectedRecord.parts.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead className="text-right">Cost</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRecord.parts.map((part: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{part.name}</TableCell>
                                <TableCell>{part.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(part.cost)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No parts used in this maintenance</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-muted-foreground mb-2">Labor Cost</Label>
                    <div className="rounded-md border p-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Hours</Label>
                          <p>{selectedRecord.labor.hours}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Hourly Rate</Label>
                          <p>{formatCurrency(selectedRecord.labor.rate)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Total Labor</Label>
                          <p className="font-medium">{formatCurrency(selectedRecord.labor.cost)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Cost</span>
                      <span className="font-bold text-lg">{formatCurrency(selectedRecord.cost)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                Close
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
