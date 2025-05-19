import type { Metadata } from "next"
import { BlockDetail } from "@/components/buildings/blocks/block-detail"

export const metadata: Metadata = {
  title: "Chi tiết khối nhà | Hệ thống quản lý tòa nhà",
  description: "Xem thông tin chi tiết về khối nhà",
}

interface BlockDetailPageProps {
  params: {
    id: string
  }
}

export default function BlockDetailPage({ params }: BlockDetailPageProps) {
  return <BlockDetail id={parseInt(params.id)} />
} 