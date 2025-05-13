"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BarChart3, Droplets, Gauge, Zap } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardServiceManager() {
  // In a real app, you would fetch this data from an API
  const totalServices = 24
  const activeMeters = 240
  const pendingReadings = 18
  const monthlyRevenue = 120000000

  // Sample data for charts
  const electricityData = [
    { month: "Jan", usage: 12500 },
    { month: "Feb", usage: 13200 },
    { month: "Mar", usage: 12800 },
    { month: "Apr", usage: 13500 },
    { month: "May", usage: 14200 },
    { month: "Jun", usage: 15000 },
  ]

  const waterData = [
    { month: "Jan", usage: 850 },
    { month: "Feb", usage: 920 },
    { month: "Mar", usage: 880 },
    { month: "Apr", usage: 950 },
    { month: "May", usage: 1020 },
    { month: "Jun", usage: 1100 },
  ]

  const serviceUsageData = [
    { name: "Electricity", usage: 14200 },
    { name: "Water", usage: 1020 },
    { name: "Internet", usage: 450 },
    { name: "Parking", usage: 320 },
    { name: "Gym", usage: 180 },
    { name: "Pool", usage: 120 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Total Services"
          value={totalServices.toString()}
          icon={<Activity className="h-5 w-5 text-[#059669]" />}
          description="Available services"
          trend={{ value: "+2", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Active Meters"
          value={activeMeters.toString()}
          icon={<Gauge className="h-5 w-5 text-[#059669]" />}
          description="Electricity and water meters"
          trend={{ value: "+5", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Pending Readings"
          value={pendingReadings.toString()}
          icon={<BarChart3 className="h-5 w-5 text-[#059669]" />}
          description="Meters to be read this week"
          trend={{ value: "-3", direction: "down", label: "from last week" }}
        />
        <DashboardSummaryCard
          title="Monthly Revenue"
          value={new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(monthlyRevenue)}
          icon={<Activity className="h-5 w-5 text-[#059669]" />}
          description="From all services"
          trend={{ value: "+8.5%", direction: "up", label: "from last month" }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="other">Other Services</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Service Usage Overview</CardTitle>
                <CardDescription>Monthly usage across all services</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceUsageData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Pending Meter Readings</CardTitle>
                  <CardDescription>Meters that need to be read</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/services/readings/new">Add Reading</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        {i % 2 === 0 ? (
                          <Zap className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Droplets className="h-5 w-5 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {i % 2 === 0 ? "Electricity Meter" : "Water Meter"} #{1000 + i}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Block {String.fromCharCode(65 + (i % 4))}, Floor {Math.floor(i / 2) + 1}, Unit {i + 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Last reading: {i % 2 === 0 ? "12,345 kWh" : "345 m³"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="electricity" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Electricity Consumption</CardTitle>
                <CardDescription>Monthly electricity usage (kWh)</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/services/electricity">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={electricityData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#059669" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Electricity Meters</CardTitle>
              <CardDescription>All electricity meters in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b p-3 font-medium">
                  <div>Meter ID</div>
                  <div>Location</div>
                  <div>Last Reading</div>
                  <div>Last Read Date</div>
                  <div>Status</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-5 border-b p-3 last:border-0">
                    <div>E-{1000 + i}</div>
                    <div>
                      Block {String.fromCharCode(65 + (i % 4))}, Floor {Math.floor(i / 2) + 1}, Unit {i + 1}
                    </div>
                    <div>{12000 + i * 100} kWh</div>
                    <div>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          i % 3 === 0
                            ? "bg-green-100 text-green-800"
                            : i % 3 === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending Reading" : "Maintenance"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Water Consumption</CardTitle>
                <CardDescription>Monthly water usage (m³)</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/services/water">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={waterData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Water Meters</CardTitle>
              <CardDescription>All water meters in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b p-3 font-medium">
                  <div>Meter ID</div>
                  <div>Location</div>
                  <div>Last Reading</div>
                  <div>Last Read Date</div>
                  <div>Status</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-5 border-b p-3 last:border-0">
                    <div>W-{1000 + i}</div>
                    <div>
                      Block {String.fromCharCode(65 + (i % 4))}, Floor {Math.floor(i / 2) + 1}, Unit {i + 1}
                    </div>
                    <div>{800 + i * 20} m³</div>
                    <div>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          i % 3 === 0
                            ? "bg-green-100 text-green-800"
                            : i % 3 === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending Reading" : "Maintenance"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Other Services</CardTitle>
                <CardDescription>Internet, parking, gym, etc.</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/services/new">Add Service</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b p-3 font-medium">
                  <div>Service ID</div>
                  <div>Service Name</div>
                  <div>Price</div>
                  <div>Subscribers</div>
                  <div>Status</div>
                </div>
                {[
                  { id: "S-001", name: "Internet (100Mbps)", price: 250000, subscribers: 95 },
                  { id: "S-002", name: "Parking (Car)", price: 1200000, subscribers: 42 },
                  { id: "S-003", name: "Parking (Motorbike)", price: 150000, subscribers: 180 },
                  { id: "S-004", name: "Gym Membership", price: 500000, subscribers: 68 },
                  { id: "S-005", name: "Swimming Pool", price: 300000, subscribers: 54 },
                ].map((service, i) => (
                  <div key={i} className="grid grid-cols-5 border-b p-3 last:border-0">
                    <div>{service.id}</div>
                    <div>{service.name}</div>
                    <div>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(service.price)}
                    </div>
                    <div>{service.subscribers}</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
