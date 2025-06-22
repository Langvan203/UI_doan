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
  Search,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useBuilding } from "../context/BuildingContext"
import { useAuth } from "../context/AuthContext"
import { useMetterContext } from "../context/MetterContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateDongHo, DongHo, DongHoPaged } from "../type/Metter"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { create } from "domain"
import { add, set } from "date-fns"
import { toast } from "react-toastify"
import { se } from "date-fns/locale"



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
  const { electricMetters,
    waterMetters,
    getElectricMetters,
    getWaterMetters,
    addElectricMetter,
    addWaterMetter,
    updateChiSoDongHoDien,
    updateChiSoDongHoNuoc,
    updateTrangThaiDien,
    updateTrangThaiNuoc,
    deleteElectricMetter,
    deleteWaterMetter } = useMetterContext();
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
  const [selectedMeter, setSelectedMeter] = useState<DongHo>()
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
  const [newReading, setNewReading] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)




  const handlePageChange = (page: number) => {
    if (activeTab === "electricity") {
      // Gọi API để load electricity meters của trang mới
      getElectricMetters(page);
    } else {
      // Gọi API để load water meters của trang mới  
      getWaterMetters(page);
    }
  };

  const findMaKH = (maMB: number) => {
    // Tìm kiếm trong danh sách premisseListForDropdown để lấy mã cư dân
    const unit = premisseListForDropdown.find((premise) => premise.maMB === maMB);
    return unit ? unit.maKH : 0; // Trả về 0 nếu không tìm thấy
  }

  const handleAddMeter = async () => {
    if (!newMeter.soDongHo || !newMeter.maMB || !newMeter.maTN || !newMeter.maKN || !newMeter.maTL) {
      alert("Vui lòng điền đầy đủ thông tin đồng hồ đo")
      return
    }
    // console.log(activeTab)
    const newMeterItem: CreateDongHo = {
      // id: newId,
      soDongHo: newMeter.soDongHo,
      chiSoSuDung: 0, // Mặc định là 0 khi thêm mới
      trangThai: true, // Mặc định là hoạt động
      maMB: newMeter.maMB, // Mã vị trí (căn hộ)
      maKH: findMaKH(newMeter.maMB), // Mã cư dân (nếu có)
      maTN: selectedBuilding || 0, // Mã tòa nhà
      maKN: selectedBlock || 0, // Mã khối nhà
      maTL: selectedFloor || 0, // Mã tầng lầu
    }
    if (activeTab === "electricity") {
      const result = await addElectricMetter(newMeterItem); // Gọi API để thêm đồng hồ điện mới
      if (result === true) {
        toast.success("Thêm đồng hồ điện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        toast.error("Khách hàng này đã có đồng hồ, vui lòng thử lại!!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    else {
      const result = await addWaterMetter(newMeterItem); // Gọi API để thêm đồng hồ nước mới
      if (result === true) {
        toast.success("Thêm đồng hồ nước thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        toast.error("Khách hàng này đã có đồng hồ, vui lòng thử lại!!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
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
      //getElectricMetters(1); // Reload electricity meters
    }
  }

  const handleAddReading = async () => {
    if (activeTab === "electricity") {
      const result = await updateChiSoDongHoDien(selectedMeter?.maDH || 0, newReading);
      if (result) {
        toast.success("Ghi chỉ số đồng hồ điện thành công", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsReadingDialogOpen(false);
        setNewReading(0);
        //  getElectricMetters(1); // Reload electricity meters
      }
      else {
        toast.error("Ghi chỉ số đồng hồ điện thất bại, vui lòng thử lại!!!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
    else {
      const result = await updateChiSoDongHoNuoc(selectedMeter?.maDH || 0, newReading);
      if (result) {
        toast.success("Ghi chỉ số đồng hồ điện thành công", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsReadingDialogOpen(false);
        setNewReading(0);
        // getElectricMetters(1); // Reload electricity meters
      }
      else {
        toast.error("Ghi chỉ số đồng hồ điện thất bại, vui lòng thử lại!!!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

  }

  const handleDeleteMeter = (id: number) => {
    if (activeTab === "electricity") {
      deleteElectricMetter(id).then((result) => {
        if (result) {
          toast.success("Đồng hồ điện đã được xóa thành công", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // getElectricMetters(1); // Reload electricity meters
        } else {
          toast.error("Xóa đồng hồ điện thất bại, vui lòng thử lại!!!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })

    }
    else {
      deleteWaterMetter(id).then((result) => {
        if (result) {
          toast.success("Đồng hồ nước đã được xóa thành công", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // getWaterMetters(1); // Reload water meters
        } else {
          toast.error("Xóa đồng hồ nước thất bại, vui lòng thử lại!!!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    }
  }

  const handleChangeMeterStatus = (id: number, status: boolean) => {
    if (activeTab === "electricity") {
      updateTrangThaiDien(id, status).then((result) => {
        if (result) {
          toast.success(`Đồng hồ điện ${status ? "đã được kích hoạt" : "đã được bảo trì"}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // getElectricMetters(1); // Reload electricity meters
        } else {
          toast.error("Cập nhật trạng thái đồng hồ điện thất bại, vui lòng thử lại!!!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    }
    else {
      updateTrangThaiNuoc(id, status).then((result) => {
        if (result) {
          toast.success(`Đồng hồ nước ${status ? "đã được kích hoạt" : "đã được bảo trì"}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // getWaterMetters(1); // Reload water meters
        } else {
          toast.error("Cập nhật trạng thái đồng hồ nước thất bại, vui lòng thử lại!!!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    }
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
  }, [currentMeters, searchQuery, selectedFloor, selectedBuilding, selectedBlock]);

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
              <DialogDescription>Ghi chỉ số hoạt động mới cho đồng hồ {selectedMeter?.soDongHo || ""}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="readingValue">
                  Chỉ số mới ({activeTab === "electricity" ? "kWh" : "m3"})
                </Label>
                <Input
                  id="readingValue"
                  type="number"
                  value={newReading}
                  onChange={(e) => setNewReading(Number.parseInt(e.target.value))}
                  placeholder="giá trị chỉ số mới"
                  min={selectedMeter?.chiSoSuDung || 0}
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
              <div className="border rounded-lg">
                {/* Fixed Header */}
                <div className="border-b bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Số đồng hồ</TableHead>
                        <TableHead className="w-[100px]">Vị trí</TableHead>
                        <TableHead className="w-[150px] text-center">Khách hàng</TableHead>
                        <TableHead className="w-[120px]">Chỉ số hiện tại</TableHead>
                        <TableHead className="w-[120px]">Cập nhật lần cuối</TableHead>
                        <TableHead className="w-[120px]">Trạng thái</TableHead>
                        <TableHead className="w-[80px] text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>

                {/* Scrollable Body */}
                <ScrollArea className="h-[500px] w-full">
                  <Table>
                    <TableBody>
                      {filteredMeters.length > 0 ? (
                        filteredMeters.map((meter) => (
                          <TableRow key={meter.maDH} className="hover:bg-muted/50">
                            <TableCell className="w-[120px] font-medium font-mono">
                              {meter.soDongHo}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {meter.maVT || "Unknown"}
                            </TableCell>
                            <TableCell className="w-[150px]">
                              <div className="max-w-[140px] truncate">
                                {meter.tenKH || "Unoccupied"}
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center font-mono">
                              {meter.chiSoSuDung.toLocaleString()}
                              <span className="text-xs text-muted-foreground ml-1">
                                {activeTab === "electricity" ? "kWh" : "m³"}
                              </span>
                            </TableCell>
                            <TableCell className="w-[120px] text-sm">
                              {new Date(meter.updatedDate).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell className="w-[120px]">
                              <Badge
                                variant="outline"
                                className={
                                  meter.trangThai === true
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }
                              >
                                {meter.trangThai === true ? "Hoạt động" : "Bảo trì"}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[80px] text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMeter(meter)
                                      setIsReadingDialogOpen(true)
                                      setNewReading(selectedMeter?.chiSoSuDung || 0)
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <p className="text-sm font-medium">Không tìm thấy đồng hồ</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="border-t bg-background">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Pagination Info */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>
                        Hiển thị{" "}
                        <span className="font-medium">
                          {((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1 - 1) *
                            ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10) + 1 - ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10)}
                        </span>{" "}
                        /{" "}
                        <span className="font-medium">
                          {Math.min(
                            ((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1) *
                            ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10),
                            (activeTab === "electricity" ? electricMetters?.totalCount : waterMetters?.totalCount) || 0
                          )}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-medium">
                          {(activeTab === "electricity" ? electricMetters?.totalCount : waterMetters?.totalCount) || 0}
                        </span>{" "}
                        đồng hồ
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) ?? 1) - 1)}
                        disabled={!(activeTab === "electricity" ? electricMetters?.hasPreviousPage : waterMetters?.hasPreviousPage)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          {
                            length: Math.min(
                              5,
                              (activeTab === "electricity" ? electricMetters?.totalPages : waterMetters?.totalPages) || 1
                            )
                          },
                          (_, i) => {
                            const currentPage = (activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1;
                            const totalPages = (activeTab === "electricity" ? electricMetters?.totalPages : waterMetters?.totalPages) || 1;

                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === currentPage ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) ?? 1) + 1)}
                        disabled={!(activeTab === "electricity" ? electricMetters?.hasNextPage : waterMetters?.hasNextPage)}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đồng hồ điện</CardTitle>
              <CardDescription>Quản lý danh sách đồng hồ điện của cư dân</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                {/* Fixed Header */}
                <div className="border-b bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Số đồng hồ</TableHead>
                        <TableHead className="w-[100px]">Vị trí</TableHead>
                        <TableHead className="w-[150px] text-center">Khách hàng</TableHead>
                        <TableHead className="w-[120px]">Chỉ số hiện tại</TableHead>
                        <TableHead className="w-[120px]">Cập nhật lần cuối</TableHead>
                        <TableHead className="w-[120px]">Trạng thái</TableHead>
                        <TableHead className="w-[80px] text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>

                {/* Scrollable Body */}
                <ScrollArea className="h-[500px] w-full">
                  <Table>
                    <TableBody>
                      {filteredMeters.length > 0 ? (
                        filteredMeters.map((meter) => (
                          <TableRow key={meter.maDH} className="hover:bg-muted/50">
                            <TableCell className="w-[120px] font-medium font-mono">
                              {meter.soDongHo}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {meter.maVT || "Unknown"}
                            </TableCell>
                            <TableCell className="w-[150px]">
                              <div className="max-w-[140px] truncate">
                                {meter.tenKH || "Unoccupied"}
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center font-mono">
                              {meter.chiSoSuDung.toLocaleString()}
                              <span className="text-xs text-muted-foreground ml-1">
                                {activeTab === "electricity" ? "kWh" : "m³"}
                              </span>
                            </TableCell>
                            <TableCell className="w-[120px] text-sm">
                              {new Date(meter.updatedDate).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell className="w-[120px]">
                              <Badge
                                variant="outline"
                                className={
                                  meter.trangThai === true
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }
                              >
                                {meter.trangThai === true ? "Hoạt động" : "Bảo trì"}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[80px] text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMeter(meter)
                                      setIsReadingDialogOpen(true)
                                      setNewReading(selectedMeter?.chiSoSuDung || 0)
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <p className="text-sm font-medium">Không tìm thấy đồng hồ</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="border-t bg-background">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Pagination Info */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>
                        Hiển thị{" "}
                        <span className="font-medium">
                          {((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1 - 1) *
                            ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10) + 1 - ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10)}
                        </span>{" "}
                        /{" "}
                        <span className="font-medium">
                          {Math.min(
                            ((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1) *
                            ((activeTab === "electricity" ? electricMetters?.pageSize : waterMetters?.pageSize) || 10),
                            (activeTab === "electricity" ? electricMetters?.totalCount : waterMetters?.totalCount) || 0
                          )}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-medium">
                          {(activeTab === "electricity" ? electricMetters?.totalCount : waterMetters?.totalCount) || 0}
                        </span>{" "}
                        đồng hồ
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) ?? 1) - 1)}
                        disabled={!(activeTab === "electricity" ? electricMetters?.hasPreviousPage : waterMetters?.hasPreviousPage)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          {
                            length: Math.min(
                              5,
                              (activeTab === "electricity" ? electricMetters?.totalPages : waterMetters?.totalPages) || 1
                            )
                          },
                          (_, i) => {
                            const currentPage = (activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) || 1;
                            const totalPages = (activeTab === "electricity" ? electricMetters?.totalPages : waterMetters?.totalPages) || 1;

                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === currentPage ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(((activeTab === "electricity" ? electricMetters?.pageNumber : waterMetters?.pageNumber) ?? 1) + 1)}
                        disabled={!(activeTab === "electricity" ? electricMetters?.hasNextPage : waterMetters?.hasNextPage)}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="grid gap-6 ">
            {meterTypes.map((type) => {
              // Lấy dữ liệu đồng hồ theo tab active
              const currentData = activeTab === "electricity" ? electricMetters : waterMetters;

              // Sửa lại logic filter - sử dụng tất cả data vì đã được filter theo tab
              const typeMeters = currentData?.data || [];

              // Chỉ hiển thị card tương ứng với tab đang active
              if ((activeTab === "electricity" && type.id !== 1) ||
                (activeTab === "water" && type.id !== 2)) {
                return null;
              }

              // Tính tổng mức tiêu thụ (dựa trên chiSoSuDung)
              const totalConsumption = typeMeters.reduce((total, meter) => {
                return total + (meter.chiSoSuDung || 0);
              }, 0);

              const averageConsumption = typeMeters.length > 0 ? totalConsumption / typeMeters.length : 0;

              // Tìm đồng hồ có mức tiêu thụ cao nhất
              let highestConsumptionMeter: DongHo | null = null;
              let highestConsumption = 0;

              typeMeters.forEach((meter) => {
                const consumption = meter.chiSoSuDung || 0;
                if (consumption > highestConsumption) {
                  highestConsumption = consumption;
                  highestConsumptionMeter = meter;
                }
              });

              // Tính số đồng hồ đang hoạt động
              const activeMetersCount = typeMeters.filter((meter) => meter.trangThai === true).length;
              const totalMetersCount = typeMeters.length;

              return (
                <Card key={type.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <CardTitle className="text-lg">Thống kê {type.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {totalMetersCount} đồng hồ
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Tổng chỉ số:</span>
                          <span className="font-medium text-lg">
                            {totalConsumption.toLocaleString()} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trung bình/đồng hồ:</span>
                          <span className="font-medium">
                            {averageConsumption.toLocaleString('vi-VN', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })} {type.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Đồng hồ hoạt động:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600">{activeMetersCount}</span>
                            <span className="text-xs text-muted-foreground">
                              / {totalMetersCount}
                            </span>
                            <Progress
                              value={totalMetersCount > 0 ? (activeMetersCount / totalMetersCount) * 100 : 0}
                              className="w-16 h-2"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Đồng hồ bảo trì:</span>
                          <span className="font-medium text-yellow-600">
                            {totalMetersCount - activeMetersCount}
                          </span>
                        </div>
                      </div>

                      {highestConsumptionMeter !== null && highestConsumption > 0 && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm font-medium text-primary">Chỉ số cao nhất</p>
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Số đồng hồ: <span className="font-mono">{(highestConsumptionMeter as DongHo).soDongHo}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Khách hàng: {(highestConsumptionMeter as DongHo).tenKH || "Chưa có"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Vị trí: {(highestConsumptionMeter as DongHo).maVT || "Không xác định"}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {highestConsumption.toLocaleString()} {type.unit}
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={totalConsumption > 0 ? (highestConsumption / totalConsumption) * 100 : 0}
                                className="w-20 h-2"
                              />
                              <span className="text-xs text-muted-foreground">
                                {totalConsumption > 0 ?
                                  ((highestConsumption / totalConsumption) * 100).toFixed(1) : 0
                                }%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Thêm thống kê cập nhật gần đây */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Cập nhật gần đây:</p>
                        {typeMeters
                          .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
                          .slice(0, 5)
                          .map((meter) => (
                            <div key={meter.maDH} className="flex items-center justify-between py-1">
                              <div className="flex-1 truncate">
                                <span className="text-sm font-medium mr-2">{meter.soDongHo}</span>
                                <span className="text-xs text-muted-foreground">
                                  {meter.tenKH || "Chưa có"} - {meter.maVT}
                                </span>
                              </div>
                              <span className="text-sm font-mono">
                                {meter.chiSoSuDung.toLocaleString()}
                                <span className="text-xs text-muted-foreground ml-1">
                                  {activeTab === "electricity" ? "kWh" : "m³"}
                                </span>
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

