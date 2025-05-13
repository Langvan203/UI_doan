"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Zap, Droplets, Wifi, Car, Dumbbell, Trash2, Edit, MoreVertical, Plus } from "lucide-react"
import type { JSX } from "react"

// Sample data for service types
const initialServiceTypes = [
  {
    id: 1,
    name: "Electricity",
    description: "Electricity services for residents",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    isEssential: true,
    servicesCount: 3,
  },
  {
    id: 2,
    name: "Water",
    description: "Water supply services",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    isEssential: true,
    servicesCount: 2,
  },
  {
    id: 3,
    name: "Internet",
    description: "Internet connectivity services",
    icon: <Wifi className="h-5 w-5 text-purple-500" />,
    isEssential: true,
    servicesCount: 4,
  },
  {
    id: 4,
    name: "Parking",
    description: "Parking services for vehicles",
    icon: <Car className="h-5 w-5 text-gray-500" />,
    isEssential: false,
    servicesCount: 2,
  },
  {
    id: 5,
    name: "Gym",
    description: "Gym and fitness services",
    icon: <Dumbbell className="h-5 w-5 text-green-500" />,
    isEssential: false,
    servicesCount: 1,
  },
]

export function ServiceTypeList() {
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newServiceType, setNewServiceType] = useState({ name: "", description: "", isEssential: false })
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddServiceType = () => {
    const newId = Math.max(...serviceTypes.map((type) => type.id)) + 1
    const iconMap: Record<string, JSX.Element> = {
      Electricity: <Zap className="h-5 w-5 text-yellow-500" />,
      Water: <Droplets className="h-5 w-5 text-blue-500" />,
      Internet: <Wifi className="h-5 w-5 text-purple-500" />,
      Parking: <Car className="h-5 w-5 text-gray-500" />,
      Gym: <Dumbbell className="h-5 w-5 text-green-500" />,
    }

    const newType = {
      id: newId,
      name: newServiceType.name,
      description: newServiceType.description,
      icon: iconMap[newServiceType.name] || <Plus className="h-5 w-5 text-gray-500" />,
      isEssential: newServiceType.isEssential,
      servicesCount: 0,
    }

    setServiceTypes([...serviceTypes, newType])
    setNewServiceType({ name: "", description: "", isEssential: false })
    setIsAddDialogOpen(false)
  }

  const handleDeleteServiceType = (id: number) => {
    setServiceTypes(serviceTypes.filter((type) => type.id !== id))
  }

  const filteredServiceTypes = serviceTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const essentialServices = filteredServiceTypes.filter((type) => type.isEssential)
  const otherServices = filteredServiceTypes.filter((type) => !type.isEssential)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search service types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Service Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Type</DialogTitle>
              <DialogDescription>Create a new service type for the building management system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newServiceType.name}
                  onChange={(e) => setNewServiceType({ ...newServiceType, name: e.target.value })}
                  placeholder="e.g., Electricity, Water, Internet"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newServiceType.description}
                  onChange={(e) => setNewServiceType({ ...newServiceType, description: e.target.value })}
                  placeholder="Brief description of the service type"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={newServiceType.isEssential}
                  onChange={(e) => setNewServiceType({ ...newServiceType, isEssential: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isEssential">Mark as essential service</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServiceType}>Add Service Type</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Essential Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Essential Services</CardTitle>
          <CardDescription>Core services that are essential for residents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {essentialServices.map((type) => (
              <Card key={type.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    {type.icon}
                    <CardTitle className="text-lg">{type.name}</CardTitle>
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
                      <DropdownMenuItem onClick={() => handleDeleteServiceType(type.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant="outline">{type.servicesCount} services</Badge>
                  <Button variant="outline" size="sm">
                    View Services
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Other Services</CardTitle>
          <CardDescription>Additional services available for residents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherServices.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span>{type.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{type.servicesCount}</Badge>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteServiceType(type.id)}>
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
