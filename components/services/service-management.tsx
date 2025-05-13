"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, ListPlus, Users, CheckSquare, ClipboardCheck, Gauge, Calculator } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ServiceTypeList } from "@/components/services/service-type-list"
import { ServiceList } from "@/components/services/service-list"
import { ServiceAssignment } from "@/components/services/service-assignment"
import { ServiceApproval } from "@/components/services/service-approval"
import { ServiceUsage } from "@/components/services/service-usage"
import { ServiceRateManagement } from "@/components/services/service-rate-management"
import { MeterManagement } from "@/components/services/meter-management"

export function ServiceManagement() {
  const [activeTab, setActiveTab] = useState("service-types")
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
        <TabsTrigger value="service-types" className="flex items-center gap-2">
          {isMobile ? (
            <ListChecks className="h-4 w-4" />
          ) : (
            <>
              <ListChecks className="h-4 w-4" />
              <span>Service Types</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="services" className="flex items-center gap-2">
          {isMobile ? (
            <ListPlus className="h-4 w-4" />
          ) : (
            <>
              <ListPlus className="h-4 w-4" />
              <span>Services</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="rates" className="flex items-center gap-2">
          {isMobile ? (
            <Calculator className="h-4 w-4" />
          ) : (
            <>
              <Calculator className="h-4 w-4" />
              <span>Rates</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="meters" className="flex items-center gap-2">
          {isMobile ? (
            <Gauge className="h-4 w-4" />
          ) : (
            <>
              <Gauge className="h-4 w-4" />
              <span>Meters</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="assignment" className="flex items-center gap-2">
          {isMobile ? (
            <Users className="h-4 w-4" />
          ) : (
            <>
              <Users className="h-4 w-4" />
              <span>Assignment</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="approval" className="flex items-center gap-2">
          {isMobile ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <>
              <CheckSquare className="h-4 w-4" />
              <span>Approval</span>
            </>
          )}
        </TabsTrigger>
        <TabsTrigger value="usage" className="flex items-center gap-2">
          {isMobile ? (
            <ClipboardCheck className="h-4 w-4" />
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4" />
              <span>Usage</span>
            </>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="service-types" className="mt-4">
        <ServiceTypeList />
      </TabsContent>
      <TabsContent value="services" className="mt-4">
        <ServiceList />
      </TabsContent>
      <TabsContent value="rates" className="mt-4">
        <ServiceRateManagement />
      </TabsContent>
      <TabsContent value="meters" className="mt-4">
        <MeterManagement />
      </TabsContent>
      <TabsContent value="assignment" className="mt-4">
        <ServiceAssignment />
      </TabsContent>
      <TabsContent value="approval" className="mt-4">
        <ServiceApproval />
      </TabsContent>
      <TabsContent value="usage" className="mt-4">
        <ServiceUsage />
      </TabsContent>
    </Tabs>
  )
}
