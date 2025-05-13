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
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Pencil, Trash2, MoreHorizontal, Eye, Wrench } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for building systems
const systemsData = [
  {
    id: 1,
    name: "Central HVAC System",
    category: "HVAC",
    location: "Block A, Basement",
    installationDate: "2020-05-15",
    lastMaintenance: "2025-04-01",
    nextMaintenance: "2025-07-01",
    status: "operational",
    manufacturer: "Daikin",
    model: "HVAC-2020-PRO",
    serialNumber: "DK2020-56789",
    description: "Central heating, ventilation, and air conditioning system for Block A",
  },
  {
    id: 2,
    name: "Emergency Generator",
    category: "Electrical",
    location: "Block B, Basement",
    installationDate: "2020-03-10",
    lastMaintenance: "2025-03-15",
    nextMaintenance: "2025-06-15",
    status: "operational",
    manufacturer: "Caterpillar",
    model: "CAT-G3520E",
    serialNumber: "CAT2020-12345",
    description: "Emergency backup generator for the building",
  },
  {
    id: 3,
    name: "Fire Alarm System",
    category: "Safety",
    location: "All Blocks",
    installationDate: "2020-02-01",
    lastMaintenance: "2025-04-20",
    nextMaintenance: "2025-07-20",
    status: "needs_attention",
    manufacturer: "Honeywell",
    model: "FA-5000",
    serialNumber: "HW2020-45678",
    description: "Building-wide fire detection and alarm system",
  },
  {
    id: 4,
    name: "Water Supply System",
    category: "Plumbing",
    location: "Block A, Basement",
    installationDate: "2020-01-15",
    lastMaintenance: "2025-02-28",
    nextMaintenance: "2025-05-28",
    status: "operational",
    manufacturer: "Grundfos",
    model: "WP-2000",
    serialNumber: "GF2020-87654",
    description: "Main water supply and distribution system",
  },
  {
    id: 5,
    name: "Elevator #1",
    category: "Transportation",
    location: "Block A",
    installationDate: "2020-01-20",
    lastMaintenance: "2025-04-10",
    nextMaintenance: "2025-07-10",
    status: "operational",
    manufacturer: "OTIS",
    model: "Elevator-X5",
    serialNumber: "OT2020-34567",
    description: "Main passenger elevator in Block A",
  },
  {
    id: 6,
    name: "Elevator #2",
    category: "Transportation",
    location: "Block B",
    installationDate: "2020-01-25",
    lastMaintenance: "2025-03-05",
    nextMaintenance: "2025-06-05",
    status: "under_maintenance",
    manufacturer: "OTIS",
    model: "Elevator-X5",
    serialNumber: "OT2020-34568",
    description: "Main passenger elevator in Block B",
  },
  {
    id: 7,
    name: "CCTV System",
    category: "Security",
    location: "All Blocks",
    installationDate: "2020-02-10",
    lastMaintenance: "2025-04-15",
    nextMaintenance: "2025-07-15",
    status: "operational",
    manufacturer: "Hikvision",
    model: "CCTV-Pro-2020",
    serialNumber: "HK2020-23456",
    description: "Building-wide security camera system",
  },
  {
    id: 8,
    name: "Access Control System",
    category: "Security",
    location: "All Entrances",
    installationDate: "2020-02-15",
    lastMaintenance: "2025-03-30",
    nextMaintenance: "2025-06-30",
    status: "operational",
    manufacturer: "HID Global",
    model: "AC-1000",
    serialNumber: "HID2020-78901",
    description: "Electronic door access control system",
  },
  {
    id: 9,
    name: "Solar Panel System",
    category: "Electrical",
    location: "Roof, All Blocks",
    installationDate: "2020-06-01",
    lastMaintenance: "2025-03-20",
    nextMaintenance: "2025-06-20",
    status: "operational",
    manufacturer: "SunPower",
    model: "SP-X22-370",
    serialNumber: "SP2020-12345",
    description: "Rooftop solar energy generation system",
  },
  {
    id: 10,
    name: "Sewage Treatment System",
    category: "Plumbing",
    location: "Block C, Basement",
    installationDate: "2020-04-10",
    lastMaintenance: "2025-04-05",
    nextMaintenance: "2025-07-05",
    status: "needs_attention",
    manufacturer: "Veolia",
    model: "STP-2000",
    serialNumber: "VL2020-45678",
    description: "Wastewater treatment system",
  },
]

// System categories for filtering
const systemCategories = [
  "All Categories",
  "HVAC",
  "Electrical",
  "Plumbing",
  "Safety",
  "Security",
  "Transportation",
  "Communication",
  "Others",
]

// Building locations for filtering
const buildingLocations = ["All Locations", "Block A", "Block B", "Block C", "All Blocks", "Roof", "Basement"]

// Status options
const statusOptions = ["All Statuses", "operational", "under_maintenance", "needs_attention", "out_of_service"]

export function BuildingSystemList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<any>(null)

  // Function to filter systems based on search and filters
  const filteredSystems = systemsData.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || system.category === selectedCategory

    const matchesLocation = selectedLocation === "All Locations" || system.location.includes(selectedLocation)

    const matchesStatus = selectedStatus === "All Statuses" || system.status === selectedStatus

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus
  })

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "operational":
        return "default"
      case "under_maintenance":
        return "secondary"
      case "needs_attention":
        return "warning"
      case "out_of_service":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Function to format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Building Systems Registry</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add System
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Building System</DialogTitle>
              <DialogDescription>
                Enter the details of the new building system. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">System Name</Label>
                  <Input id="name" placeholder="Enter system name" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. Block A, Floor 1" />
                </div>
                <div>
                  <Label htmlFor="installationDate">Installation Date</Label>
                  <Input id="installationDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="operational">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="needs_attention">Needs Attention</SelectItem>
                      <SelectItem value="out_of_service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" placeholder="Enter manufacturer" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Enter model number" />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input id="serialNumber" placeholder="Enter serial number" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter system description" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save System</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Building Systems</CardTitle>
          <CardDescription>View and manage all building systems across your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
              <div className="flex items-center gap-2 md:w-1/3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search systems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All Statuses" ? status : formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Systems Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSystems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No systems found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSystems.map((system) => (
                      <TableRow key={system.id}>
                        <TableCell className="font-medium">{system.name}</TableCell>
                        <TableCell>{system.category}</TableCell>
                        <TableCell>{system.location}</TableCell>
                        <TableCell>{new Date(system.lastMaintenance).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(system.nextMaintenance).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(system.status) as any}>
                            {formatStatus(system.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSystem(system)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSystem(system)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit System
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSystem(system)
                                  setIsScheduleMaintenanceOpen(true)
                                }}
                              >
                                <Wrench className="mr-2 h-4 w-4" />
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete System
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* View System Details Dialog */}
      {selectedSystem && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSystem.name}</DialogTitle>
              <DialogDescription>Detailed information about this building system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{selectedSystem.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedSystem.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Installation Date</Label>
                  <p className="font-medium">{new Date(selectedSystem.installationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="pt-1">
                    <Badge variant={getStatusBadgeVariant(selectedSystem.status) as any}>
                      {formatStatus(selectedSystem.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Manufacturer</Label>
                  <p className="font-medium">{selectedSystem.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="font-medium">{selectedSystem.model}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="font-medium">{selectedSystem.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Maintenance</Label>
                  <p className="font-medium">{new Date(selectedSystem.lastMaintenance).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Next Maintenance</Label>
                  <p className="font-medium">{new Date(selectedSystem.nextMaintenance).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedSystem.description}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false)
                  setIsScheduleMaintenanceOpen(true)
                }}
              >
                Schedule Maintenance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit System Dialog */}
      {selectedSystem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Building System</DialogTitle>
              <DialogDescription>Update the details of this building system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-name">System Name</Label>
                  <Input id="edit-name" defaultValue={selectedSystem.name} />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={selectedSystem.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {systemCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input id="edit-location" defaultValue={selectedSystem.location} />
                </div>
                <div>
                  <Label htmlFor="edit-installationDate">Installation Date</Label>
                  <Input
                    id="edit-installationDate"
                    type="date"
                    defaultValue={selectedSystem.installationDate.split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedSystem.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="needs_attention">Needs Attention</SelectItem>
                      <SelectItem value="out_of_service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                  <Input id="edit-manufacturer" defaultValue={selectedSystem.manufacturer} />
                </div>
                <div>
                  <Label htmlFor="edit-model">Model</Label>
                  <Input id="edit-model" defaultValue={selectedSystem.model} />
                </div>
                <div>
                  <Label htmlFor="edit-serialNumber">Serial Number</Label>
                  <Input id="edit-serialNumber" defaultValue={selectedSystem.serialNumber} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" defaultValue={selectedSystem.description} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsEditDialogOpen(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Maintenance Dialog */}
      {selectedSystem && (
        <Dialog open={isScheduleMaintenanceOpen} onOpenChange={setIsScheduleMaintenanceOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>Schedule maintenance for {selectedSystem.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="maintenance-title">Maintenance Title</Label>
                  <Input
                    id="maintenance-title"
                    placeholder={`${selectedSystem.category} Maintenance for ${selectedSystem.name}`}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance-type">Type</Label>
                  <Select defaultValue="routine">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maintenance-frequency">Frequency</Label>
                  <Select defaultValue="one-time">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One Time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maintenance-date">Date</Label>
                  <Input id="maintenance-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="assigned-to">Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance-team">Maintenance Team</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="external-vendor">External Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="maintenance-description">Description</Label>
                  <Textarea id="maintenance-description" placeholder="Describe the maintenance to be performed" />
                </div>
                <div className="col-span-2">
                  <Label>Tasks</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task-1" />
                      <Label htmlFor="task-1">Inspection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task-2" />
                      <Label htmlFor="task-2">Cleaning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task-3" />
                      <Label htmlFor="task-3">Lubrication</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task-4" />
                      <Label htmlFor="task-4">Part Replacement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task-5" />
                      <Label htmlFor="task-5">Testing</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleMaintenanceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsScheduleMaintenanceOpen(false)}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
