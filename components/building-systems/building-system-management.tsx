"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Wrench,
  ClipboardList,
  PenToolIcon as Tool,
  Calculator,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { BuildingSystemList } from "./building-system-list"
import { MaintenancePlanManagement } from "./maintenance-plan-management"
import { MaintenanceRequestManagement } from "./maintenance-request-management"
import { MaintenanceHistory } from "./maintenance-history"

export function BuildingSystemManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  // In a real application, these would be fetched from an API
  const totalSystems = 24
  const ongoingMaintenances = 5
  const pendingRequests = 8
  const systemsNeedingAttention = 3
  const completedMaintenancesThisMonth = 12
  const upcomingMaintenances = 7

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Building Systems Management</h1>
        <Button onClick={() => (window.location.href = "/dashboard/building-systems/list")}>View All Systems</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSummaryCard
          title="Total Systems"
          value={totalSystems.toString()}
          icon={<Tool className="h-5 w-5 text-blue-600" />}
          description="Across all buildings"
        />
        <DashboardSummaryCard
          title="Ongoing Maintenance"
          value={ongoingMaintenances.toString()}
          icon={<Wrench className="h-5 w-5 text-yellow-600" />}
          description="Currently in progress"
          trend={{ value: "+2", direction: "up", label: "from last week" }}
        />
        <DashboardSummaryCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={<ClipboardList className="h-5 w-5 text-purple-600" />}
          description="Awaiting approval"
          trend={{ value: "+3", direction: "up", label: "from last week" }}
        />
        <DashboardSummaryCard
          title="Systems Needing Attention"
          value={systemsNeedingAttention.toString()}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          description="Require immediate action"
          trend={{ value: "-1", direction: "down", label: "from last week" }}
        />
        <DashboardSummaryCard
          title="Completed This Month"
          value={completedMaintenancesThisMonth.toString()}
          icon={<Calculator className="h-5 w-5 text-green-600" />}
          description="Maintenance activities"
          trend={{ value: "+5", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Upcoming Maintenance"
          value={upcomingMaintenances.toString()}
          icon={<Building2 className="h-5 w-5 text-blue-600" />}
          description="Scheduled in next 30 days"
          trend={{ value: "+2", direction: "up", label: "from last month" }}
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="systems">Building Systems</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Plans</TabsTrigger>
          <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Building Systems Overview</CardTitle>
              <CardDescription>Manage all aspects of your building systems and maintenance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Quick Access</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("systems")}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <Tool className="h-4 w-4 mr-2 text-blue-600" />
                          Systems Registry
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">Manage all building systems</CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("maintenance")}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <Wrench className="h-4 w-4 mr-2 text-yellow-600" />
                          Maintenance Plans
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">Create and manage maintenance schedules</CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("requests")}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-purple-600" />
                          Maintenance Requests
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">Review and manage tenant requests</CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("history")}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-green-600" />
                          Maintenance History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">View completed maintenance activities</CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Systems Requiring Attention</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b p-3 font-medium">
                      <div>System</div>
                      <div>Location</div>
                      <div>Issue</div>
                      <div>Priority</div>
                      <div>Scheduled</div>
                    </div>
                    <div className="grid grid-cols-5 border-b p-3">
                      <div className="font-medium">HVAC Unit #3</div>
                      <div>Block A, Floor 10</div>
                      <div>Temperature fluctuations</div>
                      <div>
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">High</span>
                      </div>
                      <div>Tomorrow, 10:00 AM</div>
                    </div>
                    <div className="grid grid-cols-5 border-b p-3">
                      <div className="font-medium">Elevator #2</div>
                      <div>Block B, All floors</div>
                      <div>Unusual noise during operation</div>
                      <div>
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                          Medium
                        </span>
                      </div>
                      <div>May 10, 2025</div>
                    </div>
                    <div className="grid grid-cols-5 p-3">
                      <div className="font-medium">Fire Alarm System</div>
                      <div>Block C, Floor 2</div>
                      <div>Sensor calibration needed</div>
                      <div>
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">High</span>
                      </div>
                      <div>May 9, 2025</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upcoming Maintenance Activities</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b p-3 font-medium">
                      <div>System</div>
                      <div>Location</div>
                      <div>Maintenance Type</div>
                      <div>Assigned To</div>
                      <div>Date</div>
                    </div>
                    <div className="grid grid-cols-5 border-b p-3">
                      <div className="font-medium">Electrical Panel</div>
                      <div>Block A, Basement</div>
                      <div>Routine inspection</div>
                      <div>Nguyễn Văn A</div>
                      <div>May 12, 2025</div>
                    </div>
                    <div className="grid grid-cols-5 border-b p-3">
                      <div className="font-medium">Water Pump</div>
                      <div>Block B, Basement</div>
                      <div>Filter replacement</div>
                      <div>Trần Văn B</div>
                      <div>May 15, 2025</div>
                    </div>
                    <div className="grid grid-cols-5 p-3">
                      <div className="font-medium">CCTV System</div>
                      <div>All Buildings</div>
                      <div>Software update</div>
                      <div>Lê Thị C</div>
                      <div>May 18, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems">
          <BuildingSystemList />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenancePlanManagement />
        </TabsContent>

        <TabsContent value="requests">
          <MaintenanceRequestManagement />
        </TabsContent>

        <TabsContent value="history">
          <MaintenanceHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
