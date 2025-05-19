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

// Mock data for blocks based on tnKhoiNha model
const blocksData = [
  { MaKN: 1, TenKN: "Khối A", MaTN: 1, Status: 1 },
  { MaKN: 2, TenKN: "Khối B", MaTN: 1, Status: 1 },
  { MaKN: 3, TenKN: "Khối C", MaTN: 1, Status: 0 },
  { MaKN: 4, TenKN: "Khối D", MaTN: 1, Status: 1 },
  { MaKN: 5, TenKN: "Khối A", MaTN: 2, Status: 1 },
  { MaKN: 6, TenKN: "Khối B", MaTN: 2, Status: 0 },
  { MaKN: 7, TenKN: "Khối C", MaTN: 2, Status: 1 },
  { MaKN: 8, TenKN: "Khối D", MaTN: 2, Status: 1 },
]

// Mock data for buildings
const buildingsData = [
  {
    MaTN: 1,
    TenTN: "Chung cư Hạnh Phúc",
  },
  {
    MaTN: 2,
    TenTN: "Chung cư Sunshine",
  },
]

// Mock data for floors per block
const floorCountData: Record<number, number> = {
  1: 5,
  2: 8,
  3: 10,
  4: 12,
  5: 15,
  6: 8,
  7: 10,
  8: 12,
}

interface BlockListProps {
  buildingId?: number
}

export function BlockList({ buildingId }: BlockListProps) {
  const { toast } = useToast()
  // Filter blocks by building ID if provided
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>(buildingId?.toString() || "all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlock, setSelectedBlock] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newBlock, setNewBlock] = useState({
    TenKN: "",
    MaTN: "",
    Status: "1"
  })

  // Apply filters
  const filteredBlocks = blocksData
    .filter((block) => {
      // Filter by building if provided or selected
      if (buildingId) {
        return block.MaTN === buildingId;
      } else if (selectedBuildingFilter !== "all") {
        return block.MaTN === parseInt(selectedBuildingFilter);
      }
      return true;
    })
    .filter((block) => {
      // Filter by search query
      if (searchQuery.trim() === "") return true;
      return block.TenKN.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleAddBlock = () => {
    // Add block logic would go here - this is mock for now
    toast({
      title: "Khối nhà đã được thêm",
      description: `Khối nhà ${newBlock.TenKN} đã được tạo thành công`,
    })
    
    // Reset form
    setNewBlock({
      TenKN: "",
      MaTN: "",
      Status: "1"
    })
  }

  const handleEditBlock = () => {
    // Edit block logic would go here - this is mock for now
    toast({
      title: "Đã cập nhật khối nhà",
      description: `Khối nhà ${selectedBlock.TenKN} đã được cập nhật thành công`,
    })
    setIsEditDialogOpen(false)
  }

  const handleDeleteBlock = () => {
    // Delete block logic would go here - this is mock for now
    toast({
      title: "Đã xóa khối nhà",
      description: `Khối nhà ${selectedBlock.TenKN} đã được xóa thành công`,
    })
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khối nhà
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm khối nhà mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho khối nhà mới.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="building">Tòa nhà</Label>
                <Select value={newBlock.MaTN} onValueChange={(value) => setNewBlock({...newBlock, MaTN: value})}>
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
                <Label htmlFor="block-name">Tên khối nhà</Label>
                <Input 
                  id="block-name" 
                  placeholder="VD: Khối A" 
                  value={newBlock.TenKN}
                  onChange={(e) => setNewBlock({...newBlock, TenKN: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="block-status">Trạng thái</Label>
                <Select value={newBlock.Status} onValueChange={(value) => setNewBlock({...newBlock, Status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoạt động</SelectItem>
                    <SelectItem value="0">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddBlock}>Lưu khối nhà</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Filter controls - only show when not filtered by a specific buildingId */}
      {!buildingId && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên khối nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBuildingFilter} onValueChange={setSelectedBuildingFilter}>
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
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <div className="grid grid-cols-12 border-b p-3 font-medium">
          <div className="col-span-3">Tên khối nhà</div>
          <div className="col-span-3 hidden sm:block">Tòa nhà</div>
          <div className="col-span-2 hidden md:block">Số tầng</div>
          <div className="col-span-2">Trạng thái</div>
          <div className="col-span-2">Thao tác</div>
        </div>
        {filteredBlocks.map((block) => (
          <div key={block.MaKN} className="grid grid-cols-12 border-b p-3 last:border-0">
            <div className="col-span-3">
              {block.TenKN}
            </div>
            <div className="col-span-3 hidden sm:block">
              {buildingsData.find((b) => b.MaTN === block.MaTN)?.TenTN}
              <div className="sm:hidden text-xs text-muted-foreground">
                {buildingsData.find((b) => b.MaTN === block.MaTN)?.TenTN}
              </div>
            </div>
            <div className="col-span-2 hidden md:block">{floorCountData[block.MaKN] || 0}</div>
            <div className="col-span-2">
              <Badge variant={block.Status === 1 ? "default" : "outline"}>
                {block.Status === 1 ? "Hoạt động" : "Không hoạt động"}
              </Badge>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/buildings/blocks/${block.MaKN}`} passHref>
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
                    setSelectedBlock(block)
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
                    setSelectedBlock(block)
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

      {/* Edit Block Dialog */}
      {selectedBlock && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa khối nhà</DialogTitle>
              <DialogDescription>Cập nhật thông tin cho khối nhà này.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-building">Tòa nhà</Label>
                <Select defaultValue={selectedBlock.MaTN.toString()}>
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
                <Label htmlFor="edit-block-name">Tên khối nhà</Label>
                <Input id="edit-block-name" defaultValue={selectedBlock.TenKN} />
              </div>
              <div>
                <Label htmlFor="edit-block-status">Trạng thái</Label>
                <Select defaultValue={selectedBlock.Status.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoạt động</SelectItem>
                    <SelectItem value="0">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={handleEditBlock}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedBlock && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa khối nhà "{selectedBlock.TenKN}"? Thao tác này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteBlock}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
