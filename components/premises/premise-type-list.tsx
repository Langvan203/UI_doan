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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus, Trash2, Search } from "lucide-react"
import { toast, Bounce } from "react-toastify"
import { premiseService, PremiseType } from "@/services/premise-service"
import { useAuth } from "@/components/context/AuthContext"

export function PremiseTypeList() {
  const [premiseTypes, setPremiseTypes] = useState<PremiseType[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPremiseType, setSelectedPremiseType] = useState<PremiseType | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newPremiseTypeName, setNewPremiseTypeName] = useState("")

  const { token } = useAuth()

  // Fetch premise types
  useEffect(() => {
    const fetchPremiseTypes = async () => {
      try {
        setIsLoading(true)
        const data = await premiseService.getPremiseTypes(token)
        setPremiseTypes(data)
        setIsLoading(false)
      } catch (error) {
        toast.error("Không thể tải danh sách loại mặt bằng", {
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

    if (token) {
      fetchPremiseTypes()
    }
  }, [token])

  // Handle adding a new premise type
  const handleAddPremiseType = async () => {
    try {
      const trimmedName = (newPremiseTypeName || "").trim()
      if (!trimmedName) {
        toast.error("Vui lòng nhập tên loại mặt bằng", {
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

      const newType = await premiseService.createPremiseType(
        { tenLMB: trimmedName }, 
        token || ""
      )

      // Update local state
      setPremiseTypes(prev => [...prev, newType])

      // Reset and close dialog
      setNewPremiseTypeName("")
      setIsAddDialogOpen(false)

      toast.success("Đã thêm loại mặt bằng mới", {
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
      toast.error("Không thể thêm loại mặt bằng", {
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

  // Handle editing a premise type
  const handleEditPremiseType = async () => {
    try {
      const trimmedName = (newPremiseTypeName || "").trim()
      if (!selectedPremiseType || !trimmedName) {
        toast.error("Vui lòng nhập tên loại mặt bằng", {
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

      const updatedType = await premiseService.updatePremiseType(
        { 
          maLMB: selectedPremiseType.maLMB, 
          tenLMB: trimmedName 
        }, 
        token || ""
      )

      // Update local state
      setPremiseTypes(prev => 
        prev.map(type => 
          type.maLMB === selectedPremiseType.maLMB 
            ? { ...type, tenLMB: trimmedName } 
            : type
        )
      )

      // Reset and close dialog
      setNewPremiseTypeName("")
      setIsEditDialogOpen(false)
      setSelectedPremiseType(null)

      toast.success("Đã cập nhật loại mặt bằng", {
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
      toast.error("Không thể cập nhật loại mặt bằng", {
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

  // Handle deleting a premise type
  const handleDeletePremiseType = async () => {
    try {
      if (!selectedPremiseType) {
        toast.error("Không tìm thấy loại mặt bằng để xóa", {
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

      await premiseService.deletePremiseType(selectedPremiseType.maLMB, token)

      // Update local state
      setPremiseTypes(prev => 
        prev.filter(type => type.maLMB !== selectedPremiseType.maLMB)
      )

      // Reset and close dialog
      setIsDeleteDialogOpen(false)
      setSelectedPremiseType(null)

      toast.success("Đã xóa loại mặt bằng", {
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
      toast.error("Không thể xóa loại mặt bằng", {
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

  // Filter premise types
  const filteredPremiseTypes = premiseTypes.filter(type => 
    type.tenLMB.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 mr-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm loại mặt bằng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={() => {
          setNewPremiseTypeName("")
          setIsAddDialogOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại mặt bằng
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b p-3 font-medium">
          <div className="col-span-10">Tên loại mặt bằng</div>
          <div className="col-span-2">Thao tác</div>
        </div>
        {filteredPremiseTypes.map((type) => (
          <div key={type.maLMB} className="grid grid-cols-12 border-b p-3 last:border-0">
            <div className="col-span-10">{type.tenLMB}</div>
            <div className="col-span-2 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedPremiseType(type)
                  setNewPremiseTypeName(type.tenLMB)
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
                  setSelectedPremiseType(type)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Xóa</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Premise Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm loại mặt bằng mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho loại mặt bằng mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="premise-type-name">Tên loại mặt bằng</Label>
              <Input 
                id="premise-type-name"
                placeholder="VD: Văn phòng, Căn hộ, Cửa hàng"
                value={newPremiseTypeName}
                onChange={(e) => setNewPremiseTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddPremiseType}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Premise Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa loại mặt bằng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho loại mặt bằng.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-premise-type-name">Tên loại mặt bằng</Label>
              <Input 
                id="edit-premise-type-name"
                placeholder="VD: Văn phòng, Căn hộ, Cửa hàng"
                value={newPremiseTypeName}
                onChange={(e) => setNewPremiseTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditPremiseType}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa loại mặt bằng "{selectedPremiseType?.tenLMB}"? 
              Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePremiseType}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 