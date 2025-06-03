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
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { buildingService, Building, BlockDetail, CreateBlockParams, UpdateBlockParams } from "@/services/building-service"
import { Bounce, toast } from "react-toastify"
import { useAuth } from "@/components/context/AuthContext"
import { useBuilding } from "@/components/context/BuildingContext"

interface BlockListProps {
  buildingId?: number
}

export function BlockList({ buildingId }: BlockListProps) {
  // TODO: Replace this with actual token retrieval from your authentication context/hook
    const { token } = useAuth()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>(buildingId?.toString() || "all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlock, setSelectedBlock] = useState<BlockDetail | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newBlock, setNewBlock] = useState({
    TenKN: "",
    MaTN: "",
    Status: "1"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editBlockData, setEditBlockData] = useState({
    maKN: 0,
    tenKN: "",
    trangThaiKhoiNha: 1
  })

  const {blocks, floors, createBlock, updateBlock, deleteBlock, getBuildingList, getFloorList, getBlockDetail, getBlockList} = useBuilding()

  // useEffect(() => {
  //   // Safely retrieve token only on client-side
  //   const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  //   setToken(storedToken || '')
  // }, [])

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        if (!token) return

        const data = await buildingService.getBlockList(token)
        setBuildings(data)
        setIsLoading(false)
      } catch (error) {
        toast.error("Không thể tải danh sách khối nhà", {
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

    fetchBlocks()
  }, [token])

  // Apply filters
  const filteredBlocks = buildings
    .flatMap(building => building.khoiNhaDetail)
    .filter((block) => {
      // Filter by building if provided or selected
      if (buildingId) {
        return block.maTN === buildingId;
      } else if (selectedBuildingFilter !== "all") {
        return block.maTN === parseInt(selectedBuildingFilter);
      }
      return true;
    })
    .filter((block) => {
      // Filter by search query
      if (searchQuery.trim() === "") return true;
      return block.tenKN.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleAddBlock = async () => {
    // Validate inputs
    if (!newBlock.TenKN.trim()) {
      toast.error("Vui lòng nhập tên khối nhà", {
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
      return
    }

    if (!newBlock.MaTN) {
      toast.error("Vui lòng chọn tòa nhà", {
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
      return
    }

    try {
      const blockData: CreateBlockParams = {
        tenKN: newBlock.TenKN,
        maTN: parseInt(newBlock.MaTN),
        trangThaiKhoiNha: parseInt(newBlock.Status)
      }
      // Call API to create block
      await buildingService.createBlock(blockData, token || '')

      // Refresh block list
      const updatedBlocks = await buildingService.getBlockList(token || '')
      setBuildings(updatedBlocks)

      // Reset form and close dialog
      setNewBlock({
        TenKN: "",
        MaTN: "",
        Status: "1"
      })
    
      toast.success('Thêm khối nhà thành công', {
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

    } catch (error) {
      toast.error('Thêm khối nhà thất bại', {
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

  const handleEditBlock = async () => {
    if (!selectedBlock) {
      toast.error("Không có khối nhà được chọn để sửa", {
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
      return
    }

    try {
      // Prepare update data
      const updateData: UpdateBlockParams = {
        maKN: selectedBlock.maKN,
        tenKN: editBlockData.tenKN || selectedBlock.tenKN,
        trangThaiKhoiNha: editBlockData.trangThaiKhoiNha
      }

      // Call API to update block
      await buildingService.updateBlock(updateData, token || '')

      // Refresh block list
      const updatedBlocks = await buildingService.getBlockList(token || '')
      setBuildings(updatedBlocks)

      // Close edit dialog
      setIsEditDialogOpen(false)

      // Show success toast
      toast.success(`Cập nhật khối nhà ${updateData.tenKN} thành công`, {
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
    } catch (error) {
      toast.error("Không thể cập nhật khối nhà. Vui lòng thử lại.", {
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
    }
  }

  const handleDeleteBlock = async () => {
    if (!selectedBlock) {
      toast.error('Không có khối nhà được chọn để xóa', {
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
      return
    }

    try {
      // Call API to delete block
      await buildingService.deleteBlock(selectedBlock.maKN, token || '')

      // Refresh block list
      const updatedBlocks = await buildingService.getBlockList(token || '')
      setBuildings(updatedBlocks)

      // Close delete dialog
      setIsDeleteDialogOpen(false)

      toast.success(`Khối nhà ${selectedBlock.tenKN} đã được xóa`, {
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
    } catch (error) {
      toast.error('Không thể xóa khối nhà. Vui lòng thử lại.', {
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
    }
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
                    {buildings.map((building) => (
                      <SelectItem key={building.maTN} value={building.maTN.toString()}>
                        {building.tenTN}
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
                {buildings.map((building) => (
                  <SelectItem key={building.maTN} value={building.maTN.toString()}>
                    {building.tenTN}
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
        {buildings.flatMap(building => building.khoiNhaDetail).map((block, index) => {
          const building = buildings.find(b => b.maTN === block.maTN)
          return (
            <div key={index} className="grid grid-cols-12 border-b p-3 last:border-0">
              <div className="col-span-3">
                {block.tenKN}
              </div>
              <div className="col-span-3 hidden sm:block">
                {building?.tenTN}
              </div>
              <div className="col-span-2 hidden md:block">{block.totalFloors}</div>
              <div className="col-span-2">
                <Badge variant={block.status === 1 ? "default" : "outline"}>
                  {block.status === 1 ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/buildings/blocks/${block.maKN}`} passHref>
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
          )
        })}
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
                <Select 
                  defaultValue={selectedBlock?.maTN.toString()}
                  onValueChange={(value) => setEditBlockData(prev => ({
                    ...prev,
                    maTN: parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-block-name">Tên khối nhà</Label>
                <Input 
                  id="edit-block-name" 
                  defaultValue={selectedBlock?.tenKN} 
                  onChange={(e) => setEditBlockData(prev => ({
                    ...prev,
                    tenKN: e.target.value
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-block-status">Trạng thái</Label>
                <Select 
                  defaultValue={selectedBlock?.status.toString()}
                  onValueChange={(value) => setEditBlockData(prev => ({
                    ...prev,
                    trangThaiKhoiNha: parseInt(value)
                  }))}
                >
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
                Bạn có chắc chắn muốn xóa khối nhà "{selectedBlock.tenKN}"? Thao tác này không thể hoàn tác.
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
