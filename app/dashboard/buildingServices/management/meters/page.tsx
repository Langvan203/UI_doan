import type { Metadata } from "next"
import { MeterManagement } from "@/components/buildingServices/meter-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Đồng hồ đo dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý đồng hồ đo tiện ích và số liệu đọc",
}

export default function ServiceMetersPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Đồng hồ đo dịch vụ</h1>
        <p className="text-muted-foreground">Quản lý đồng hồ đo tiện ích cho điện, nước và các dịch vụ đo lường khác</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý đồng hồ đo</CardTitle>
          <CardDescription>Theo dõi và quản lý tất cả các đồng hồ đo tiện ích trong tòa nhà của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <MeterManagement />
        </CardContent>
      </Card>
    </div>
  )
}
