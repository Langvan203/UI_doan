import type { Metadata } from "next"
import { ServiceAssignment } from "@/components/buildingServices/service-assignment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Duyệt Dịch Vụ | Hệ Thống Quản Lý Tòa Nhà",
  description: "Quản lý phân bổ dịch vụ cho cư dân và cơ sở",
}

export default function ServiceAssignmentPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dịch vụ sử dụng của cư dân</h1>
        <p className="text-muted-foreground">Dịch vụ sử dụng của cư dân theo vị trí và tòa nhà</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sử dụng dịch vụ</CardTitle>
          <CardDescription>Quản lý các nhiệm vụ dịch vụ cho cư dân và cơ sở</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceAssignment />
        </CardContent>
      </Card>
    </div>
  )
}
