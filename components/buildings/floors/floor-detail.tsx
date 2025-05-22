"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Building, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/hooks/use-auth"
import type { FloorApartment } from "@/services/building-service"

// Mock data for floors
const floorsData = [
  { MaTL: 1, TenTL: "Tầng 1", MaKN: 1, MaTN: 1, DienTichSan: 1200, DienTichKhuVucDungChung: 300, DienTichKyThuaPhuTro: 150 },
  { MaTL: 2, TenTL: "Tầng 2", MaKN: 1, MaTN: 1, DienTichSan: 1200, DienTichKhuVucDungChung: 300, DienTichKyThuaPhuTro: 150 },
  { MaTL: 3, TenTL: "Tầng 3", MaKN: 1, MaTN: 1, DienTichSan: 1200, DienTichKhuVucDungChung: 300, DienTichKyThuaPhuTro: 150 },
  { MaTL: 4, TenTL: "Tầng 4", MaKN: 1, MaTN: 1, DienTichSan: 1200, DienTichKhuVucDungChung: 300, DienTichKyThuaPhuTro: 150 },
  { MaTL: 5, TenTL: "Tầng 1", MaKN: 2, MaTN: 1, DienTichSan: 1000, DienTichKhuVucDungChung: 250, DienTichKyThuaPhuTro: 130 },
  { MaTL: 6, TenTL: "Tầng 2", MaKN: 2, MaTN: 1, DienTichSan: 1000, DienTichKhuVucDungChung: 250, DienTichKyThuaPhuTro: 130 },
]

// Mock data for buildings
const buildingsData = [
  { MaTN: 1, TenTN: "Chung cư Hạnh Phúc" },
  { MaTN: 2, TenTN: "Chung cư Sunshine" },
]

// Mock data for blocks
const blocksData = [
  { MaKN: 1, TenKN: "Khối A", MaTN: 1 },
  { MaKN: 2, TenKN: "Khối B", MaTN: 1 },
  { MaKN: 3, TenKN: "Khối C", MaTN: 1 },
  { MaKN: 4, TenKN: "Khối D", MaTN: 1 },
  { MaKN: 5, TenKN: "Khối A", MaTN: 2 },
  { MaKN: 6, TenKN: "Khối B", MaTN: 2 },
]

// Mock data for apartments per floor
const apartmentCountData: Record<number, number> = {
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 6,
  6: 6,
}

// Mock occupancy rates per floor
const occupancyRateData: Record<number, number> = {
  1: 75,
  2: 100,
  3: 50,
  4: 75,
  5: 83,
  6: 66,
}

// Mock data for apartments
const apartmentsData = [
  { id: 1, number: "101", floorId: 1, area: 120, status: "occupied", type: "2 phòng ngủ" },
  { id: 2, number: "102", floorId: 1, area: 150, status: "occupied", type: "3 phòng ngủ" },
  { id: 3, number: "103", floorId: 1, area: 120, status: "vacant", type: "2 phòng ngủ" },
  { id: 4, number: "104", floorId: 1, area: 100, status: "occupied", type: "1 phòng ngủ" },
  { id: 5, number: "201", floorId: 2, area: 120, status: "occupied", type: "2 phòng ngủ" },
  { id: 6, number: "202", floorId: 2, area: 150, status: "occupied", type: "3 phòng ngủ" },
  { id: 7, number: "203", floorId: 2, area: 120, status: "occupied", type: "2 phòng ngủ" },
  { id: 8, number: "204", floorId: 2, area: 100, status: "occupied", type: "1 phòng ngủ" },
]

interface FloorDetailProps {
  id: number
}

interface FloorData {
  maTL: number
  tenTL: string
  dienTichSan: number
  dienTichKhuVucDungChung: number
  dienTichKyThuaPhuTro: number
  listMatBangInTanLaus: FloorApartment[]
}

export function FloorDetail({ id }: FloorDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [floorData, setFloorData] = useState<FloorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const token = useAuth().getToken()
  
  useEffect(() => {
    const fetchFloorDetail = async () => {
      try {
        const response = await fetch(`https://localhost:7246/api/TangLau/GetDSTangLau`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch floor details')
        }
        
        const data = await response.json()
        
        // Find the specific floor by ID
        const foundFloor = data.find((floor: FloorData) => floor.maTL === id)
        
        if (!foundFloor) {
          throw new Error('Floor not found')
        }
        
        setFloorData(foundFloor)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin tầng lầu",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    if (token) {
      fetchFloorDetail()
    }
  }, [id, token])
  
  if (isLoading) {
    return <div>Đang tải...</div>
  }
  
  if (!floorData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Không tìm thấy thông tin tầng lầu.</p>
      </div>
    )
  }
  
  // Calculate total usable area (subtract common and technical areas from total)
  const totalUsableArea = floorData.dienTichSan - floorData.dienTichKhuVucDungChung - floorData.dienTichKyThuaPhuTro
  
  // Get apartments for this floor
  const floorApartments = floorData.listMatBangInTanLaus || []
  
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
        <span className="text-foreground font-medium">{floorData.tenTL}</span>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{floorData.tenTL}</h1>
          <p className="text-muted-foreground">
            {/* TODO: Add building and block names from API or additional fetch */}
            Khối nhà, Tòa nhà
          </p>
        </div>
        
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="apartments">Căn hộ</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diện tích sàn</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{floorData.dienTichSan} m²</div>
                <p className="text-xs text-muted-foreground">
                  Tổng diện tích sàn của tầng
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diện tích sử dụng</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsableArea} m²</div>
                <p className="text-xs text-muted-foreground">
                  Diện tích sử dụng cho căn hộ
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số căn hộ</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{floorApartments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Căn hộ trong tầng lầu
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Floor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tầng lầu</CardTitle>
              <CardDescription>Thông tin chi tiết về {floorData.tenTL}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Tên tầng lầu</h3>
                  <p className="text-sm text-muted-foreground">{floorData.tenTL}</p>
                </div>
                <div>
                  <h3 className="font-medium">Khối nhà</h3>
                  <p className="text-sm text-muted-foreground">Khối nhà</p>
                </div>
                <div>
                  <h3 className="font-medium">Thuộc tòa nhà</h3>
                  <p className="text-sm text-muted-foreground">Tòa nhà</p>
                </div>
                <div>
                  <h3 className="font-medium">Tỷ lệ lấp đầy</h3>
                  <p className="text-sm text-muted-foreground">
                    {floorApartments.filter((apt: FloorApartment) => apt.status === 'Đã bàn giao').length / floorApartments.length * 100 || 0}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Phân bổ diện tích</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Diện tích khu vực dùng chung: {floorData.dienTichKhuVucDungChung} m²</span>
                    <span>{((floorData.dienTichKhuVucDungChung / floorData.dienTichSan) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(floorData.dienTichKhuVucDungChung / floorData.dienTichSan) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Diện tích kỹ thuật phụ trợ: {floorData.dienTichKyThuaPhuTro} m²</span>
                    <span>{((floorData.dienTichKyThuaPhuTro / floorData.dienTichSan) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(floorData.dienTichKyThuaPhuTro / floorData.dienTichSan) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Diện tích sử dụng cho căn hộ: {totalUsableArea} m²</span>
                    <span>{((totalUsableArea / floorData.dienTichSan) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(totalUsableArea / floorData.dienTichSan) * 100} className="h-2" />
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
        
        {/* Apartments Tab */}
        <TabsContent value="apartments">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách căn hộ</CardTitle>
              <CardDescription>Các căn hộ thuộc {floorData.tenTL}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="grid grid-cols-12 border-b p-3 font-medium">
                  <div className="col-span-2">Mã căn hộ</div>
                  <div className="col-span-3">Loại căn hộ</div>
                  <div className="col-span-2">Diện tích</div>
                  <div className="col-span-3">Trạng thái</div>
                  <div className="col-span-2">Thao tác</div>
                </div>
                {floorApartments.map((apartment: FloorApartment) => (
                  <div key={apartment.id} className="grid grid-cols-12 border-b p-3 last:border-0">
                    <div className="col-span-2">{apartment.number}</div>
                    <div className="col-span-3">{apartment.type}</div>
                    <div className="col-span-2">{apartment.area} m²</div>
                    <div className="col-span-3">
                      <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                        apartment.status === 'Đã bàn giao' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apartment.status}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/buildings/premises/${apartment.id}`}>
                          Chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 