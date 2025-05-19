"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Users, Layers, Plus, Pencil, Trash2, ChevronRight } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts"

// Mock data for buildings
const buildingsData = [
  {
    id: 1,
    name: "Happy Residence",
    address: "123 Main Street, District 1",
    totalBlocks: 4,
    totalFloors: 16,
    totalPremises: 60,
    occupancyRate: 85,
    totalResidents: 120,
    constructionYear: 2020,
    status: "active",
  },
  {
    id: 2,
    name: "Sunshine Apartments",
    address: "456 Park Avenue, District 2",
    totalBlocks: 4,
    totalFloors: 16,
    totalPremises: 60,
    occupancyRate: 78,
    totalResidents: 110,
    constructionYear: 2019,
    status: "active",
  },
]

// Mock data for blocks
const blocksData = [
  { id: 1, buildingId: 1, name: "Block A", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 2, buildingId: 1, name: "Block B", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 3, buildingId: 1, name: "Block C", floors: 8, premises: 32, type: "Mixed Use", status: "active" },
  { id: 4, buildingId: 1, name: "Block D", floors: 8, premises: 32, type: "Mixed Use", status: "active" },
  { id: 5, buildingId: 2, name: "Block A", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 6, buildingId: 2, name: "Block B", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 7, buildingId: 2, name: "Block C", floors: 8, premises: 32, type: "Commercial", status: "active" },
  { id: 8, buildingId: 2, name: "Block D", floors: 8, premises: 32, type: "Commercial", status: "active" },
]

// Mock data for floors
const floorsData = [
  { id: 1, buildingId: 1, blockId: 1, number: 1, premises: 4, status: "active" },
  { id: 2, buildingId: 1, blockId: 1, number: 2, premises: 4, status: "active" },
  { id: 3, buildingId: 1, blockId: 1, number: 3, premises: 4, status: "active" },
  { id: 4, buildingId: 1, blockId: 1, number: 4, premises: 4, status: "active" },
  { id: 5, buildingId: 1, blockId: 2, number: 1, premises: 4, status: "active" },
  { id: 6, buildingId: 1, blockId: 2, number: 2, premises: 4, status: "active" },
  // More floors...
]

// Mock data for premises
const premisesData = [
  {
    id: 1,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A101",
    type: "Apartment",
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    status: "occupied",
    owner: "Nguyễn Văn A",
    ownerContact: "0901234567",
    monthlyRent: 15000000,
    leaseStart: "2023-01-15",
    leaseEnd: "2025-01-14",
  },
  {
    id: 2,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A102",
    type: "Apartment",
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    status: "vacant",
    owner: null,
    ownerContact: null,
    monthlyRent: 12000000,
    leaseStart: null,
    leaseEnd: null,
  },
  {
    id: 3,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A103",
    type: "Apartment",
    area: 100,
    bedrooms: 3,
    bathrooms: 2,
    status: "occupied",
    owner: "Trần Thị B",
    ownerContact: "0912345678",
    monthlyRent: 18000000,
    leaseStart: "2023-03-01",
    leaseEnd: "2025-02-28",
  },
  {
    id: 4,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A104",
    type: "Apartment",
    area: 75,
    bedrooms: 2,
    bathrooms: 1,
    status: "maintenance",
    owner: null,
    ownerContact: null,
    monthlyRent: 14000000,
    leaseStart: null,
    leaseEnd: null,
  },
  // More premises...
]

// Mock data for charts
const buildingStatsData = [
  { name: "Blocks", value: 4 },
  { name: "Floors", value: 16 },
  { name: "Premises", value: 60 },
  { name: "Residents", value: 120 },
]

const occupancyData = [
  { name: "Occupied", value: 48 },
  { name: "Vacant", value: 8 },
  { name: "Maintenance", value: 4 },
]

const expensesData = [
  { month: "Jan", amount: 120000000 },
  { month: "Feb", amount: 115000000 },
  { month: "Mar", amount: 125000000 },
  { month: "Apr", amount: 118000000 },
  { month: "May", amount: 130000000 },
  { month: "Jun", amount: 122000000 },
]

const COLORS = ["#2563eb", "#0ea5e9", "#7c3aed", "#059669", "#f97316"]

export function DashboardBuildingManager() {
  const [selectedBuilding, setSelectedBuilding] = useState<number>(1)
  const [selectedTab, setSelectedTab] = useState<string>("overview")

  // Get the selected building data
  const building = buildingsData.find((b) => b.id === selectedBuilding) || buildingsData[0]

  // Filter data based on selected building
  const buildingBlocks = blocksData.filter((block) => block.buildingId === selectedBuilding)
  const buildingFloors = floorsData.filter((floor) => floor.buildingId === selectedBuilding)
  const buildingPremises = premisesData.filter((premise) => premise.buildingId === selectedBuilding)

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Building Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Building</DialogTitle>
              <DialogDescription>
                Enter the details for the new building. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Building Name</Label>
                  <Input id="name" placeholder="Enter building name" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter building address" />
                </div>
                <div>
                  <Label htmlFor="constructionYear">Construction Year</Label>
                  <Input id="constructionYear" type="number" placeholder="YYYY" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter building description" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Building</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Total Buildings"
          value={buildingsData.length.toString()}
          icon={<Building2 className="h-5 w-5 text-[#2563eb]" />}
          description="Under your management"
          trend={{ value: "+0", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Blocks"
          value={blocksData.filter((b) => b.buildingId === selectedBuilding).length.toString()}
          icon={<Layers className="h-5 w-5 text-[#2563eb]" />}
          description={`In ${building.name}`}
          trend={{ value: "+0", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Premises"
          value={building.totalPremises.toString()}
          icon={<Home className="h-5 w-5 text-[#2563eb]" />}
          description={`${Math.round((building.totalPremises * building.occupancyRate) / 100)} occupied (${building.occupancyRate}%)`}
          trend={{ value: "+3", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Residents"
          value={building.totalResidents.toString()}
          icon={<Users className="h-5 w-5 text-[#2563eb]" />}
          description={`In ${building.name}`}
          trend={{ value: "+5", direction: "up", label: "from last month" }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Buildings</CardTitle>
            <CardDescription>Select a building to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {buildingsData.map((building) => (
                <div
                  key={building.id}
                  className={`flex items-center justify-between rounded-md p-2 cursor-pointer ${
                    selectedBuilding === building.id ? "bg-[#2563eb] text-white" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedBuilding(building.id)}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span>{building.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{building.name}</CardTitle>
                <CardDescription>{building.address}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Edit Building</DialogTitle>
                      <DialogDescription>Update the building details. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="edit-name">Building Name</Label>
                          <Input id="edit-name" defaultValue={building.name} />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="edit-address">Address</Label>
                          <Input id="edit-address" defaultValue={building.address} />
                        </div>
                        <div>
                          <Label htmlFor="edit-constructionYear">Construction Year</Label>
                          <Input id="edit-constructionYear" type="number" defaultValue={building.constructionYear} />
                        </div>
                        <div>
                          <Label htmlFor="edit-status">Status</Label>
                          <Select defaultValue={building.status}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea id="edit-description" placeholder="Enter building description" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="blocks">Blocks</TabsTrigger>
                <TabsTrigger value="floors">Floors</TabsTrigger>
                <TabsTrigger value="premises">Premises</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Building Statistics</CardTitle>
                      <CardDescription>Distribution of building components</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={buildingStatsData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#2563eb">
                            {buildingStatsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Occupancy Status</CardTitle>
                      <CardDescription>Current occupancy distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={occupancyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {occupancyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Monthly Expenses</CardTitle>
                      <CardDescription>Building maintenance and operational costs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={expensesData}>
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => formatCurrency(Number(value)).replace("₫", "")} />
                          <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                          <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="blocks" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Block
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Block</DialogTitle>
                        <DialogDescription>Enter the details for the new block in {building.name}.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="block-name">Block Name</Label>
                          <Input id="block-name" placeholder="e.g., Block A" />
                        </div>
                        <div>
                          <Label htmlFor="block-floors">Number of Floors</Label>
                          <Input id="block-floors" type="number" placeholder="e.g., 8" />
                        </div>
                        <div>
                          <Label htmlFor="block-type">Block Type</Label>
                          <Select defaultValue="residential">
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="mixed">Mixed Use</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Block</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-6 border-b p-3 font-medium">
                    <div>Block Name</div>
                    <div>Type</div>
                    <div>Floors</div>
                    <div>Premises</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {buildingBlocks.map((block) => (
                    <div key={block.id} className="grid grid-cols-6 border-b p-3 last:border-0">
                      <div>{block.name}</div>
                      <div>{block.type}</div>
                      <div>{block.floors}</div>
                      <div>{block.premises}</div>
                      <div>
                        <Badge variant={block.status === "active" ? "default" : "outline"}>
                          {block.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Block</DropdownMenuItem>
                              <DropdownMenuItem>View Floors</DropdownMenuItem>
                              <DropdownMenuItem>View Premises</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="floors" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Floor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Floor</DialogTitle>
                        <DialogDescription>Enter the details for the new floor.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="floor-block">Block</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select block" />
                            </SelectTrigger>
                            <SelectContent>
                              {buildingBlocks.map((block) => (
                                <SelectItem key={block.id} value={block.id.toString()}>
                                  {block.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="floor-number">Floor Number</Label>
                          <Input id="floor-number" type="number" placeholder="e.g., 1" />
                        </div>
                        <div>
                          <Label htmlFor="floor-premises">Number of Premises</Label>
                          <Input id="floor-premises" type="number" placeholder="e.g., 4" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Floor</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-6 border-b p-3 font-medium">
                    <div>Block</div>
                    <div>Floor Number</div>
                    <div>Premises</div>
                    <div>Status</div>
                    <div>Last Maintenance</div>
                    <div>Actions</div>
                  </div>
                  {buildingFloors.map((floor) => (
                    <div key={floor.id} className="grid grid-cols-6 border-b p-3 last:border-0">
                      <div>{blocksData.find((b) => b.id === floor.blockId)?.name || "Unknown"}</div>
                      <div>{floor.number}</div>
                      <div>{floor.premises}</div>
                      <div>
                        <Badge variant={floor.status === "active" ? "default" : "outline"}>
                          {floor.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>{new Date().toLocaleDateString()}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Floor</DropdownMenuItem>
                              <DropdownMenuItem>View Premises</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premises" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Premise
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Premise</DialogTitle>
                        <DialogDescription>Enter the details for the new premise.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="premise-block">Block</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select block" />
                              </SelectTrigger>
                              <SelectContent>
                                {buildingBlocks.map((block) => (
                                  <SelectItem key={block.id} value={block.id.toString()}>
                                    {block.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="premise-floor">Floor</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select floor" />
                              </SelectTrigger>
                              <SelectContent>
                                {buildingFloors.map((floor) => (
                                  <SelectItem key={floor.id} value={floor.id.toString()}>
                                    Floor {floor.number}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="premise-number">Premise Number</Label>
                            <Input id="premise-number" placeholder="e.g., A101" />
                          </div>
                          <div>
                            <Label htmlFor="premise-type">Type</Label>
                            <Select defaultValue="apartment">
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="office">Office</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="premise-area">Area (m²)</Label>
                            <Input id="premise-area" type="number" placeholder="e.g., 85" />
                          </div>
                          <div>
                            <Label htmlFor="premise-status">Status</Label>
                            <Select defaultValue="vacant">
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vacant">Vacant</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="premise-bedrooms">Bedrooms</Label>
                            <Input id="premise-bedrooms" type="number" placeholder="e.g., 2" />
                          </div>
                          <div>
                            <Label htmlFor="premise-bathrooms">Bathrooms</Label>
                            <Input id="premise-bathrooms" type="number" placeholder="e.g., 2" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Premise</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Number
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Area (m²)
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {buildingPremises.map((premise) => (
                        <tr key={premise.id}>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">{premise.number}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">
                            {blocksData.find((b) => b.id === premise.blockId)?.name || "Unknown"}, Floor{" "}
                            {floorsData.find((f) => f.id === premise.floorId)?.number || "Unknown"}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">{premise.type}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">{premise.area}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">
                            {premise.owner || "Vacant"}
                            {premise.owner && (
                              <div className="text-xs text-muted-foreground">{premise.ownerContact}</div>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">
                            <Badge
                              variant={
                                premise.status === "occupied"
                                  ? "default"
                                  : premise.status === "vacant"
                                    ? "outline"
                                    : premise.status === "maintenance"
                                      ? "destructive"
                                      : "secondary"
                              }
                            >
                              {premise.status.charAt(0).toUpperCase() + premise.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Premise</DropdownMenuItem>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Assign Owner</DropdownMenuItem>
                                  <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
