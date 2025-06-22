"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Droplets, Wifi, Car, Dumbbell, User, MapPin, TrendingUp, Calendar, Building } from "lucide-react"
import { GetThongKeSuDung } from "../type/serviceUsage"
import { format } from "date-fns"

interface ServiceUsageDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usageData: GetThongKeSuDung | null
}

// Sample data for service rates/tiers based on maLDV
const serviceRates = {
  1: [ // Electricity
    { id: 1, name: "Bậc 1", minUsage: 0, maxUsage: 50, rate: 1678, description: "Mức tiêu thụ tiết kiệm" },
    { id: 2, name: "Bậc 2", minUsage: 51, maxUsage: 100, rate: 1734, description: "Mức tiêu thụ bình thường" },
    { id: 3, name: "Bậc 3", minUsage: 101, maxUsage: 200, rate: 2014, description: "Mức tiêu thụ trung bình" },
    { id: 4, name: "Bậc 4", minUsage: 201, maxUsage: 300, rate: 2536, description: "Mức tiêu thụ cao" },
    { id: 5, name: "Bậc 5", minUsage: 301, maxUsage: 400, rate: 2834, description: "Mức tiêu thụ rất cao" },
    { id: 6, name: "Bậc 6", minUsage: 401, maxUsage: null, rate: 2927, description: "Vượt quá mức cho phép" },
  ],
  2: [ // Water
    { id: 1, name: "Định mức sinh hoạt", minUsage: 0, maxUsage: 10, rate: 5973, description: "Mức tiêu thụ cơ bản cho sinh hoạt hàng ngày" },
    { id: 2, name: "Định mức trung bình", minUsage: 11, maxUsage: 20, rate: 7052, description: "Mức tiêu thụ trung bình" },
    { id: 3, name: "Định mức cao", minUsage: 21, maxUsage: 30, rate: 8669, description: "Mức tiêu thụ cao" },
    { id: 4, name: "Vượt định mức", minUsage: 31, maxUsage: null, rate: 15929, description: "Vượt quá định mức cho phép" },
  ],
  3: [ // Internet
    { id: 1, name: "Gói cơ bản", minUsage: 0, maxUsage: 1, rate: 200000, description: "Internet cơ bản 50Mbps" },
  ],
  4: [ // Other services
    { id: 1, name: "Gói cơ bản", minUsage: 0, maxUsage: 1, rate: 500000, description: "Dịch vụ khác" },
  ]
}

export function ServiceUsageDetailDialog({
  open,
  onOpenChange,
  usageData,
}: ServiceUsageDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!usageData) return null

  // Get service rates based on service type
  const getServiceRates = (maLDV: number) => {
    return serviceRates[maLDV as keyof typeof serviceRates] || serviceRates[4]
  }

  const currentServiceRates = getServiceRates(usageData.maLDV)

  // Mock usage amount for calculation (you should get this from your actual data)
  const mockUsageAmount = 150 // This should come from your actual usage data

  // Calculate cost with tier system
  function calculateCostWithTiers(usage: number, rates: any[]) {
    let totalCost = 0
    let remainingUsage = usage

    for (const rate of rates) {
      if (remainingUsage <= 0) break

      const maxUsageForTier = rate.maxUsage || Number.MAX_SAFE_INTEGER
      const minUsageForTier = rate.minUsage
      const tierCapacity = maxUsageForTier - minUsageForTier + 1
      const tierUsage = Math.min(remainingUsage, tierCapacity)

      if (tierUsage > 0) {
        totalCost += tierUsage * rate.rate
        remainingUsage -= tierUsage
      }
    }

    return totalCost
  }

  // Get usage breakdown by tiers
  function getUsageBreakdown(usage: number, rates: any[]) {
    const breakdown = []
    let remainingUsage = usage

    for (const rate of rates) {
      if (remainingUsage <= 0) break

      const maxUsageForTier = rate.maxUsage || Number.MAX_SAFE_INTEGER
      const minUsageForTier = rate.minUsage
      const tierCapacity = maxUsageForTier - minUsageForTier + 1
      const tierUsage = Math.min(remainingUsage, tierCapacity)

      if (tierUsage > 0) {
        breakdown.push({
          ...rate,
          usedAmount: tierUsage,
          cost: tierUsage * rate.rate,
          percentage: (tierUsage / usage) * 100,
        })
        remainingUsage -= tierUsage
      }
    }

    return breakdown
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get service icon
  const getServiceIcon = (maLDV: number) => {
    switch (maLDV) {
      case 1: return <Zap className="h-6 w-6 text-yellow-500" />
      case 2: return <Droplets className="h-6 w-6 text-blue-500" />
      case 3: return <Wifi className="h-6 w-6 text-purple-500" />
      default: return <Building className="h-6 w-6 text-gray-500" />
    }
  }

  // Get unit
  const getUnit = (maLDV: number) => {
    switch (maLDV) {
      case 1: return "kWh"
      case 2: return "m³"
      case 3: return "tháng"
      default: return "đơn vị"
    }
  }

  // Get service name
  const getServiceName = (maLDV: number) => {
    switch (maLDV) {
      case 1: return "Điện"
      case 2: return "Nước"
      case 3: return "Internet"
      default: return "Dịch vụ khác"
    }
  }

  const usageBreakdown = getUsageBreakdown(mockUsageAmount, currentServiceRates)
  const calculatedCost = calculateCostWithTiers(mockUsageAmount, currentServiceRates)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getServiceIcon(usageData.maLDV)}
            <span>Chi tiết sử dụng dịch vụ</span>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về việc sử dụng dịch vụ {usageData.tenDV}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer and Service Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên:</span>
                  <span className="font-medium">{usageData.tenKH}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã khách hàng:</span>
                  <span className="font-medium">{usageData.maKH}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vị trí:</span>
                  <span className="font-medium">{usageData.maVT}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dịch vụ:</span>
                  <span className="font-medium">{usageData.tenDV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã dịch vụ:</span>
                  <span className="font-medium">{usageData.maDV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày bắt đầu:</span>
                  <span className="font-medium">
                    {format(new Date(usageData.ngayBatDauSuDung), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đến hạn:</span>
                  <span className="font-medium">
                    {format(new Date(usageData.ngayDenHanThanhToan), "dd/MM/yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(usageData.thanhTien)}
                  </div>
                  <div className="text-sm text-muted-foreground">Thành tiền</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(usageData.tienVAT)}
                  </div>
                  <div className="text-sm text-muted-foreground">Tiền VAT</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPrice(usageData.tienBVMT)}
                  </div>
                  <div className="text-sm text-muted-foreground">Tiền BVMT</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {usageData.isDuyetHoaDon === 1 ? "Đã duyệt" : "Chờ duyệt"}
                  </div>
                  <div className="text-sm text-muted-foreground">Trạng thái</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="rates">Bảng giá</TabsTrigger>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích sử dụng</CardTitle>
                  <CardDescription>
                    Chi tiết về mức sử dụng và tính phí theo từng bậc giá
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">
                          Kỳ thanh toán hiện tại
                        </h4>
                        <Badge variant={usageData.isDuyetHoaDon === 1 ? "default" : "secondary"}>
                          {usageData.isDuyetHoaDon === 1 ? "Đã duyệt" : "Chờ duyệt"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {usageBreakdown.map((tier, tierIndex) => (
                          <div key={tier.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full`}
                                  style={{ backgroundColor: `hsl(${(tierIndex * 60) % 360}, 70%, 50%)` }}
                                />
                                <span className="font-medium text-sm">{tier.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({tier.minUsage} - {tier.maxUsage || "∞"} {getUnit(usageData.maLDV)})
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm">
                                  {tier.usedAmount} {getUnit(usageData.maLDV)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatPrice(tier.cost)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={tier.percentage} className="h-2 flex-1" />
                              <span className="text-xs text-muted-foreground min-w-[40px]">
                                {tier.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Tổng sử dụng</div>
                          <div className="font-medium">
                            {mockUsageAmount} {getUnit(usageData.maLDV)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Chi phí tính toán</div>
                          <div className="font-medium">{formatPrice(calculatedCost)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Giá TB</div>
                          <div className="font-medium">
                            {formatPrice(calculatedCost / mockUsageAmount)}/{getUnit(usageData.maLDV)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng định mức giá</CardTitle>
                  <CardDescription>
                    Chi tiết các mức giá áp dụng cho dịch vụ {getServiceName(usageData.maLDV)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Định mức</TableHead>
                        <TableHead>Khoảng sử dụng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Mô tả</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentServiceRates.map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell className="font-medium">{rate.name}</TableCell>
                          <TableCell>
                            {rate.minUsage} - {rate.maxUsage || "∞"} {getUnit(usageData.maLDV)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(rate.rate)}/{getUnit(usageData.maLDV)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {rate.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Các thông tin chi tiết về dịch vụ sử dụng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Thông tin hệ thống</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã DVSD:</span>
                          <span>{usageData.maDVSD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã tòa nhà:</span>
                          <span>{usageData.maTN}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã khối nhà:</span>
                          <span>{usageData.maKN}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã tầng lầu:</span>
                          <span>{usageData.maTL}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã mặt bằng:</span>
                          <span>{usageData.maMB}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Thông tin thanh toán</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thành tiền:</span>
                          <span className="font-medium">{formatPrice(usageData.thanhTien)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiền VAT:</span>
                          <span className="font-medium">{formatPrice(usageData.tienVAT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiền BVMT:</span>
                          <span className="font-medium">{formatPrice(usageData.tienBVMT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tổng cộng:</span>
                          <span className="font-bold text-lg">
                            {formatPrice(usageData.thanhTien + usageData.tienVAT + usageData.tienBVMT)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
