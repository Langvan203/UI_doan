"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, MessageSquare, Bell, ArrowRight, DollarSign } from "lucide-react"

export function DashboardTenant() {
  // In a real app, you would fetch this data from an API
  const upcomingInvoices = [
    {
      id: "INV-001",
      title: "Monthly Rent - May 2025",
      amount: 15000000,
      dueDate: "2025-05-15",
      status: "pending",
    },
    {
      id: "INV-002",
      title: "Electricity Bill - May 2025",
      amount: 1200000,
      dueDate: "2025-05-20",
      status: "pending",
    },
    {
      id: "INV-003",
      title: "Water Bill - May 2025",
      amount: 450000,
      dueDate: "2025-05-18",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-[#0ea5e9]/10 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Welcome back, Nguyễn Văn A</h2>
          <p className="text-muted-foreground">
            Your apartment: <span className="font-medium">A1203, Building A, Happy Residence</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Apartment</CardTitle>
            <CardDescription>Details about your rented apartment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-[#0ea5e9]" />
              <span>A1203, Building A, Happy Residence</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Area:</span>
                <span>95 m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>2 Bedroom Apartment</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract ends:</span>
                <span>2026-01-15</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/premises/details">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Payments</CardTitle>
            <CardDescription>Due invoices for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInvoices.map((invoice) => (
                <div key={invoice.id} className="flex justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{invoice.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(invoice.amount)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {invoice.status === "pending" ? "Pending" : "Paid"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/invoices">
                View All Invoices
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Frequently used services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/invoices/pay">
                  <DollarSign className="mr-2 h-4 w-4 text-[#0ea5e9]" />
                  Pay Invoice
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/support/new">
                  <MessageSquare className="mr-2 h-4 w-4 text-[#0ea5e9]" />
                  Submit Support Request
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/services">
                  <Bell className="mr-2 h-4 w-4 text-[#0ea5e9]" />
                  Request Service
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Important updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="font-semibold">Building Maintenance Notice</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The water supply will be temporarily interrupted on May 10, 2025, from 10:00 AM to 2:00 PM for scheduled
                maintenance.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">May 5, 2025</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="font-semibold">Community Event</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Join us for the monthly community gathering in the central garden area on May 15, 2025, at 5:00 PM.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">May 3, 2025</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/notifications">
              View All Notifications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
