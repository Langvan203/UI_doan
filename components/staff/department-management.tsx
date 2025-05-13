"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  Edit,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  Wrench,
  HeadphonesIcon,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Trash,
  MoreVertical,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { departmentsData, staffData } from "@/components/staff/staff-management"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Map of department icons
const departmentIcons: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-5 w-5" />,
  Wrench: <Wrench className="h-5 w-5" />,
  HeadphonesIcon: <HeadphonesIcon className="h-5 w-5" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
}

// Sample department data
const sampleDepartments = [
  {
    id: 1,
    name: "Building Management",
    description: "Responsible for day-to-day operations of buildings",
    staffCount: 15,
    createdAt: "2022-01-15",
  },
  {
    id: 2,
    name: "Customer Service",
    description: "Handles resident inquiries and service requests",
    staffCount: 8,
    createdAt: "2022-01-20",
  },
  {
    id: 3,
    name: "Maintenance",
    description: "Performs repairs and maintenance in all buildings",
    staffCount: 12,
    createdAt: "2022-02-05",
  },
  {
    id: 4,
    name: "Security",
    description: "Ensures safety and security of residents and properties",
    staffCount: 10,
    createdAt: "2022-02-10",
  },
  {
    id: 5,
    name: "Finance",
    description: "Manages financial aspects of property management",
    staffCount: 6,
    createdAt: "2022-03-15",
  },
]

export function DepartmentManagement() {
  const [departments, setDepartments] = useState(departmentsData)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    color: "#2563eb",
    icon: "Building2",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedDepartment_1, setSelectedDepartment_1] = useState<(typeof sampleDepartments)[0] | null>(null)
  const [newDepartment_1, setNewDepartment_1] = useState({
    name: "",
    description: "",
  })
  const [editDepartment, setEditDepartment] = useState({
    id: 0,
    name: "",
    description: "",
  })

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get selected department
  const selectedDept = selectedDepartmentId
    ? departments.find((department) => department.id === selectedDepartmentId)
    : null

  // Get staff in selected department
  const departmentStaff = selectedDept ? staffData.filter((staff) => staff.departments.includes(selectedDept.id)) : []

  // Handle adding a new department
  const handleAddDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    const newDepartmentObj = {
      id: departments.length + 1,
      name: newDepartment.name,
      description: newDepartment.description,
      color: newDepartment.color,
      icon: newDepartment.icon,
      staffCount: 0,
      createdAt: new Date().toISOString(),
    }

    setDepartments([...departments, newDepartmentObj])
    setNewDepartment({
      name: "",
      description: "",
      color: "#2563eb",
      icon: "Building2",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: `Department "${newDepartment.name}" has been created`,
    })
  }

  // Handle editing a department
  const handleEditDepartment_1 = () => {
    if (!selectedDept) return

    const updatedDepartments = departments.map((dept) => (dept.id === selectedDept.id ? selectedDept : dept))

    setDepartments(updatedDepartments)
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: `Department "${selectedDept.name}" has been updated`,
    })
  }

  // Handle deleting a department
  const handleDeleteDepartment_1 = () => {
    if (!selectedDept) return

    const updatedDepartments = departments.filter((dept) => dept.id !== selectedDept.id)
    setDepartments(updatedDepartments)
    setSelectedDepartmentId(null)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: `Department "${selectedDept.name}" has been deleted`,
    })
  }

  // Handle adding staff to department
  const handleAddStaffToDepartment = (staffIds: number[]) => {
    if (!selectedDept) return

    // In a real application, you would update the staff-department relationship
    // For this demo, we'll just update the staffCount
    const updatedDepartments = departments.map((dept) =>
      dept.id === selectedDept.id ? { ...dept, staffCount: dept.staffCount + staffIds.length } : dept,
    )

    setDepartments(updatedDepartments)
    toast({
      title: "Success",
      description: `${staffIds.length} staff members added to "${selectedDept.name}"`,
    })
  }

  // Handle removing staff from department
  const handleRemoveStaffFromDepartment = (staffId: number) => {
    if (!selectedDept) return

    // In a real application, you would update the staff-department relationship
    // For this demo, we'll just update the staffCount
    const updatedDepartments = departments.map((dept) =>
      dept.id === selectedDept.id ? { ...dept, staffCount: Math.max(0, dept.staffCount - 1) } : dept,
    )

    setDepartments(updatedDepartments)
    toast({
      title: "Success",
      description: "Staff member removed from department",
    })
  }

  // Handle adding a new department
  const handleAddDepartment_1 = () => {
    const newDept = {
      id: Math.max(...departments.map((d) => d.id)) + 1,
      name: newDepartment_1.name,
      description: newDepartment_1.description,
      staffCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setDepartments([...departments, newDept])
    setNewDepartment_1({ name: "", description: "" })
    setIsAddDepartmentOpen(false)
  }

  // Handle editing a department
  const handleEditDepartment = () => {
    const updatedDepartments = departments.map((dept) =>
      dept.id === editDepartment.id
        ? { ...dept, name: editDepartment.name, description: editDepartment.description }
        : dept,
    )
    setDepartments(updatedDepartments)
    setIsEditDepartmentOpen(false)
  }

  // Handle deleting a department
  const handleDeleteDepartment = () => {
    if (selectedDepartment_1) {
      const updatedDepartments = departments.filter((dept) => dept.id !== selectedDepartment_1.id)
      setDepartments(updatedDepartments)
      setIsDeleteConfirmOpen(false)
      setSelectedDepartment_1(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Department Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>Add a new department to your organization structure.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={newDepartment_1.name}
                    onChange={(e) => setNewDepartment_1({ ...newDepartment_1, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDepartment_1.description}
                    onChange={(e) => setNewDepartment_1({ ...newDepartment_1, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment_1} disabled={!newDepartment_1.name}>
                Create Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>Manage departments and their staff</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Create New Department</DialogTitle>
                      <DialogDescription>Define a new department for your organization.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="department-name">Department Name</Label>
                        <Input
                          id="department-name"
                          placeholder="e.g., Human Resources"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department-description">Description</Label>
                        <Textarea
                          id="department-description"
                          placeholder="Describe the department's responsibilities"
                          value={newDepartment.description}
                          onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department-color">Color</Label>
                          <div className="flex gap-2">
                            {["#2563eb", "#059669", "#7c3aed", "#dc2626", "#f97316", "#0ea5e9"].map((color) => (
                              <div
                                key={color}
                                className={`h-8 w-8 cursor-pointer rounded-full border-2 ${
                                  newDepartment.color === color
                                    ? "border-gray-900"
                                    : "border-transparent hover:border-gray-300"
                                } focus:border-gray-900 focus:outline-none`}
                                style={{ backgroundColor: color }}
                                tabIndex={0}
                                onClick={() => setNewDepartment({ ...newDepartment, color })}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="department-icon">Icon</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(departmentIcons).map(([name, icon]) => (
                              <div
                                key={name}
                                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border ${
                                  newDepartment.icon === name ? "border-gray-900 bg-accent" : "hover:bg-accent"
                                } focus:border-gray-900 focus:outline-none`}
                                tabIndex={0}
                                onClick={() => setNewDepartment({ ...newDepartment, icon: name })}
                              >
                                {icon}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddDepartment}>
                        Create Department
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="max-h-[600px] space-y-2 overflow-auto pr-2">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                        selectedDepartmentId === department.id ? "border-primary bg-accent" : ""
                      }`}
                      onClick={() => setSelectedDepartmentId(department.id)}
                      style={{ borderLeftColor: department.color, borderLeftWidth: "4px" }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${department.color}20` }}
                        >
                          {departmentIcons[department.icon] ? (
                            React.cloneElement(departmentIcons[department.icon] as React.ReactElement, {
                              style: { color: department.color },
                            })
                          ) : (
                            <Building2 style={{ color: department.color }} className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{department.name}</h4>
                          <p className="text-sm text-muted-foreground">{department.description}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {department.staffCount} staff members
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Created {new Date(department.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No departments found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4">
          {selectedDept ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${selectedDept.color}20` }}
                    >
                      {departmentIcons[selectedDept.icon] ? (
                        React.cloneElement(departmentIcons[selectedDept.icon] as React.ReactElement, {
                          style: { color: selectedDept.color },
                        })
                      ) : (
                        <Building2 style={{ color: selectedDept.color }} className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle>{selectedDept.name}</CardTitle>
                      <CardDescription>{selectedDept.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Edit Department</DialogTitle>
                          <DialogDescription>Update the department details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <Label htmlFor="edit-department-name">Department Name</Label>
                            <Input
                              id="edit-department-name"
                              value={selectedDept.name}
                              onChange={(e) =>
                                setSelectedDepartmentId((prev) => {
                                  if (prev !== null) {
                                    const updatedDept = {
                                      ...selectedDept,
                                      name: e.target.value,
                                    }
                                    setDepartments(departments.map((d) => (d.id === prev ? updatedDept : d)))
                                  }
                                  return prev
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-department-description">Description</Label>
                            <Textarea
                              id="edit-department-description"
                              value={selectedDept.description}
                              onChange={(e) =>
                                setSelectedDepartmentId((prev) => {
                                  if (prev !== null) {
                                    const updatedDept = {
                                      ...selectedDept,
                                      description: e.target.value,
                                    }
                                    setDepartments(departments.map((d) => (d.id === prev ? updatedDept : d)))
                                  }
                                  return prev
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-department-color">Color</Label>
                              <div className="flex gap-2">
                                {["#2563eb", "#059669", "#7c3aed", "#dc2626", "#f97316", "#0ea5e9"].map((color) => (
                                  <div
                                    key={color}
                                    className={`h-8 w-8 cursor-pointer rounded-full border-2 ${
                                      selectedDept.color === color
                                        ? "border-gray-900"
                                        : "border-transparent hover:border-gray-300"
                                    } focus:border-gray-900 focus:outline-none`}
                                    style={{ backgroundColor: color }}
                                    tabIndex={0}
                                    onClick={() =>
                                      setSelectedDepartmentId((prev) => {
                                        if (prev !== null) {
                                          const updatedDept = {
                                            ...selectedDept,
                                            color,
                                          }
                                          setDepartments(departments.map((d) => (d.id === prev ? updatedDept : d)))
                                        }
                                        return prev
                                      })
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-department-icon">Icon</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(departmentIcons).map(([name, icon]) => (
                                  <div
                                    key={name}
                                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border ${
                                      selectedDept.icon === name ? "border-gray-900 bg-accent" : "hover:bg-accent"
                                    } focus:border-gray-900 focus:outline-none`}
                                    tabIndex={0}
                                    onClick={() =>
                                      setSelectedDepartmentId((prev) => {
                                        if (prev !== null) {
                                          const updatedDept = {
                                            ...selectedDept,
                                            icon: name,
                                          }
                                          setDepartments(departments.map((d) => (d.id === prev ? updatedDept : d)))
                                        }
                                        return prev
                                      })
                                    }
                                  >
                                    {icon}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleEditDepartment_1}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Department</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the "{selectedDept.name}" department? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteDepartment_1}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="staff" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="staff">Staff Members</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="staff" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Department Staff</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Staff
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Staff to Department</DialogTitle>
                            <DialogDescription>
                              Select staff members to add to the {selectedDept.name} department.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[400px] space-y-4 overflow-auto py-4">
                            {staffData
                              .filter((staff) => !staff.departments.includes(selectedDept.id))
                              .map((staff) => (
                                <div key={staff.id} className="flex items-center space-x-2">
                                  <Checkbox id={`add-staff-${staff.id}`} />
                                  <Label
                                    htmlFor={`add-staff-${staff.id}`}
                                    className="flex items-center gap-2 font-normal"
                                  >
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
                            <Button
                              type="button"
                              onClick={() => {
                                // In a real app, you would collect the checked staff IDs
                                const staffIds = [1, 2] // Example
                                handleAddStaffToDepartment(staffIds)
                              }}
                            >
                              Add to Department
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {departmentStaff.length > 0 ? (
                      <div className="space-y-3">
                        {departmentStaff.map((staff) => (
                          <div key={staff.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{staff.name}</p>
                                <p className="text-sm text-muted-foreground">{staff.position}</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {staff.roles.slice(0, 2).map((roleId: string) => {
                                    const roleName =
                                      {
                                        BUILDING_MANAGER: "Building Manager",
                                        FINANCIAL_MANAGER: "Financial Manager",
                                        SERVICE_MANAGER: "Service Manager",
                                        CUSTOMER_SERVICE: "Customer Service",
                                        MAINTENANCE_MANAGER: "Maintenance Manager",
                                        MAINTENANCE_STAFF: "Maintenance Staff",
                                        SECURITY_MANAGER: "Security Manager",
                                        SECURITY_STAFF: "Security Staff",
                                        CLEANING_MANAGER: "Cleaning Manager",
                                      }[roleId] || roleId
                                    return (
                                      <Badge key={roleId} variant="secondary" className="text-xs">
                                        {roleName}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveStaffFromDepartment(staff.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No staff members in this department</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Department Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                              <dd className="text-sm">{new Date(selectedDept.createdAt).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Staff Count</dt>
                              <dd className="text-sm">{selectedDept.staffCount}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Buildings</dt>
                              <dd className="text-sm">All Buildings</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Staff Roles</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {[
                              {
                                role: "Managers",
                                count: departmentStaff.filter((s) => s.position.includes("Manager")).length,
                              },
                              {
                                role: "Staff",
                                count: departmentStaff.filter((s) => !s.position.includes("Manager")).length,
                              },
                            ].map((item) => (
                              <div key={item.role} className="flex items-center justify-between">
                                <span className="text-sm">{item.role}</span>
                                <Badge variant="outline">{item.count}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                              <div>
                                <p className="text-sm">New staff member added to department</p>
                                <p className="text-xs text-muted-foreground">2 days ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                              <div>
                                <p className="text-sm">Department description updated</p>
                                <p className="text-xs text-muted-foreground">1 week ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                              <div>
                                <p className="text-sm">Department created</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(selectedDept.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Department Details</CardTitle>
                <CardDescription>Select a department to view details</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No department selected</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <Card key={department.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle>{department.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setEditDepartment({
                          id: department.id,
                          name: department.name,
                          description: department.description,
                        })
                        setIsEditDepartmentOpen(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedDepartment_1(department)
                        setIsDeleteConfirmOpen(true)
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>Created on {department.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{department.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{department.staffCount}</span> staff members
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={editDepartment.name}
                  onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDepartment.description}
                  onChange={(e) => setEditDepartment({ ...editDepartment, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment} disabled={!editDepartment.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department &quot;{selectedDepartment_1?.name}&quot; and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
