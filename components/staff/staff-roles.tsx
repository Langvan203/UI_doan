"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Search, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StaffRolesProps {
  rolesData: any[]
  staffData: any[]
}

export function StaffRoles({ rolesData, staffData }: StaffRolesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  // Filter roles based on search query
  const filteredRoles = rolesData.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get selected role
  const selectedRole = selectedRoleId ? rolesData.find((role) => role.id === selectedRoleId) : null

  // Get staff with selected role
  const staffWithRole = selectedRole ? staffData.filter((staff) => staff.roles.includes(selectedRole.id)) : []

  return (
    <div className="grid gap-6 md:grid-cols-7">
      <div className="md:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage staff roles and permissions</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>Define a new role and its permissions.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="role-name">Role Name</Label>
                      <Input id="role-name" placeholder="e.g., Maintenance Supervisor" />
                    </div>
                    <div>
                      <Label htmlFor="role-description">Description</Label>
                      <Textarea id="role-description" placeholder="Describe the role's responsibilities" />
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="space-y-2 rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Building Management</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-building-read" />
                              <Label htmlFor="permission-building-read" className="text-sm font-normal">
                                View buildings
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-building-write" />
                              <Label htmlFor="permission-building-write" className="text-sm font-normal">
                                Manage buildings
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Staff Management</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-staff-read" />
                              <Label htmlFor="permission-staff-read" className="text-sm font-normal">
                                View staff
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-staff-write" />
                              <Label htmlFor="permission-staff-write" className="text-sm font-normal">
                                Manage staff
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Resident Management</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-resident-read" />
                              <Label htmlFor="permission-resident-read" className="text-sm font-normal">
                                View residents
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-resident-write" />
                              <Label htmlFor="permission-resident-write" className="text-sm font-normal">
                                Manage residents
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Financial Management</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-finance-read" />
                              <Label htmlFor="permission-finance-read" className="text-sm font-normal">
                                View finances
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="permission-finance-write" />
                              <Label htmlFor="permission-finance-write" className="text-sm font-normal">
                                Manage finances
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[600px] space-y-2 overflow-auto pr-2">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                      selectedRoleId === role.id ? "border-primary bg-accent" : ""
                    }`}
                    onClick={() => setSelectedRoleId(role.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
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
                  </div>
                ))
              ) : (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No roles found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4">
        {selectedRole ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedRole.name}</CardTitle>
                  <CardDescription>{selectedRole.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>Modify this role and its permissions.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="edit-role-name">Role Name</Label>
                          <Input id="edit-role-name" defaultValue={selectedRole.name} />
                        </div>
                        <div>
                          <Label htmlFor="edit-role-description">Description</Label>
                          <Textarea id="edit-role-description" defaultValue={selectedRole.description} />
                        </div>
                        <div>
                          <Label>Permissions</Label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="space-y-2 rounded-lg border p-3">
                              <h4 className="text-sm font-medium">Building Management</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-permission-building-read"
                                    defaultChecked={selectedRole.permissions.includes("building:read")}
                                  />
                                  <Label htmlFor="edit-permission-building-read" className="text-sm font-normal">
                                    View buildings
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-permission-building-write"
                                    defaultChecked={selectedRole.permissions.includes("building:write")}
                                  />
                                  <Label htmlFor="edit-permission-building-write" className="text-sm font-normal">
                                    Manage buildings
                                  </Label>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2 rounded-lg border p-3">
                              <h4 className="text-sm font-medium">Staff Management</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-permission-staff-read"
                                    defaultChecked={selectedRole.permissions.includes("staff:read")}
                                  />
                                  <Label htmlFor="edit-permission-staff-read" className="text-sm font-normal">
                                    View staff
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-permission-staff-write"
                                    defaultChecked={selectedRole.permissions.includes("staff:write")}
                                  />
                                  <Label htmlFor="edit-permission-staff-write" className="text-sm font-normal">
                                    Manage staff
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="permissions" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="staff">Staff Members</TabsTrigger>
                </TabsList>
                <TabsContent value="permissions" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedRole.permissions.map((permission: string) => (
                      <div key={permission} className="flex items-center gap-2 rounded-lg border p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100">
                          <Shield className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{permission}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="staff" className="space-y-4">
                  {staffWithRole.length > 0 ? (
                    <div className="space-y-3">
                      {staffWithRole.map((staff) => (
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
                            Remove Role
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">No staff members with this role</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>Select a role to view details</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">No role selected</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
