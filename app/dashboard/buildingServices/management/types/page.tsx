import type { Metadata } from "next"
import { ServiceTypeList } from "@/components/buildingServices/service-type-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Các loại dịch vụ | Hệ thống quản lý tòa nhà",
  description: "Quản lý các loại và danh mục dịch vụ",
}

export default function ServiceTypesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Loại dịch vụ</h1>
        <p className="text-muted-foreground">Quản lý các loại dịch vụ khác nhau có sẵn trong tòa nhà của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loại dịch vụ</CardTitle>
          <CardDescription>Cấu hình và sắp xếp các loại dịch vụ để quản lý tốt hơn</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceTypeList />
        </CardContent>
      </Card>
    </div>
  )
}
