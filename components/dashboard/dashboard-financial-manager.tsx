"use client"

import { CardFooter } from "@/components/ui/card"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, DollarSign, FileText, TrendingUp } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Line,
  LineChart,
  Pie,
  PieChart as RechartsChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts"

export function DashboardFinancialManager() {
  // In a real app, you would fetch this data from an API
  const monthlyRevenue = 450000000
  const outstandingInvoices = 85000000
  const paidInvoices = 365000000
  const totalInvoices = 120

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 400000000 },
    { month: "Feb", revenue: 420000000 },
    { month: "Mar", revenue: 410000000 },
    { month: "Apr", revenue: 430000000 },
    { month: "May", revenue: 450000000 },
    { month: "Jun", revenue: 445000000 },
  ]

  const invoiceStatusData = [
    { name: "Paid", value: 75 },
    { name: "Pending", value: 15 },
    { name: "Overdue", value: 10 },
  ]

  const COLORS = ["#f97316", "#0ea5e9", "#ef4444"]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={<DollarSign className="h-5 w-5 text-[#f97316]" />}
          description="Total revenue this month"
          trend={{ value: "+4.5%", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Outstanding Invoices"
          value={formatCurrency(outstandingInvoices)}
          icon={<FileText className="h-5 w-5 text-[#f97316]" />}
          description="Unpaid invoices"
          trend={{ value: "-2.3%", direction: "down", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Paid Invoices"
          value={formatCurrency(paidInvoices)}
          icon={<TrendingUp className="h-5 w-5 text-[#f97316]" />}
          description="Collected payments"
          trend={{ value: "+5.8%", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Invoices"
          value={totalInvoices.toString()}
          icon={<BarChart3 className="h-5 w-5 text-[#f97316]" />}
          description="Invoices generated this month"
          trend={{ value: "+12", direction: "up", label: "from last month" }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => formatCurrency(value).replace("₫", "")}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>Distribution of invoice statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest invoices generated</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/invoices/new">Create Invoice</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b p-3 font-medium">
                  <div>Invoice ID</div>
                  <div>Customer</div>
                  <div>Premise</div>
                  <div>Amount</div>
                  <div>Due Date</div>
                  <div>Status</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-6 border-b p-3 last:border-0">
                    <div>INV-{2023001 + i}</div>
                    <div>{["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"][i]}</div>
                    <div>
                      Block {String.fromCharCode(65 + (i % 4))}, Unit {101 + i}
                    </div>
                    <div>{formatCurrency(3500000 + i * 500000)}</div>
                    <div>{new Date(Date.now() + (i + 1) * 86400000 * 5).toLocaleDateString()}</div>
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
                        {i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payments received</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/payments/new">Record Payment</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b p-3 font-medium">
                  <div>Payment ID</div>
                  <div>Invoice ID</div>
                  <div>Customer</div>
                  <div>Amount</div>
                  <div>Payment Date</div>
                  <div>Method</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-6 border-b p-3 last:border-0">
                    <div>PMT-{2023001 + i}</div>
                    <div>INV-{2023001 + i}</div>
                    <div>{["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"][i]}</div>
                    <div>{formatCurrency(3500000 + i * 500000)}</div>
                    <div>{new Date(Date.now() - i * 86400000 * 2).toLocaleDateString()}</div>
                    <div>{["Bank Transfer", "Credit Card", "Cash", "E-wallet", "Bank Transfer"][i]}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Monthly Revenue Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Detailed breakdown of revenue by service type and building
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/reports/revenue">Generate Report</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Outstanding Invoices Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">List of all unpaid invoices with aging analysis</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/reports/outstanding">Generate Report</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Collection Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Analysis of payment collection efficiency and methods
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/reports/payments">Generate Report</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Service Profitability Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Profitability analysis for each service type</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/reports/profitability">Generate Report</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
