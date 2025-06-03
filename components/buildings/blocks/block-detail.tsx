"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Layers, Building, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloorList } from "@/components/buildings/floors/floor-list"
import type { BlockDetail, Building as BuildingType } from "@/services/building-service"
import { buildingService } from "@/services/building-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/context/AuthContext"

// Mock data for blocks
const blocksData = [
  { MaKN: 1, TenKN: "Khối A", MaTN: 1, Status: 1 },
  { MaKN: 2, TenKN: "Khối B", MaTN: 1, Status: 1 },
  { MaKN: 3, TenKN: "Khối C", MaTN: 1, Status: 0 },
  { MaKN: 4, TenKN: "Khối D", MaTN: 1, Status: 1 },
  { MaKN: 5, TenKN: "Khối A", MaTN: 2, Status: 1 },
  { MaKN: 6, TenKN: "Khối B", MaTN: 2, Status: 0 },
  { MaKN: 7, TenKN: "Khối C", MaTN: 2, Status: 1 },
  { MaKN: 8, TenKN: "Khối D", MaTN: 2, Status: 1 },
]

// Mock data for buildings
const buildingsData = [
  {
    MaTN: 1,
    TenTN: "Chung cư Hạnh Phúc",
  },
  {
    MaTN: 2,
    TenTN: "Chung cư Sunshine",
  },
]

// Mock data for floors per block
const floorCountData: Record<number, number> = {
  1: 5,
  2: 8,
  3: 10,
  4: 12,
  5: 15,
  6: 8,
  7: 10,
  8: 12,
}

// Mock data for apartments per block
const apartmentCountData: Record<number, number> = {
  1: 20,
  2: 32,
  3: 40,
  4: 48,
  5: 60,
  6: 32,
  7: 40,
  8: 48,
}

// Mock occupancy rates per block
const occupancyRateData: Record<number, number> = {
  1: 85,
  2: 92,
  3: 78,
  4: 88,
  5: 90,
  6: 75,
  7: 82,
  8: 95,
}

interface BlockDetailPageProps {
  id: number
}

export function BlockDetail({ id }: BlockDetailPageProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [blockData, setBlockData] = useState<BlockDetail | null>(null)
  const [buildings, setBuildings] = useState<BuildingType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {token} = useAuth()
  
  useEffect(() => {
    const fetchBlockDetail = async () => {
      try {
        const buildingsData = await buildingService.getBlockList(token || '')
        
        // Find the block in the buildings data
        const foundBlock = buildingsData
          .flatMap(building => 
            building.khoiNhaDetail.map(block => ({
              ...block,
              tenTN: building.tenTN // Add building name to each block
            }))
          )
          .find(block => block.maKN === id)
        
        if (foundBlock) {
          setBlockData(foundBlock)
          setBuildings(buildingsData)
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy thông tin khối nhà",
            variant: "destructive"
          })
        }
        
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin khối nhà",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    if (token) {
      fetchBlockDetail()
    }
  }, [id, token])
  
  if (isLoading) {
    return <div>Đang tải...</div>
  }
  
  if (!blockData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Không tìm thấy thông tin khối nhà.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard/buildings" className="hover:text-foreground">
          Quản lý tòa nhà
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/dashboard/buildings/blocks" className="hover:text-foreground">
          Khối nhà
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">{blockData.tenKN}</span>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{blockData.tenKN}</h1>
          <p className="text-muted-foreground">
            {blockData.tenTN}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={blockData.status === 1 ? "default" : "outline"}>
            {blockData.status === 1 ? "Hoạt động" : "Không hoạt động"}
          </Badge>
          
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="floors">Tầng lầu</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số tầng</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockData.totalFloors}</div>
                <p className="text-xs text-muted-foreground">
                  Tầng trong khối nhà
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số căn hộ</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockData.totalPremies}</div>
                <p className="text-xs text-muted-foreground">
                  Căn hộ trong khối nhà
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockData.occupancyRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ căn hộ đã có người ở
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Block Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khối nhà</CardTitle>
              <CardDescription>Thông tin chi tiết về khối nhà {blockData.tenKN}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Tên khối nhà</h3>
                  <p className="text-sm text-muted-foreground">{blockData.tenKN}</p>
                </div>
                <div>
                  <h3 className="font-medium">Thuộc tòa nhà</h3>
                  <p className="text-sm text-muted-foreground">{blockData.tenTN}</p>
                </div>
                <div>
                  <h3 className="font-medium">Trạng thái</h3>
                  <p className="text-sm text-muted-foreground">
                    {blockData.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Tỷ lệ lấp đầy</h3>
                  <p className="text-sm text-muted-foreground">{blockData.occupancyRate.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Ngày cập nhật: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Floors Tab */}
        <TabsContent value="floors">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tầng lầu</CardTitle>
              <CardDescription>Các tầng lầu thuộc {blockData.tenKN}</CardDescription>
            </CardHeader>
            <CardContent>
              <FloorList 
                buildingId={blockData.maTN} 
                blockId={id} 
                floors={blockData.listTangLauInKhoiNhas.map(floor => ({
                  ...floor,
                  maTL: 0, // Temporary fix as the API doesn't return maTL
                  maTN: blockData.maTN,
                  maKN: blockData.maKN
                }))} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 