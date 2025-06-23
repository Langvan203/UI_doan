"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ThumbsUp,
  UserCog,
  X,
} from "lucide-react"

// Mock data for maintenance requests
const maintenanceRequestsData = [
  {
    id: 1,
    title: "Bathroom Faucet Leaking",
    description: "The bathroom faucet in my apartment has been leaking continuously for the past two days.",
    location: "Block A, Floor 5, Unit 502",
    category: "Plumbing",
    priority: "medium",
    status: "pending_approval",
    submittedBy: "Nguyễn Văn A",
    submittedDate: "2025-05-05T10:30:00",
    assignedTo: null,
    attachments: ["faucet_leak.jpg"],
    notes: [],
  },
  {
    id: 2,
    title: "Air Conditioner Not Cooling",
    description: "The air conditioner in the living room is running but not cooling the room. It's blowing warm air.",
    location: "Block B, Floor 3, Unit 305",
    category: "HVAC",
    priority: "high",
    status: "approved",
    submittedBy: "Trần Thị B",
    submittedDate: "2025-05-04T14:15:00",
    assignedTo: "HVAC Team",
    assignedDate: "2025-05-05T09:00:00",
    scheduledDate: "2025-05-07T10:00:00",
    attachments: [],
    notes: [
      {
        id: 1,
        text: "Scheduled technician visit for May 7th, 10:00 AM",
        addedBy: "Service Manager",
        addedDate: "2025-05-05T09:15:00",
      },
    ],
  },
  {
    id: 3,
    title: "Ceiling Light Flickering",
    description: "The ceiling light in the kitchen is flickering constantly and making buzzing noises.",
    location: "Block A, Floor 2, Unit 201",
    category: "Electrical",
    priority: "medium",
    status: "in_progress",
    submittedBy: "Lê Văn C",
    submittedDate: "2025-05-03T16:45:00",
    assignedTo: "Electrical Team",
    assignedDate: "2025-05-04T08:30:00",
    scheduledDate: "2025-05-06T14:00:00",
    attachments: ["light_issue.jpg"],
    notes: [
      {
        id: 2,
        text: "Initial inspection shows it may need full replacement of the fixture",
        addedBy: "Electrician",
        addedDate: "2025-05-06T14:30:00",
      },
    ],
  },
  {
    id: 4,
    title: "Door Lock Broken",
    description: "The front door lock is difficult to turn and sometimes gets stuck completely.",
    location: "Block C, Floor 4, Unit 405",
    category: "Locks & Keys",
    priority: "high",
    status: "completed",
    submittedBy: "Phạm Thị D",
    submittedDate: "2025-05-01T09:20:00",
    assignedTo: "Maintenance Team",
    assignedDate: "2025-05-01T10:00:00",
    scheduledDate: "2025-05-02T11:00:00",
    completedDate: "2025-05-02T11:45:00",
    attachments: ["door_lock.jpg"],
    notes: [
      {
        id: 3,
        text: "Lock cylinder was worn out. Replaced with new deadbolt lock.",
        addedBy: "Maintenance Staff",
        addedDate: "2025-05-02T11:50:00",
      },
    ],
  },
  {
    id: 5,
    title: "Water Heater Not Working",
    description: "No hot water in the entire apartment. The water heater appears to be off.",
    location: "Block B, Floor 6, Unit 602",
    category: "Plumbing",
    priority: "high",
    status: "in_progress",
    submittedBy: "Hoàng Văn E",
    submittedDate: "2025-05-04T18:30:00",
    assignedTo: "Plumbing Team",
    assignedDate: "2025-05-05T08:15:00",
    scheduledDate: "2025-05-06T09:00:00",
    attachments: ["water_heater.jpg"],
    notes: [
      {
        id: 4,
        text: "Initial inspection shows electrical issue with the heater element. Ordered replacement part.",
        addedBy: "Plumber",
        addedDate: "2025-05-06T09:45:00",
      },
    ],
  },
  {
    id: 6,
    title: "Elevator Button Stuck",
    description: "The button for floor 7 in elevator #1 is stuck and doesn't work properly.",
    location: "Block A, Elevator #1",
    category: "Elevator",
    priority: "medium",
    status: "approved",
    submittedBy: "Building Manager",
    submittedDate: "2025-05-05T07:45:00",
    assignedTo: "OTIS Service Technician",
    assignedDate: "2025-05-05T09:30:00",
    scheduledDate: "2025-05-08T10:00:00",
    attachments: [],
    notes: [],
  },
  {
    id: 7,
    title: "Window Seal Broken",
    description: "The window in the bedroom has a broken seal allowing water to leak in during rain.",
    location: "Block C, Floor 8, Unit 805",
    category: "Windows & Doors",
    priority: "medium",
    status: "pending_approval",
    submittedBy: "Vũ Thị G",
    submittedDate: "2025-05-05T15:20:00",
    assignedTo: null,
    attachments: ["window_leak.jpg"],
    notes: [],
  },
  {
    id: 8,
    title: "Common Area Light Out",
    description: "The light in the 3rd floor hallway near Unit 302 is completely out.",
    location: "Block B, Floor 3, Hallway",
    category: "Electrical",
    priority: "low",
    status: "completed",
    submittedBy: "Building Manager",
    submittedDate: "2025-05-02T11:10:00",
    assignedTo: "Maintenance Team",
    assignedDate: "2025-05-02T13:00:00",
    scheduledDate: "2025-05-03T10:00:00",
    completedDate: "2025-05-03T10:25:00",
    attachments: [],
    notes: [
      {
        id: 5,
        text: "Replaced bulb with LED equivalent for better efficiency",
        addedBy: "Maintenance Staff",
        addedDate: "2025-05-03T10:30:00",
      },
    ],
  },
]

// Maintenance request categories
const requestCategories = [
  "All Categories",
  "HVAC",
  "Electrical",
  "Plumbing",
  "Locks & Keys",
  "Windows & Doors",
  "Appliances",
  "Elevator",
  "Common Areas",
  "Structural",
  "Others",
]

// Priority options
const priorityOptions = ["All Priorities", "low", "medium", "high", "emergency"]

// Status options
const statusOptions = [
  "All Statuses",
  "pending_approval",
  "approved",
  "in_progress",
  "on_hold",
  "completed",
  "rejected",
]

// Staff for assignment
const staffMembers = [
  "Maintenance Team",
  "Plumbing Team",
  "Electrical Team",
  "HVAC Team",
  "Cleaning Team",
  "OTIS Service Technician",
  "Nguyễn Văn X",
  "Trần Văn Y",
  "Lê Thị Z",
]

export function MaintenanceRequestManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedPriority, setSelectedPriority] = useState("All Priorities")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false)
  const [isViewRequestOpen, setIsViewRequestOpen] = useState(false)
  const [isAssignRequestOpen, setIsAssignRequestOpen] = useState(false)
  const [isUpdateRequestOpen, setIsUpdateRequestOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [newNote, setNewNote] = useState("")

  // Handler functions for request actions
  const handleApproveRequest = (requestId: number) => {
    // In a real application, this would call an API to update the request status
    alert(`Request #${requestId} approved successfully`)
  }

  const handleRejectRequest = (requestId: number) => {
    // In a real application, this would call an API to update the request status
    alert(`Request #${requestId} rejected`)
  }

  const handleCompleteRequest = (requestId: number) => {
    // In a real application, this would call an API to update the request status
    alert(`Request #${requestId} marked as completed`)
  }

  // Filter requests based on search, filters, and active tab
  const filteredRequests = maintenanceRequestsData.filter((request) => {
    // Filter by tab
    if (activeTab === "pending" && !["pending_approval"].includes(request.status)) return false
    if (activeTab === "approved" && !["approved"].includes(request.status)) return false
    if (activeTab === "inProgress" && !["in_progress"].includes(request.status)) return false
    if (activeTab === "completed" && !["completed", "rejected"].includes(request.status)) return false

    // Filter by search
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.submittedBy && request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.assignedTo && request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by category, priority, and status
    const matchesCategory = selectedCategory === "All Categories" || request.category === selectedCategory
    const matchesPriority = selectedPriority === "All Priorities" || request.priority === selectedPriority
    const matchesStatus = selectedStatus === "All Statuses" || request.status === selectedStatus

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  // Function to get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "default"
      case "emergency":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending_approval":
        return "outline"
      case "approved":
        return "secondary"
      case "in_progress":
        return "default"
      case "on_hold":
        return "warning"
      case "completed":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Function to format status or priority for display
  const formatText = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Calculate counts for tabs
  const pendingCount = maintenanceRequestsData.filter((req) => req.status === "pending_approval").length
  const approvedCount = maintenanceRequestsData.filter((req) => req.status === "approved").length
  const inProgressCount = maintenanceRequestsData.filter((req) => req.status === "in_progress").length
  const completedCount = maintenanceRequestsData.filter(
    (req) => req.status === "completed" || req.status === "rejected",
  ).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yêu cầu sửa chữa</h1>
        <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Tạo yêu cầu sửa chữa
                <span className="text-sm text-muted-foreground ml-2">Thông tin yêu cầu</span>
              </DialogTitle>
              <DialogDescription>
                Vui lòng điền đầy đủ thông tin để gửi yêu cầu sửa chữa. Các trường bắt buộc được đánh dấu sao (*).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">
                    Tiêu đề yêu cầu <span className="text-red-500">*</span>
                  </Label>
                  <Input id="title" placeholder="Brief description of the issue" />
                </div>
                <div>
                  <Label htmlFor="category">
                    Danh mục yêu cầu <span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">
                    Mức độ ưu tiên <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Thấp
                      </SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="emergency">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="location">Vị trí</Label>
                  <Input id="location" placeholder="Building, floor, unit, or specific area" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about the issue..."
                    rows={4}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="attachment">
                    Tệp đính kèm (nếu có)
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input id="attachment" type="file" className="flex-1" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bạn có thể đính kèm hình ảnh hoặc tài liệu liên quan đến yêu cầu sửa chữa.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateRequestOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                Gửi yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Quản lý yêu cầu sửa chữa
          </CardTitle>
          <CardDescription>
            Quản lý tất cả yêu cầu sửa chữa từ cư dân, bao gồm duyệt, phân công, cập nhật trạng thái và ghi chú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
              <TabsTrigger value="pending">
                Đang chờ duyệt{" "}
                <Badge variant="outline" className="ml-1">
                  {pendingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Đã duyệt{" "}
                <Badge variant="outline" className="ml-1">
                  {approvedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inProgress">
                Đang xử lý{" "}
                <Badge variant="outline" className="ml-1">
                  {inProgressCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority === "All Priorities" ? priority : formatText(priority)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All Statuses" ? status : formatText(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Người yêu cầu</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Không có yêu cầu nào phù hợp với tiêu chí tìm kiếm của bạn.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{request.submittedBy}</TableCell>
                        <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(request.priority) as any}>
                            {formatText(request.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(request.status) as any}>
                            {formatText(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Hành động</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setIsViewRequestOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {request.status === "pending_approval" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    Duyệt yêu cầu
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Từ chối yêu cầu
                                  </DropdownMenuItem>
                                </>
                              )}
                              {request.status === "approved" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsAssignRequestOpen(true)
                                  }}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Giao cho nhân viên
                                </DropdownMenuItem>
                              )}
                              {request.status === "in_progress" && (
                                <DropdownMenuItem onClick={() => handleCompleteRequest(request.id)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Đánh dấu hoàn thành
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setIsUpdateRequestOpen(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Cập nhật yêu cầu
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
          </Tabs>
        </CardContent>
      </Card>

      {/* View Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isViewRequestOpen} onOpenChange={setIsViewRequestOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedRequest.title}</DialogTitle>
              <DialogDescription>
                Chi tiết yêu cầu sửa chữa từ {selectedRequest.submittedBy} vào{" "}
                {new Date(selectedRequest.submittedDate).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Hệ thống</Label>
                  <p className="font-medium">{selectedRequest.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vị trí</Label>
                  <p className="font-medium">{selectedRequest.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Người yêu cầu</Label>
                  <p className="font-medium">{selectedRequest.submittedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày yêu cầu</Label>
                  <p className="font-medium">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mức độ</Label>
                  <div className="pt-1">
                    <Badge variant={getPriorityBadgeVariant(selectedRequest.priority) as any}>
                      {formatText(selectedRequest.priority)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="pt-1">
                    <Badge variant={getStatusBadgeVariant(selectedRequest.status) as any}>
                      {formatText(selectedRequest.status)}
                    </Badge>
                  </div>
                </div>

                {selectedRequest.assignedTo && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Giao cho nhân viên</Label>
                      <p className="font-medium">{selectedRequest.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Ngày sửa</Label>
                      <p className="font-medium">
                        {selectedRequest.scheduledDate
                          ? new Date(selectedRequest.scheduledDate).toLocaleString()
                          : "Not scheduled yet"}
                      </p>
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <Label className="text-muted-foreground">
                    Mô tả yêu cầu
                  </Label>
                  <p className="mt-1 whitespace-pre-line">{selectedRequest.description}</p>
                </div>

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">
                      Tệp đính kèm
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedRequest.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="relative rounded-md border p-2 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-muted-foreground mb-2 block">
                    Ghi chú
                  </Label>
                  {selectedRequest.notes && selectedRequest.notes.length > 0 ? (
                    <div className="space-y-3 rounded-md border p-3">
                      {selectedRequest.notes.map((note: any) => (
                        <div key={note.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span>{note.addedBy}</span>
                            <span className="text-muted-foreground">{new Date(note.addedDate).toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-sm">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có ghi chú nào</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="newNote">Thêm ghi chú</Label>
                  <Textarea
                    id="newNote"
                    placeholder="Add a note about this maintenance request..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsViewRequestOpen(false)}>
                Đóng
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => setNewNote("")} disabled={!newNote.trim()}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Thêm ghi chú
                </Button>
                {selectedRequest.status === "pending_approval" && (
                  <Button>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Duyệt yêu cầu
                  </Button>
                )}
                {selectedRequest.status === "in_progress" && (
                  <Button>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Technician Dialog */}
      {selectedRequest && (
        <Dialog open={isAssignRequestOpen} onOpenChange={setIsAssignRequestOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Giao việc cho kỹ thuật viên
              </DialogTitle>
              <DialogDescription>
                Chọn kỹ thuật viên và lên lịch sửa chữa cho yêu cầu bảo trì này.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-base font-medium">Yêu cầu {selectedRequest.title}</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="assignedTo">Giao việc đến</Label>
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
                  <Label htmlFor="scheduledDate">Lịch sửa chữa</Label>
                  <Input id="scheduledDate" type="datetime-local" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="assignmentNote">Ghi chú</Label>
                  <Textarea id="assignmentNote" placeholder="Add any specific instructions for the technician..." />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignRequestOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={() => setIsAssignRequestOpen(false)}>
                <UserCog className="mr-2 h-4 w-4" />
                Giao yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Request Dialog */}
      {selectedRequest && (
        <Dialog open={isUpdateRequestOpen} onOpenChange={setIsUpdateRequestOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cập nhật yêu cầu</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin yêu cầu bảo trì để phản ánh tình trạng hiện tại và các thay đổi cần thiết.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="update-title">Tiêu đề yêu cầu</Label>
                  <Input id="update-title" defaultValue={selectedRequest.title} />
                </div>
                <div>
                  <Label htmlFor="update-category">Danh mục</Label>
                  <Select defaultValue={selectedRequest.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {requestCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="update-priority">Mức độ</Label>
                  <Select defaultValue={selectedRequest.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Thấp
                      </SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="emergency">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="update-location">
                    vị trí
                  </Label>
                  <Input id="update-location" defaultValue={selectedRequest.location} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="update-description">
                    Chi tiết mô tả
                  </Label>
                  <Textarea id="update-description" defaultValue={selectedRequest.description} rows={4} />
                </div>
                {selectedRequest.status !== "pending_approval" && (
                  <div className="col-span-2">
                    <Label htmlFor="update-status">Trạng thái</Label>
                    <Select defaultValue={selectedRequest.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_approval">Đang chờ duyệt</SelectItem>
                        <SelectItem value="approved">Duyệt</SelectItem>
                        <SelectItem value="in_progress">Đang xử lý</SelectItem>
                        <SelectItem value="on_hold">Chờ xác nhận</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateRequestOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={() => setIsUpdateRequestOpen(false)}>
                Cập nhật yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
