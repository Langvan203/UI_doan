"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceAssignment } from "./service-assignment"
import { ServiceApproval } from "./service-aproval"
import { ServiceUsageStatistics } from "./service-usage"
import { UserCheck, CheckCircle, BarChart3 } from "lucide-react"

export function ServiceOperationsMain() {
  const [activeTab, setActiveTab] = useState("assignment")

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">142</div>
            <p className="text-xs text-blue-600">Services assigned to residents</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">8</div>
            <p className="text-xs text-yellow-600">Requests awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">₫24.5M</div>
            <p className="text-xs text-green-600">Total service revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Assignment</span>
            <span className="sm:hidden">Assign</span>
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Approval</span>
            <span className="sm:hidden">Approve</span>
            <Badge variant="secondary" className="ml-1">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Usage</span>
            <span className="sm:hidden">Usage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Assignment</CardTitle>
              <CardDescription>Assign services to residents and manage service allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceAssignment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Approval</CardTitle>
              <CardDescription>Review and approve service requests from residents</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceApproval />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Usage</CardTitle>
              <CardDescription>Monitor service usage and generate usage reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceUsageStatistics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
