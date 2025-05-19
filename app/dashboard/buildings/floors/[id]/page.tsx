import type { Metadata } from "next"
import { FloorDetail } from "@/components/buildings/floors/floor-detail"

export const metadata: Metadata = {
  title: "Chi tiết tầng lầu | Hệ thống quản lý tòa nhà",
  description: "Xem thông tin chi tiết về tầng lầu",
}

interface FloorDetailPageProps {
  params: {
    id: string
  }
}

export default function FloorDetailPage({ params }: FloorDetailPageProps) {
  return <FloorDetail id={parseInt(params.id)} />
} 