"use client"

import { useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Calendar,
  Home,
  Mail,
  Phone,
  User,
  CreditCard,
  MapPin,
  Flag,
  Briefcase,
  Building,
  Droplets,
  Zap,
  FileText,
  Edit,
  UserCircle,
  X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Resident {
  maKH: number
  hoTen: string
  cccd: string
  ngayCap: string
  noiCap: string
  gioiTinh: boolean
  taiKhoanCuDan: string
  matKhauMaHoa: string
  dienThoai: string
  email: string
  isCaNhan: boolean
  maSoThue: string
  diaChiThuongTru: string
  quocTich: string
  ctyTen: string
  soFax: string
  maTN?: number
  maKN?: number
  maTL?: number
  avatar: string
  status: string
}

interface Premise {
  id: number
  maVT: string
  floorId: number
  dienTichBG: number
  dienTichThongThuy: number
  dienTichTimTuong: number
  isBanGiao: boolean
  soHopDong: string
  ngayBanGiao: string | null
  ngayHetHanChoThue: string | null
  maTL: number
  maKH: number | null
  maLMB: number
  maTrangThai: number
  maTN: number
}

interface ElectricMeter {
  id: number
  code: string
  customerId: number
  lastReading: number
  currentReading: number
  unit: string
}

interface WaterMeter {
  id: number
  code: string
  customerId: number
  lastReading: number
  currentReading: number
  unit: string
}

interface ParkingCard {
  id: number
  cardNumber: string
  customerId: number
  vehicleType: string
  licensePlate: string
  parkingSpace: string
}

interface MaintenanceRequest {
  id: number
  customerId: number
  date: string
  type: string
  description: string
  status: string
}

interface ServiceUsage {
  id: number
  customerId: number
  serviceType: string
  month: string
  usage: number
  unit: string
  amount: number
  status: string
}

interface ResidentDetailProps {
  resident: Resident
  isOpen: boolean
  onClose: () => void
  buildings: Array<{ id: number; name: string }>
  blocks: Array<{ id: number; name: string }>
  floors: Array<{ id: number; number: number }>
  premises: Premise[]
  electricMeter?: ElectricMeter
  waterMeter?: WaterMeter
  parkingCards: ParkingCard[]
  maintenanceRequests: MaintenanceRequest[]
  servicesUsage: ServiceUsage[]
}

export function ResidentDetail({
  resident,
  isOpen,
  onClose,
  buildings,
  blocks,
  floors,
  premises,
  electricMeter,
  waterMeter,
  parkingCards,
  maintenanceRequests,
  servicesUsage,
}: ResidentDetailProps) {
  const [activeTab, setActiveTab] = useState("info")

  if (!resident) {
    return null
  }

  if (!isOpen) {
    return null
  }

  const building = buildings.find((b) => b.id === resident.maTN)
  const block = blocks.find((b) => b.id === resident.maKN)
  const floor = floors.find((f) => f.id === resident.maTL)

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="flex h-full flex-col">
      <CardHeader className="sticky top-0 z-10 bg-background px-4 sm:px-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Chi tiết khách hàng</CardTitle>
            <CardDescription className="hidden sm:block">Thông tin về khách hàng đã chọn</CardDescription>
          </div>
          <div className="flex gap-2 sm:mt-0">
            <Button variant="outline" size="sm" className="h-8">
              <Edit className="mr-2 h-3.5 w-3.5" />
              Sửa
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={onClose}>
              <X className="lg:hidden mr-2 h-3.5 w-3.5" />
              <span className="hidden lg:inline">Đóng</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-0 pt-4 overflow-hidden">
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={resident.avatar || "/placeholder.svg"} alt={resident.hoTen} />
              <AvatarFallback>{resident.hoTen.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold truncate">{resident.hoTen}</h2>
                <Badge variant={resident.isCaNhan ? "default" : "secondary"}>
                  {resident.isCaNhan ? "Cá nhân" : "Tổ chức"}
                </Badge>
              </div>
              <p className="text-muted-foreground truncate">{resident.email}</p>
              <p className="text-muted-foreground">{resident.dienThoai}</p>
              {resident.maSoThue && <p className="text-muted-foreground">MST: {resident.maSoThue}</p>}
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <ScrollArea className="w-full">
              <div className="min-w-max">
                <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="info"
                    className="h-10 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Thông tin cá nhân
                  </TabsTrigger>
                  <TabsTrigger
                    value="premises"
                    className="h-10 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Mặt bằng
                  </TabsTrigger>
                  <TabsTrigger
                    value="meters"
                    className="h-10 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Đồng hồ
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="h-10 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Dịch vụ
                  </TabsTrigger>
                </TabsList>
              </div>
            </ScrollArea>
          </div>

          <ScrollArea className="h-[calc(100vh-360px)] sm:h-[calc(100vh-350px)] min-h-[350px]">
            <TabsContent value="info" className="p-4 sm:p-6 mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-3">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resident.isCaNhan ? (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-start sm:items-center gap-2">
                            <UserCircle className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Họ tên:</span>
                            <span className="text-sm break-words">{resident.hoTen}</span>
                          </div>
                          <div className="flex items-start sm:items-center gap-2">
                            <CreditCard className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">CCCD:</span>
                            <span className="text-sm break-words">{resident.cccd}</span>
                          </div>
                          <div className="flex items-start sm:items-center gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Ngày cấp:</span>
                            <span className="text-sm break-words">{formatDate(resident.ngayCap)}</span>
                          </div>
                          <div className="flex items-start sm:items-center gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Nơi cấp:</span>
                            <span className="text-sm break-words">{resident.noiCap}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Giới tính:</span>
                            <span>{resident.gioiTinh ? "Nam" : "Nữ"}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Tên công ty:</span>
                            <span>{resident.ctyTen}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Mã số thuế:</span>
                            <span>{resident.maSoThue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Số fax:</span>
                            <span>{resident.soFax}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Điện thoại:</span>
                        <span>{resident.dienThoai}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="break-all">{resident.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Địa chỉ:</span>
                        <span className="text-sm">{resident.diaChiThuongTru}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Quốc tịch:</span>
                        <span>{resident.quocTich}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Thông tin tài khoản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tài khoản:</span>
                        <span>{resident.taiKhoanCuDan}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Thông tin tòa nhà</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tòa nhà:</span>
                        <span>{building?.name || "Chưa có"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Khối nhà:</span>
                        <span>{block?.name || "Chưa có"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tầng:</span>
                        <span>{floor ? `Tầng ${floor.number}` : "Chưa có"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="premises" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Mặt bằng sở hữu</h3>
                  <Badge variant="outline">{premises.length} mặt bằng</Badge>
                </div>

                {premises.length > 0 ? (
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã VT</TableHead>
                          <TableHead>Diện tích</TableHead>
                          <TableHead className="hidden sm:table-cell">Hợp đồng</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {premises.map((premise) => (
                          <TableRow key={premise.id}>
                            <TableCell className="font-medium">{premise.maVT}</TableCell>
                            <TableCell>{premise.dienTichThongThuy} m²</TableCell>
                            <TableCell className="hidden sm:table-cell">{premise.soHopDong || "Chưa có"}</TableCell>
                            <TableCell>
                              <Badge variant={premise.isBanGiao ? "default" : "secondary"}>
                                {premise.isBanGiao ? "Đã bàn giao" : "Chưa bàn giao"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <Home className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">Khách hàng chưa có mặt bằng nào</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="meters" className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Đồng hồ điện</h3>
                  {electricMeter ? (
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Mã đồng hồ:</span>
                            <span>{electricMeter.code}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Chỉ số cũ:</span>
                            <span>
                              {electricMeter.lastReading} {electricMeter.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Chỉ số mới:</span>
                            <span>
                              {electricMeter.currentReading} {electricMeter.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Tiêu thụ:</span>
                            <span>
                              {electricMeter.currentReading - electricMeter.lastReading} {electricMeter.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Khách hàng chưa có đồng hồ điện</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Đồng hồ nước</h3>
                  {waterMeter ? (
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Mã đồng hồ:</span>
                            <span>{waterMeter.code}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Chỉ số cũ:</span>
                            <span>
                              {waterMeter.lastReading} {waterMeter.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Chỉ số mới:</span>
                            <span>
                              {waterMeter.currentReading} {waterMeter.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Tiêu thụ:</span>
                            <span>
                              {waterMeter.currentReading - waterMeter.lastReading} {waterMeter.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Khách hàng chưa có đồng hồ nước</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Thẻ xe</h3>
                  {parkingCards.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã thẻ</TableHead>
                            <TableHead>Loại xe</TableHead>
                            <TableHead className="hidden sm:table-cell">Biển số</TableHead>
                            <TableHead>Vị trí</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parkingCards.map((card) => (
                            <TableRow key={card.id}>
                              <TableCell className="font-medium">{card.cardNumber}</TableCell>
                              <TableCell>{card.vehicleType}</TableCell>
                              <TableCell className="hidden sm:table-cell">{card.licensePlate}</TableCell>
                              <TableCell>{card.parkingSpace}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Khách hàng chưa có thẻ xe</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Yêu cầu sửa chữa</h3>
                  {maintenanceRequests.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ngày</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="hidden sm:table-cell">Mô tả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {maintenanceRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{formatDate(request.date)}</TableCell>
                              <TableCell>{request.type}</TableCell>
                              <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                                {request.description}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    request.status === "Đã hoàn thành"
                                      ? "default"
                                      : request.status === "Đang xử lý"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {request.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Khách hàng chưa có yêu cầu sửa chữa nào</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Dịch vụ sử dụng</h3>
                  {servicesUsage.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tháng</TableHead>
                            <TableHead>Loại DV</TableHead>
                            <TableHead className="hidden sm:table-cell">Sử dụng</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {servicesUsage.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell>{service.month}</TableCell>
                              <TableCell>{service.serviceType}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {service.usage} {service.unit}
                              </TableCell>
                              <TableCell>{formatCurrency(service.amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    service.status === "Đã thanh toán"
                                      ? "default"
                                      : service.status === "Chưa thanh toán"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {service.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Khách hàng chưa sử dụng dịch vụ nào</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </div>
  )
}
