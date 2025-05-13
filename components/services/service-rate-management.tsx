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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Zap, Droplets, Edit, MoreVertical, Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data for service types that can have rates
const serviceTypesWithRates = [
  {
    id: 1,
    name: "Electricity",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    unit: "kWh",
  },
  {
    id: 2,
    name: "Water",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    unit: "m³",
  },
]

// Sample data for electricity rates
const initialElectricityRates = [
  {
    id: 1,
    name: "Residential Tier 1",
    serviceTypeId: 1,
    fromValue: 0,
    toValue: 50,
    price: 1678,
    description: "First 50 kWh for residential use",
  },
  {
    id: 2,
    name: "Residential Tier 2",
    serviceTypeId: 1,
    fromValue: 51,
    toValue: 100,
    price: 1734,
    description: "From 51 to 100 kWh for residential use",
  },
  {
    id: 3,
    name: "Residential Tier 3",
    serviceTypeId: 1,
    fromValue: 101,
    toValue: 200,
    price: 2014,
    description: "From 101 to 200 kWh for residential use",
  },
  {
    id: 4,
    name: "Residential Tier 4",
    serviceTypeId: 1,
    fromValue: 201,
    toValue: 300,
    price: 2536,
    description: "From 201 to 300 kWh for residential use",
  },
  {
    id: 5,
    name: "Residential Tier 5",
    serviceTypeId: 1,
    fromValue: 301,
    toValue: 400,
    price: 2834,
    description: "From 301 to 400 kWh for residential use",
  },
  {
    id: 6,
    name: "Residential Tier 6",
    serviceTypeId: 1,
    fromValue: 401,
    toValue: null,
    price: 2927,
    description: "Above 400 kWh for residential use",
  },
  {
    id: 7,
    name: "Commercial Flat Rate",
    serviceTypeId: 1,
    fromValue: 0,
    toValue: null,
    price: 3500,
    description: "Flat rate for commercial use",
  },
]

// Sample data for water rates
const initialWaterRates = [
  {
    id: 8,
    name: "Residential Tier 1",
    serviceTypeId: 2,
    fromValue: 0,
    toValue: 10,
    price: 5973,
    description: "First 10 m³ for residential use",
  },
  {
    id: 9,
    name: "Residential Tier 2",
    serviceTypeId: 2,
    fromValue: 11,
    toValue: 20,
    price: 7052,
    description: "From 11 to 20 m³ for residential use",
  },
  {
    id: 10,
    name: "Residential Tier 3",
    serviceTypeId: 2,
    fromValue: 21,
    toValue: 30,
    price: 8669,
    description: "From 21 to 30 m³ for residential use",
  },
  {
    id: 11,
    name: "Residential Tier 4",
    serviceTypeId: 2,
    fromValue: 31,
    toValue: null,
    price: 15929,
    description: "Above 30 m³ for residential use",
  },
  {
    id: 12,
    name: "Commercial Flat Rate",
    serviceTypeId: 2,
    fromValue: 0,
    toValue: null,
    price: 22000,
    description: "Flat rate for commercial use",
  },
]

export function ServiceRateManagement() {
  const [activeTab, setActiveTab] = useState("electricity")
  const [electricityRates, setElectricityRates] = useState(initialElectricityRates)
  const [waterRates, setWaterRates] = useState(initialWaterRates)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newRate, setNewRate] = useState({
    name: "",
    serviceTypeId: 1,
    fromValue: 0,
    toValue: null as number | null,
    price: 0,
    description: "",
  })
  const [editingRate, setEditingRate] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddRate = () => {
    const rates = newRate.serviceTypeId === 1 ? electricityRates : waterRates
    const newId = Math.max(...rates.map((rate) => rate.id), 0) + 1
    const newRateItem = {
      id: newId,
      name: newRate.name,
      serviceTypeId: newRate.serviceTypeId,
      fromValue: newRate.fromValue,
      toValue: newRate.toValue,
      price: newRate.price,
      description: newRate.description,
    }

    if (newRate.serviceTypeId === 1) {
      setElectricityRates([...electricityRates, newRateItem])
    } else {
      setWaterRates([...waterRates, newRateItem])
    }

    setNewRate({
      name: "",
      serviceTypeId: 1,
      fromValue: 0,
      toValue: null,
      price: 0,
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditRate = () => {
    if (!editingRate) return

    if (editingRate.serviceTypeId === 1) {
      setElectricityRates(electricityRates.map((rate) => (rate.id === editingRate.id ? { ...editingRate } : rate)))
    } else {
      setWaterRates(waterRates.map((rate) => (rate.id === editingRate.id ? { ...editingRate } : rate)))
    }

    setEditingRate(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteRate = (id: number, serviceTypeId: number) => {
    if (serviceTypeId === 1) {
      setElectricityRates(electricityRates.filter((rate) => rate.id !== id))
    } else {
      setWaterRates(waterRates.filter((rate) => rate.id !== id))
    }
  }

  const startEditRate = (rate: any) => {
    setEditingRate({ ...rate })
    setIsEditDialogOpen(true)
  }

  // Filter rates based on search query
  const filteredElectricityRates = electricityRates.filter(
    (rate) =>
      rate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredWaterRates = waterRates.filter(
    (rate) =>
      rate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate example bill for electricity
  const calculateElectricityBill = (usage: number) => {
    let total = 0
    const sortedRates = [...electricityRates]
      .filter((rate) => rate.name.includes("Residential"))
      .sort((a, b) => a.fromValue - b.fromValue)

    let remainingUsage = usage

    for (const rate of sortedRates) {
      if (remainingUsage <= 0) break

      const usageInThisTier =
        rate.toValue === null ? remainingUsage : Math.min(remainingUsage, rate.toValue - rate.fromValue + 1)

      total += usageInThisTier * rate.price
      remainingUsage -= usageInThisTier
    }

    return total
  }

  // Calculate example bill for water
  const calculateWaterBill = (usage: number) => {
    let total = 0
    const sortedRates = [...waterRates]
      .filter((rate) => rate.name.includes("Residential"))
      .sort((a, b) => a.fromValue - b.fromValue)

    let remainingUsage = usage

    for (const rate of sortedRates) {
      if (remainingUsage <= 0) break

      const usageInThisTier =
        rate.toValue === null ? remainingUsage : Math.min(remainingUsage, rate.toValue - rate.fromValue + 1)

      total += usageInThisTier * rate.price
      remainingUsage -= usageInThisTier
    }

    return total
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search rates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Rate</DialogTitle>
              <DialogDescription>Create a new rate tier for electricity or water service.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={newRate.serviceTypeId.toString()}
                  onValueChange={(value) => setNewRate({ ...newRate, serviceTypeId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypesWithRates.map((type) => (
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
                <Label htmlFor="name">Rate Name</Label>
                <Input
                  id="name"
                  value={newRate.name}
                  onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                  placeholder="e.g., Residential Tier 1, Commercial Rate"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fromValue">From Value</Label>
                  <Input
                    id="fromValue"
                    type="number"
                    value={newRate.fromValue || ""}
                    onChange={(e) => setNewRate({ ...newRate, fromValue: Number.parseInt(e.target.value) || 0 })}
                    placeholder={`Starting ${
                      newRate.serviceTypeId === 1 ? "kWh" : newRate.serviceTypeId === 2 ? "m³" : "unit"
                    }`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="toValue">To Value (leave empty for unlimited)</Label>
                  <Input
                    id="toValue"
                    type="number"
                    value={newRate.toValue === null ? "" : newRate.toValue}
                    onChange={(e) =>
                      setNewRate({
                        ...newRate,
                        toValue: e.target.value === "" ? null : Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder={`Ending ${
                      newRate.serviceTypeId === 1 ? "kWh" : newRate.serviceTypeId === 2 ? "m³" : "unit"
                    }`}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Unit (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newRate.price || ""}
                  onChange={(e) => setNewRate({ ...newRate, price: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Price per unit in VND"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRate.description}
                  onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                  placeholder="Brief description of the rate"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRate}>Add Rate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Rate</DialogTitle>
              <DialogDescription>Modify the rate tier details.</DialogDescription>
            </DialogHeader>
            {editingRate && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editName">Rate Name</Label>
                  <Input
                    id="editName"
                    value={editingRate.name}
                    onChange={(e) => setEditingRate({ ...editingRate, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editFromValue">From Value</Label>
                    <Input
                      id="editFromValue"
                      type="number"
                      value={editingRate.fromValue || ""}
                      onChange={(e) =>
                        setEditingRate({ ...editingRate, fromValue: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editToValue">To Value (leave empty for unlimited)</Label>
                    <Input
                      id="editToValue"
                      type="number"
                      value={editingRate.toValue === null ? "" : editingRate.toValue}
                      onChange={(e) =>
                        setEditingRate({
                          ...editingRate,
                          toValue: e.target.value === "" ? null : Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPrice">Price per Unit (VND)</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    value={editingRate.price || ""}
                    onChange={(e) => setEditingRate({ ...editingRate, price: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Input
                    id="editDescription"
                    value={editingRate.description}
                    onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Electricity Rates</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Water Rates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="mt-4 space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Progressive Billing</AlertTitle>
            <AlertDescription>
              Electricity is billed progressively through tiers. Each usage range is charged at its corresponding rate.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Electricity Rate Tiers</CardTitle>
              <CardDescription>Define different rate tiers for electricity consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rate Name</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Price per kWh</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElectricityRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.name}</TableCell>
                      <TableCell>
                        {rate.fromValue} - {rate.toValue === null ? "∞" : rate.toValue} kWh
                      </TableCell>
                      <TableCell>{formatPrice(rate.price)}</TableCell>
                      <TableCell>{rate.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditRate(rate)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRate(rate.id, rate.serviceTypeId)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Electricity Bill Calculator</CardTitle>
              <CardDescription>See how the tiered rates affect the total bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[100, 200, 350].map((usage) => {
                  const bill = calculateElectricityBill(usage)
                  return (
                    <Card key={usage}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Usage: {usage} kWh</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(bill)}</div>
                        <p className="text-sm text-muted-foreground">Average price: {formatPrice(bill / usage)}/kWh</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4 space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Progressive Billing</AlertTitle>
            <AlertDescription>
              Water is billed progressively through tiers. Each usage range is charged at its corresponding rate.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Water Rate Tiers</CardTitle>
              <CardDescription>Define different rate tiers for water consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rate Name</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Price per m³</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWaterRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.name}</TableCell>
                      <TableCell>
                        {rate.fromValue} - {rate.toValue === null ? "∞" : rate.toValue} m³
                      </TableCell>
                      <TableCell>{formatPrice(rate.price)}</TableCell>
                      <TableCell>{rate.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditRate(rate)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRate(rate.id, rate.serviceTypeId)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Bill Calculator</CardTitle>
              <CardDescription>See how the tiered rates affect the total bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[10, 20, 35].map((usage) => {
                  const bill = calculateWaterBill(usage)
                  return (
                    <Card key={usage}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Usage: {usage} m³</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(bill)}</div>
                        <p className="text-sm text-muted-foreground">Average price: {formatPrice(bill / usage)}/m³</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
