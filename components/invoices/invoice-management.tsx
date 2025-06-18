"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceList } from "./invoice-list"
import { InvoiceStats } from "./invoice-stats"
import { InvoiceFilters } from "./invoice-filters"
import { PlusCircle, FileText } from "lucide-react"
import { CreateInvoiceDialog } from "./create-invoice-dialog"
import { InvoiceTemplateDialog } from "./invoice-template-dialog"
import { InvoiceTemplateList } from "./invoice-template-list"

export function InvoiceManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    building: "all",
    resident: "",
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hóa đơn</h2>
          <p className="text-muted-foreground">
            Quản lý hóa đơn cho cư dân, bao gồm tạo, xem và theo dõi tình trạng thanh toán.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Tạo Template
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo Hóa Đơn
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <TabsList>
            <TabsTrigger value="all">Tất cả hóa đơn</TabsTrigger>
            <TabsTrigger value="pending">Đang chờ thanh toán</TabsTrigger>
            <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
            <TabsTrigger value="overdue">Hết hạn</TabsTrigger>
            <TabsTrigger value="templates">Mẫu hóa đơn</TabsTrigger>
          </TabsList>
          {activeTab !== "templates" && <InvoiceFilters filters={filters} setFilters={setFilters} />}
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InvoiceStats title="Total Invoices" value="1,234" description="+12% from last month" />
            <InvoiceStats title="Pending" value="256" description="+2% from last month" />
            <InvoiceStats title="Paid" value="864" description="+18% from last month" />
            <InvoiceStats title="Overdue" value="114" description="-5% from last month" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Tất cả hóa đơn</CardTitle>
              <CardDescription>Quản lý tất cả hóa đơn của hệ thống tòa nhà</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList status="all" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đang chờ thanh toán</CardTitle>
              <CardDescription>Hóa đơn chờ thanh toán</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList status="pending" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đã thanh toán</CardTitle>
              <CardDescription>Hóa đơn đã thanh toán bởi cư dân</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList status="paid" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hóa đơn hết hạn</CardTitle>
              <CardDescription>Hóa đơn quá hạn thanh toán</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList status="overdue" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <InvoiceTemplateList />
        </TabsContent>
      </Tabs>

      <CreateInvoiceDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <InvoiceTemplateDialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen} />
    </div>
  )
}
