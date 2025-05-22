"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2, Search, Filter, Eye } from "lucide-react"
import Link from "next/link"
import type { FloorDetail } from "@/services/building-service"
import { buildingService } from "@/services/building-service"
import { useAuth } from "@/app/hooks/use-auth"
import axios from "axios"
import {toast, Bounce} from "react-toastify"

interface BuildingData {
  maTN: number
  tenTN: string
  khoiNhaDetail: BlockData[]
}

interface BlockData {
  maKN: number
  tenKN: string
  maTN: number
}

interface FloorData {
  maTL?: number
  tenTL: string
  maTN: number
  maKN: number
  dienTichSan: number
  listMatBangInTanLaus: any[]
}

interface TransformedFloor {
  maTL: number | string
  tenTL: string
  tenTN: string
  tenKN: string
  dienTichSan: number
  totalPremises: number
  maTN: number
  maKN: number
}

interface FloorListProps {
  buildingId?: number
  blockId?: number
  floors?: FloorDetail[]
}

export function FloorList({ buildingId, blockId, floors: propFloors }: FloorListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>(buildingId?.toString() || "all")
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>(blockId?.toString() || "all")
  const [selectedFloor, setSelectedFloor] = useState<FloorDetail | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [floors, setFloors] = useState<TransformedFloor[]>([])
  const [buildings, setBuildings] = useState<{maTN: number, tenTN: string}[]>([])
  const [blocks, setBlocks] = useState<{maKN: number, tenKN: string, maTN: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const token = useAuth().getToken()
  const [newFloor, setNewFloor] = useState({
    TenTL: "",
    MaTN: "",
    MaKN: "",
    DienTichSan: "0",
    DienTichKhuVucDungChung: "0",
    DienTichKyThuaPhuTro: "0"
  })

  // Fetch floors from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // If floors are provided via props, use those
        if (propFloors && propFloors.length > 0) {
          setFloors(propFloors.map((floor, index) => ({
            ...floor,
            maTL: floor.maTL || `temp-${index}`
          })))
          setIsLoading(false)
          return
        }

        // Fetch buildings and blocks first
        const buildingsResponse = await fetch('https://localhost:7246/api/KhoiNha/GetDSKhoiNhaDetail', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!buildingsResponse.ok) {
          throw new Error('Failed to fetch buildings')
        }
        
        const buildingsData: BuildingData[] = await buildingsResponse.json()
        
        // Extract buildings and blocks
        const extractedBuildings = buildingsData.map((building) => ({
          maTN: building.maTN,
          tenTN: building.tenTN
        }))
        
        const extractedBlocks = buildingsData.flatMap((building) => 
          building.khoiNhaDetail.map((block) => ({
            maKN: block.maKN,
            tenKN: block.tenKN,
            maTN: building.maTN
          }))
        )
        
        setBuildings(extractedBuildings)
        setBlocks(extractedBlocks)

        // Fetch floors
        const floorsResponse = await fetch('https://localhost:7246/api/TangLau/GetDSTangLau', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!floorsResponse.ok) {
          throw new Error('Failed to fetch floors')
        }
        
        const floorsData: FloorData[] = await floorsResponse.json()
        
        // Transform API data to match FloorDetail type
        const transformedFloors: TransformedFloor[] = floorsData.map((floor, index) => {
          const building = extractedBuildings.find(b => b.maTN === floor.maTN)
          const block = extractedBlocks.find(b => b.maKN === floor.maKN)
          
          return {
            maTL: floor.maTL || `temp-${index}`, // Use unique key
            tenTL: floor.tenTL,
            tenTN: building?.tenTN || '',
            tenKN: block?.tenKN || '',
            dienTichSan: floor.dienTichSan,
            totalPremises: floor.listMatBangInTanLaus.length,
            maTN: floor.maTN,
            maKN: floor.maKN
          }
        })
        
        setFloors(transformedFloors)
        setIsLoading(false)
      } catch (error) {
        toast.error("Không thể tải danh sách tầng lầu", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
        setIsLoading(false)
      }
    }

    // Only fetch if no prop floors are provided and token exists
    if (token) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [token, propFloors])
  
  // Get available blocks based on selected building
  const availableBlocks = newFloor.MaTN 
    ? blocks.filter(block => block.maTN === parseInt(newFloor.MaTN))
    : blocks

  // Apply filters
  const filteredFloors = floors
    .filter((floor) => {
      // Filter by building if provided or selected
      if (buildingId) {
        return floor.maTN === buildingId
      } else if (selectedBuildingFilter !== "all") {
        return floor.maTN === parseInt(selectedBuildingFilter)
      }
      return true
    })
    .filter((floor) => {
      // Filter by block if provided or selected
      if (blockId) {
        return floor.maKN === blockId
      } else if (selectedBlockFilter !== "all") {
        // Ensure both are converted to numbers for comparison
        return floor.maKN === parseInt(selectedBlockFilter)
      }
      return true
    })
    .filter((floor) => {
      // Filter by search query
      if (searchQuery.trim() === "") return true
      return floor.tenTL.toLowerCase().includes(searchQuery.toLowerCase())
    })

  // Prepare building filter options
  const buildingFilterOptions = [
    { value: "all", label: "Tất cả tòa nhà" },
    ...buildings.map(building => ({
      value: building.maTN.toString(),
      label: building.tenTN
    }))
  ]

  // Prepare block filter options
  const blockFilterOptions = [
    { value: "all", label: "Tất cả khối nhà" },
    ...blocks
      .filter(block => 
        selectedBuildingFilter === "all" || 
        block.maTN === parseInt(selectedBuildingFilter)
      )
      .map(block => {
        // Find the building name for this block
        const buildingName = buildings.find(b => b.maTN === block.maTN)?.tenTN || 'Không xác định'
        return {
          value: block.maKN.toString(),
          label: `${block.tenKN} (${buildingName})`
        }
      })]

  const handleAddFloor = async () => {
    try {
      // Validate required fields
      if (!newFloor.MaTN || !newFloor.MaKN || !newFloor.TenTL) {
        toast.error("Vui lòng điền đầy đủ thông tin tầng lầu", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      // Prepare floor data for API
      const floorData = {
        tenTL: newFloor.TenTL,
        dienTichSan: parseFloat(newFloor.DienTichSan) || 0,
        dienTichKhuVucDungChung: parseFloat(newFloor.DienTichKhuVucDungChung) || 0,
        dienTichKyThuaPhuTro: parseFloat(newFloor.DienTichKyThuaPhuTro) || 0,
        maKN: parseInt(newFloor.MaKN),
        maTN: parseInt(newFloor.MaTN)
      };

      // Send API request to create floor
      const response = await axios.post(
        'https://localhost:7246/api/TangLau/CreateTangLau', 
        floorData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Refresh floors list
      const fetchData = async () => {
        try {
          setIsLoading(true)
          
          // Fetch buildings and blocks first
          const buildingsResponse = await fetch('https://localhost:7246/api/KhoiNha/GetDSKhoiNha', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (!buildingsResponse.ok) {
            throw new Error('Failed to fetch buildings')
          }
          
          const buildingsData: BuildingData[] = await buildingsResponse.json()
          
          // Extract buildings and blocks
          const extractedBuildings = buildingsData.map((building) => ({
            maTN: building.maTN,
            tenTN: building.tenTN
          }))
          
          const extractedBlocks = buildingsData.flatMap((building) => 
            building.khoiNhaDetail.map((block) => ({
              maKN: block.maKN,
              tenKN: block.tenKN,
              maTN: building.maTN
            }))
          )
          
          setBuildings(extractedBuildings)
          setBlocks(extractedBlocks)

          // Fetch floors
          const floorsResponse = await fetch('https://localhost:7246/api/TangLau/GetDSTangLauDetail', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (!floorsResponse.ok) {
            throw new Error('Failed to fetch floors')
          }
          
          const floorsData: FloorData[] = await floorsResponse.json()
          
          // Transform API data to match FloorDetail type
          const transformedFloors: TransformedFloor[] = floorsData.map((floor, index) => {
            const building = extractedBuildings.find(b => b.maTN === floor.maTN)
            const block = extractedBlocks.find(b => b.maKN === floor.maKN)
            
            return {
              maTL: floor.maTL || `temp-${index}`, // Use unique key
              tenTL: floor.tenTL,
              tenTN: building?.tenTN || '',
              tenKN: block?.tenKN || '',
              dienTichSan: floor.dienTichSan,
              totalPremises: floor.listMatBangInTanLaus.length,
              maTN: floor.maTN,
              maKN: floor.maKN
            }
          })
          
          setFloors(transformedFloors)
          setIsLoading(false)
        } catch (error) {
          toast.error("Không thể tải danh sách tầng lầu", {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          })
          setIsLoading(false)
        }
      }

      // Call fetchData to refresh the list
      await fetchData();

      // Show success toast
      toast.success("Đã thêm tầng lầu mới", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // Close the dialog
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error adding floor:', error);
      toast.error("Không thể thêm tầng lầu. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const handleEditFloor = async () => {
    try {
      if (!selectedFloor) {
        toast.error("Không tìm thấy tầng lầu để chỉnh sửa", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      // Get values from input fields
      const editFloorNameInput = document.getElementById('edit-floor-name') as HTMLInputElement;
      const editFloorAreaInput = document.getElementById('edit-floor-area') as HTMLInputElement;
      const editFloorCommonAreaInput = document.getElementById('edit-floor-common-area') as HTMLInputElement;
      const editFloorTechAreaInput = document.getElementById('edit-floor-tech-area') as HTMLInputElement;

      // Prepare floor update data
      const floorUpdateData = {
        maTL: selectedFloor.maTL,
        tenTL: editFloorNameInput.value,
        dienTichSan: parseFloat(editFloorAreaInput.value) || 0,
        dienTichKhuVucDungChung: parseFloat(editFloorCommonAreaInput.value) || 0,
        dienTichKyThuaPhuTro: parseFloat(editFloorTechAreaInput.value) || 0
      };

      // Send API request to update floor
      const response = await axios.put(
        'https://localhost:7246/api/TangLau/UpdateTangLau', 
        floorUpdateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the floors list with the new data
      setFloors(prevFloors => 
        prevFloors.map(floor => 
          floor.maTL === selectedFloor.maTL 
            ? {
                ...floor,
                tenTL: floorUpdateData.tenTL,
                dienTichSan: floorUpdateData.dienTichSan,
              } 
            : floor
        )
      );

      // Show success toast
      toast.success("Đã cập nhật thông tin tầng lầu", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // Close the edit dialog
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating floor:', error);
      toast.error("Không thể cập nhật tầng lầu. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const handleDeleteFloor = async () => {
    try {
      if (!selectedFloor || !selectedFloor.maTL) {
        toast.error("Không tìm thấy tầng lầu để xóa", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      // Send API request to delete floor
      const response = await axios.delete(
        `https://localhost:7246/api/TangLau/DeleteTangLau/?MaTL=${selectedFloor.maTL}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Show success toast
      toast.success(`Đã xóa tầng lầu "${selectedFloor.tenTL}"`, {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Close the delete dialog
      setIsDeleteDialogOpen(false);

      // Optionally, remove the deleted floor from the list
      setFloors(prevFloors => 
        prevFloors.filter(floor => 
          floor.maTL !== selectedFloor.maTL
        )
      );
    } catch (error) {
      console.error('Error deleting floor:', error);
      toast.error("Không thể xóa tầng lầu. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  // Handle building selection in add form
  const handleBuildingChange = (value: string) => {
    setNewFloor({
      ...newFloor,
      MaTN: value,
      MaKN: "" // Reset block when building changes
    })
  }

  const handleSelectFloorForEdit = (floor: TransformedFloor) => {
    // Convert TransformedFloor to FloorDetail for editing
    const floorDetail: FloorDetail = {
      maTL: typeof floor.maTL === 'number' ? floor.maTL : 0,
      tenTL: floor.tenTL,
      tenTN: floor.tenTN,
      tenKN: floor.tenKN,
      dienTichSan: floor.dienTichSan,
      totalPremises: floor.totalPremises,
      maTN: floor.maTN,
      maKN: floor.maKN
    }
    setSelectedFloor(floorDetail)
    setIsEditDialogOpen(true)
  }

  const handleSelectFloorForDelete = (floor: TransformedFloor) => {
    // Convert TransformedFloor to FloorDetail for deleting
    const floorDetail: FloorDetail = {
      maTL: typeof floor.maTL === 'number' ? floor.maTL : 0,
      tenTL: floor.tenTL,
      tenTN: floor.tenTN,
      tenKN: floor.tenKN,
      dienTichSan: floor.dienTichSan,
      totalPremises: floor.totalPremises,
      maTN: floor.maTN,
      maKN: floor.maKN
    }
    setSelectedFloor(floorDetail)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tầng lầu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm tầng lầu mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho tầng lầu mới.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="building">Tòa nhà</Label>
                <Select value={newFloor.MaTN} onValueChange={handleBuildingChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.maTN} value={building.maTN.toString()}>
                        {building.tenTN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor-block">Khối nhà</Label>
                <Select 
                  value={newFloor.MaKN} 
                  onValueChange={(value) => setNewFloor({...newFloor, MaKN: value})}
                  disabled={!newFloor.MaTN}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khối nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBlocks.map((block) => (
                      <SelectItem key={block.maKN} value={block.maKN.toString()}>
                        {block.tenKN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor-name">Tên tầng lầu</Label>
                <Input 
                  id="floor-name" 
                  placeholder="VD: Tầng 1"
                  value={newFloor.TenTL}
                  onChange={(e) => setNewFloor({...newFloor, TenTL: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="floor-area">Diện tích sàn (m²)</Label>
                <Input 
                  id="floor-area" 
                  type="number" 
                  placeholder="VD: 1000"
                  value={newFloor.DienTichSan}
                  onChange={(e) => setNewFloor({...newFloor, DienTichSan: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="floor-common-area">Diện tích khu vực dùng chung (m²)</Label>
                <Input 
                  id="floor-common-area" 
                  type="number" 
                  placeholder="VD: 250"
                  value={newFloor.DienTichKhuVucDungChung}
                  onChange={(e) => setNewFloor({...newFloor, DienTichKhuVucDungChung: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="floor-tech-area">Diện tích kỹ thuật phụ trợ (m²)</Label>
                <Input 
                  id="floor-tech-area" 
                  type="number" 
                  placeholder="VD: 150"
                  value={newFloor.DienTichKyThuaPhuTro}
                  onChange={(e) => setNewFloor({...newFloor, DienTichKyThuaPhuTro: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddFloor}>Lưu tầng lầu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter controls - only show when not filtered by specific IDs */}
      {!buildingId && !blockId && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên tầng lầu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={selectedBuildingFilter} 
              onValueChange={(value) => {
              setSelectedBuildingFilter(value)
              setSelectedBlockFilter("all") // Reset block filter when building changes
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Lọc theo tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                {buildingFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={selectedBlockFilter} 
              onValueChange={setSelectedBlockFilter} 
              disabled={selectedBuildingFilter === "all"}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Lọc theo khối nhà" />
              </SelectTrigger>
              <SelectContent>
                {blockFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <div className="grid grid-cols-12 border-b p-3 font-medium">
          <div className="col-span-2">Tên tầng</div>
          <div className="col-span-2 hidden sm:block">Tòa nhà</div>
          <div className="col-span-2">Khối nhà</div>
          <div className="col-span-2 hidden md:block">Diện tích sàn (m²)</div>
          <div className="col-span-2 hidden lg:block">Căn hộ</div>
          <div className="col-span-2">Thao tác</div>
        </div>
        {filteredFloors.map((floor) => (
          <div key={floor.maTL} className="grid grid-cols-12 border-b p-3 last:border-0">
            <div className="col-span-2">
              {floor.tenTL}
            </div>
            <div className="col-span-2 hidden sm:block">
              {floor.tenTN}
            </div>
            <div className="col-span-2">
              {floor.tenKN}
            </div>
            <div className="col-span-2 hidden md:block">{floor.dienTichSan.toFixed(2)} m²</div>
            <div className="col-span-2 hidden lg:block">{floor.totalPremises}</div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/buildings/floors/${floor.maTL}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Chi tiết</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSelectFloorForEdit(floor)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Sửa</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSelectFloorForDelete(floor)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Xóa</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Floor Dialog */}
      {selectedFloor && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa tầng lầu</DialogTitle>
              <DialogDescription>Cập nhật thông tin cho tầng lầu này.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-building">Tòa nhà</Label>
                <Select 
                  defaultValue={selectedFloor.maTN.toString()}
                  onValueChange={(value) => {
                    // Update the available blocks when building changes
                    const selectedBuilding = parseInt(value);
                    const availableBlocksForBuilding = blocks.filter(block => block.maTN === selectedBuilding);
                    
                    // If the current block is not in the new building's blocks, reset block selection
                    const currentBlockInBuilding = availableBlocksForBuilding.find(
                      block => block.maKN === selectedFloor.maKN
                    );
                    
                    if (!currentBlockInBuilding) {
                      // Reset block selection to the first block of the selected building
                      const firstBlock = availableBlocksForBuilding[0];
                      if (firstBlock) {
                        // Update the selected floor's block
                        setSelectedFloor(prev => prev ? {
                          ...prev,
                          maTN: selectedBuilding,
                          maKN: firstBlock.maKN,
                          tenKN: firstBlock.tenKN
                        } : null);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem 
                        key={building.maTN} 
                        value={building.maTN.toString()}
                      >
                        {building.tenTN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-floor-block">Khối nhà</Label>
                <Select 
                  value={selectedFloor.maKN.toString()}
                  onValueChange={(value) => {
                    // Update the selected floor's block
                    setSelectedFloor(prev => prev ? {
                      ...prev,
                      maKN: parseInt(value),
                      tenKN: blocks.find(block => block.maKN === parseInt(value))?.tenKN || ''
                    } : null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khối nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks
                      .filter(block => block.maTN === selectedFloor.maTN)
                      .map((block) => (
                        <SelectItem 
                          key={block.maKN} 
                          value={block.maKN.toString()}
                        >
                          {block.tenKN}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-floor-name">Tên tầng lầu</Label>
                <Input 
                  id="edit-floor-name" 
                  defaultValue={selectedFloor.tenTL} 
                />
              </div>
              <div>
                <Label htmlFor="edit-floor-area">Diện tích sàn (m²)</Label>
                <Input 
                  id="edit-floor-area" 
                  type="number" 
                  defaultValue={selectedFloor.dienTichSan.toFixed(2)} 
                />
              </div>
              <div>
                <Label htmlFor="edit-floor-common-area">Diện tích khu vực dùng chung (m²)</Label>
                <Input 
                  id="edit-floor-common-area" 
                  type="number" 
                  defaultValue="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-floor-tech-area">Diện tích kỹ thuật phụ trợ (m²)</Label>
                <Input 
                  id="edit-floor-tech-area" 
                  type="number" 
                  defaultValue="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={handleEditFloor}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedFloor && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa tầng lầu "{selectedFloor.tenTL}"? Thao tác này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteFloor}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
