"use client"

import { useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Mock data for floors based on tnTangLau model
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

// Mock data for premises count
const premisesCountData: Record<number, number> = {
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 6,
  6: 6,
}

interface FloorListProps {
  buildingId?: number
  blockId?: number
}

export function FloorList({ buildingId, blockId }: FloorListProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>(buildingId?.toString() || "all")
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>(blockId?.toString() || "all")
  const [selectedFloor, setSelectedFloor] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newFloor, setNewFloor] = useState({
    TenTL: "",
    MaTN: "",
    MaKN: "",
    DienTichSan: "0",
    DienTichKhuVucDungChung: "0",
    DienTichKyThuaPhuTro: "0"
  })
  
  // Get available blocks based on selected building
  const availableBlocks = newFloor.MaTN 
    ? blocksData.filter(block => block.MaTN === parseInt(newFloor.MaTN))
    : blocksData

  // Apply filters
  const filteredFloors = floorsData
    .filter((floor) => {
      // Filter by building if provided or selected
      if (buildingId) {
        return floor.MaTN === buildingId;
      } else if (selectedBuildingFilter !== "all") {
        return floor.MaTN === parseInt(selectedBuildingFilter);
      }
      return true;
    })
    .filter((floor) => {
      // Filter by block if provided or selected
      if (blockId) {
        return floor.MaKN === blockId;
      } else if (selectedBlockFilter !== "all") {
        return floor.MaKN === parseInt(selectedBlockFilter);
      }
      return true;
    })
    .filter((floor) => {
      // Filter by search query
      if (searchQuery.trim() === "") return true;
      return floor.TenTL.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleAddFloor = () => {
    // Add floor logic would go here - this is mock for now
    toast({
      title: "Tầng lầu đã được thêm",
      description: `Tầng lầu ${newFloor.TenTL} đã được tạo thành công`,
    })
    
    // Reset form
    setNewFloor({
      TenTL: "",
      MaTN: "",
      MaKN: "",
      DienTichSan: "0",
      DienTichKhuVucDungChung: "0",
      DienTichKyThuaPhuTro: "0"
    })
  }

  const handleEditFloor = () => {
    // Edit floor logic would go here - this is mock for now
    toast({
      title: "Đã cập nhật tầng lầu",
      description: `Tầng lầu ${selectedFloor.TenTL} đã được cập nhật thành công`,
    })
    setIsEditDialogOpen(false)
  }

  const handleDeleteFloor = () => {
    // Delete floor logic would go here - this is mock for now
    toast({
      title: "Đã xóa tầng lầu",
      description: `Tầng lầu ${selectedFloor.TenTL} đã được xóa thành công`,
    })
    setIsDeleteDialogOpen(false)
  }

  // Handle building selection in add form
  const handleBuildingChange = (value: string) => {
    setNewFloor({
      ...newFloor,
      MaTN: value,
      MaKN: "" // Reset block when building changes
    })
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
                    {buildingsData.map((building) => (
                      <SelectItem key={building.MaTN} value={building.MaTN.toString()}>
                        {building.TenTN}
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
                      <SelectItem key={block.MaKN} value={block.MaKN.toString()}>
                        {block.TenKN}
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
            <Select value={selectedBuildingFilter} onValueChange={(value) => {
              setSelectedBuildingFilter(value)
              setSelectedBlockFilter("all") // Reset block filter when building changes
            }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Lọc theo tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                {buildingsData.map((building) => (
                  <SelectItem key={building.MaTN} value={building.MaTN.toString()}>
                    {building.TenTN}
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
                <SelectItem value="all">Tất cả khối nhà</SelectItem>
                {blocksData
                  .filter(block => selectedBuildingFilter === "all" || block.MaTN === parseInt(selectedBuildingFilter))
                  .map((block) => (
                    <SelectItem key={block.MaKN} value={block.MaKN.toString()}>
                      {block.TenKN}
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
          <div key={floor.MaTL} className="grid grid-cols-12 border-b p-3 last:border-0">
            <div className="col-span-2">
              {floor.TenTL}
            </div>
            <div className="col-span-2 hidden sm:block">
              {buildingsData.find((b) => b.MaTN === floor.MaTN)?.TenTN}
              <div className="sm:hidden text-xs text-muted-foreground">
                {buildingsData.find((b) => b.MaTN === floor.MaTN)?.TenTN}
              </div>
            </div>
            <div className="col-span-2">
              {blocksData.find((b) => b.MaKN === floor.MaKN)?.TenKN}
            </div>
            <div className="col-span-2 hidden md:block">{floor.DienTichSan} m²</div>
            <div className="col-span-2 hidden lg:block">{premisesCountData[floor.MaTL] || 0}</div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/buildings/floors/${floor.MaTL}`} passHref>
                  <Button variant="ghost" size="sm" asChild>
                    <div>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Chi tiết</span>
                    </div>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedFloor(floor)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Sửa</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedFloor(floor)
                    setIsDeleteDialogOpen(true)
                  }}
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
                <Select defaultValue={selectedFloor.MaTN.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingsData.map((building) => (
                      <SelectItem key={building.MaTN} value={building.MaTN.toString()}>
                        {building.TenTN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-floor-block">Khối nhà</Label>
                <Select defaultValue={selectedFloor.MaKN.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blocksData
                      .filter((block) => block.MaTN === selectedFloor.MaTN)
                      .map((block) => (
                        <SelectItem key={block.MaKN} value={block.MaKN.toString()}>
                          {block.TenKN}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-floor-name">Tên tầng lầu</Label>
                <Input id="edit-floor-name" defaultValue={selectedFloor.TenTL} />
              </div>
              <div>
                <Label htmlFor="edit-floor-area">Diện tích sàn (m²)</Label>
                <Input id="edit-floor-area" type="number" defaultValue={selectedFloor.DienTichSan} />
              </div>
              <div>
                <Label htmlFor="edit-floor-common-area">Diện tích khu vực dùng chung (m²)</Label>
                <Input id="edit-floor-common-area" type="number" defaultValue={selectedFloor.DienTichKhuVucDungChung} />
              </div>
              <div>
                <Label htmlFor="edit-floor-tech-area">Diện tích kỹ thuật phụ trợ (m²)</Label>
                <Input id="edit-floor-tech-area" type="number" defaultValue={selectedFloor.DienTichKyThuaPhuTro} />
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
                Bạn có chắc chắn muốn xóa tầng lầu "{selectedFloor.TenTL}"? Thao tác này không thể hoàn tác.
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
