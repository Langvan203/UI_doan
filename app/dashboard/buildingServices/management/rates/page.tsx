import type { Metadata } from "next"
import { ServiceRateManagement } from "@/components/buildingServices/service-rate-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Giá dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý giá cả và tỷ giá dịch vụ",
}

export default function ServiceRatesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Giá dịch vụ</h1>
        <p className="text-muted-foreground">Thiết lập giá cả và tỷ lệ thanh toán cho các dịch vụ khác nhau</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý định mức</CardTitle>
          <CardDescription>Cấu hình định mức & mức giá cho tất cả các dịch vụ</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceRateManagement />
        </CardContent>
      </Card>
    </div>
  )
}
