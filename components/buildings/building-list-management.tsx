"use client"

import { useState, useEffect } from "react"
import { Plus, Search, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BuildingDetailedList } from "@/components/buildings/building-detailed-list"
import { BuildingOverviewCard } from "@/components/buildings/building-overview-card"
import axios from "axios"
import { Bounce, toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from "@/app/hooks/use-auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Định nghĩa interface cho tòa nhà với các thuộc tính yêu cầu
interface BuildingDetailed {
  id: number
  name: string
  address: string
  occupancyRate: number
  constructionYear: number
  status: string
  soTangHam: number
  soTangNoi: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
  nganHangThanhToan: string
  soTaiKhoan: string
  noiDungChuyenKhoan: string
}

export function BuildingListManagement() {
  const [buildings, setBuildings] = useState<BuildingDetailed[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingDetailed | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [buildingToDelete, setBuildingToDelete] = useState<BuildingDetailed | null>(null)
  const [newBuilding, setNewBuilding] = useState<Partial<BuildingDetailed>>({
    status: "Hoạt động",
  })

  // Get authentication token
  const { getToken } = useAuth()

  // Fetch buildings on component mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const token = getToken()
        if (!token) {
          return;
        }

        const response = await axios.get('https://localhost:7246/api/ToaNha/GetDSToaNha', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setBuildings(response.data)
      } catch (error) {
        console.error("Error fetching buildings:", error)
        toast.error("Không thể tải danh sách tòa nhà", {
          position: "top-right",
          autoClose: 1000,
        })
        setBuildings([])
      }
    }

    fetchBuildings()
  }, [getToken])

  // Lọc tòa nhà theo từ khóa tìm kiếm
  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý thêm tòa nhà mới
  const handleAddBuilding = async () => {
    // Validate required fields
    if (!newBuilding.name || !newBuilding.address) {
      toast.error('Vui lòng nhập đầy đủ thông tin', {
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
      // Get authentication token
      const token = getToken()
      if (!token) {
        toast.error("Vui lòng đăng nhập", {
          position: "top-right",
          autoClose: 1000,
        })
        return
      }

      // Prepare the payload to match the API requirements
      const payload = {
        tenTN: newBuilding.name,
        diaChi: newBuilding.address,
        trangThaiToaNha: newBuilding.status === "active" || newBuilding.status === "Hoạt động" ? 1 : 
                         newBuilding.status === "inactive" || newBuilding.status === "Không hoạt động" ? 0 : 
                         2, // Default to a neutral state if status is unclear
        soTangNoi: newBuilding.soTangNoi || 0,
        soTangHam: newBuilding.soTangHam || 0,
        soTaiKhoan: newBuilding.soTaiKhoan || "",
        noiDungChuyenKhoan: newBuilding.noiDungChuyenKhoan || "",
        nganHangThanhToan: newBuilding.nganHangThanhToan || "",
        dienTichXayDung: newBuilding.dienTichXayDung || 0,
        tongDienTichSan: newBuilding.tongDienTichSan || 0,
        tongDienTichChoThueNET: newBuilding.tongDienTichChoThueNET || 0,
        tongDienTichChoThueGross: newBuilding.tongDienTichChoThueGross || 0,
      }

      // Call the API to add the building
      const response = await axios.post(
        'https://localhost:7246/api/ToaNha/them-toa-nha', 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast.success('Thêm tòa nhà thành công', {
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

        // Fetch updated building list
        const fetchBuildings = async () => {
          try {
            const buildingsResponse = await axios.get('https://localhost:7246/api/ToaNha/GetDSToaNha', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            setBuildings(buildingsResponse.data)
          } catch (error) {
            console.error("Error fetching buildings:", error)
            toast.error("Không thể tải danh sách tòa nhà", {
              position: "top-right",
              autoClose: 1000,
            })
          }
        }

        // Close the dialog and reset the form
        setShowAddDialog(false)
        setNewBuilding({
          status: "Hoạt động",
        })

        // Fetch updated buildings
        fetchBuildings()
      }
    } catch (error) {
      // Handle API errors
      console.error("Error adding building:", error)
      toast.error("Thêm tòa nhà thất bại. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 1000,
      })
    }
  }

  // Xử lý cập nhật tòa nhà
  const handleUpdateBuilding = async () => {
    // Validate required fields
    if (!selectedBuilding || !selectedBuilding.name || !selectedBuilding.address) {
      toast.error('Vui lòng nhập đầy đủ thông tin', {
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

    try {
      // Get authentication token
      const token = getToken()
      if (!token) {
        toast.error("Vui lòng đăng nhập", {
          position: "top-right",
          autoClose: 1000,
        })
        return
      }

      // Prepare the payload to match the API requirements
      const payload = {
        id: selectedBuilding.id,
        tenTN: selectedBuilding.name,
        diaChi: selectedBuilding.address,
        trangThaiToaNha: selectedBuilding.status === "active" || selectedBuilding.status === "Hoạt động" ? 1 : 
                         selectedBuilding.status === "inactive" || selectedBuilding.status === "Không hoạt động" ? 0 : 
                         2, // Default to a neutral state if status is unclear
        soTangNoi: selectedBuilding.soTangNoi || 0,
        soTangHam: selectedBuilding.soTangHam || 0,
        soTaiKhoan: selectedBuilding.soTaiKhoan || "",
        noiDungChuyenKhoan: selectedBuilding.noiDungChuyenKhoan || "",
        nganHangThanhToan: selectedBuilding.nganHangThanhToan || "",
        dienTichXayDung: selectedBuilding.dienTichXayDung || 0,
        tongDienTichSan: selectedBuilding.tongDienTichSan || 0,
        tongDienTichChoThueNET: selectedBuilding.tongDienTichChoThueNET || 0,
        tongDienTichChoThueGross: selectedBuilding.tongDienTichChoThueGross || 0,
        namXayDung: selectedBuilding.constructionYear || 0,
      }

      // Call the API to update the building
      const response = await axios.put(
        'https://localhost:7246/api/ToaNha/UpdateToaNha', 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Check if the response is successful
      if (response.status === 200) {
        // Show success toast
        toast.success('Cập nhật tòa nhà thành công', {
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

        // Fetch updated building list
        const fetchBuildings = async () => {
          try {
            const buildingsResponse = await axios.get('https://localhost:7246/api/ToaNha/GetDSToaNha', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            setBuildings(buildingsResponse.data)
          } catch (error) {
            console.error("Error fetching buildings:", error)
            toast.error("Không thể tải danh sách tòa nhà", {
              position: "top-right",
              autoClose: 1000,
            })
          }
        }

        // Close the dialog
        setShowEditDialog(false)

        // Fetch updated buildings
        fetchBuildings()
      }
    } catch (error) {
      // Handle API errors
      console.error("Error updating building:", error)
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Không thể cập nhật tòa nhà"
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1000,
        })
      } else {
        toast.error("Cập nhật tòa nhà thất bại. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 1000,
        })
      }
    }
  }

  // Modify delete handling to show confirmation dialog
  const confirmDeleteBuilding = (building: BuildingDetailed) => {
    setBuildingToDelete(building)
    setShowDeleteConfirmDialog(true)
  }

  // Actual delete method
  const handleDeleteBuilding = async () => {
    if (!buildingToDelete) return

    try {
      // Get authentication token
      const token = getToken()
      if (!token) {
        toast.error("Vui lòng đăng nhập", {
          position: "top-right",
          autoClose: 1000,
        })
        return
      }

      // Call API to delete building
      const response = await axios.delete(`https://localhost:7246/api/ToaNha/XoaToaNhaById?id=${buildingToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Check if deletion was successful
      if (response.status === 200) {
        // Remove the deleted building from the list
        const updatedBuildings = buildings.filter((building) => building.id !== buildingToDelete.id)
        setBuildings(updatedBuildings)

        // Reset selected building if it was the deleted one
        if (selectedBuilding?.id === buildingToDelete.id) {
          setSelectedBuilding(null)
        }

        // Close the confirmation dialog
        setShowDeleteConfirmDialog(false)
        setBuildingToDelete(null)

        // Show success toast
        toast.success('Xóa tòa nhà thành công', {
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
    } catch (error) {
      console.error("Error deleting building:", error)
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Không thể xóa tòa nhà"
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1000,
        })
      } else {
        toast.error("Xóa tòa nhà thất bại. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 1000,
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Danh sách tòa nhà</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tòa nhà
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="maintenance">Đang bảo trì</SelectItem>
            </SelectContent>
          </Select> */}
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              Danh sách
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
            >
              Lưới
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả tòa nhà</TabsTrigger>
          <TabsTrigger value="active">Hoạt động</TabsTrigger>
          <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "list" ? (
            <BuildingDetailedList
              buildings={filteredBuildings}
              onEdit={(building) => {
                setSelectedBuilding(building)
                setShowEditDialog(true)
              }}
              onDelete={(building) => confirmDeleteBuilding(building)}
              onSelect={(building) => setSelectedBuilding(building)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBuildings.map((building) => (
                <BuildingOverviewCard
                  key={building.id}
                  building={building}
                  onEdit={() => {
                    setSelectedBuilding(building)
                    setShowEditDialog(true)
                  }}
                  onDelete={() => confirmDeleteBuilding(building)}
                  onSelect={() => setSelectedBuilding(building)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {viewMode === "list" ? (
            <BuildingDetailedList
              buildings={filteredBuildings.filter((b) => 
                b.status === "active" || b.status === "Hoạt động"
              )}
              onEdit={(building) => {
                setSelectedBuilding(building)
                setShowEditDialog(true)
              }}
              onDelete={(building) => confirmDeleteBuilding(building)}
              onSelect={(building) => setSelectedBuilding(building)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBuildings
                .filter((b) => b.status === "active" || b.status === "Hoạt động")
                .map((building) => (
                  <BuildingOverviewCard
                    key={building.id}
                    building={building}
                    onEdit={() => {
                      setSelectedBuilding(building)
                      setShowEditDialog(true)
                    }}
                    onDelete={() => confirmDeleteBuilding(building)}
                    onSelect={() => setSelectedBuilding(building)}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {viewMode === "list" ? (
            <BuildingDetailedList
              buildings={filteredBuildings.filter((b) => 
                b.status === "inactive" || b.status === "Không hoạt động"
              )}
              onEdit={(building) => {
                setSelectedBuilding(building)
                setShowEditDialog(true)
              }}
              onDelete={(building) => confirmDeleteBuilding(building)}
              onSelect={(building) => setSelectedBuilding(building)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBuildings
                .filter((b) => b.status === "inactive" || b.status === "Không hoạt động")
                .map((building) => (
                  <BuildingOverviewCard
                    key={building.id}
                    building={building}
                    onEdit={() => {
                      setSelectedBuilding(building)
                      setShowEditDialog(true)
                    }}
                    onDelete={() => confirmDeleteBuilding(building)}
                    onSelect={() => setSelectedBuilding(building)}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog thêm tòa nhà mới */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tòa nhà mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho tòa nhà mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="tenTN">Tên tòa nhà</Label>
                <Input
                  id="tenTN"
                  placeholder="Nhập tên tòa nhà"
                  value={newBuilding.name || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="diaChi">Địa chỉ</Label>
                <Input
                  id="diaChi"
                  placeholder="Nhập địa chỉ tòa nhà"
                  value={newBuilding.address || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="soTangNoi">Số tầng nổi</Label>
                <Input
                  id="soTangNoi"
                  type="number"
                  placeholder="Nhập số tầng nổi"
                  value={newBuilding.soTangNoi || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, soTangNoi: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="soTangHam">Số tầng hầm</Label>
                <Input
                  id="soTangHam"
                  type="number"
                  placeholder="Nhập số tầng hầm"
                  value={newBuilding.soTangHam || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, soTangHam: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="dienTichXayDung">Diện tích xây dựng (m²)</Label>
                <Input
                  id="dienTichXayDung"
                  type="number"
                  placeholder="Nhập diện tích xây dựng"
                  value={newBuilding.dienTichXayDung || ""}
                  onChange={(e) =>
                    setNewBuilding({ ...newBuilding, dienTichXayDung: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tongDienTichSan">Tổng diện tích sàn (m²)</Label>
                <Input
                  id="tongDienTichSan"
                  type="number"
                  placeholder="Nhập tổng diện tích sàn"
                  value={newBuilding.tongDienTichSan || ""}
                  onChange={(e) =>
                    setNewBuilding({ ...newBuilding, tongDienTichSan: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tongDienTichChoThueNET">Tổng diện tích cho thuê NET (m²)</Label>
                <Input
                  id="tongDienTichChoThueNET"
                  type="number"
                  placeholder="Nhập diện tích cho thuê NET"
                  value={newBuilding.tongDienTichChoThueNET || ""}
                  onChange={(e) =>
                    setNewBuilding({ ...newBuilding, tongDienTichChoThueNET: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tongDienTichChoThueGross">Tổng diện tích cho thuê Gross (m²)</Label>
                <Input
                  id="tongDienTichChoThueGross"
                  type="number"
                  placeholder="Nhập diện tích cho thuê Gross"
                  value={newBuilding.tongDienTichChoThueGross || ""}
                  onChange={(e) =>
                    setNewBuilding({ ...newBuilding, tongDienTichChoThueGross: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  defaultValue="active"
                  onValueChange={(value) => setNewBuilding({ ...newBuilding, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="nganHangThanhToan">Ngân hàng thanh toán</Label>
                <Input
                  id="nganHangThanhToan"
                  placeholder="Nhập tên ngân hàng"
                  value={newBuilding.nganHangThanhToan || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, nganHangThanhToan: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="soTaiKhoan">Số tài khoản</Label>
                <Input
                  id="soTaiKhoan"
                  placeholder="Nhập số tài khoản"
                  value={newBuilding.soTaiKhoan || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, soTaiKhoan: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="noiDungChuyenKhoan">Nội dung chuyển khoản</Label>
                <Input
                  id="noiDungChuyenKhoan"
                  placeholder="Nhập nội dung chuyển khoản"
                  value={newBuilding.noiDungChuyenKhoan || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, noiDungChuyenKhoan: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleAddBuilding}>
              Lưu tòa nhà
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa tòa nhà */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tòa nhà</DialogTitle>
            <DialogDescription>Cập nhật thông tin chi tiết cho tòa nhà.</DialogDescription>
          </DialogHeader>
          {selectedBuilding && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-tenTN">Tên tòa nhà</Label>
                  <Input
                    id="edit-tenTN"
                    value={selectedBuilding.name}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, name: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-diaChi">Địa chỉ</Label>
                  <Input
                    id="edit-diaChi"
                    value={selectedBuilding.address}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-soTangNoi">Số tầng nổi</Label>
                  <Input
                    id="edit-soTangNoi"
                    type="number"
                    value={selectedBuilding.soTangNoi}
                    onChange={(e) =>
                      setSelectedBuilding({ ...selectedBuilding, soTangNoi: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-soTangHam">Số tầng hầm</Label>
                  <Input
                    id="edit-soTangHam"
                    type="number"
                    value={selectedBuilding.soTangHam}
                    onChange={(e) =>
                      setSelectedBuilding({ ...selectedBuilding, soTangHam: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dienTichXayDung">Diện tích xây dựng (m²)</Label>
                  <Input
                    id="edit-dienTichXayDung"
                    type="number"
                    value={selectedBuilding.dienTichXayDung}
                    onChange={(e) =>
                      setSelectedBuilding({ ...selectedBuilding, dienTichXayDung: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tongDienTichSan">Tổng diện tích sàn (m²)</Label>
                  <Input
                    id="edit-tongDienTichSan"
                    type="number"
                    value={selectedBuilding.tongDienTichSan}
                    onChange={(e) =>
                      setSelectedBuilding({ ...selectedBuilding, tongDienTichSan: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tongDienTichChoThueNET">Tổng diện tích cho thuê NET (m²)</Label>
                  <Input
                    id="edit-tongDienTichChoThueNET"
                    type="number"
                    value={selectedBuilding.tongDienTichChoThueNET}
                    onChange={(e) =>
                      setSelectedBuilding({
                        ...selectedBuilding,
                        tongDienTichChoThueNET: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tongDienTichChoThueGross">Tổng diện tích cho thuê Gross (m²)</Label>
                  <Input
                    id="edit-tongDienTichChoThueGross"
                    type="number"
                    value={selectedBuilding.tongDienTichChoThueGross}
                    onChange={(e) =>
                      setSelectedBuilding({
                        ...selectedBuilding,
                        tongDienTichChoThueGross: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-constructionYear">Năm xây dựng</Label>
                  <Input
                    id="edit-constructionYear"
                    type="number"
                    value={selectedBuilding.constructionYear}
                    onChange={(e) =>
                      setSelectedBuilding({ ...selectedBuilding, constructionYear: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select
                    defaultValue={selectedBuilding.status === "Hoạt động" ? "active" : "inactive"}
                    onValueChange={(value) => setSelectedBuilding({ ...selectedBuilding, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-nganHangThanhToan">Ngân hàng thanh toán</Label>
                  <Input
                    id="edit-nganHangThanhToan"
                    value={selectedBuilding.nganHangThanhToan}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, nganHangThanhToan: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-soTaiKhoan">Số tài khoản</Label>
                  <Input
                    id="edit-soTaiKhoan"
                    value={selectedBuilding.soTaiKhoan}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, soTaiKhoan: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-noiDungChuyenKhoan">Nội dung chuyển khoản</Label>
                  <Input
                    id="edit-noiDungChuyenKhoan"
                    value={selectedBuilding.noiDungChuyenKhoan}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, noiDungChuyenKhoan: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleUpdateBuilding}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa tòa nhà */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tòa nhà</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa tòa nhà này?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="building-name">Tên tòa nhà</Label>
                <Input
                  id="building-name"
                  value={buildingToDelete?.name || ""}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="building-address">Địa chỉ</Label>
                <Input
                  id="building-address"
                  value={buildingToDelete?.address || ""}
                  disabled
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleDeleteBuilding}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chi tiết tòa nhà khi được chọn */}
      {selectedBuilding && (
        <Card className="mt-4 relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chi tiết tòa nhà: {selectedBuilding.name}</CardTitle>
                <CardDescription>{selectedBuilding.address}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Thông tin cơ bản</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Số tầng nổi:</span>
                    <span className="font-medium">{selectedBuilding.soTangNoi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Số tầng hầm:</span>
                    <span className="font-medium">{selectedBuilding.soTangHam}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Năm xây dựng:</span>
                    <span className="font-medium">{selectedBuilding.constructionYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Trạng thái:</span>
                    <span className="font-medium capitalize">{selectedBuilding.status}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Thông tin diện tích</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Diện tích xây dựng:</span>
                    <span className="font-medium">{selectedBuilding.dienTichXayDung.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tổng diện tích sàn:</span>
                    <span className="font-medium">{selectedBuilding.tongDienTichSan.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Diện tích cho thuê NET:</span>
                    <span className="font-medium">{selectedBuilding.tongDienTichChoThueNET.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Diện tích cho thuê Gross:</span>
                    <span className="font-medium">{selectedBuilding.tongDienTichChoThueGross.toLocaleString()} m²</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Thông tin thanh toán</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ngân hàng:</span>
                    <span className="font-medium">{selectedBuilding.nganHangThanhToan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Số tài khoản:</span>
                    <span className="font-medium">{selectedBuilding.soTaiKhoan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nội dung chuyển khoản:</span>
                    <span className="font-medium">{selectedBuilding.noiDungChuyenKhoan}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toast Notifications */}
    </div>
  )
}
