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
import { Zap, Droplets, Wifi, Car, Dumbbell, Trash2, Edit, MoreVertical, Plus } from "lucide-react"

// Sample data for service types
const serviceTypes = [
  {
    id: 1,
    name: "Electricity",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    isEssential: true,
  },
  {
    id: 2,
    name: "Water",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    isEssential: true,
  },
  {
    id: 3,
    name: "Internet",
    icon: <Wifi className="h-5 w-5 text-purple-500" />,
    isEssential: true,
  },
  {
    id: 4,
    name: "Parking",
    icon: <Car className="h-5 w-5 text-gray-500" />,
    isEssential: false,
  },
  {
    id: 5,
    name: "Gym",
    icon: <Dumbbell className="h-5 w-5 text-green-500" />,
    isEssential: false,
  },
]

// Sample data for services
const initialServices = [
  {
    id: 1,
    name: "Residential Electricity",
    typeId: 1,
    price: 3500,
    vatRate: 10,
    environmentTax: 2,
    description: "Standard electricity service for residential units",
  },
  {
    id: 2,
    name: "Commercial Electricity",
    typeId: 1,
    price: 4200,
    vatRate: 10,
    environmentTax: 2,
    description: "Electricity service for commercial units",
  },
  {
    id: 3,
    name: "Premium Electricity",
    typeId: 1,
    price: 4800,
    vatRate: 10,
    environmentTax: 2,
    description: "Premium electricity service with priority support",
  },
  {
    id: 4,
    name: "Residential Water",
    typeId: 2,
    price: 15000,
    vatRate: 5,
    environmentTax: 3,
    description: "Standard water service for residential units",
  },
  {
    id: 5,
    name: "Commercial Water",
    typeId: 2,
    price: 25000,
    vatRate: 5,
    environmentTax: 3,
    description: "Water service for commercial units",
  },
  {
    id: 6,
    name: "Basic Internet",
    typeId: 3,
    price: 200000,
    vatRate: 10,
    environmentTax: 0,
    description: "Basic internet package with 100Mbps",
  },
  {
    id: 7,
    name: "Premium Internet",
    typeId: 3,
    price: 350000,
    vatRate: 10,
    environmentTax: 0,
    description: "Premium internet package with 500Mbps",
  },
  {
    id: 8,
    name: "Car Parking",
    typeId: 4,
    price: 1200000,
    vatRate: 10,
    environmentTax: 0,
    description: "Monthly car parking service",
  },
  {
    id: 9,
    name: "Motorbike Parking",
    typeId: 4,
    price: 150000,
    vatRate: 10,
    environmentTax: 0,
    description: "Monthly motorbike parking service",
  },
  {
    id: 10,
    name: "Gym Membership",
    typeId: 5,
    price: 500000,
    vatRate: 10,
    environmentTax: 0,
    description: "Monthly gym membership",
  },
]

export function ServiceList() {
  const [services, setServices] = useState(initialServices)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newService, setNewService] = useState({
    name: "",
    typeId: 0,
    price: 0,
    vatRate: 10,
    environmentTax: 0,
    description: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<number | null>(null)

  const handleAddService = () => {
    if (newService.typeId === 0) return

    const newId = Math.max(...services.map((service) => service.id)) + 1
    const newServiceItem = {
      id: newId,
      name: newService.name,
      typeId: newService.typeId,
      price: newService.price,
      vatRate: newService.vatRate,
      environmentTax: newService.environmentTax,
      description: newService.description,
    }

    setServices([...services, newServiceItem])
    setNewService({
      name: "",
      typeId: 0,
      price: 0,
      vatRate: 10,
      environmentTax: 0,
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const filteredServices = services.filter(
    (service) =>
      (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedType === null || service.typeId === selectedType),
  )

  const getServiceTypeIcon = (typeId: number) => {
    const type = serviceTypes.find((t) => t.id === typeId)
    return type ? type.icon : null
  }

  const getServiceTypeName = (typeId: number) => {
    const type = serviceTypes.find((t) => t.id === typeId)
    return type ? type.name : "Unknown"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Group services by type for the drag and drop view
  const servicesByType = serviceTypes.map((type) => ({
    type,
    services: filteredServices.filter((service) => service.typeId === type.id),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={selectedType?.toString() || ""}
            onValueChange={(value) => setSelectedType(value ? Number.parseInt(value) : null)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {serviceTypes.map((type) => (
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service under a service type.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={newService.typeId ? newService.typeId.toString() : ""}
                  onValueChange={(value) => setNewService({ ...newService, typeId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
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
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., Residential Electricity, Premium Internet"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price || ""}
                  onChange={(e) => setNewService({ ...newService, price: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Service price in VND"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    value={newService.vatRate || ""}
                    onChange={(e) => setNewService({ ...newService, vatRate: Number.parseInt(e.target.value) || 0 })}
                    placeholder="VAT percentage"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="environmentTax">Environment Tax (%)</Label>
                  <Input
                    id="environmentTax"
                    type="number"
                    value={newService.environmentTax || ""}
                    onChange={(e) =>
                      setNewService({ ...newService, environmentTax: Number.parseInt(e.target.value) || 0 })
                    }
                    placeholder="Environment tax percentage"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Brief description of the service"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grouped Services View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servicesByType.map(({ type, services }) => (
          <Card key={type.id} className={services.length > 0 ? "" : "opacity-70"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {type.icon}
                <CardTitle className="text-lg">{type.name}</CardTitle>
              </div>
              <Badge variant={type.isEssential ? "default" : "outline"}>
                {type.isEssential ? "Essential" : "Optional"}
              </Badge>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-md border p-3 cursor-move"
                      draggable
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(service.price)}</p>
                      </div>
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
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">No services found</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>Complete list of all services available in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Env. Tax</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getServiceTypeIcon(service.typeId)}
                      <span>{getServiceTypeName(service.typeId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{service.vatRate}%</TableCell>
                  <TableCell>{service.environmentTax}%</TableCell>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteService(service.id)}>
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
    </div>
  )
}
