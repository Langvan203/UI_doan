import type { Metadata } from "next"
import { ServiceApproval } from "@/components/buildingServices/service-aproval"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Đăng ký dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý các yêu cầu dịch vụ đang chờ phê duyệt từ cư dân",
}

export default function ServiceApprovalPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Duyệt yêu cầu sử dụng</h1>
        <p className="text-muted-foreground">Xem xét và duyệt  yêu cầu sử dụng từ các cư dân</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chờ phê duyệt</CardTitle>
          <CardDescription>Quản lý danh sách cách dịch vụ yêu cầu đăng ký</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceApproval />
        </CardContent>
      </Card>
    </div>
  )
}
