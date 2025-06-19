"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  ListChecks,
  ListPlus,
  Search,
  Droplet,
  Tv,
  Phone,
  Thermometer,
  Shield,
} from "lucide-react"
import type { JSX } from "react"
import { useServiceType } from "../context/ServiceTypeContext"
import DynamicIcon from "@/app/providers/DynamicIcon"
import { CreateLoaiDichVu } from "../type/serviceType"


export function ServiceTypeList() {
  const { serviceTypes, createServiceType,removeServiceType } = useServiceType();
  const [serviceTypesUse, setServiceTypesUse] = useState(serviceTypes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newServiceType, setNewServiceType] = useState({
    tenLDV: "",
    moTa: "",
    icon: "Zap",
    iconColor: "text-yellow-500",
    isEssential: false,
    matn: "", // or provide a default value if needed
  })
  const [searchQuery, setSearchQuery] = useState("")
  const availableIcons = [
    { name: "Zap", component: Zap, label: "Electricity" },
    { name: "Droplets", component: Droplets, label: "Water" },
    { name: "Wifi", component: Wifi, label: "Internet" },
    { name: "Car", component: Car, label: "Parking" },
    { name: "Dumbbell", component: Dumbbell, label: "Gym" },
    { name: "Shield", component: Shield, label: "Security" },
    { name: "Thermometer", component: Thermometer, label: "HVAC" },
    { name: "Trash2", component: Trash2, label: "Waste" },
    { name: "Phone", component: Phone, label: "Phone" },
    { name: "Tv", component: Tv, label: "Cable TV" },
  ]
  const availableColors = [
    "text-yellow-500",
    "text-blue-500",
    "text-purple-500",
    "text-gray-500",
    "text-green-500",
    "text-red-500",
    "text-orange-500",
    "text-pink-500",
    "text-indigo-500",
    "text-teal-500",
  ]
  const handleAddServiceType = async () => {
    if (!newServiceType.tenLDV.trim()) return
    const iconString = `<${newServiceType.icon} className="h-5 w-5 ${newServiceType.iconColor}" />`
    const SelectedIcon = availableIcons.find((i) => i.name === newServiceType.icon)?.component || Zap
    const newType:CreateLoaiDichVu = {
      tenLDV: newServiceType.tenLDV,
      moTa: newServiceType.moTa,
      isEssential: newServiceType.isEssential, // typo in API type?
      maTN: null, // or provide a default value if needed
      icon: iconString
    }
    await createServiceType(newType)

    // setServiceTypesUse(newType)
    setNewServiceType({ tenLDV: "", moTa: "", isEssential: false, matn: "", icon: "Zap", iconColor: "text-yellow-500" }) // Reset form
    setIsAddDialogOpen(false)

    console.log("New service type added:", newType)
  }

  function processIconString(iconStr: string) {
    return iconStr
      .replace(/^["']|["']$/g, '')  // Xóa quotes ở đầu và cuối
      .replace(/\\"/g, '"')         // Unescape double quotes
      .replace(/\\'/g, "'")         // Unescape single quotes
      .replace(/\\\\/g, "\\");      // Unescape backslashes
  }

  const handleDeleteServiceType = async (id: number) => {
    setServiceTypesUse(serviceTypes.filter((type) => type.id !== id))
    await removeServiceType(id)
  }

  const filteredServiceTypes = serviceTypes.filter(
  (type) => {
    const name = type.name || type.name || ""; // Fallback cho các tên field khác nhau
    const description = type.description || type.description || "";
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           description.toLowerCase().includes(searchQuery.toLowerCase());
  }
)

  const essentialServices = filteredServiceTypes.filter((type) => type.isEssential === true)
  const otherServices = filteredServiceTypes.filter((type) => type.isEssential === false)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số loại dịch vụ</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceTypes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ cơ bản</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{essentialServices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ tiện ích</CardTitle>
            <Dumbbell className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otherServices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dịch vụ</CardTitle>
            <ListPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceTypesUse.reduce((total, type) => total + type.servicesCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Tìm kiếm loại dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm loại dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm loại dịch vụ mới</DialogTitle>
              <DialogDescription>Thêm loại dịch vụ mới cho tòa nhà của bạn</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên loại dịch vụ</Label>
                <Input
                  id="tenLDV"
                  value={newServiceType.tenLDV}
                  onChange={(e) => setNewServiceType({ ...newServiceType, tenLDV: e.target.value })}
                  placeholder="VD: Điện, Nước, Internet"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="moTa"
                  value={newServiceType.moTa}
                  onChange={(e) => setNewServiceType({ ...newServiceType, moTa: e.target.value })}
                  placeholder="Mô tả ngắn gọn về loại dịch vụ"
                />
              </div>
              <div className="grid gap-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableIcons.map((iconItem) => {
                    const IconComponent = iconItem.component
                    return (
                      <Button
                        key={iconItem.name}
                        type="button"
                        variant={newServiceType.icon === iconItem.name ? "default" : "outline"}
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => setNewServiceType({ ...newServiceType, icon: iconItem.name })}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Màu Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={newServiceType.iconColor === color ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setNewServiceType({ ...newServiceType, iconColor: color })}
                    >
                      <div className={`h-4 w-4 rounded-full bg-current ${color}`} />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Preview</Label>
                <div className="flex items-center space-x-2 p-2 border rounded">
                  {(() => {
                    const SelectedIcon = availableIcons.find((i) => i.name === newServiceType.icon)?.component || Zap
                    return <SelectedIcon className={`h-5 w-5 ${newServiceType.iconColor}`} />
                  })()}
                  <span className="font-medium">{newServiceType.tenLDV || "Tên dịch vụ"}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={newServiceType.isEssential}
                  onChange={(e) => setNewServiceType({ ...newServiceType, isEssential: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isEssential">Dịch vụ cơ bản</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServiceType} disabled={!newServiceType.tenLDV.trim()}>
                Thêm Loại Dịch Vụ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Essential Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ cơ bản</CardTitle>
          <CardDescription>Dịch vụ cần thiết cho cư dân</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {essentialServices.map((type,index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <DynamicIcon iconString={processIconString(type.icon)} />
                    <CardTitle className="text-lg">{type.name}</CardTitle>
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
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteServiceType(type.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant="outline">{type.servicesCount} dịch vụ</Badge>
                  <Button variant="outline" size="sm">
                    Xem dịch vụ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ tiện ích</CardTitle>
          <CardDescription>Dịch vụ tiện ích cho cư dân</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên loại dịch vụ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherServices.map((type,index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <DynamicIcon iconString={processIconString(type.icon)} />
                      <span>{type.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{type.servicesCount}</Badge>
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
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteServiceType(type.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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
