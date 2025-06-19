"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceTypeList } from "./service-type-list"
import { ServiceList } from "./service-list"
import { ServiceRateManagement } from "./service-rate-management"
import { MeterManagement } from "./meter-management"
import { Tags, Bell, DollarSign, Gauge } from "lucide-react"

export function ServiceManagementMain() {
  const [activeTab, setActiveTab] = useState("types")

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loại dịch vụ</CardTitle>
            <Tags className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">8</div>
            <p className="text-xs text-blue-600">Danh mục hoạt động</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">24</div>
            <p className="text-xs text-green-600">Available services</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Plans</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">12</div>
            <p className="text-xs text-orange-600">Pricing tiers</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meters</CardTitle>
            <Gauge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">156</div>
            <p className="text-xs text-purple-600">Installed meters</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Service Types</span>
            <span className="sm:hidden">Types</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
            <span className="sm:hidden">Services</span>
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Rates</span>
            <span className="sm:hidden">Rates</span>
          </TabsTrigger>
          <TabsTrigger value="meters" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Meters</span>
            <span className="sm:hidden">Meters</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Types</CardTitle>
              <CardDescription>Manage different categories of services available in your building</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceTypeList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Configure and manage individual services offered to residents</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Rates</CardTitle>
              <CardDescription>Set up pricing and billing rates for different services</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceRateManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Meters</CardTitle>
              <CardDescription>Manage utility meters for electricity, water and other metered services</CardDescription>
            </CardHeader>
            <CardContent>
              <MeterManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
