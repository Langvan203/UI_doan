import type { Metadata } from "next"
import { ServiceList } from "@/components/buildingServices/service-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Các loại dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý dịch vụ tòa nhà",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dịch vụ</h1>
        <p className="text-muted-foreground">Cấu hình và quản lý các dịch vụ cá nhân được cung cấp cho cư dân</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ có sẵn</CardTitle>
          <CardDescription>Quản lý tất cả các dịch vụ được cung cấp trong tòa nhà của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceList />
        </CardContent>
      </Card>
    </div>
  )
}
