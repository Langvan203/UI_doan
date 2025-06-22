"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, ListPlus, Users, CheckSquare, ClipboardCheck, Gauge, Calculator } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ServiceTypeList } from "./service-type-list"
import { ServiceList } from "./service-list"
import { ServiceAssignment } from "./service-assignment"
import { ServiceApproval } from "./service-aproval"
import { ServiceUsageStatistics } from "./service-usage"
import { ServiceRateManagement } from "./service-rate-management"
import { MeterManagement } from "./meter-management"

export function ServiceManagement() {
  const [activeTab, setActiveTab] = useState("service-types")
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">Comprehensive service management system for building operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 min-w-[600px]">
            <TabsTrigger value="service-types" className="flex items-center gap-2 text-xs md:text-sm">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Service Types</span>
              <span className="sm:hidden">Types</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 text-xs md:text-sm">
              <ListPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
              <span className="sm:hidden">Services</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center gap-2 text-xs md:text-sm">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Rates</span>
              <span className="sm:hidden">Rates</span>
            </TabsTrigger>
            <TabsTrigger value="meters" className="flex items-center gap-2 text-xs md:text-sm">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Meters</span>
              <span className="sm:hidden">Meters</span>
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2 text-xs md:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Assignment</span>
              <span className="sm:hidden">Assign</span>
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2 text-xs md:text-sm">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Approval</span>
              <span className="sm:hidden">Approve</span>
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2 text-xs md:text-sm">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Usage</span>
              <span className="sm:hidden">Usage</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="service-types" className="mt-6">
          <ServiceTypeList />
        </TabsContent>
        <TabsContent value="services" className="mt-6">
          <ServiceList />
        </TabsContent>
        <TabsContent value="rates" className="mt-6">
          <ServiceRateManagement />
        </TabsContent>
        <TabsContent value="meters" className="mt-6">
          <MeterManagement />
        </TabsContent>
        <TabsContent value="assignment" className="mt-6">
          <ServiceAssignment />
        </TabsContent>
        <TabsContent value="approval" className="mt-6">
          <ServiceApproval />
        </TabsContent>
        <TabsContent value="usage" className="mt-6">
          <ServiceUsageStatistics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
