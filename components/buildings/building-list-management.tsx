"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
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

// Định nghĩa interface cho tòa nhà với các thuộc tính yêu cầu
interface BuildingDetailed {
  id: number
  tenTN: string
  diaChi: string
  soTangNoi: number
  soTangHam: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
  nganHangThanhToan: string
  soTaiKhoan: string
  noiDungChuyenKhoan: string
  status: string
  constructionYear: number
}

// Dữ liệu mẫu cho danh sách tòa nhà
const buildingsData: BuildingDetailed[] = [
  {
    id: 1,
    tenTN: "Happy Residence",
    diaChi: "123 Main Street, District 1",
    soTangNoi: 20,
    soTangHam: 2,
    dienTichXayDung: 2500,
    tongDienTichSan: 35000,
    tongDienTichChoThueNET: 28000,
    tongDienTichChoThueGross: 30000,
    nganHangThanhToan: "VietcomBank",
    soTaiKhoan: "0123456789",
    noiDungChuyenKhoan: "Thanh toan tien thue Happy Residence",
    status: "active",
    constructionYear: 2020,
  },
  {
    id: 2,
    tenTN: "Sunshine Apartments",
    diaChi: "456 Park Avenue, District 2",
    soTangNoi: 18,
    soTangHam: 3,
    dienTichXayDung: 3000,
    tongDienTichSan: 40000,
    tongDienTichChoThueNET: 32000,
    tongDienTichChoThueGross: 35000,
    nganHangThanhToan: "BIDV",
    soTaiKhoan: "9876543210",
    noiDungChuyenKhoan: "Thanh toan tien thue Sunshine Apartments",
    status: "active",
    constructionYear: 2019,
  },
  {
    id: 3,
    tenTN: "Green Tower",
    diaChi: "789 Garden Street, District 7",
    soTangNoi: 25,
    soTangHam: 4,
    dienTichXayDung: 3500,
    tongDienTichSan: 50000,
    tongDienTichChoThueNET: 42000,
    tongDienTichChoThueGross: 45000,
    nganHangThanhToan: "Techcombank",
    soTaiKhoan: "1122334455",
    noiDungChuyenKhoan: "Thanh toan tien thue Green Tower",
    status: "active",
    constructionYear: 2021,
  },
]

export function BuildingListManagement() {
  const [buildings, setBuildings] = useState<BuildingDetailed[]>(buildingsData)
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingDetailed | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newBuilding, setNewBuilding] = useState<Partial<BuildingDetailed>>({
    status: "active",
  })

  // Lọc tòa nhà theo từ khóa tìm kiếm
  const filteredBuildings = buildings.filter(
    (building) =>
      building.tenTN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.diaChi.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý thêm tòa nhà mới
  const handleAddBuilding = () => {
    const id = Math.max(...buildings.map((b) => b.id)) + 1
    const buildingToAdd = {
      ...newBuilding,
      id,
      soTangNoi: Number(newBuilding.soTangNoi || 0),
      soTangHam: Number(newBuilding.soTangHam || 0),
      dienTichXayDung: Number(newBuilding.dienTichXayDung || 0),
      tongDienTichSan: Number(newBuilding.tongDienTichSan || 0),
      tongDienTichChoThueNET: Number(newBuilding.tongDienTichChoThueNET || 0),
      tongDienTichChoThueGross: Number(newBuilding.tongDienTichChoThueGross || 0),
      constructionYear: Number(newBuilding.constructionYear || new Date().getFullYear()),
    } as BuildingDetailed

    setBuildings([...buildings, buildingToAdd])
    setNewBuilding({
      status: "active",
    })
    setShowAddDialog(false)
  }

  // Xử lý cập nhật tòa nhà
  const handleUpdateBuilding = () => {
    if (!selectedBuilding) return

    const updatedBuildings = buildings.map((building) =>
      building.id === selectedBuilding.id ? selectedBuilding : building,
    )

    setBuildings(updatedBuildings)
    setShowEditDialog(false)
  }

  // Xử lý xóa tòa nhà
  const handleDeleteBuilding = (id: number) => {
    const updatedBuildings = buildings.filter((building) => building.id !== id)
    setBuildings(updatedBuildings)
    if (selectedBuilding?.id === id) {
      setSelectedBuilding(null)
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
          <Select defaultValue="all" className="w-full sm:w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="maintenance">Đang bảo trì</SelectItem>
            </SelectContent>
          </Select>
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
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
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
              onDelete={handleDeleteBuilding}
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
                  onDelete={() => handleDeleteBuilding(building.id)}
                  onSelect={() => setSelectedBuilding(building)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {viewMode === "list" ? (
            <BuildingDetailedList
              buildings={filteredBuildings.filter((b) => b.status === "active")}
              onEdit={(building) => {
                setSelectedBuilding(building)
                setShowEditDialog(true)
              }}
              onDelete={handleDeleteBuilding}
              onSelect={(building) => setSelectedBuilding(building)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBuildings
                .filter((b) => b.status === "active")
                .map((building) => (
                  <BuildingOverviewCard
                    key={building.id}
                    building={building}
                    onEdit={() => {
                      setSelectedBuilding(building)
                      setShowEditDialog(true)
                    }}
                    onDelete={() => handleDeleteBuilding(building.id)}
                    onSelect={() => setSelectedBuilding(building)}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {viewMode === "list" ? (
            <BuildingDetailedList
              buildings={filteredBuildings.filter((b) => b.status === "inactive")}
              onEdit={(building) => {
                setSelectedBuilding(building)
                setShowEditDialog(true)
              }}
              onDelete={handleDeleteBuilding}
              onSelect={(building) => setSelectedBuilding(building)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBuildings
                .filter((b) => b.status === "inactive")
                .map((building) => (
                  <BuildingOverviewCard
                    key={building.id}
                    building={building}
                    onEdit={() => {
                      setSelectedBuilding(building)
                      setShowEditDialog(true)
                    }}
                    onDelete={() => handleDeleteBuilding(building.id)}
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
                  value={newBuilding.tenTN || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, tenTN: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="diaChi">Địa chỉ</Label>
                <Input
                  id="diaChi"
                  placeholder="Nhập địa chỉ tòa nhà"
                  value={newBuilding.diaChi || ""}
                  onChange={(e) => setNewBuilding({ ...newBuilding, diaChi: e.target.value })}
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
              <div>
                <Label htmlFor="constructionYear">Năm xây dựng</Label>
                <Input
                  id="constructionYear"
                  type="number"
                  placeholder="YYYY"
                  value={newBuilding.constructionYear || ""}
                  onChange={(e) =>
                    setNewBuilding({ ...newBuilding, constructionYear: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
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
                    <SelectItem value="maintenance">Đang bảo trì</SelectItem>
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
                    value={selectedBuilding.tenTN}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, tenTN: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-diaChi">Địa chỉ</Label>
                  <Input
                    id="edit-diaChi"
                    value={selectedBuilding.diaChi}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, diaChi: e.target.value })}
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
                    defaultValue={selectedBuilding.status}
                    onValueChange={(value) => setSelectedBuilding({ ...selectedBuilding, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="maintenance">Đang bảo trì</SelectItem>
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

      {/* Chi tiết tòa nhà khi được chọn */}
      {selectedBuilding && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Chi tiết tòa nhà: {selectedBuilding.tenTN}</CardTitle>
            <CardDescription>{selectedBuilding.diaChi}</CardDescription>
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
    </div>
  )
}
