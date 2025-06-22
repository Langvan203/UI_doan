import type { Metadata } from "next"
import { ServiceUsageStatistics } from "@/components/buildingServices/service-usage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Quản lý dịch vụ sử dụng | Hệ thống quản lý tòa nhà",
  description: "Hiển thị thống kê sử dụng dịch vụ và tạo báo cáo",
}

export default function ServiceUsagePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sử dụng dịch vụ</h1>
        <p className="text-muted-foreground">Theo dõi số liệu thống kê sử dụng dịch vụ và tạo báo cáo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phân tích sử dụng</CardTitle>
          <CardDescription>Theo dõi mức tiêu thụ dịch vụ và mô hình sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceUsageStatistics />
        </CardContent>
      </Card>
    </div>
  )
}
