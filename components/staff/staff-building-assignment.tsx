"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Search, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StaffBuildingAssignmentProps {
  staffData: any[]
  buildingsData: any[]
}

export function StaffBuildingAssignment({ staffData, buildingsData }: StaffBuildingAssignmentProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get selected building
  const selectedBuilding = selectedBuildingId
    ? buildingsData.find((building) => building.id === selectedBuildingId)
    : null

  // Get staff assigned to selected building
  const assignedStaff = selectedBuilding
    ? staffData.filter((staff) => staff.buildings.includes(selectedBuilding.id))
    : []

  // Filter buildings based on search query
  const filteredBuildings = buildingsData.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid gap-6 md:grid-cols-7">
      <div className="md:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Buildings</CardTitle>
            <CardDescription>Select a building to manage staff assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buildings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                    selectedBuildingId === building.id ? "border-primary bg-accent" : ""
                  }`}
                  onClick={() => setSelectedBuildingId(building.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{building.name}</h4>
                      <p className="text-sm text-muted-foreground">{building.address}</p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {staffData.filter((staff) => staff.buildings.includes(building.id)).length} staff assigned
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4">
        {selectedBuilding ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedBuilding.name}</CardTitle>
                  <CardDescription>{selectedBuilding.address}</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Staff to Building</DialogTitle>
                      <DialogDescription>Select staff members to assign to {selectedBuilding.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] space-y-4 overflow-auto py-4">
                      {staffData.map((staff) => (
                        <div key={staff.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assign-staff-${staff.id}`}
                            defaultChecked={staff.buildings.includes(selectedBuilding.id)}
                          />
                          <Label htmlFor={`assign-staff-${staff.id}`} className="flex items-center gap-2 font-normal">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{staff.name}</p>
                              <p className="text-xs text-muted-foreground">{staff.position}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Assignments</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assigned" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="assigned">Assigned Staff</TabsTrigger>
                  <TabsTrigger value="departments">By Department</TabsTrigger>
                  <TabsTrigger value="roles">By Role</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned" className="space-y-4">
                  {assignedStaff.length > 0 ? (
                    <div className="space-y-3">
                      {assignedStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-sm text-muted-foreground">{staff.position}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">No staff assigned to this building</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="departments" className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { id: 1, name: "Building Management", color: "#2563eb" },
                      { id: 3, name: "Maintenance", color: "#059669" },
                      { id: 4, name: "Customer Service", color: "#7c3aed" },
                      { id: 5, name: "Security", color: "#dc2626" },
                    ].map((department) => {
                      const deptStaff = assignedStaff.filter((staff) => staff.departments.includes(department.id))
                      return (
                        <div key={department.id} className="rounded-lg border">
                          <div
                            className="flex items-center gap-3 border-b p-3"
                            style={{ borderLeftColor: department.color, borderLeftWidth: "4px" }}
                          >
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-md"
                              style={{ backgroundColor: `${department.color}20` }}
                            >
                              <Building2 style={{ color: department.color }} className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{department.name}</h4>
                              <p className="text-xs text-muted-foreground">{deptStaff.length} staff members</p>
                            </div>
                          </div>
                          {deptStaff.length > 0 ? (
                            <div className="divide-y">
                              {deptStaff.map((staff) => (
                                <div key={staff.id} className="flex items-center justify-between p-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{staff.name}</p>
                                      <p className="text-xs text-muted-foreground">{staff.position}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-16 items-center justify-center">
                              <p className="text-sm text-muted-foreground">No staff in this department</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="roles" className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { id: "BUILDING_MANAGER", name: "Building Manager" },
                      { id: "MAINTENANCE_STAFF", name: "Maintenance Staff" },
                      { id: "SECURITY_STAFF", name: "Security Staff" },
                      { id: "CUSTOMER_SERVICE", name: "Customer Service" },
                    ].map((role) => {
                      const roleStaff = assignedStaff.filter((staff) => staff.roles.includes(role.id))
                      return (
                        <div key={role.id} className="rounded-lg border">
                          <div className="flex items-center gap-3 border-b p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100">
                              <UserPlus className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{role.name}</h4>
                              <p className="text-xs text-muted-foreground">{roleStaff.length} staff members</p>
                            </div>
                          </div>
                          {roleStaff.length > 0 ? (
                            <div className="divide-y">
                              {roleStaff.map((staff) => (
                                <div key={staff.id} className="flex items-center justify-between p-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{staff.name}</p>
                                      <p className="text-xs text-muted-foreground">{staff.position}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-16 items-center justify-center">
                              <p className="text-sm text-muted-foreground">No staff with this role</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Building Staff</CardTitle>
              <CardDescription>Select a building to view assigned staff</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">No building selected</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
