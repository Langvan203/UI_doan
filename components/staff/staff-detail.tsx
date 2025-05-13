"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Building2, Calendar, Edit, Mail, Phone, Shield, Trash2, User, UserCheck, UserPlus } from "lucide-react"

interface StaffDetailProps {
  staff: any
  departmentsData: any[]
  buildingsData: any[]
  rolesData: any[]
}

export function StaffDetail({ staff, departmentsData, buildingsData, rolesData }: StaffDetailProps) {
  const [activeTab, setActiveTab] = useState("info")

  // Get staff departments
  const staffDepartments = departmentsData.filter((dept) => staff.departments.includes(dept.id))

  // Get staff buildings
  const staffBuildings = buildingsData.filter((building) => staff.buildings.includes(building.id))

  // Get staff roles
  const staffRoles = rolesData.filter((role) => staff.roles.includes(role.id))

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{staff.name}</CardTitle>
              <CardDescription className="text-base">{staff.position}</CardDescription>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                  {staff.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Joined {new Date(staff.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Staff Member</DialogTitle>
                  <DialogDescription>Update the staff member's information.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input id="edit-name" defaultValue={staff.name} />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input id="edit-email" type="email" defaultValue={staff.email} />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input id="edit-phone" defaultValue={staff.phone} />
                    </div>
                    <div>
                      <Label htmlFor="edit-position">Position</Label>
                      <Input id="edit-position" defaultValue={staff.position} />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select defaultValue={staff.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Departments</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {departmentsData.map((department) => (
                          <div key={department.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-department-${department.id}`}
                              defaultChecked={staff.departments.includes(department.id)}
                            />
                            <Label htmlFor={`edit-department-${department.id}`} className="font-normal">
                              {department.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Buildings</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {buildingsData.map((building) => (
                          <div key={building.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-building-${building.id}`}
                              defaultChecked={staff.buildings.includes(building.id)}
                            />
                            <Label htmlFor={`edit-building-${building.id}`} className="font-normal">
                              {building.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Roles</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {rolesData.map((role) => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox id={`edit-role-${role.id}`} defaultChecked={staff.roles.includes(role.id)} />
                            <Label htmlFor={`edit-role-${role.id}`} className="font-normal">
                              {role.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit-notes">Notes</Label>
                      <Textarea id="edit-notes" placeholder="Add notes about this staff member" />
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
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                </div>
                <p className="text-sm">{staff.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                </div>
                <p className="text-sm">{staff.phone}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Position:</span>
                </div>
                <p className="text-sm">{staff.position}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Join Date:</span>
                </div>
                <p className="text-sm">{new Date(staff.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm">Updated maintenance schedule for Happy Residence</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm">Completed quarterly inspection for Block A</p>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm">Assigned to new maintenance team</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Assigned Departments</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign to Departments</DialogTitle>
                      <DialogDescription>
                        Select the departments this staff member should be assigned to.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {departmentsData.map((department) => (
                        <div key={department.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assign-department-${department.id}`}
                            defaultChecked={staff.departments.includes(department.id)}
                          />
                          <Label htmlFor={`assign-department-${department.id}`} className="font-normal">
                            {department.name}
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

              <div className="grid gap-3 md:grid-cols-2">
                {staffDepartments.length > 0 ? (
                  staffDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                      style={{ borderLeftColor: department.color, borderLeftWidth: "4px" }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                        style={{ backgroundColor: `${department.color}20` }}
                      >
                        <Building2 style={{ color: department.color }} className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{department.name}</h4>
                        <p className="text-sm text-muted-foreground">{department.description}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {department.staffCount} staff members
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex h-20 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No departments assigned</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buildings" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Assigned Buildings</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Building
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign to Buildings</DialogTitle>
                      <DialogDescription>
                        Select the buildings this staff member should be assigned to.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {buildingsData.map((building) => (
                        <div key={building.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assign-building-${building.id}`}
                            defaultChecked={staff.buildings.includes(building.id)}
                          />
                          <Label htmlFor={`assign-building-${building.id}`} className="font-normal">
                            {building.name}
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

              <div className="grid gap-3 md:grid-cols-2">
                {staffBuildings.length > 0 ? (
                  staffBuildings.map((building) => (
                    <div key={building.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{building.name}</h4>
                        <p className="text-sm text-muted-foreground">{building.address}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex h-20 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No buildings assigned</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Assigned Roles</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Roles</DialogTitle>
                      <DialogDescription>Select the roles this staff member should have.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {rolesData.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <Checkbox id={`assign-role-${role.id}`} defaultChecked={staff.roles.includes(role.id)} />
                          <Label htmlFor={`assign-role-${role.id}`} className="font-normal">
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Roles</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {staffRoles.length > 0 ? (
                  staffRoles.map((role) => (
                    <div key={role.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{role.name}</h4>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission: string) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex h-20 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No roles assigned</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex w-full items-center justify-between">
          <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <Button variant="outline" size="sm">
            View Full Profile
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
