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

// Định nghĩa interface cho Premise với các trường mới
interface Premise {
  id: number
  buildingId: number
  blockId: number
  floorId: number
  number: string
  maVT: string
  dienTichBG: number
  dienTichThongThuy: number
  dienTichTimTuong: number
  isBanGiao: boolean
  soHopDong: string
  ngayBanGiao: Date | null
  ngayHetHanChoThue: Date | null
  maTL: number
  maKH: number | null
  maLMB: number
  maTrangThai: number
  maTN: number
  owner: string | null
  ownerContact: string | null
  type: string
}

// Mock data cho premises
const premisesData: Premise[] = [
  {
    id: 1,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A101",
    maVT: "VT001",
    dienTichBG: 85,
    dienTichThongThuy: 80,
    dienTichTimTuong: 90,
    isBanGiao: true,
    soHopDong: "HD001/2023",
    ngayBanGiao: new Date("2023-01-15"),
    ngayHetHanChoThue: new Date("2025-01-14"),
    maTL: 1,
    maKH: 101,
    maLMB: 1,
    maTrangThai: 1,
    maTN: 1,
    owner: "Nguyễn Văn A",
    ownerContact: "0901234567",
    type: "Apartment",
  },
  {
    id: 2,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A102",
    maVT: "VT002",
    dienTichBG: 65,
    dienTichThongThuy: 60,
    dienTichTimTuong: 70,
    isBanGiao: false,
    soHopDong: "",
    ngayBanGiao: null,
    ngayHetHanChoThue: null,
    maTL: 1,
    maKH: null,
    maLMB: 2,
    maTrangThai: 2,
    maTN: 1,
    owner: null,
    ownerContact: null,
    type: "Apartment",
  },
  {
    id: 3,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A103",
    maVT: "VT003",
    dienTichBG: 100,
    dienTichThongThuy: 95,
    dienTichTimTuong: 105,
    isBanGiao: true,
    soHopDong: "HD002/2023",
    ngayBanGiao: new Date("2023-03-01"),
    ngayHetHanChoThue: new Date("2025-02-28"),
    maTL: 1,
    maKH: 102,
    maLMB: 1,
    maTrangThai: 1,
    maTN: 1,
    owner: "Trần Thị B",
    ownerContact: "0912345678",
    type: "Apartment",
  },
  {
    id: 4,
    buildingId: 1,
    blockId: 1,
    floorId: 1,
    number: "A104",
    maVT: "VT004",
    dienTichBG: 75,
    dienTichThongThuy: 70,
    dienTichTimTuong: 80,
    isBanGiao: false,
    soHopDong: "",
    ngayBanGiao: null,
    ngayHetHanChoThue: null,
    maTL: 1,
    maKH: null,
    maLMB: 3,
    maTrangThai: 3,
    maTN: 1,
    owner: null,
    ownerContact: null,
    type: "Apartment",
  },
]

// Mock data cho buildings
const buildingsData = [
  { id: 1, name: "Happy Residence" },
  { id: 2, name: "Sunshine Apartments" },
]

// Mock data cho blocks
const blocksData = [
  { id: 1, buildingId: 1, name: "Block A" },
  { id: 2, buildingId: 1, name: "Block B" },
  { id: 3, buildingId: 1, name: "Block C" },
  { id: 4, buildingId: 1, name: "Block D" },
]

// Mock data cho floors
const floorsData = [
  { id: 1, buildingId: 1, blockId: 1, number: 1 },
  { id: 2, buildingId: 1, blockId: 1, number: 2 },
  { id: 3, buildingId: 1, blockId: 1, number: 3 },
]

// Mock data cho trạng thái
const trangThaiData = [
  { id: 1, name: "Đã cho thuê" },
  { id: 2, name: "Trống" },
  { id: 3, name: "Bảo trì" },
  { id: 4, name: "Đặt chỗ" },
]

// Mock data cho loại mặt bằng
const loaiMatBangData = [
  { id: 1, name: "Căn hộ" },
  { id: 2, name: "Văn phòng" },
  { id: 3, name: "Thương mại" },
]

// Mock data cho thể loại
const theLoaiData = [
  { id: 1, name: "Studio" },
  { id: 2, name: "1 Phòng ngủ" },
  { id: 3, name: "2 Phòng ngủ" },
  { id: 4, name: "3 Phòng ngủ" },
  { id: 5, name: "Penthouse" },
]

// Mock data cho khách hàng
const khachHangData = [
  { id: 101, name: "Nguyễn Văn A", contact: "0901234567" },
  { id: 102, name: "Trần Thị B", contact: "0912345678" },
  { id: 103, name: "Lê Văn C", contact: "0923456789" },
]

interface PremiseListProps {
  buildingId?: number
}

export function PremiseList({ buildingId }: PremiseListProps) {
  const [premises, setPremises] = useState<Premise[]>(premisesData)
  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [newPremise, setNewPremise] = useState<Partial<Premise>>({
    buildingId: buildingId || 1,
    maTrangThai: 2, // Mặc định là trống
    isBanGiao: false,
  })
  const [ngayBanGiao, setNgayBanGiao] = useState<Date | undefined>(undefined)
  const [ngayHetHan, setNgayHetHan] = useState<Date | undefined>(undefined)

  // Filter premises by building ID if provided
  const filteredPremises = buildingId ? premises.filter((premise) => premise.buildingId === buildingId) : premises

  // Xử lý thêm mặt bằng mới
  const handleAddPremise = () => {
    const id = Math.max(...premises.map((p) => p.id)) + 1
    const premiseToAdd = {
      ...newPremise,
      id,
      ngayBanGiao: ngayBanGiao || null,
      ngayHetHanChoThue: ngayHetHan || null,
      dienTichBG: Number(newPremise.dienTichBG || 0),
      dienTichThongThuy: Number(newPremise.dienTichThongThuy || 0),
      dienTichTimTuong: Number(newPremise.dienTichTimTuong || 0),
    } as Premise

    setPremises([...premises, premiseToAdd])
    setNewPremise({
      buildingId: buildingId || 1,
      maTrangThai: 2,
      isBanGiao: false,
    })
    setNgayBanGiao(undefined)
    setNgayHetHan(undefined)
    setShowAddDialog(false)
  }

  // Xử lý cập nhật mặt bằng
  const handleUpdatePremise = () => {
    if (!selectedPremise) return

    const updatedPremises = premises.map((premise) => (premise.id === selectedPremise.id ? selectedPremise : premise))

    setPremises(updatedPremises)
    setShowEditDialog(false)
  }

  // Xử lý xóa mặt bằng
  const handleDeletePremise = (id: number) => {
    const updatedPremises = premises.filter((premise) => premise.id !== id)
    setPremises(updatedPremises)
  }

  // Lấy tên trạng thái từ mã
  const getTrangThaiName = (maTrangThai: number) => {
    return trangThaiData.find((tt) => tt.id === maTrangThai)?.name || "Không xác định"
  }

  // Lấy tên loại mặt bằng từ mã
  const getLoaiMatBangName = (maLMB: number) => {
    return loaiMatBangData.find((lmb) => lmb.id === maLMB)?.name || "Không xác định"
  }

  // Lấy tên thể loại từ mã
  const getTheLoaiName = (maTL: number) => {
    return theLoaiData.find((tl) => tl.id === maTL)?.name || "Không xác định"
  }

  // Lấy tên khách hàng từ mã
  const getKhachHangName = (maKH: number | null) => {
    if (!maKH) return "Chưa có"
    return khachHangData.find((kh) => kh.id === maKH)?.name || "Không xác định"
  }

  // Lấy badge trạng thái với màu sắc phù hợp
  const getStatusBadge = (maTrangThai: number) => {
    switch (maTrangThai) {
      case 1: // Đã cho thuê
        return <Badge className="bg-green-500">Đã cho thuê</Badge>
      case 2: // Trống
        return <Badge variant="outline">Trống</Badge>
      case 3: // Bảo trì
        return <Badge variant="destructive">Bảo trì</Badge>
      case 4: // Đặt chỗ
        return <Badge variant="secondary">Đặt chỗ</Badge>
      default:
        return <Badge variant="outline">{getTrangThaiName(maTrangThai)}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {!buildingId && (
        <div className="flex justify-end">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mặt bằng
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mã VT
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
              <tr key={premise.id}>
                <td className="px-3 py-3 whitespace-nowrap text-sm">{premise.maVT}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  <div>{premise.number}</div>
                  <div className="text-xs text-muted-foreground">
                    {blocksData.find((b) => b.id === premise.blockId)?.name}, Tầng{" "}
                    {floorsData.find((f) => f.id === premise.floorId)?.number}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm hidden md:table-cell">
                  <div>BG: {premise.dienTichBG} m²</div>
                  <div className="text-xs text-muted-foreground">TT: {premise.dienTichThongThuy} m²</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                  <div>{getLoaiMatBangName(premise.maLMB)}</div>
                  <div className="text-xs text-muted-foreground">{getTheLoaiName(premise.maTL)}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                  {premise.maKH ? (
                    <>
                      <div>{getKhachHangName(premise.maKH)}</div>
                      <div className="text-xs text-muted-foreground">{premise.ownerContact}</div>
                    </>
                  ) : (
                    "Chưa có"
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  {getStatusBadge(premise.maTrangThai)}
                  <div className="text-xs text-muted-foreground mt-1">
                    {premise.isBanGiao ? "Đã bàn giao" : "Chưa bàn giao"}
                  </div>
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
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPremise(premise)
                            setShowEditDialog(true)
                          }}
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>Gán khách hàng</DropdownMenuItem>
                        <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                        <DropdownMenuItem>Lịch sử bàn giao</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn xóa mặt bằng này?")) {
                          handleDeletePremise(premise.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Xóa</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  onValueChange={(value) => setNewPremise({ ...newPremise, buildingId: Number(value) })}
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
              <div>
                <Label htmlFor="premise-block">Block</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) => setNewPremise({ ...newPremise, blockId: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn block" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocksData.map((block) => (
                      <SelectItem key={block.id} value={block.id.toString()}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-floor">Tầng</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) => setNewPremise({ ...newPremise, floorId: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tầng" />
                  </SelectTrigger>
                  <SelectContent>
                    {floorsData.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id.toString()}>
                        Tầng {floor.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-number">Số mặt bằng</Label>
                <Input
                  id="premise-number"
                  placeholder="VD: A101"
                  value={newPremise.number || ""}
                  onChange={(e) => setNewPremise({ ...newPremise, number: e.target.value })}
                />
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
                      <SelectItem key={loai.id} value={loai.id.toString()}>
                        {loai.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-theloai">Thể loại</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(value) => setNewPremise({ ...newPremise, maTL: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {theLoaiData.map((theloai) => (
                      <SelectItem key={theloai.id} value={theloai.id.toString()}>
                        {theloai.name}
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
                  onValueChange={(value) => setNewPremise({ ...newPremise, maTrangThai: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {trangThaiData.map((trangthai) => (
                      <SelectItem key={trangthai.id} value={trangthai.id.toString()}>
                        {trangthai.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="premise-khachhang">Khách hàng</Label>
                <Select
                  onValueChange={(value) =>
                    setNewPremise({ ...newPremise, maKH: value === "null" ? null : Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Chưa có khách hàng</SelectItem>
                    {khachHangData.map((kh) => (
                      <SelectItem key={kh.id} value={kh.id.toString()}>
                        {kh.name} - {kh.contact}
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
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="premise-isBanGiao"
                  checked={newPremise.isBanGiao}
                  onCheckedChange={(checked) => setNewPremise({ ...newPremise, isBanGiao: !!checked })}
                />
                <label
                  htmlFor="premise-isBanGiao"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Đã bàn giao
                </label>
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
                  <Select
                    defaultValue={selectedPremise.buildingId.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, buildingId: Number(value) })}
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
                <div>
                  <Label htmlFor="edit-premise-block">Block</Label>
                  <Select
                    defaultValue={selectedPremise.blockId.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, blockId: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocksData.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()}>
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-floor">Tầng</Label>
                  <Select
                    defaultValue={selectedPremise.floorId.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, floorId: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tầng" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorsData.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id.toString()}>
                          Tầng {floor.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-number">Số mặt bằng</Label>
                  <Input
                    id="edit-premise-number"
                    value={selectedPremise.number}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-mavt">Mã vị trí</Label>
                  <Input
                    id="edit-premise-mavt"
                    value={selectedPremise.maVT}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, maVT: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-premise-loai">Loại mặt bằng</Label>
                  <Select
                    defaultValue={selectedPremise.maLMB.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maLMB: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại mặt bằng" />
                    </SelectTrigger>
                    <SelectContent>
                      {loaiMatBangData.map((loai) => (
                        <SelectItem key={loai.id} value={loai.id.toString()}>
                          {loai.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-theloai">Thể loại</Label>
                  <Select
                    defaultValue={selectedPremise.maTL.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maTL: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {theLoaiData.map((theloai) => (
                        <SelectItem key={theloai.id} value={theloai.id.toString()}>
                          {theloai.name}
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
                    defaultValue={selectedPremise.maTrangThai.toString()}
                    onValueChange={(value) => setSelectedPremise({ ...selectedPremise, maTrangThai: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {trangThaiData.map((trangthai) => (
                        <SelectItem key={trangthai.id} value={trangthai.id.toString()}>
                          {trangthai.name}
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
                        maKH: value === "null" ? null : Number(value),
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
                          {kh.name} - {kh.contact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-premise-soHopDong">Số hợp đồng</Label>
                  <Input
                    id="edit-premise-soHopDong"
                    value={selectedPremise.soHopDong}
                    onChange={(e) => setSelectedPremise({ ...selectedPremise, soHopDong: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="edit-premise-isBanGiao"
                    checked={selectedPremise.isBanGiao}
                    onCheckedChange={(checked) => setSelectedPremise({ ...selectedPremise, isBanGiao: !!checked })}
                  />
                  <label
                    htmlFor="edit-premise-isBanGiao"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Đã bàn giao
                  </label>
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedPremise.ngayBanGiao
                          ? format(new Date(selectedPremise.ngayBanGiao), "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedPremise.ngayBanGiao ? new Date(selectedPremise.ngayBanGiao) : undefined}
                        onSelect={(date) => setSelectedPremise({ ...selectedPremise, ngayBanGiao: date })}
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
                        onSelect={(date) => setSelectedPremise({ ...selectedPremise, ngayHetHanChoThue: date })}
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
            <Button type="submit" onClick={handleUpdatePremise}>
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
                  {selectedPremise.maVT} - {selectedPremise.number} -{" "}
                  {blocksData.find((b) => b.id === selectedPremise.blockId)?.name}, Tầng{" "}
                  {floorsData.find((f) => f.id === selectedPremise.floorId)?.number}
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
                        {buildingsData.find((b) => b.id === selectedPremise.buildingId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Block:</span>
                      <span className="font-medium">
                        {blocksData.find((b) => b.id === selectedPremise.blockId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tầng:</span>
                      <span className="font-medium">
                        {floorsData.find((f) => f.id === selectedPremise.floorId)?.number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số mặt bằng:</span>
                      <span className="font-medium">{selectedPremise.number}</span>
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
                    <div className="flex justify-between">
                      <span>Thể loại:</span>
                      <span className="font-medium">{getTheLoaiName(selectedPremise.maTL)}</span>
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
                      <span className="font-medium">{selectedPremise.ownerContact || "Chưa có"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số hợp đồng:</span>
                      <span className="font-medium">{selectedPremise.soHopDong || "Chưa có"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <span className="font-medium">{getTrangThaiName(selectedPremise.maTrangThai)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin bàn giao</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Trạng thái bàn giao:</span>
                      <span className="font-medium">{selectedPremise.isBanGiao ? "Đã bàn giao" : "Chưa bàn giao"}</span>
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
    </div>
  )
}
