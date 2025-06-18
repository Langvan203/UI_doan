"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Droplets,
  Wifi,
  Car,
  Dumbbell,
  Trash2,
  Edit,
  MoreVertical,
  Plus,
  ListPlus,
  Calculator,
  ListChecks,
  Search,
  Calendar,
  Building,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useServiceType } from "../context/ServiceTypeContext"
import DynamicIcon from "@/app/providers/DynamicIcon"
import { useServices } from "../context/ServicesContext"
import { CreateDichVu } from "../type/services"
// Sample data for service types


// Sample data for services
const paymentCycles = [
  { value: 1, label: "Theo tháng" },
  { value: 3, label: "Theo quý" },
  { value: 6, label: "Nửa năm" },
  { value: 12, label: "1 năm" },
]
const units = ["kWh", "m³", "month", "day", "hour", "piece", "service","m2"]
export function ServiceList() {
  const { serviceTypes } = useServiceType();
  const { services, createService, removeService } = useServices();
  const [servicesUse, setServicesUse] = useState(services)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newService, setNewService] = useState({
    tenDV: "",
    maLDV: 1,
    donGia: 0,
    tyLeVAT: 10,
    tyLeBVMT: 0,
    donViTinh: "kWh",
    kyThanhToan: 1,
    isThanhToanTheoKy: true,
    maTN: 1,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<number | null>(null)

  const handleAddService = async () => {
    if (!newService.tenDV.trim()) return

    const newServiceItem: CreateDichVu = {
      ...newService,
    }

    await createService(newServiceItem)

    // setServices([...services, newServiceItem])
    setNewService({
      tenDV: "",
      maLDV: 1,
      donGia: 0,
      tyLeVAT: 10,
      tyLeBVMT: 0,
      donViTinh: "kWh",
      kyThanhToan: 1,
      isThanhToanTheoKy: true,
      maTN: 1,
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteService = (id: number) => {
    setServicesUse(services.filter((service) => service.id !== id))
  }

  const filteredServices = services.filter(
    (service) =>
      service.tenDV.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === null || service.maLDV === selectedType),
  )

  const getServiceTypeIcon = (maLDV: number) => {
    const type = serviceTypes.find((t) => t.id === maLDV)
    return type ? type.icon : null
  }

  const getServiceTypeName = (maLDV: number) => {
    const type = serviceTypes.find((t) => t.id === maLDV)
    return type ? type.name : "Unknown"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }
  const getPaymentCycleName = (kyThanhToan: number) => {
    const cycle = paymentCycles.find((c) => c.value === kyThanhToan)
    return cycle ? cycle.label : `${kyThanhToan} month(s)`
  }
  // Group services by type for the drag and drop view
  const servicesByType = serviceTypes.map((type) => ({
    type,
    services: filteredServices.filter((service) => service.maLDV === type.id),
  }))
  function processIconString(iconStr: string) {
    return iconStr
      .replace(/^["']|["']$/g, '')  // Xóa quotes ở đầu và cuối
      .replace(/\\"/g, '"')         // Unescape double quotes
      .replace(/\\'/g, "'")         // Unescape single quotes
      .replace(/\\\\/g, "\\");      // Unescape backslashes
  }
  return (
    <div className="space-y-6">
      {/* Service Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tất cả dịch vụ</CardTitle>
            <ListPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trung bình</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(services.reduce((sum, s) => sum + s.donGia, 0) / services.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">trên một dịch vụ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loại dịch vụ</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceTypes.length}</div>
            <p className="text-xs text-muted-foreground">danh mục dịch vụ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periodic Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.filter((s) => s.isThanhToanTheoKy).length}</div>
            <p className="text-xs text-muted-foreground">Recurring billing</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Select
            value={selectedType?.toString() || "0"}
            onValueChange={(value) => setSelectedType(value === "0" ? null : Number.parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả loại dịch vụ</SelectItem>
              {serviceTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  <div className="flex items-center">
                    <DynamicIcon iconString={processIconString(type.icon)} />
                    <span className="ml-2">{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ mới</DialogTitle>
              <DialogDescription>Nhập thông tin cho dịch vụ mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tenDV">Tên dịch vụ</Label>
                    <Input
                      id="tenDV"
                      value={newService.tenDV}
                      onChange={(e) => setNewService({ ...newService, tenDV: e.target.value })}
                      placeholder="VD: Điện cư dân.."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maLDV">Loại dịch vụ</Label>
                    <Select
                      value={newService.maLDV.toString()}
                      onValueChange={(value) => setNewService({ ...newService, maLDV: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="maLDV">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            <div className="flex items-center">
                              <DynamicIcon iconString={processIconString(type.icon)} />
                              <span className="ml-2">{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h2 className="text-sm font-extrabold">Thông tin đơn giá</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="donGia">Đơn giá(VND)</Label>
                    <Input
                      id="donGia"
                      type="number"
                      value={newService.donGia || ""}
                      onChange={(e) => setNewService({ ...newService, donGia: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="đơn giá dịch vụ"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tyLeVAT">Thuế VAT (%)</Label>
                    <Input
                      id="tyLeVAT"
                      type="number"
                      value={newService.tyLeVAT || ""}
                      onChange={(e) =>
                        setNewService({ ...newService, tyLeVAT: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="VAT percentage"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tyLeBVMT">Thuế BVMT (%)</Label>
                    <Input
                      id="tyLeBVMT"
                      type="number"
                      value={newService.tyLeBVMT || ""}
                      onChange={(e) =>
                        setNewService({ ...newService, tyLeBVMT: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Environment tax"
                    />
                  </div>
                </div>
              </div>

              {/* Service Configuration */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold">Thông tin dịch vụ</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="donViTinh">Đơn vị tính</Label>
                    <Select
                      value={newService.donViTinh}
                      onValueChange={(value) => setNewService({ ...newService, donViTinh: value })}
                    >
                      <SelectTrigger id="donViTinh">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kyThanhToan">Payment Cycle</Label>
                    <Select
                      value={newService.kyThanhToan.toString()}
                      onValueChange={(value) => setNewService({ ...newService, kyThanhToan: Number(value) })}
                    >
                      <SelectTrigger id="kyThanhToan">
                        <SelectValue placeholder="Select cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentCycles.map((cycle) => (
                          <SelectItem key={cycle.value} value={cycle.value.toString()}>
                            {cycle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isThanhToanTheoKy"
                      checked={newService.isThanhToanTheoKy}
                      onCheckedChange={(checked) => setNewService({ ...newService, isThanhToanTheoKy: checked })}
                    />
                    <Label htmlFor="isThanhToanTheoKy">Thanh toán theo kỳ</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddService}>Thêm dịch vụ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grouped Services View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servicesByType.map(({ type, services }) => (
          <Card key={type.id} className={services.length > 0 ? "" : "opacity-70"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <DynamicIcon iconString={processIconString(type.icon)} />

                <CardTitle className="text-lg">{type.name}</CardTitle>
              </div>
              <Badge variant={type.isEssential ? "default" : "outline"}>
                {type.isEssential ? "Essential" : "Optional"}
              </Badge>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex-1">
                        <p className="font-medium">{service.tenDV}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {formatPrice(service.donGia)}/{service.donViTinh}
                          </span>
                          {service.isThanhToanTheoKy && (
                            <Badge variant="secondary" className="text-xs">
                              {getPaymentCycleName(service.kyThanhToan)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">No services found</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả dịch vụ</CardTitle>
          <CardDescription>Tất cả dịch vụ trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thuế VAT</TableHead>
                <TableHead>Thuế BVMT</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service,index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p>{service.tenDV}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {service.isThanhToanTheoKy && (
                          <Badge variant="secondary" className="text-xs">
                            Periodic
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(service.donGia)}</TableCell>
                  <TableCell>{service.tyLeVAT}%</TableCell>
                  <TableCell>{service.tyLeBVMT}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{getPaymentCycleName(Number(service.kyThanhToan))}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
