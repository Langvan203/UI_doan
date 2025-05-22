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
import { premiseService, PremiseStatus } from "@/services/premise-service"
import { useAuth } from "@/app/hooks/use-auth"

export function PremiseStatusList() {
  const [premiseStatuses, setPremiseStatuses] = useState<PremiseStatus[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPremiseStatus, setSelectedPremiseStatus] = useState<PremiseStatus | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newPremiseStatusName, setNewPremiseStatusName] = useState("")

  const token = useAuth().getToken()

  // Fetch premise statuses
  useEffect(() => {
    const fetchPremiseStatuses = async () => {
      try {
        setIsLoading(true)
        const data = await premiseService.getPremiseStatuses(token)
        setPremiseStatuses(data)
        setIsLoading(false)
      } catch (error) {
        toast.error("Không thể tải danh sách trạng thái mặt bằng", {
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
      fetchPremiseStatuses()
    }
  }, [token])

  // Handle adding a new premise status
  const handleAddPremiseStatus = async () => {
    try {
      const trimmedName = (newPremiseStatusName || "").trim()
      if (!trimmedName) {
        toast.error("Vui lòng nhập tên trạng thái mặt bằng", {
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

      const newStatus = await premiseService.createPremiseStatus(
        { tenTrangThai: trimmedName }, 
        token || ""
      )

      // Update local state
      setPremiseStatuses(prev => [...prev, newStatus])

      // Reset and close dialog
      setNewPremiseStatusName("")
      setIsAddDialogOpen(false)

      toast.success("Đã thêm trạng thái mặt bằng mới", {
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
      toast.error("Không thể thêm trạng thái mặt bằng", {
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

  // Handle editing a premise status
  const handleEditPremiseStatus = async () => {
    try {
      const trimmedName = (newPremiseStatusName || "").trim()
      if (!selectedPremiseStatus || !trimmedName) {
        toast.error("Vui lòng nhập tên trạng thái mặt bằng", {
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

      const updatedStatus = await premiseService.updatePremiseStatus(
        { 
          maTrangThai: selectedPremiseStatus.maTrangThai, 
          tenTrangThai: trimmedName 
        }, 
        token || ""
      )

      // Update local state
      setPremiseStatuses(prev => 
        prev.map(status => 
          status.maTrangThai === selectedPremiseStatus.maTrangThai 
            ? { ...status, tenTrangThai: trimmedName } 
            : status
        )
      )

      // Reset and close dialog
      setNewPremiseStatusName("")
      setIsEditDialogOpen(false)
      setSelectedPremiseStatus(null)

      toast.success("Đã cập nhật trạng thái mặt bằng", {
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
      toast.error("Không thể cập nhật trạng thái mặt bằng", {
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

  // Handle deleting a premise status
  const handleDeletePremiseStatus = async () => {
    try {
      if (!selectedPremiseStatus) {
        toast.error("Không tìm thấy trạng thái mặt bằng để xóa", {
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

      await premiseService.deletePremiseStatus(selectedPremiseStatus.maTrangThai, token)

      // Update local state
      setPremiseStatuses(prev => 
        prev.filter(status => status.maTrangThai !== selectedPremiseStatus.maTrangThai)
      )

      // Reset and close dialog
      setIsDeleteDialogOpen(false)
      setSelectedPremiseStatus(null)

      toast.success("Đã xóa trạng thái mặt bằng", {
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
      toast.error("Không thể xóa trạng thái mặt bằng", {
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

  // Filter premise statuses
  const filteredPremiseStatuses = premiseStatuses.filter(status => 
    status.tenTrangThai.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Tìm kiếm trạng thái mặt bằng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={() => {
          setNewPremiseStatusName("")
          setIsAddDialogOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm trạng thái mặt bằng
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b p-3 font-medium">
          <div className="col-span-10">Tên trạng thái mặt bằng</div>
          <div className="col-span-2">Thao tác</div>
        </div>
        {filteredPremiseStatuses.map((status) => (
          <div key={status.maTrangThai} className="grid grid-cols-12 border-b p-3 last:border-0">
            <div className="col-span-10">{status.tenTrangThai}</div>
            <div className="col-span-2 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedPremiseStatus(status)
                  setNewPremiseStatusName(status.tenTrangThai)
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
                  setSelectedPremiseStatus(status)
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

      {/* Add Premise Status Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm trạng thái mặt bằng mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho trạng thái mặt bằng mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="premise-status-name">Tên trạng thái mặt bằng</Label>
              <Input 
                id="premise-status-name"
                placeholder="VD: Trống, Đã thuê, Đang sửa chữa"
                value={newPremiseStatusName}
                onChange={(e) => setNewPremiseStatusName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddPremiseStatus}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Premise Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa trạng thái mặt bằng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho trạng thái mặt bằng.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-premise-status-name">Tên trạng thái mặt bằng</Label>
              <Input 
                id="edit-premise-status-name"
                placeholder="VD: Trống, Đã thuê, Đang sửa chữa"
                value={newPremiseStatusName}
                onChange={(e) => setNewPremiseStatusName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditPremiseStatus}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa trạng thái mặt bằng "{selectedPremiseStatus?.tenTrangThai}"? 
              Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePremiseStatus}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 