"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/context/AuthContext"
import { Block, Building, Floor, LoaiMatBang, KhachHang, premiseService, TrangThai, AddNewPremise, EditPremise } from "@/services/premise-service"
import { ScrollArea } from "@/components/ui/scroll-area"
import {toast,Bounce} from "react-toastify"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// Định nghĩa interface cho Premise với các trường mới
interface Premise {
  maMB: number
  maTN: number
  maKN: number
  maTL: number
  maVT: string
  dienTichBG: number
  dienTichThongThuy: number
  dienTichTimTuong: number
  soHopDong: string
  ngayBanGiao: Date | null
  ngayHetHanChoThue: Date | null
  maLMB: number
  tenLMB: string
  maKH: number
  tenKH: string,
  maTT: number,
  tenTrangThai: string,
  tenTN: string,
  tenKN: string,
  tenTL: string,
}

interface PremiseListProps {
  buildingId?: number
}

export function PremiseList({ buildingId }: PremiseListProps) {

  const { token } = useAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPremise, setNewPremise] = useState<Premise>({
    maMB: 0,
    maTN: 0,
    maKN: 0,
    maTL: 0,
    maVT: '',
    dienTichBG: 0,
    dienTichThongThuy: 0,
    dienTichTimTuong: 0,
    soHopDong: '',
    ngayBanGiao: null,
    ngayHetHanChoThue: null,
    maLMB: 0,
    tenLMB: '',
    maKH: 0,
    tenKH: '',
    maTT: 2, // Mặc định là chưa bàn giao
    tenTrangThai: '',
    tenTN: '',
    tenKN: '',
    tenTL: ''
  });

  const [premises, setPremises] = useState<Premise[]>([])
  const [buildingsData, setBuildingsData] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [blocksData, setBlocksData] = useState<Block[]>([])
  const [filterBlocks, setFilterBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Number | null>(null)
  const [floorsData, setFloorsData] = useState<Floor[]>([])
  const [filterFloors, setFilterFloors] = useState<Floor[]>([])
  const [trangThaiData, setTrangThaiData] = useState<TrangThai[]>([])
  const [loaiMatBangData, setLoaiMatBangData] = useState<LoaiMatBang[]>([])
  const [khachHangData, setKhachHangData] = useState<KhachHang[]>([])
  useEffect(() => {
    if (token) {
      premiseService.getPremisesList(token).then((data) => setPremises(data))
      premiseService.getBuildings(token).then((data) => {
        setBuildingsData(data);
        if (data.length > 0) {
          setSelectedBuilding(data[0].id);
          setNewPremise(prev => ({...prev, maTN: data[0].id}));

        }
      })
      premiseService.getBlocks(token).then((data) => {
        setBlocksData(data);
        if (data.length > 0) {
          setSelectedBlock(data[0].maKN);
          setNewPremise(prev => ({...prev, maKN: data[0].maKN}));
        }
      })
      premiseService.getFloorList(token).then((data) => setFloorsData(data))
      premiseService.getTrangThaiList(token).then((data) => {
        setTrangThaiData(data);
        // Mặc định trạng thái là chưa bàn giao (giả sử mã 2 là chưa bàn giao)
        setNewPremise(prev => ({...prev, maTT: 2}));
      })
      premiseService.getLoaiMatBangList(token).then((data) => {
        setLoaiMatBangData(data);
        if (data.length > 0) {
          setNewPremise(prev => ({...prev, maLMB: data[0].maLMB}));
        }
      })
      premiseService.getKhachHangList(token).then((data) => setKhachHangData(data))
    }
  }, [token])

  
  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedPremiseId, setSelectedPremiseId] = useState<number | null>(null)
  const [ngayBanGiao, setNgayBanGiao] = useState<Date | undefined>(undefined)
  const [ngayHetHan, setNgayHetHan] = useState<Date | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<number | null>(null)
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<number | null>(null)
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<number | null>(null)
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<number | null>(null)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<number | null>(null)
  const [filteredPremises, setFilteredPremises] = useState<Premise[]>([])

  const filterOptions = [
    { id: 'building', label: 'Tòa nhà' },
    { id: 'block', label: 'Khối nhà' },
    { id: 'floor', label: 'Tầng' },
    { id: 'type', label: 'Loại căn hộ' },
    { id: 'status', label: 'Trạng thái' },
  ]

  const toggleFilter = (filterId: string) => {
    setActiveFilters(current =>
      current.includes(filterId)
        ? current.filter(id => id !== filterId)
        : [...current, filterId]
    )
  }

  // Initialize filteredPremises with all premises
  useEffect(() => {
    setFilteredPremises(premises)
  }, [premises])

  // Update filteredPremises when filters change
  useEffect(() => {
    // If no filters are active, show all premises
    if (!selectedBuildingFilter && !selectedBlockFilter && !selectedFloorFilter && 
        !selectedTypeFilter && !selectedStatusFilter) {
      setFilteredPremises(premises)
      return
    }

    // Apply filters
    const filtered = premises.filter((premise) => {
      return (
        (!selectedBuildingFilter || premise.maTN === selectedBuildingFilter) &&
        (!selectedBlockFilter || premise.maKN === selectedBlockFilter) &&
        (!selectedFloorFilter || premise.maTL === selectedFloorFilter) && 
        (!selectedTypeFilter || premise.maLMB === selectedTypeFilter) &&
        (!selectedStatusFilter || premise.maTT === selectedStatusFilter)
      )
    })
    setFilteredPremises(filtered)
  }, [premises, selectedBuildingFilter, selectedBlockFilter, selectedFloorFilter, selectedTypeFilter, selectedStatusFilter])

  useEffect(() => {
    if(selectedBlockFilter && selectedBlockFilter){
      const filtered = premises.filter((premise) => premise.maKN === selectedBlockFilter &&premise.maTN == selectedBuildingFilter)
      setFilterBlocks(filterBlocks.filter((block) => block.maTN == selectedBuildingFilter))
      setFilteredPremises(filtered)
    }
    if(selectedFloorFilter && selectedBlockFilter){
      const filtered = premises.filter((premise) => premise.maTL === selectedFloorFilter &&premise.maKN == selectedBlockFilter)
      setFilterFloors(filterFloors.filter((block) => block.maKN == selectedBlockFilter))
      setFilteredPremises(filtered)
    }
  }, [selectedBlockFilter, selectedFloorFilter])
  // Xử lý thêm mặt bằng mới
  const handleAddPremise = () => {
    if (!newPremise.maTN || !newPremise.maKN || !newPremise.maTL || !newPremise.maVT || !newPremise.maLMB) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const newPremiseData: AddNewPremise = {
      MaTN: newPremise.maTN,
      MaKN: newPremise.maKN,
      MaTL: newPremise.maTL,
      MaVT: newPremise.maVT,
      MaLMB: newPremise.maLMB,
      DienTichBG: newPremise.dienTichBG,
      DienTichThongThuy: newPremise.dienTichThongThuy,
      DienTichTimTuong: newPremise.dienTichTimTuong,
      MaTrangThai: newPremise.maTT,
      MaKH: newPremise.maKH || null,
      SoHopDong: newPremise.soHopDong || "",
      NgayBanGiao: ngayBanGiao || new Date(),
      NgayHetHanChoThue: ngayHetHan || new Date()
    }
    
    console.log('Dữ liệu gửi đi:', newPremiseData);
    
    premiseService.createPremise(newPremiseData, token).then((data) => {
      console.log('Kết quả từ server:', data);
      if (data) {
        // Cập nhật lại danh sách mặt bằng
        premiseService.getPremisesList(token || '').then((updatedData) => setPremises(updatedData));
        toast.success('Thêm mặt bằng thành công', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setShowAddDialog(false);
        // Reset form
        setNgayBanGiao(undefined);
        setNgayHetHan(undefined);
        setNewPremise({
          ...newPremise,
          maVT: '',
          dienTichBG: 0,
          dienTichThongThuy: 0,
          dienTichTimTuong: 0,
          soHopDong: '',
          maKH: 0
        });
      }
    }).catch(error => {
      console.error('Lỗi khi tạo mặt bằng:', error);
      alert('Có lỗi xảy ra khi tạo mặt bằng mới');
    });
  }

  const handleEditPremise = () => {
    const editPremiseData: EditPremise = {
      MaMB: selectedPremise?.maMB || 0,
      DienTichBG: selectedPremise?.dienTichBG || 0,
      DienTichThongThuy: selectedPremise?.dienTichThongThuy || 0,
      DienTichTimTuong: selectedPremise?.dienTichTimTuong || 0,
      MaTrangThai: selectedPremise?.maTT || 0,
      MaKhachHang: selectedPremise?.maKH || 0,
      NgayBanGiao: ngayBanGiao || new Date(),
      NgayHetHanChoThue: ngayHetHan || new Date()
    }
    console.log('Dữ liệu gửi đi:', editPremiseData);
    premiseService.editPremise(editPremiseData, token).then((data) => {
      if (data) {
        // Cập nhật lại danh sách mặt bằng
        premiseService.getPremisesList(token || '').then((updatedData) => setPremises(updatedData));
        toast.success('Cập nhật mặt bằng thành công', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          onClose: () => {
            setShowEditDialog(false);
          }
        });
      }
    })
  }

  const getLoaiMatBangName = (maLMB: number) => {
    return loaiMatBangData.find((lmb) => lmb.maLMB === maLMB)?.tenLMB || "Không xác định"
  }

  const handleDeletePremise = () => {
    premiseService.deletePremise(selectedPremiseId || 0, token).then((data) => {
      if (data) {
        setPremises(premises.filter((premise) => premise.maMB !== selectedPremiseId))
        toast.success('Xóa mặt bằng thành công', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setIsDeleteDialogOpen(false)
      }
    })
  }
  useEffect(() => {
    const filterBlocks = blocksData.filter((block) => block.maTN === selectedBuilding)
    setFilterBlocks(filterBlocks)
    console.log(filterBlocks)
  }, [selectedBuilding]);
  useEffect(() => {
    const filterFloors = floorsData.filter((floor) => floor.maKN === selectedBlock)
    setFilterFloors(filterFloors)
    console.log(filterFloors)
  }, [selectedBlock]);


  

  // Lấy tên thể loại từ mã

  // Lấy tên khách hàng từ mã
  const getKhachHangName = (maKH: number | null) => {
    if (!maKH) return "Chưa có"
    return khachHangData.find((kh) => kh.id === maKH)?.name || "Không xác định"
  }

  const getKhachhangContract = (maKH: number | null) => {
    if (!maKH) return "Chưa có"
    return khachHangData.find((kh) => kh.id === maKH)?.contract || "Không xác định"
  }

  // Lấy badge trạng thái với màu sắc phù hợp
  const getStatusBadge = (tenTrangThai: string) => {
    switch (tenTrangThai) {
      case "Đã bàn giao": // Đã cho thuê
        return <Badge className="bg-green-500">Đã bàn giao</Badge>
      case "Chưa bàn giao": // Trống
        return <Badge variant="outline">Chưa bàn giao</Badge>
      case "Đang sửa chữa": // Bảo trì
        return <Badge variant="destructive">Đang sửa chữa</Badge>
      case "Đã thanh lý": // Đặt chỗ
        return <Badge variant="secondary">Đã thanh lý</Badge>
      case "Đã qua sử dụng":
        return <Badge variant="secondary">Đã qua sử dụng</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {!buildingId && (
        <div className="flex justify-end">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm căn hộ
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          {/* Thanh tìm kiếm và bộ lọc */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 max-w-lg">
              <Input 
                placeholder="Tìm kiếm theo tên KH hoặc mã căn hộ..." 
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = premises.filter(
                    (premise) => 
                      premise.maVT.toLowerCase().includes(searchTerm) || 
                      getKhachHangName(premise.maKH).toLowerCase().includes(searchTerm)
                  );
                  setFilteredPremises(filtered)
                }}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Lọc nâng cao {activeFilters.length > 0 && `(${activeFilters.length})`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Tìm điều kiện lọc..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {filterOptions.map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleFilter(option.id)}
                        >
                          <Checkbox
                            checked={activeFilters.includes(option.id)}
                            className="mr-2"
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {activeFilters.length > 0 && (
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            setActiveFilters([]);
                            setSelectedBuildingFilter(null);
                            setSelectedBlockFilter(null);
                            setSelectedFloorFilter(null);
                            setSelectedTypeFilter(null);
                            setSelectedStatusFilter(null);
                            setFilteredPremises(premises);
                          }}
                          className="justify-center text-center text-sm text-muted-foreground"
                        >
                          Hiển thị tất cả
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveFilters([]);
                  setSelectedBuildingFilter(null);
                  setSelectedBlockFilter(null);
                  setSelectedFloorFilter(null);
                  setSelectedTypeFilter(null);
                  setSelectedStatusFilter(null);
                  setFilteredPremises(premises);
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Các bộ lọc đã chọn */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {/* Lọc theo tòa nhà */}
              {activeFilters.includes('building') && (
                <div className="w-[200px]">
                  <Select 
                    value={selectedBuildingFilter?.toString() || ""}
                    onValueChange={(value) => {
                      const buildingId = Number(value);
                      setSelectedBuildingFilter(buildingId);
                      // Reset các filter phụ thuộc
                      setSelectedBlockFilter(null);
                      setSelectedFloorFilter(null);
                      setSelectedTypeFilter(null);
                      setSelectedStatusFilter(null);
                      // Lọc lại danh sách khối nhà dựa trên tòa nhà được chọn
                      const filteredBlocks = blocksData.filter(block => block.maTN === buildingId);
                      setFilterBlocks(filteredBlocks);
                      // Lọc lại danh sách premises
                      const filtered = premises.filter(premise => premise.maTN === buildingId);
                      setFilteredPremises(filtered);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tòa nhà" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingsData.map((building) => (
                        <SelectItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lọc theo khối nhà */}
              {activeFilters.includes('block') && (
                <div className="w-[200px]">
                  <Select 
                    value={selectedBlockFilter?.toString() || ""}
                    onValueChange={(value) => {
                      const blockId = Number(value);
                      setSelectedBlockFilter(blockId);
                      setSelectedFloorFilter(null);
                      // Lọc lại danh sách tầng dựa trên khối nhà được chọn
                      const filteredFloors = floorsData.filter(floor => floor.maKN === blockId);
                      setFilterFloors(filteredFloors);
                      // Lọc lại danh sách premises
                      const filtered = premises.filter(premise => 
                        premise.maKN === blockId && 
                        (!selectedBuildingFilter || premise.maTN === selectedBuildingFilter)
                      );
                      setFilteredPremises(filtered);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khối nhà" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterBlocks.map((block) => (
                        <SelectItem key={block.maKN} value={block.maKN.toString()}>
                          {block.tenKN}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lọc theo tầng */}
              {activeFilters.includes('floor') && (
                <div className="w-[200px]">
                  <Select 
                    value={selectedFloorFilter?.toString() || ""}
                    onValueChange={(value) => {
                      const floorId = Number(value);
                      setSelectedFloorFilter(floorId);
                      // Lọc lại danh sách premises
                      const filtered = premises.filter(premise => 
                        premise.maTL === floorId && 
                        (!selectedBlockFilter || premise.maKN === selectedBlockFilter) &&
                        (!selectedBuildingFilter || premise.maTN === selectedBuildingFilter)
                      );
                      setFilteredPremises(filtered);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tầng" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterFloors.map((floor) => (
                        <SelectItem key={floor.maTL} value={floor.maTL.toString()}>
                          {floor.tenTL}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lọc theo loại căn hộ */}
              {activeFilters.includes('type') && (
                <div className="w-[200px]">
                  <Select 
                    value={newPremise.maLMB?.toString() || ""}
                    onValueChange={(value) => {
                      const loaiMBId = Number(value);
                      setSelectedTypeFilter(loaiMBId)
                      setNewPremise(prev => ({...prev, maLMB: loaiMBId}));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại căn hộ" />
                    </SelectTrigger>
                    <SelectContent>
                      {loaiMatBangData.map((loaiMB) => (
                        <SelectItem key={loaiMB.maLMB} value={loaiMB.maLMB.toString()}>
                          {loaiMB.tenLMB}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lọc theo trạng thái */}
              {activeFilters.includes('status') && (
                <div className="w-[200px]">
                  <Select 
                    value={newPremise.maTT?.toString() || ""}
                    onValueChange={(value) => {
                      const statusId = Number(value);
                      setSelectedStatusFilter(statusId)
                      setNewPremise(prev => ({...prev, maTT: statusId}));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {trangThaiData.map((status) => (
                        <SelectItem key={status.maTrangThai} value={status.maTrangThai.toString()}>
                          {status.tenTrangThai}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[600px]">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/100 sticky top-0">
              <tr className="bg-muted/50">
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Diện tích (m²)
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Loại
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Khách hàng
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-background divide-y divide-border">
              {filteredPremises.map((premise) => (
                <tr key={premise.maMB}>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{premise.maMB}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <div>{premise.maVT}</div>
                    <div className="text-xs text-muted-foreground">
                      {premise.tenTN} - {premise.tenKN} - {premise.tenTL}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm hidden md:table-cell">
                    <div>BG: {premise.dienTichBG} m²</div>
                    <div className="text-xs text-muted-foreground">TT: {premise.dienTichThongThuy} m²</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                    <div>{getLoaiMatBangName(premise.maLMB)}</div>
                    <div className="text-xs text-muted-foreground">{premise.tenLMB}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                    {premise.maKH ? (
                      <>
                        <div>{getKhachHangName(premise.maKH)}</div>
                        <div className="text-xs text-muted-foreground">{premise.tenKH}</div>
                      </>
                    ) : (
                      "Chưa có"
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    {getStatusBadge(premise.tenTrangThai)}
                    
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPremise(premise)
                          setShowDetailDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem chi tiết</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button onClick={() => {
                            setSelectedPremise(premise)
                            setShowEditDialog(true)
                          }} variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Chỉnh sửa</span>
                          </Button>
                        </DropdownMenuTrigger>
                        
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPremiseId(premise.maMB)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span onClick={() => {
                          setSelectedPremiseId(premise.maMB)
                          setIsDeleteDialogOpen(true)
                        }} className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* Dialog thêm mặt bằng mới */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm mặt bằng mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho mặt bằng mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="premise-building">Tòa nhà</Label>
                <Select
                  defaultValue={buildingId?.toString() || "1"}
                  onValueChange={(value) => {
                    console.log('Selected Building Value:', value);
                    const selectedBuildingId = Number(value);
                    setNewPremise({ ...newPremise, maTN: Number(value) });
                    setSelectedBuilding(selectedBuildingId);
                    console.log('Selected Building State:', selectedBuildingId);
                  }}
                  
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingsData && buildingsData.length > 0 ? (
                      buildingsData.map((building, index) => (
                        <SelectItem 
                          key={index} 
                          value={building.id?.toString() || "0"}
                        >
                          {building.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Không có dữ liệu tòa nhà
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-block">Block</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) =>  {
                    setNewPremise({ ...newPremise, maKN: Number(selectedBlock) })
                    setSelectedBlock(Number(value))
                    console.log(selectedBlock)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn block" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterBlocks.map((block) => (
                      <SelectItem key={block.maKN} value={block.maKN.toString()}>
                        {block.tenKN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-floor">Tầng</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) => setNewPremise({ ...newPremise, maTL: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tầng" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterFloors.map((floor) => (
                      <SelectItem key={floor.maTL} value={floor.maTL.toString()}>
                        {floor.tenTL}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="premise-mavt">Mã vị trí</Label>
                <Input
                  id="premise-mavt"
                  placeholder="VD: VT001"
                  value={newPremise.maVT || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, maVT: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="premise-loai">Loại mặt bằng</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) => setNewPremise({ ...newPremise, maLMB: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại mặt bằng" />
                  </SelectTrigger>
                  <SelectContent>
                    {loaiMatBangData.map((loai) => (
                      <SelectItem key={loai.maLMB} value={loai.maLMB.toString()}>
                        {loai.tenLMB}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-dienTichBG">Diện tích bàn giao (m²)</Label>
                <Input
                  id="premise-dienTichBG"
                  type="number"
                  placeholder="VD: 85"
                  value={newPremise.dienTichBG || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, dienTichBG: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="premise-dienTichThongThuy">Diện tích thông thủy (m²)</Label>
                <Input
                  id="premise-dienTichThongThuy"
                  type="number"
                  placeholder="VD: 80"
                  value={newPremise.dienTichThongThuy || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, dienTichThongThuy: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="premise-dienTichTimTuong">Diện tích tim tường (m²)</Label>
                <Input
                  id="premise-dienTichTimTuong"
                  type="number"
                  placeholder="VD: 90"
                  value={newPremise.dienTichTimTuong || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, dienTichTimTuong: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="premise-trangthai">Trạng thái</Label>
                <Select
                  defaultValue="2"
                  onValueChange={(value) => setNewPremise({ ...newPremise, maTT: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {trangThaiData && trangThaiData.map((trangthai) => (
                      <SelectItem 
                        key={trangthai?.maTrangThai} 
                        value={trangthai?.maTrangThai?.toString() || ""}
                      >
                        {trangthai?.tenTrangThai || "Không xác định"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-khachhang">Khách hàng</Label>
                <Select
                  onValueChange={(value) =>
                    setNewPremise({ ...newPremise, maKH: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Chưa có khách hàng</SelectItem>
                    {khachHangData.map((kh) => (
                      <SelectItem key={kh.id} value={kh.id.toString()}>
                        {kh.name} - {kh.contract}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-soHopDong">Số hợp đồng</Label>
                <Input
                  id="premise-soHopDong"
                  placeholder="VD: HD001/2023"
                  value={newPremise.soHopDong || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, soHopDong: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="premise-ngayBanGiao">Ngày bàn giao</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !ngayBanGiao && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {ngayBanGiao ? format(ngayBanGiao, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={ngayBanGiao} onSelect={setNgayBanGiao} initialFocus locale={vi} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="premise-ngayHetHan">Ngày hết hạn cho thuê</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !ngayHetHan && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {ngayHetHan ? format(ngayHetHan, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={ngayHetHan} onSelect={setNgayHetHan} initialFocus locale={vi} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleAddPremise}>
              Lưu mặt bằng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa mặt bằng */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mặt bằng</DialogTitle>
            <DialogDescription>Cập nhật thông tin chi tiết cho mặt bằng.</DialogDescription>
          </DialogHeader>
          {selectedPremise && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-premise-building">Tòa nhà</Label>
                  <Select disabled={true}
                    defaultValue={selectedPremise.maTN.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maTN: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tòa nhà" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingsData && buildingsData.map((building, index) => (
                        <SelectItem 
                          key={`building-${building?.id || index}`} 
                          value={building?.id?.toString() || ""}
                        >
                          {building?.name || "Không xác định"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-block">Block</Label>
                  <Select disabled={true}
                    defaultValue={selectedPremise.maKN.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maKN: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocksData.map((block) => (
                        <SelectItem key={block.maKN} value={block.maKN.toString()}>
                          {block.tenKN}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-floor">Tầng</Label>
                  <Select disabled={true}
                    defaultValue={selectedPremise.maTL.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maTL: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tầng" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorsData.map((floor) => (
                        <SelectItem key={floor.maTL} value={floor.maTL.toString()}>
                          Tầng {floor.tenTL}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-premise-mavt">Mã vị trí</Label>
                  <Input disabled={true}
                    id="edit-premise-mavt"
                    value={selectedPremise.maVT}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, maVT: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-loai">Loại mặt bằng</Label>
                  <Select disabled={true}
                    defaultValue={selectedPremise.maLMB.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maLMB: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại mặt bằng" />
                    </SelectTrigger>
                    <SelectContent>
                      {loaiMatBangData.map((loai) => (
                        <SelectItem key={loai.maLMB} value={loai.maLMB.toString()}>
                          {loai.tenLMB}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-premise-dienTichBG">Diện tích bàn giao (m²)</Label>
                  <Input
                    id="edit-premise-dienTichBG"
                    type="number"
                    value={selectedPremise.dienTichBG}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, dienTichBG: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-dienTichThongThuy">Diện tích thông thủy (m²)</Label>
                  <Input
                    id="edit-premise-dienTichThongThuy"
                    type="number"
                    value={selectedPremise.dienTichThongThuy}
                    onChange={(e) =>
                      setSelectedPremise({ ...selectedPremise, dienTichThongThuy: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-dienTichTimTuong">Diện tích tim tường (m²)</Label>
                  <Input
                    id="edit-premise-dienTichTimTuong"
                    type="number"
                    value={selectedPremise.dienTichTimTuong}
                    onChange={(e) =>
                      setSelectedPremise({ ...selectedPremise, dienTichTimTuong: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-trangthai">Trạng thái</Label>
                  <Select 
                    defaultValue={selectedPremise.maTT?.toString() || "null"}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maTT: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {trangThaiData && trangThaiData.map((trangthai) => (
                        <SelectItem 
                          key={trangthai?.maTrangThai} 
                          value={trangthai?.maTrangThai?.toString() || ""}
                        >
                          {trangthai?.tenTrangThai || "Không xác định"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-khachhang">Khách hàng</Label>
                  <Select
                    defaultValue={selectedPremise.maKH?.toString() || "null"}
                    onValueChange={(value) =>
                      setSelectedPremise({
                        ...selectedPremise,
                          maKH: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Chưa có khách hàng</SelectItem>
                      {khachHangData.map((kh) => (
                        <SelectItem key={kh.id} value={kh.id.toString()}>
                            {kh.name} - {kh.contract}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-soHopDong">Số hợp đồng</Label>
                  <Input disabled={true}
                    id="edit-premise-soHopDong"
                    value={selectedPremise.soHopDong}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, soHopDong: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-premise-ngayBanGiao">Ngày bàn giao</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedPremise.ngayBanGiao && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4"  />
                        {selectedPremise.ngayBanGiao
                          ? format(new Date(selectedPremise.ngayBanGiao), "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedPremise.ngayBanGiao ? new Date(selectedPremise.ngayBanGiao) : undefined}
                        onSelect={(date) => setSelectedPremise({ ...selectedPremise, ngayBanGiao: date || null })}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="edit-premise-ngayHetHan">Ngày hết hạn cho thuê</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedPremise.ngayHetHanChoThue && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedPremise.ngayHetHanChoThue
                          ? format(new Date(selectedPremise.ngayHetHanChoThue), "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          selectedPremise.ngayHetHanChoThue ? new Date(selectedPremise.ngayHetHanChoThue) : undefined
                        }
                        onSelect={(date) => setSelectedPremise({ ...selectedPremise, ngayHetHanChoThue: date || null })}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
              <Button type="submit" onClick={handleEditPremise}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem chi tiết mặt bằng */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết mặt bằng</DialogTitle>
            <DialogDescription>
              {selectedPremise && (
                <>
                  {selectedPremise.maVT} - Khối nhà {selectedPremise.maKN} - Tầng {selectedPremise.maTL}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedPremise && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin vị trí</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tòa nhà:</span>
                      <span className="font-medium">
                        {selectedPremise.tenTN}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Khối nhà:</span>
                      <span className="font-medium">
                        {selectedPremise.tenKN}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tầng:</span>
                      <span className="font-medium">
                        {selectedPremise.tenTL}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số mặt bằng:</span>
                      <span className="font-medium">{selectedPremise.maMB}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mã vị trí:</span>
                      <span className="font-medium">{selectedPremise.maVT}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin diện tích</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Diện tích bàn giao:</span>
                      <span className="font-medium">{selectedPremise.dienTichBG} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diện tích thông thủy:</span>
                      <span className="font-medium">{selectedPremise.dienTichThongThuy} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diện tích tim tường:</span>
                      <span className="font-medium">{selectedPremise.dienTichTimTuong} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loại mặt bằng:</span>
                      <span className="font-medium">{getLoaiMatBangName(selectedPremise.maLMB)}</span>
                    </div>
                    
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin khách hàng</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Khách hàng:</span>
                      <span className="font-medium">
                        {selectedPremise.maKH ? getKhachHangName(selectedPremise.maKH) : "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liên hệ:</span>
                      <span className="font-medium">{getKhachhangContract(selectedPremise.maKH)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số hợp đồng:</span>
                      <span className="font-medium">{selectedPremise.soHopDong || "Chưa có"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <span className="font-medium">{selectedPremise.tenTrangThai}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin bàn giao</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Trạng thái bàn giao:</span>
                      <span className="font-medium">{true}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày bàn giao:</span>
                      <span className="font-medium">
                        {selectedPremise.ngayBanGiao
                          ? format(new Date(selectedPremise.ngayBanGiao), "dd/MM/yyyy")
                          : "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày hết hạn cho thuê:</span>
                      <span className="font-medium">
                        {selectedPremise.ngayHetHanChoThue
                          ? format(new Date(selectedPremise.ngayHetHanChoThue), "dd/MM/yyyy")
                          : "Chưa có"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailDialog(false)
                    setSelectedPremise(selectedPremise)
                    setShowEditDialog(true)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button onClick={() => setShowDetailDialog(false)}>Đóng</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {selectedPremiseId && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa mặt bằng "{selectedPremiseId}"? Thao tác này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
                  <Button variant="destructive" onClick={handleDeletePremise}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
