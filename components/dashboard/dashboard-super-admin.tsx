"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Home, Users, BarChart3, DollarSign, Percent } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { OccupancyRateChart } from "@/components/dashboard/occupancy-rate-chart"
import { RevenueBreakdownChart } from "@/components/dashboard/revenue-breakdown-chart"

export function DashboardSuperAdmin() {
  // In a real app, you would fetch this data from an API
  const buildings = 4
  const premises = 120
  const occupiedPremises = 98
  const occupancyRate = 81.7
  const residents = 245
  const monthlyRevenue = 450000000
  const hasData = true

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSummaryCard
          title="Total Buildings"
          value={buildings.toString()}
          icon={<Building className="h-5 w-5 text-blue-600" />}
          description="Across all locations"
          trend={{ value: "+1", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Premises"
          value={premises.toString()}
          icon={<Home className="h-5 w-5 text-green-600" />}
          description={`${occupiedPremises} occupied (${occupancyRate}%)`}
          trend={{ value: "+3", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Residents"
          value={residents.toString()}
          icon={<Users className="h-5 w-5 text-purple-600" />}
          description="Registered in the system"
          trend={{ value: "+12", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Monthly Revenue"
          value={new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(monthlyRevenue)}
          icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
          description="For the current month"
          trend={{ value: "+5.2%", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={<Percent className="h-5 w-5 text-red-600" />}
          description="Across all buildings"
          trend={{ value: "+2.3%", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Services"
          value="24"
          icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
          description="Active services available"
          trend={{ value: "+2", direction: "up", label: "from last month" }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {hasData ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue across all buildings</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <DashboardChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Occupancy Rate</CardTitle>
                  <CardDescription>Current occupancy by building</CardDescription>
                </CardHeader>
                <CardContent>
                  <OccupancyRateChart />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueBreakdownChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 text-sm">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <div>
                        <p className="font-medium">New tenant registered</p>
                        <p className="text-muted-foreground">Nguyễn Văn A registered at Building 1</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 text-sm">
                      <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium">Invoice paid</p>
                        <p className="text-muted-foreground">Invoice #1234 paid by Trần Văn B</p>
                        <p className="text-xs text-muted-foreground">3 hours ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 text-sm">
                      <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                      <div>
                        <p className="font-medium">New service added</p>
                        <p className="text-muted-foreground">Gym service added to Building 2</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <DashboardEmptyState />
          )}
        </TabsContent>
        <TabsContent value="buildings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buildings Overview</CardTitle>
              <CardDescription>Performance metrics for all buildings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Buildings content would go here */}
              <p>Buildings data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Revenue and expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Finances content would go here */}
              <p>Financial data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Overview</CardTitle>
              <CardDescription>Usage and revenue by service type</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Services content would go here */}
              <p>Services data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
