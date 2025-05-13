"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffList } from "@/components/staff/staff-list"
import { StaffDetail } from "@/components/staff/staff-detail"
import { StaffStats } from "@/components/staff/staff-stats"
import { StaffRoles } from "@/components/staff/staff-roles"
import { StaffBuildingAssignment } from "@/components/staff/staff-building-assignment"

// Mock data for staff members
export const staffData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    position: "Building Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-01-15",
    departments: [1, 3],
    buildings: [1],
    roles: ["BUILDING_MANAGER", "MAINTENANCE_MANAGER"],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    position: "Financial Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-02-20",
    departments: [2],
    buildings: [1, 2],
    roles: ["FINANCIAL_MANAGER"],
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0923456789",
    position: "Service Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-03-10",
    departments: [3, 4],
    buildings: [2],
    roles: ["SERVICE_MANAGER"],
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0934567890",
    position: "Customer Service",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-04-05",
    departments: [4],
    buildings: [1, 2],
    roles: ["CUSTOMER_SERVICE"],
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0945678901",
    position: "Maintenance Staff",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    joinDate: "2022-05-15",
    departments: [3],
    buildings: [1],
    roles: ["MAINTENANCE_STAFF"],
  },
  {
    id: 6,
    name: "Vũ Thị F",
    email: "vuthif@example.com",
    phone: "0956789012",
    position: "Security Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-06-20",
    departments: [5],
    buildings: [1, 2],
    roles: ["SECURITY_MANAGER"],
  },
  {
    id: 7,
    name: "Đặng Văn G",
    email: "dangvang@example.com",
    phone: "0967890123",
    position: "Security Staff",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-07-10",
    departments: [5],
    buildings: [2],
    roles: ["SECURITY_STAFF"],
  },
  {
    id: 8,
    name: "Bùi Thị H",
    email: "buithih@example.com",
    phone: "0978901234",
    position: "Cleaning Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinDate: "2022-08-05",
    departments: [6],
    buildings: [1],
    roles: ["CLEANING_MANAGER"],
  },
]

// Mock data for departments
export const departmentsData = [
  {
    id: 1,
    name: "Building Management",
    description: "Responsible for overall building operations and management",
    color: "#2563eb",
    icon: "Building2",
    staffCount: 2,
    createdAt: "2022-01-01",
  },
  {
    id: 2,
    name: "Finance",
    description: "Handles financial operations, invoicing, and payments",
    color: "#f97316",
    icon: "DollarSign",
    staffCount: 3,
    createdAt: "2022-01-01",
  },
  {
    id: 3,
    name: "Maintenance",
    description: "Responsible for building maintenance and repairs",
    color: "#059669",
    icon: "Wrench",
    staffCount: 5,
    createdAt: "2022-01-01",
  },
  {
    id: 4,
    name: "Customer Service",
    description: "Handles resident inquiries and support",
    color: "#7c3aed",
    icon: "HeadphonesIcon",
    staffCount: 4,
    createdAt: "2022-01-01",
  },
  {
    id: 5,
    name: "Security",
    description: "Manages building security and access control",
    color: "#dc2626",
    icon: "ShieldCheck",
    staffCount: 6,
    createdAt: "2022-01-01",
  },
  {
    id: 6,
    name: "Cleaning",
    description: "Responsible for building cleanliness and sanitation",
    color: "#0ea5e9",
    icon: "Sparkles",
    staffCount: 8,
    createdAt: "2022-01-01",
  },
]

// Mock data for buildings
export const buildingsData = [
  {
    id: 1,
    name: "Happy Residence",
    address: "123 Main Street, District 1",
  },
  {
    id: 2,
    name: "Sunshine Apartments",
    address: "456 Park Avenue, District 2",
  },
]

// Mock data for roles
export const rolesData = [
  {
    id: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Full access to all system features",
    permissions: ["all"],
  },
  {
    id: "BUILDING_MANAGER",
    name: "Building Manager",
    description: "Manages building operations",
    permissions: ["building:read", "building:write", "staff:read", "resident:read", "resident:write"],
  },
  {
    id: "FINANCIAL_MANAGER",
    name: "Financial Manager",
    description: "Manages financial operations",
    permissions: ["invoice:read", "invoice:write", "payment:read", "payment:write"],
  },
  {
    id: "SERVICE_MANAGER",
    name: "Service Manager",
    description: "Manages building services",
    permissions: ["service:read", "service:write", "maintenance:read", "maintenance:write"],
  },
  {
    id: "CUSTOMER_SERVICE",
    name: "Customer Service",
    description: "Handles resident support",
    permissions: ["resident:read", "ticket:read", "ticket:write", "announcement:read", "announcement:write"],
  },
  {
    id: "MAINTENANCE_MANAGER",
    name: "Maintenance Manager",
    description: "Manages maintenance operations",
    permissions: ["maintenance:read", "maintenance:write", "staff:read"],
  },
  {
    id: "MAINTENANCE_STAFF",
    name: "Maintenance Staff",
    description: "Performs maintenance tasks",
    permissions: ["maintenance:read"],
  },
  {
    id: "SECURITY_MANAGER",
    name: "Security Manager",
    description: "Manages security operations",
    permissions: ["security:read", "security:write", "staff:read"],
  },
  {
    id: "SECURITY_STAFF",
    name: "Security Staff",
    description: "Performs security tasks",
    permissions: ["security:read"],
  },
  {
    id: "CLEANING_MANAGER",
    name: "Cleaning Manager",
    description: "Manages cleaning operations",
    permissions: ["cleaning:read", "cleaning:write", "staff:read"],
  },
]

export function StaffManagement() {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const selectedStaff = selectedStaffId ? staffData.find((staff) => staff.id === selectedStaffId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Management</h1>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="buildings">Building Assignment</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-7">
            <div className="md:col-span-3">
              <StaffList
                staffData={staffData}
                departmentsData={departmentsData}
                selectedStaffId={selectedStaffId}
                onSelectStaff={setSelectedStaffId}
              />
            </div>
            <div className="md:col-span-4">
              {selectedStaff ? (
                <StaffDetail
                  staff={selectedStaff}
                  departmentsData={departmentsData}
                  buildingsData={buildingsData}
                  rolesData={rolesData}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Details</CardTitle>
                    <CardDescription>Select a staff member to view details</CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">No staff member selected</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <StaffRoles rolesData={rolesData} staffData={staffData} />
        </TabsContent>

        <TabsContent value="buildings">
          <StaffBuildingAssignment staffData={staffData} buildingsData={buildingsData} />
        </TabsContent>

        <TabsContent value="stats">
          <StaffStats staffData={staffData} departmentsData={departmentsData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
