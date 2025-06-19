"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Zap,
  Droplets,
  MoreVertical,
  Plus,
  Trash2,
  History,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useBuilding } from "../context/BuildingContext"
import { useAuth } from "../context/AuthContext"
import { useMetterContext } from "../context/MetterContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateDongHo, DongHo, DongHoPaged } from "../type/Metter"



// Sample data for meter types
const meterTypes = [
  { id: 1, name: "Đồng hồ điện", icon: <Zap className="h-5 w-5 text-yellow-500" />, unit: "kWh" },
  { id: 2, name: "Đồng hồ nước", icon: <Droplets className="h-5 w-5 text-blue-500" />, unit: "m³" },
]

// Sample data for meters

export function MeterManagement() {
  // lấy thông tin bộ lọc tòa nhà, khối nhà, tầng lầu từ API
  const { buildingListForDropdown,
    blockListForDropdown,
    floorListForDropdown,
    premisseListForDropdown,
    getPremisseListForDropdown,
    getBuildingListForDropdown,
    getBlockListForDropdown,
    getFloorListForDropdown } = useBuilding();
  const { electricMetters, waterMetters, getElectricMetters, getWaterMetters } = useMetterContext();
  const { token } = useAuth();
  useEffect(() => {
    if (token) {
      getBuildingListForDropdown();
      getBlockListForDropdown();
      getFloorListForDropdown();
      getElectricMetters(1);
      getWaterMetters(1);
      getPremisseListForDropdown();
    }
  }, [token]);


  const [activeTab, setActiveTab] = useState("electricity")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isReadingDialogOpen, setIsReadingDialogOpen] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<any>(null)
  const [newMeter, setNewMeter] = useState<CreateDongHo>({
    soDongHo: "",
    chiSoSuDung: 0,
    trangThai: true,
    maMB: 0,
    maKH: 0,
    maTN: 0,
    maKN: 0,
    maTL: 0,
  })
  const [newReading, setNewReading] = useState({
    date: new Date().toISOString().split("T")[0],
    value: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)



  const handleAddMeter = () => {
    if (!newMeter.soDongHo || !newMeter.maMB || !newMeter.maKH || !newMeter.maTN || !newMeter.maKN || !newMeter.maTL) {
      alert("Vui lòng điền đầy đủ thông tin đồng hồ đo")
      return
    }
    const newMeterItem: CreateDongHo = {
      // id: newId,
      soDongHo: newMeter.soDongHo,
      chiSoSuDung: 0, // Mặc định là 0 khi thêm mới
      trangThai: true, // Mặc định là hoạt động
      maMB: newMeter.maMB, // Mã vị trí (căn hộ)
      maKH: newMeter.maKH, // Mã cư dân (nếu có)
      maTN: selectedBuilding || 0, // Mã tòa nhà
      maKN: selectedBlock || 0, // Mã khối nhà
      maTL: selectedFloor || 0, // Mã tầng lầu
    }

    // setMeters([...meters, newMeterItem])
    setNewMeter({
      soDongHo: "",
      chiSoSuDung: 0,
      trangThai: true,
      maMB: 0,
      maKH: 0,
      maTN: 0,
      maKN: 0,
      maTL: 0,
    })

    setIsAddDialogOpen(false)
  }

  const handleAddReading = () => {

  }


  const handleDeleteMeter = (id: number) => {
    // setMeters(meters.filter((meter) => meter.id !== id))
  }

  const handleChangeMeterStatus = (id: number, status: boolean) => {
    // setMeters(meters.map((meter) => (meter.id === id ? { ...meter, status } : meter)))
  }

  // Filter blocks based on selected building
  const filteredBlocks = blockListForDropdown.filter((block) => selectedBuilding === null || block.maTN === selectedBuilding)

  // Filter floors based on selected block
  const filteredFloors = floorListForDropdown.filter((floor) => selectedBlock === null || floor.maKN === selectedBlock)

  // Filter units based on selected floor
  const filteredUnits = premisseListForDropdown.filter((unit) => selectedFloor === null || unit.maTL === selectedFloor)


  // Filter meters based on search query, selected building, block, floor, and active tab
  const currentMeters: DongHo[] = useMemo(() => {
    return activeTab === "electricity"
      ? electricMetters?.data || []
      : waterMetters?.data || [];
  }, [activeTab, electricMetters, waterMetters]);

  // Filter mảng DongHo[]
  const filteredMeters = useMemo(() => {
    return currentMeters.filter((dongHo) => {
      const searchLower = (searchQuery || "").toLowerCase();
      const matchesSearch = !searchQuery ||
        dongHo.soDongHo?.toLowerCase().includes(searchLower) ||
        dongHo.tenKH?.toLowerCase().includes(searchLower);

      const matchesBuilding = !selectedBuilding || dongHo.maTN === selectedBuilding;
      const matchesBlock = !selectedBlock || dongHo.maKN === selectedBlock;
      const mathchesFloor = !selectedFloor || dongHo.maTL === selectedFloor;
      return matchesSearch && mathchesFloor && matchesBuilding && matchesBlock;
    });
  }, [currentMeters, searchQuery,selectedFloor, selectedBuilding, selectedBlock]);

  // Filter dữ liệu


  // Function to get unit details by ID
  function getUnitById(unitId: number | string | undefined) {
    if (!unitId) return null;

    // Search for the unit in the premises list
    const unit = premisseListForDropdown.find(premise => premise.maMB === unitId);

    if (!unit) return null;

    // Return formatted unit data
    return {
      id: unit.maMB,
      name: unit.maVT || unit.maMB.toString(),
      // Add any other required properties
    };
  }

  // Helper function to get meter type by ID (referenced but not implemented)
  function getMeterTypeById(typeId: number) {
    return meterTypes.find(type => type.id === typeId) || null;
  }

  // Helper function to get resident by unit ID (referenced but not implemented)
  function getResidentByUnitId(unitId: number) {
    // This would typically fetch resident data from your state or API
    // For now returning null as we don't have resident data in the context
    return null;
  }

  // Helper function to verify meter readings
  function handleVerifyReading(meterId: number, readingIndex: number) {
    // Implementation would update the verified status of the reading
    console.log(`Verifying reading ${readingIndex} for meter ${meterId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Tìm kiếm đồng hồ đo theo vị trí hoặc số seri"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={selectedBuilding?.toString() || ""}
            onValueChange={(value) => {
              setSelectedBuilding(value ? Number.parseInt(value) : null)
              setSelectedBlock(null)
              setSelectedFloor(null)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn tòa nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildingListForDropdown.map((building, index) => (
                <SelectItem key={index} value={building.id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedBlock?.toString() || ""}
            onValueChange={(value) => {
              setSelectedBlock(value ? Number.parseInt(value) : null)
              setSelectedFloor(null)
            }}
            disabled={selectedBuilding === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn khối nhà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khối nhà</SelectItem>
              {filteredBlocks.map((block, index) => (
                <SelectItem key={index} value={block.maKN.toString()}>
                  {block.tenKN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedFloor?.toString() || ""}
            onValueChange={(value) => setSelectedFloor(value ? Number.parseInt(value) : null)}
            disabled={selectedBlock === null}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn tầng lầu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tầng lầu</SelectItem>
              {filteredFloors.map((floor, index) => (
                <SelectItem key={index} value={floor.maTL.toString()}>
                  {floor.tenTL}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm đồng hồ đo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm đồng hồ đo mới</DialogTitle>
              <DialogDescription>Đăng ký sử dụng đồng hồ đo mới cho cư dân</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Số đồng hồ</Label>
                <Input
                  id="serialNumber"
                  value={newMeter.soDongHo}
                  onChange={(e) => setNewMeter({ ...newMeter, soDongHo: e.target.value })}
                  placeholder="e.g., E-A1-101, W-B2-203"
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="meterType">Loại đồng hồ</Label>
                <Select
                  value={newMeter.typeId.toString()}
                  onValueChange={(value) => setNewMeter({ ...newMeter, typeId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="meterType">
                    <SelectValue placeholder="Chọn loại đồng hồ" />
                  </SelectTrigger>
                  <SelectContent>
                    {meterTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="building">Tòa nhà</Label>
                <Select
                  value={selectedBuilding?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedBuilding(value ? Number.parseInt(value) : null)
                    setSelectedBlock(null)
                    setSelectedFloor(null)
                    setNewMeter({ ...newMeter, maTN: Number.parseInt(value) })
                  }}
                >
                  <SelectTrigger id="building">
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingListForDropdown.map((building) => {
                      return (
                        <SelectItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="block">khối nhà</Label>
                <Select
                  value={selectedBlock?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedBlock(value ? Number.parseInt(value) : null)
                    setSelectedFloor(null)
                    setNewMeter({ ...newMeter, maKN: Number.parseInt(value) })
                  }}
                  disabled={selectedBuilding === null}
                >
                  <SelectTrigger id="block">
                    <SelectValue placeholder="Chọn khối nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBlocks.map((building) => {
                      return (
                        <SelectItem key={building.maKN} value={building.maKN.toString()}>
                          {building.tenKN}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Tầng lầu</Label>
                <Select
                  value={selectedFloor?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedFloor(value ? Number.parseInt(value) : null)
                    setNewMeter({ ...newMeter, maTL: Number.parseInt(value) })
                  }}
                  disabled={selectedBlock === null}
                >
                  <SelectTrigger id="floor">
                    <SelectValue placeholder="Chọn tầng lầu" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFloors.map((building) => {
                      return (
                        <SelectItem key={building.maTL} value={building.maTL.toString()}>
                          {building.tenTL}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Vị trí</Label>
                <Select
                  value={newMeter.maMB ? newMeter.maMB.toString() : ""}
                  onValueChange={(value) => setNewMeter({ ...newMeter, maMB: Number.parseInt(value) })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUnits.map((unit) => {
                      // const resident = getResidentByUnitId(unit.id)
                      return (
                        <SelectItem key={unit.maMB} value={unit.maMB.toString()}>
                          {unit.maVT} - {unit.tenKH || "Unoccupied"}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddMeter}>Thêm đồng hồ mới</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReadingDialogOpen} onOpenChange={setIsReadingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ghi chỉ số hoạt động mới</DialogTitle>
              <DialogDescription>Ghi chỉ số hoạt động mới cho đồng hồ{selectedMeter?.serialNumber || ""}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="readingValue">
                  Chỉ số mới ({selectedMeter?.typeId === 1 ? "kWh" : selectedMeter?.typeId === 2 ? "m³" : "units"})
                </Label>
                <Input
                  id="readingValue"
                  type="number"
                  value={newReading.value || ""}
                  onChange={(e) => setNewReading({ ...newReading, value: Number.parseInt(e.target.value) || 0 })}
                  placeholder="giá trị chỉ số mới"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReadingDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddReading}>Ghi chỉ số</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Đồng hồ điện</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Đồng hồ nước</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đồng hồ điện</CardTitle>
              <CardDescription>Quản lý danh sách đồng hồ điện của cư dân</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMeters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Số đồng hồ</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Cư dân</TableHead>
                      <TableHead>Chỉ số sử dụng</TableHead>
                      <TableHead>Ngày cập nhật cuối cùng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.map((meter) => {
                      return (
                        <TableRow key={meter.maDH}>
                          <TableCell className="font-medium">{meter.soDongHo}</TableCell>
                          <TableCell>{meter.maVT || "Unknown"}</TableCell>
                          <TableCell>{meter.tenKH || "Unoccupied"}</TableCell>
                          <TableCell>
                            {meter.updatedDate}
                          </TableCell>
                          <TableCell>{meter.updatedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                meter.trangThai === true
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : meter.trangThai === false
                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                    : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {meter.trangThai === true ? "Hoạt động" : meter.trangThai === false ? "Đang sửa chữa" : "Không xác định"}
                            </Badge>
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMeter(meter)
                                    // setNewReading({
                                    //   date: new Date().toISOString().split("T")[0],
                                    //   value: meter.updatedDate ? meter.updatedDate : 0,
                                    // })
                                    setIsReadingDialogOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Ghi chỉ số
                                </DropdownMenuItem>
                                {meter.trangThai === true ? (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.maDH, false)}>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                                    Bảo trì đồng hồ
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.maDH, true)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Đang hoạt động
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteMeter(meter.maDH)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">Không có đồng hồ điện nào được tìm thấy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Đồng hồ nước</CardTitle>
              <CardDescription>Quản lý danh sách đồng hồ nước của cư dân</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMeters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Số đồng hồ</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Cư dân</TableHead>
                      <TableHead>Chỉ số sử dụng</TableHead>
                      <TableHead>Lần cập nhật cuối</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.map((meter) => {
                      return (
                        <TableRow key={meter.maDH}>
                          <TableCell className="font-medium">{meter.soDongHo}</TableCell>
                          <TableCell>{meter.maVT || "Unknown"}</TableCell>
                          <TableCell>{meter.tenKH || "Unoccupied"}</TableCell>
                          <TableCell>
                            {meter.updatedDate}
                          </TableCell>
                          <TableCell>{meter.updatedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                meter.trangThai === true
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : meter.trangThai === false
                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                    : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {meter.trangThai === true ? "Hoạt động" : meter.trangThai === false ? "Đang sửa chữa" : "Không xác định"}
                            </Badge>
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMeter(meter)
                                    setIsReadingDialogOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Ghi chỉ số
                                </DropdownMenuItem>
                                {meter.trangThai === true ? (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.maDH, false)}>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                                    Bảo trì đồng hồ
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleChangeMeterStatus(meter.maDH, true)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Đang hoạt động
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteMeter(meter.maDH)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">Không có đồng hồ nước nào được tìm thấy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      <Card>
        <CardHeader>
          <CardTitle>Thống kê sử dụng</CardTitle>
          <CardDescription>Thống kê số lượng sử dụng theo các loại đồng hồ đo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* {meterTypes.map((type) => {
              const typeMeters = meters.filter((meter) => meter.typeId === type.id)
              const totalConsumption = typeMeters.reduce((total, meter) => {
                return (
                  total +
                  meter.readings.reduce((sum, reading) => {
                    return sum + reading.consumption
                  }, 0)
                )
              }, 0)

              const averageConsumption = typeMeters.length > 0 ? totalConsumption / typeMeters.length : 0

              // Find the meter with highest consumption
              let highestConsumptionMeter = null
              let highestConsumption = 0

              typeMeters.forEach((meter) => {
                const consumption = meter.readings.reduce((sum, reading) => sum + reading.consumption, 0)
                if (consumption > highestConsumption) {
                  highestConsumption = consumption
                  highestConsumptionMeter = meter
                }
              })

              return (
                <Card key={type.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <CardTitle className="text-lg">{type.name} Usage</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Consumption:</span>
                          <span className="font-medium">
                            {totalConsumption} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Average per Meter:</span>
                          <span className="font-medium">
                            {averageConsumption.toFixed(2)} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Active Meters:</span>
                          <span className="font-medium">
                            {typeMeters.filter((meter) => meter.status === "active").length}
                          </span>
                        </div>
                      </div>

                      {highestConsumptionMeter && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm font-medium">Highest Consumption</p>
                          <p className="text-xs text-muted-foreground">
                            {highestConsumptionMeter.serialNumber} -{" "}
                            {getUnitById(highestConsumptionMeter.unitId)?.name || "Unknown"}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm">
                              {highestConsumption} {type.unit}
                            </span>
                            <Progress value={(highestConsumption / (totalConsumption || 1)) * 100} className="w-1/2" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })} */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

