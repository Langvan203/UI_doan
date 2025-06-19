"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Zap, Droplets, Edit, MoreVertical, Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useElectricityRate } from "../context/ElectricityRate"
import { useAuth } from "../context/AuthContext"
import { useWaterRate } from "../context/WaterRate"
import { CreateDinhMuc, DinhMuc, UpdateDinhMuc } from "../type/electricityRate"
import { toast } from "react-toastify"
import { se } from "date-fns/locale"

// Sample data for service types that can have rates
const serviceTypesWithRates = [
  {
    id: 1,
    name: "Điện",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    unit: "kWh",
  },
  {
    id: 2,
    name: "Nước",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    unit: "m³",
  },
]

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function ServiceRateManagement() {
  const [activeTab, setActiveTab] = useState("electricity")
  const { token } = useAuth()
  // lấy danh sách định mức điện
  const { electricityRates, getElectricityRates, addElectricityRate, deleteElectricityRate, updateElectricityRate } = useElectricityRate()
  useEffect(() => {
    getElectricityRates()
  }, [token])

  // lấy danh sách định mức nước
  const { WaterRates, getWaterRates, addWaterRate, deleteWaterRate, updateWaterRate } = useWaterRate()
  useEffect(() => {
    getWaterRates()
  }, [token])
  // tối ưu khi nhập form

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newRate, setNewRate] = useState({
    name: "",
    fromValue: 0 as number | null,
    toValue: 0 as number | null,
    price: 0 as number | null,
    serviceTypeId: 1, // Default to electricity
    description: "",
  })
  const [editingRate, setEditingRate] = useState<DinhMuc>({
    maDM: 0,
    tenDM: "",
    chiSoDau: 0,
    chiSoCuoi: 0,
    donGia: 0,
    description: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [localSearchQuery, setLocalSearchQuery] = useState("") // THÊM dòng này
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)
  const serviceTypeId = useMemo(() => {
    return activeTab === "electricity" ? 1 : 2
  }, [activeTab])
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery])
  const placeholders = useMemo(() => ({
    fromValue: `Bắt đầu từ... ${newRate.serviceTypeId === 1 ? "kWh" : newRate.serviceTypeId === 2 ? "m³" : "unit"}`,
    toValue: `Kết thúc... ${newRate.serviceTypeId === 1 ? "kWh" : newRate.serviceTypeId === 2 ? "m³" : "unit"}`
  }), [newRate.serviceTypeId])
  const handleNameChange = useCallback((e: any) => {
    setNewRate(prev => ({ ...prev, name: e.target.value }))
  }, [])

  const handleDescriptionChange = useCallback((e: any) => {
    setNewRate(prev => ({ ...prev, description: e.target.value }))
  }, [])

  const handleFromValueChange = useCallback((e: any) => {
    const value = e.target.value
    setNewRate(prev => ({
      ...prev,
      fromValue: value === "" ? null : parseInt(value, 10)
    }))
  }, [])

  const handleToValueChange = useCallback((e: any) => {
    const value = e.target.value
    setNewRate(prev => ({
      ...prev,
      toValue: value === "" ? null : parseInt(value, 10)
    }))
  }, [])

  const handlePriceChange = useCallback((e: any) => {
    const value = e.target.value
    setNewRate(prev => ({
      ...prev,
      price: value === "" ? null : parseInt(value, 10)
    }))
  }, [])

  const handleServiceTypeChange = useCallback((value: any) => {
    setNewRate(prev => ({ ...prev, serviceTypeId: parseInt(value, 10) }))
  }, [])
  const handleAddRate = async () => {
    const newRateItem: CreateDinhMuc = {
      // id: newId,
      tenDM: newRate.name,
      chiSoDau: newRate.fromValue ?? 0,
      chiSoCuoi: newRate.toValue ?? 0,
      donGiaDinhMuc: newRate.price ?? 0,
      description: newRate.description,
    }
    if (newRate.serviceTypeId === 1) {
      await addElectricityRate(newRateItem)
      toast.success("Đã thêm định mức điện mới thành công!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => getElectricityRates(),
      })
    } else {
      addWaterRate(newRateItem)
    }
    setNewRate({
      name: "",
      fromValue: 0,
      toValue: 0,
      price: 0,
      description: "",
      serviceTypeId: 1, // Reset to default
    })
    setIsAddDialogOpen(false)
  }

  const handleEditRate = async () => {
    if (!editingRate) return

    if (serviceTypeId === 1) {
      electricityRates.map((rate) => (rate.maDM === editingRate.maDM ? { ...editingRate } : rate))
      const result = await updateElectricityRate(editingRate)
      if (result) {
        toast.success(`${result}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => getElectricityRates(),
        })
      } else {
        toast.error("Cập nhật định mức điện thất bại!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    } else {
      (WaterRates.map((rate) => (rate.maDM === editingRate.maDM ? { ...editingRate } : rate)))
      if (await updateWaterRate(editingRate)) {
        toast.success("Đã cập nhật định mức nước thành công!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => getWaterRates(),
        })
      }
      else
      {
        toast.error("Cập nhật định mức nước thất bại!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    }
    setEditingRate({
      maDM: 0,
      tenDM: "",
      chiSoDau: 0,
      chiSoCuoi: 0,
      donGia: 0,
      description: "",
    } as DinhMuc
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteRate = (id: number) => {
    if(serviceTypeId === 1) {
      deleteElectricityRate(id).then((result) => {
        if (result) {
          toast.success("Đã xóa định mức điện thành công!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => getElectricityRates(),
          })
        } else {
          toast.error("Xóa định mức điện thất bại!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
    else {
      deleteWaterRate(id).then((result) => {
        if (result) {
          toast.success("Đã xóa định mức nước thành công!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => getWaterRates(),
          })
        } else {
          toast.error("Xóa định mức nước thất bại!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
  }

  const startEditRate = (rate: any) => {
    setEditingRate({ ...rate })
    setIsEditDialogOpen(true)
  }

  // Filter rates based on search query
  const filteredElectricityRates = electricityRates.filter(
    (rate) =>
      rate.tenDM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredWaterRates = WaterRates.filter(
    (rate) =>
      rate.tenDM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate example bill for electricity
  const calculateElectricityBill = (usage: number) => {
    let total = 0
    const sortedRates = [...electricityRates]
      .filter((rate) => rate.tenDM.includes("cư dân"))
      .sort((a, b) => a.chiSoDau - b.chiSoCuoi)

    let remainingUsage = usage

    for (const rate of sortedRates) {
      if (remainingUsage <= 0) break

      const usageInThisTier =
        rate.chiSoCuoi === null ? remainingUsage : Math.min(remainingUsage, rate.chiSoCuoi - rate.chiSoDau + 1)

      total += usageInThisTier * rate.donGia
      remainingUsage -= usageInThisTier
    }

    return total
  }

  // Calculate example bill for water
  const calculateWaterBill = (usage: number) => {
    let total = 0
    const sortedRates = [...WaterRates]
      .filter((rate) => rate.tenDM.includes("bậc"))
      .sort((a, b) => a.chiSoDau - b.chiSoDau)

    let remainingUsage = usage

    for (const rate of sortedRates) {
      if (remainingUsage <= 0) break

      const usageInThisTier =
        rate.chiSoCuoi === null ? remainingUsage : Math.min(remainingUsage, rate.chiSoCuoi - rate.chiSoDau + 1)

      total += usageInThisTier * rate.donGia
      remainingUsage -= usageInThisTier
    }

    return total
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Tìm kiếm định mức"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm định mức mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm định mức mới</DialogTitle>
              <DialogDescription>Thêm định mức mới cho dịch vụ điện và dịch vụ nước</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Loại dịch vụ</Label>
                <Select
                  value={newRate.serviceTypeId.toString()}
                  onValueChange={handleServiceTypeChange}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypesWithRates.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Tên định mức</Label>
                <Input
                  id="name"
                  value={newRate.name}
                  onChange={handleNameChange}
                  placeholder="Điện cư dân....."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fromValue">Chỉ số đầu</Label>
                  <Input
                    id="fromValue"
                    type="number"
                    value={newRate.fromValue ?? ""}
                    onChange={handleFromValueChange}
                    placeholder={placeholders.fromValue}
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="toValue">Chỉ số cuối</Label>
                  <Input
                    id="toValue"
                    type="number"
                    value={newRate.toValue ?? ""}
                    onChange={handleToValueChange}
                    placeholder={placeholders.toValue}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Đơn giá trong phạm vi định mức</Label>
                <Input
                  id="price"
                  type="number"
                  value={newRate.price ?? ""}
                  onChange={handlePriceChange}
                  placeholder="Giá trên mỗi đơn vị (VND) như 1000, 2000, 3000..."
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  value={newRate.description}
                  onChange={handleDescriptionChange}
                  placeholder="Mô tả định mức, ví dụ: 'Định mức điện cho cư dân', 'Định mức nước thương mại'..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddRate}>Thêm định mức mới</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa định mức</DialogTitle>
              <DialogDescription>Chỉnh sửa chi tiết định mức</DialogDescription>
            </DialogHeader>
            {editingRate && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editName">Tên định mức</Label>
                  <Input
                    id="editName"
                    value={editingRate.tenDM}
                    onChange={(e) => setEditingRate({ ...editingRate, tenDM: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editFromValue">Chỉ số đầu</Label>
                    <Input
                      id="editFromValue"
                      type="number"
                      value={editingRate.chiSoDau || 0}
                      min={0}
                      onChange={(e) =>
                        setEditingRate({ ...editingRate, chiSoDau: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editToValue">Chỉ số cuối</Label>
                    <Input
                      id="editToValue"
                      type="number"
                      value={editingRate.chiSoCuoi === null ? "" : editingRate.chiSoCuoi}
                      onChange={(e) =>
                        setEditingRate({
                          ...editingRate,
                          chiSoCuoi: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPrice">Đơn giá (VND)</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    value={editingRate.donGia || ""}
                    onChange={(e) => setEditingRate({ ...editingRate, donGia: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDescription">Mô tả</Label>
                  <Input
                    id="editDescription"
                    value={editingRate.description}
                    onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditRate}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Định mức điện</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Định mức nước</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="mt-4 space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Đơn giá được tính theo định mức</AlertTitle>
            <AlertDescription>
              Điện được tính theo từng bậc. Mỗi mức sử dụng được tính theo mức giá tương ứng.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Đơn giá điện được tính theo định mức</CardTitle>
              <CardDescription>Xác định các mức giá khác nhau cho mức tiêu thụ điện</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên định mức</TableHead>
                    <TableHead>Phạm vi</TableHead>
                    <TableHead>Giá trên mỗi Kwh</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElectricityRates.map((rate, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rate.tenDM}</TableCell>
                      <TableCell>
                        {rate.chiSoDau} - {rate.chiSoCuoi > 999 ? "∞" : rate.chiSoCuoi} kWh
                      </TableCell>
                      <TableCell>{formatPrice(rate.donGia)}</TableCell>
                      <TableCell>{rate.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditRate(rate)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRate(rate.maDM)}>
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

          <Card>
            <CardHeader>
              <CardTitle>Mô phỏng tính tiền điện</CardTitle>
              <CardDescription>Xem cách các mức giá theo bậc ảnh hưởng đến tổng hóa đơn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[100, 200, 350].map((usage) => {
                  const bill = calculateElectricityBill(usage)
                  return (
                    <Card key={usage}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Sử dụng: {usage} kWh</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(bill)}</div>
                        <p className="text-sm text-muted-foreground">Giá trung bình: {formatPrice(bill / usage)}/kWh</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4 space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Đơn giá được tính theo định mức</AlertTitle>
            <AlertDescription>
              Nước được tính theo từng bậc. Mỗi mức sử dụng được tính theo mức giá tương ứng.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Đơn giá nước được tính theo định mức</CardTitle>
              <CardDescription>Xác định các mức giá khác nhau cho mức tiêu thụ nước</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên định mức</TableHead>
                    <TableHead>Phạm vi</TableHead>
                    <TableHead>Giá trên mỗi m³</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWaterRates.map((rate, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rate.tenDM}</TableCell>
                      <TableCell>
                        {rate.chiSoDau} - {rate.chiSoCuoi >= 999 ? "∞" : rate.chiSoCuoi} m³
                      </TableCell>
                      <TableCell>{formatPrice(rate.donGia)}</TableCell>
                      <TableCell>{rate.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditRate(rate)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRate(rate.maDM)}>
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

          <Card>
            <CardHeader>
              <CardTitle>Mô phỏng tính đơn giá nước</CardTitle>
              <CardDescription>Xem cách các mức giá theo bậc ảnh hưởng đến tổng hóa đơn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[10, 20, 35].map((usage) => {
                  const bill = calculateWaterBill(usage)
                  return (
                    <Card key={usage}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Sử dụng: {usage} m³</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(bill)}</div>
                        <p className="text-sm text-muted-foreground">Giá trung bình: {formatPrice(bill / usage)}/m³</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
