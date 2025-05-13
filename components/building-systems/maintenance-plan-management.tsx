"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  ListChecks,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCog,
  Wrench,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for maintenance plans
const maintenancePlansData = [
  {
    id: 1,
    title: "HVAC Quarterly Maintenance",
    systemId: 1,
    systemName: "Central HVAC System",
    frequency: "Quarterly",
    nextScheduledDate: "2025-07-01",
    assignedTo: "Nguyễn Văn A",
    status: "scheduled",
    description:
      "Complete inspection and maintenance of the HVAC system including filter replacement, coil cleaning, and performance checks.",
    tasks: [
      { id: 1, description: "Replace air filters", completed: false },
      { id: 2, description: "Clean condenser coils", completed: false },
      { id: 3, description: "Check refrigerant levels", completed: false },
      { id: 4, description: "Inspect electrical components", completed: false },
      { id: 5, description: "Test system performance", completed: false },
    ],
  },
  {
    id: 2,
    title: "Emergency Generator Monthly Test",
    systemId: 2,
    systemName: "Emergency Generator",
    frequency: "Monthly",
    nextScheduledDate: "2025-06-01",
    assignedTo: "Trần Văn B",
    status: "scheduled",
    description: "Monthly test run of the emergency generator to ensure proper operation during power outages.",
    tasks: [
      { id: 6, description: "Visual inspection of the generator", completed: false },
      { id: 7, description: "Check fuel levels", completed: false },
      { id: 8, description: "Test start and run for 30 minutes", completed: false },
      { id: 9, description: "Check battery condition", completed: false },
      { id: 10, description: "Record performance metrics", completed: false },
    ],
  },
  {
    id: 3,
    title: "Fire Alarm System Annual Certification",
    systemId: 3,
    systemName: "Fire Alarm System",
    frequency: "Annually",
    nextScheduledDate: "2025-09-15",
    assignedTo: "Certified External Contractor",
    status: "scheduled",
    description: "Annual certification of the fire alarm system as required by regulations.",
    tasks: [
      { id: 11, description: "Test all smoke detectors", completed: false },
      { id: 12, description: "Test all manual pull stations", completed: false },
      { id: 13, description: "Test alarm notification devices", completed: false },
      { id: 14, description: "Inspect control panel", completed: false },
      { id: 15, description: "Update certification documentation", completed: false },
    ],
  },
  {
    id: 4,
    title: "Elevator #1 Bi-monthly Maintenance",
    systemId: 5,
    systemName: "Elevator #1",
    frequency: "Bi-monthly",
    nextScheduledDate: "2025-06-10",
    assignedTo: "OTIS Service Technician",
    status: "in_progress",
    description: "Regular maintenance of Elevator #1 to ensure safe and efficient operation.",
    tasks: [
      { id: 16, description: "Inspect door operation", completed: true },
      { id: 17, description: "Check cable condition", completed: true },
      { id: 18, description: "Test emergency phone", completed: false },
      { id: 19, description: "Lubricate moving parts", completed: false },
      { id: 20, description: "Test safety features", completed: false },
    ],
  },
  {
    id: 5,
    title: "Elevator #2 Repair",
    systemId: 6,
    systemName: "Elevator #2",
    frequency: "One-time",
    nextScheduledDate: "2025-05-20",
    assignedTo: "OTIS Service Technician",
    status: "in_progress",
    description: "Repair of the unusual noise issue in Elevator #2.",
    tasks: [
      { id: 21, description: "Diagnose noise source", completed: true },
      { id: 22, description: "Replace faulty component", completed: false },
      { id: 23, description: "Test operation after repair", completed: false },
      { id: 24, description: "Update maintenance log", completed: false },
    ],
  },
  {
    id: 6,
    title: "Water Pump Semi-annual Maintenance",
    systemId: 4,
    systemName: "Water Supply System",
    frequency: "Semi-annually",
    nextScheduledDate: "2025-08-15",
    assignedTo: "Plumbing Team",
    status: "scheduled",
    description: "Regular maintenance of the water pump system.",
    tasks: [
      { id: 25, description: "Inspect pump condition", completed: false },
      { id: 26, description: "Check pressure settings", completed: false },
      { id: 27, description: "Clean filters", completed: false },
      { id: 28, description: "Test backup pump", completed: false },
    ],
  },
  {
    id: 7,
    title: "CCTV System Quarterly Check",
    systemId: 7,
    systemName: "CCTV System",
    frequency: "Quarterly",
    nextScheduledDate: "2025-07-15",
    assignedTo: "Security Team",
    status: "scheduled",
    description: "Regular check of all security cameras and recording equipment.",
    tasks: [
      { id: 29, description: "Test all cameras", completed: false },
      { id: 30, description: "Clean camera lenses", completed: false },
      { id: 31, description: "Check recording quality", completed: false },
      { id: 32, description: "Verify storage capacity", completed: false },
      { id: 33, description: "Update firmware if needed", completed: false },
    ],
  },
  {
    id: 8,
    title: "Solar Panel System Annual Inspection",
    systemId: 9,
    systemName: "Solar Panel System",
    frequency: "Annually",
    nextScheduledDate: "2025-10-01",
    assignedTo: "Solar System Specialist",
    status: "scheduled",
    description: "Annual inspection and cleaning of the solar panel system.",
    tasks: [
      { id: 34, description: "Clean all solar panels", completed: false },
      { id: 35, description: "Inspect mounting hardware", completed: false },
      { id: 36, description: "Test inverter performance", completed: false },
      { id: 37, description: "Check electrical connections", completed: false },
      { id: 38, description: "Measure output efficiency", completed: false },
    ],
  },
]

// Mock data for building systems (for dropdown selection)
const systemsForSelection = [
  { id: 1, name: "Central HVAC System" },
  { id: 2, name: "Emergency Generator" },
  { id: 3, name: "Fire Alarm System" },
  { id: 4, name: "Water Supply System" },
  { id: 5, name: "Elevator #1" },
  { id: 6, name: "Elevator #2" },
  { id: 7, name: "CCTV System" },
  { id: 8, name: "Access Control System" },
  { id: 9, name: "Solar Panel System" },
  { id: 10, name: "Sewage Treatment System" },
]

// Maintenance frequencies
const frequencies = [
  "Daily",
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Bi-monthly",
  "Quarterly",
  "Semi-annually",
  "Annually",
  "One-time",
]

// Maintenance statuses
const statuses = ["All Statuses", "scheduled", "in_progress", "completed", "cancelled", "overdue"]

// Staff for assignment
const staffMembers = [
  "Nguyễn Văn A",
  "Trần Văn B",
  "Lê Thị C",
  "Phạm Văn D",
  "OTIS Service Technician",
  "Plumbing Team",
  "Security Team",
  "Electrical Team",
  "Certified External Contractor",
  "Solar System Specialist",
]

export function MaintenancePlanManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isViewPlanDialogOpen, setIsViewPlanDialogOpen] = useState(false)
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newPlanTasks, setNewPlanTasks] = useState<{ id: number; description: string; completed: boolean }[]>([])
  const [nextTaskId, setNextTaskId] = useState(100) // Start from a high number to avoid conflicts
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false)
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)

  // Filter plans based on search and status filter
  const filteredPlans = maintenancePlansData.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All Statuses" || plan.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Function to add a new task to the list when creating a plan
  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      setNewPlanTasks([...newPlanTasks, { id: nextTaskId, description: newTaskDescription.trim(), completed: false }])
      setNextTaskId(nextTaskId + 1)
      setNewTaskDescription("")
    }
  }

  // Function to remove a task from the list when creating a plan
  const handleRemoveTask = (taskId: number) => {
    setNewPlanTasks(newPlanTasks.filter((task) => task.id !== taskId))
  }

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "success"
      case "cancelled":
        return "outline"
      case "overdue":
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
        <h1 className="text-2xl font-bold">Maintenance Plans</h1>
        <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Maintenance Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Maintenance Plan</DialogTitle>
              <DialogDescription>
                Set up a maintenance plan for a building system. Add detailed tasks to be completed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Plan Title</Label>
                  <Input id="title" placeholder="Enter maintenance plan title" />
                </div>
                <div>
                  <Label htmlFor="system">Building System</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemsForSelection.map((system) => (
                        <SelectItem key={system.id} value={system.id.toString()}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input id="scheduledDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter plan description" />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Tasks</Label>
                    <span className="text-xs text-muted-foreground">Add tasks to be completed during maintenance</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Enter task description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTask()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTask} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    {newPlanTasks.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No tasks added yet. Add tasks using the field above.
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {newPlanTasks.map((task) => (
                          <li key={task.id} className="flex items-center justify-between p-3">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{task.description}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveTask(task.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewPlanTasks([])
                  setIsAddPlanDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  setNewPlanTasks([])
                  setIsAddPlanDialogOpen(false)
                }}
              >
                Create Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Maintenance Plans</CardTitle>
          <CardDescription>View and manage all scheduled and ongoing maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All Statuses" ? status : formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Maintenance Plans Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No maintenance plans found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.title}</TableCell>
                        <TableCell>{plan.systemName}</TableCell>
                        <TableCell>{new Date(plan.nextScheduledDate).toLocaleDateString()}</TableCell>
                        <TableCell>{plan.frequency}</TableCell>
                        <TableCell>{plan.assignedTo}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(plan.status) as any}>{formatStatus(plan.status)}</Badge>
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
                                  setSelectedPlan(plan)
                                  setIsViewPlanDialogOpen(true)
                                }}
                              >
                                <ListChecks className="mr-2 h-4 w-4" />
                                View Tasks & Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setIsEditPlanDialogOpen(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setIsReassignDialogOpen(true)
                                }}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                Reassign
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setIsRescheduleDialogOpen(true)
                                }}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Plan
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

      {/* View Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={isViewPlanDialogOpen} onOpenChange={setIsViewPlanDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedPlan.title}</DialogTitle>
              <DialogDescription>Maintenance plan for {selectedPlan.systemName}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex-1">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">System</Label>
                    <p className="font-medium">{selectedPlan.systemName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Frequency</Label>
                    <p className="font-medium">{selectedPlan.frequency}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Scheduled Date</Label>
                    <p className="font-medium">{new Date(selectedPlan.nextScheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="pt-1">
                      <Badge variant={getStatusBadgeVariant(selectedPlan.status) as any}>
                        {formatStatus(selectedPlan.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Assigned To</Label>
                    <p className="font-medium">{selectedPlan.assignedTo}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="font-medium">{selectedPlan.description}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Maintenance Tasks</CardTitle>
                    <CardDescription>Tasks to be completed for this maintenance plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPlan.tasks.map((task: any, index: number) => (
                        <li key={task.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                          <div
                            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${task.completed ? "text-green-500" : "text-muted-foreground"}`}
                          >
                            {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className={`${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {index + 1}. {task.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      {selectedPlan.tasks.filter((t: any) => t.completed).length} of {selectedPlan.tasks.length} tasks
                      completed
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Maintenance History</CardTitle>
                    <CardDescription>Previous maintenance activities for this plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3 border-b pb-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Maintenance completed</p>
                          <p className="text-sm text-muted-foreground">March 15, 2025</p>
                          <p className="text-sm">All tasks completed successfully. No issues found.</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3 border-b pb-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Maintenance completed</p>
                          <p className="text-sm text-muted-foreground">December 10, 2024</p>
                          <p className="text-sm">Replaced fan belt and lubricated moving parts.</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Maintenance completed</p>
                          <p className="text-sm text-muted-foreground">September 5, 2024</p>
                          <p className="text-sm">
                            Routine inspection and cleaning. System operating at optimal efficiency.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button variant="outline" onClick={() => setIsViewPlanDialogOpen(false)}>
                Close
              </Button>
              <div className="flex space-x-2">
                {selectedPlan.status === "scheduled" && (
                  <Button variant="default">
                    <Wrench className="mr-2 h-4 w-4" />
                    Start Maintenance
                  </Button>
                )}
                {selectedPlan.status === "in_progress" && (
                  <Button variant="default">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Plan Dialog */}
      {selectedPlan && (
        <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Maintenance Plan</DialogTitle>
              <DialogDescription>Update the details of this maintenance plan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Plan Title</Label>
                  <Input id="edit-title" defaultValue={selectedPlan.title} />
                </div>
                <div>
                  <Label htmlFor="edit-system">Building System</Label>
                  <Select defaultValue={selectedPlan.systemId.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {systemsForSelection.map((system) => (
                        <SelectItem key={system.id} value={system.id.toString()}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select defaultValue={selectedPlan.frequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-scheduledDate">Scheduled Date</Label>
                  <Input
                    id="edit-scheduledDate"
                    type="date"
                    defaultValue={selectedPlan.nextScheduledDate.split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-assignedTo">Assigned To</Label>
                  <Select defaultValue={selectedPlan.assignedTo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" defaultValue={selectedPlan.description} />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Tasks</Label>
                  </div>
                  <div className="rounded-md border">
                    <ul className="divide-y">
                      {selectedPlan.tasks.map((task: any) => (
                        <li key={task.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <Checkbox id={`task-${task.id}`} defaultChecked={task.completed} className="mr-2" />
                            <Label htmlFor={`task-${task.id}`}>{task.description}</Label>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Input placeholder="Add new task..." />
                    <Button type="button" size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsEditPlanDialogOpen(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reassign Dialog */}
      {selectedPlan && (
        <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Reassign Maintenance Plan</DialogTitle>
              <DialogDescription>Change the staff assigned to this maintenance plan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-4">
                  <div className="font-medium">Current Plan: {selectedPlan.title}</div>
                  <div className="text-sm text-muted-foreground">For {selectedPlan.systemName}</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="reassign-current">Currently Assigned To</Label>
                    <Input id="reassign-current" value={selectedPlan.assignedTo} disabled />
                  </div>
                  <div>
                    <Label htmlFor="reassign-new">Reassign To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers
                          .filter((staff) => staff !== selectedPlan.assignedTo)
                          .map((staff) => (
                            <SelectItem key={staff} value={staff}>
                              {staff}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reassign-reason">Reason for Reassignment</Label>
                    <Textarea
                      id="reassign-reason"
                      placeholder="Provide a reason for reassigning this maintenance plan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notify">Notification</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="notify-old" defaultChecked />
                      <Label htmlFor="notify-old" className="text-sm">
                        Notify current assignee
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="notify-new" defaultChecked />
                      <Label htmlFor="notify-new" className="text-sm">
                        Notify new assignee
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsReassignDialogOpen(false)}>
                Reassign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog */}
      {selectedPlan && (
        <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Reschedule Maintenance Plan</DialogTitle>
              <DialogDescription>Change the scheduled date for this maintenance plan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-4">
                  <div className="font-medium">Current Plan: {selectedPlan.title}</div>
                  <div className="text-sm text-muted-foreground">For {selectedPlan.systemName}</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="current-date">Current Scheduled Date</Label>
                    <Input
                      id="current-date"
                      type="date"
                      value={selectedPlan.nextScheduledDate.split("T")[0]}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-date">New Scheduled Date</Label>
                    <Input id="new-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="reschedule-reason">Reason for Rescheduling</Label>
                    <Textarea
                      id="reschedule-reason"
                      placeholder="Provide a reason for rescheduling this maintenance plan"
                    />
                  </div>
                  <div>
                    <Label>Adjust Future Recurring Dates</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="adjust-future" />
                      <Label htmlFor="adjust-future" className="text-sm">
                        Also adjust all future recurring dates by the same time interval
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Label>Notifications</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="notify-assigned" defaultChecked />
                      <Label htmlFor="notify-assigned" className="text-sm">
                        Notify assigned staff
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="notify-manager" defaultChecked />
                      <Label htmlFor="notify-manager" className="text-sm">
                        Notify building manager
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsRescheduleDialogOpen(false)}>
                Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
