"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search } from "lucide-react"

interface StaffListProps {
  staffData: any[]
  departmentsData: any[]
  selectedStaffId: number | null
  onSelectStaff: (id: number) => void
}

export function StaffList({ staffData, departmentsData, selectedStaffId, onSelectStaff }: StaffListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter staff based on search query and filters
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || staff.departments.includes(Number.parseInt(departmentFilter, 10))

    const matchesStatus = statusFilter === "all" || staff.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>Manage staff members and their roles</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details for the new staff member.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Enter position" />
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Departments</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {departmentsData.map((department) => (
                        <div key={department.id} className="flex items-center space-x-2">
                          <Checkbox id={`department-${department.id}`} />
                          <Label htmlFor={`department-${department.id}`} className="font-normal">
                            {department.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Staff Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="department-filter">Department</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentsData.map((department) => (
                  <SelectItem key={department.id} value={department.id.toString()}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="max-h-[500px] space-y-2 overflow-auto pr-2">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                  selectedStaffId === staff.id ? "border-primary bg-accent" : ""
                }`}
                onClick={() => onSelectStaff(staff.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{staff.name}</h4>
                      <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                        {staff.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{staff.position}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {staff.departments.map((deptId: number) => {
                        const department = departmentsData.find((d) => d.id === deptId)
                        return department ? (
                          <Badge key={deptId} variant="outline" className="text-xs">
                            {department.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No staff members found</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {filteredStaff.length} of {staffData.length} staff members
        </p>
      </CardFooter>
    </Card>
  )
}
