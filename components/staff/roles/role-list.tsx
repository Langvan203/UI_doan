"use client"

import type React from "react"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dữ liệu mẫu cho role
const roleData = [
  {
    id: 1,
    name: "Admin",
    description: "Quyền quản trị hệ thống",
    userCount: 5,
    users: [
      { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
      { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
    ],
  },
  {
    id: 2,
    name: "Manager",
    description: "Quyền quản lý",
    userCount: 8,
    users: [
      { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
      { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
      { id: 6, name: "Nguyễn Thị F", email: "nguyenthif@example.com" },
    ],
  },
  {
    id: 3,
    name: "Staff",
    description: "Quyền nhân viên",
    userCount: 15,
    users: [
      { id: 2, name: "Trần Thị B", email: "tranthib@example.com" },
      { id: 4, name: "Phạm Thị D", email: "phamthid@example.com" },
      { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com" },
    ],
  },
]

export function RoleList() {
  const [roles, setRoles] = useState(roleData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<{ id: number; name: string; description: string } | null>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  const handleAddRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (currentRole) {
      // Cập nhật role
      setRoles(roles.map((role) => (role.id === currentRole.id ? { ...role, name, description } : role)))
      toast({
        title: "Role đã được cập nhật",
        description: `Role ${name} đã được cập nhật thành công.`,
      })
    } else {
      // Thêm role mới
      const newRole = {
        id: roles.length + 1,
        name,
        description,
        userCount: 0,
        users: [],
      }
      setRoles([...roles, newRole])
      toast({
        title: "Role mới đã được tạo",
        description: `Role ${name} đã được tạo thành công.`,
      })
    }

    setIsDialogOpen(false)
    setCurrentRole(null)
  }

  const handleEditRole = (role: { id: number; name: string; description: string }) => {
    setCurrentRole(role)
    setIsDialogOpen(true)
  }

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id))
    toast({
      title: "Role đã được xóa",
      description: "Role đã được xóa thành công.",
    })
  }

  const handleViewRole = (role: any) => {
    setSelectedRole(role)
  }

  return (
    <div className="space-y-4">
      {!selectedRole ? (
        <>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Danh sách Role</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentRole(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{currentRole ? "Chỉnh sửa Role" : "Thêm Role mới"}</DialogTitle>
                  <DialogDescription>
                    {currentRole
                      ? "Chỉnh sửa thông tin role hiện tại."
                      : "Thêm role mới vào hệ thống. Nhấn lưu khi hoàn tất."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddRole}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Tên Role
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={currentRole?.name || ""}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Mô tả
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        defaultValue={currentRole?.description || ""}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Lưu</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewRole(role)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{role.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditRole(role)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteRole(role.id)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm">
                    <span className="font-medium">{role.userCount}</span> nhân viên có role này
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>
              Quay lại
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleEditRole(selectedRole)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteRole(selectedRole.id)
                  setSelectedRole(null)
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedRole.name}</CardTitle>
              <CardDescription>{selectedRole.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Thông tin</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Tên Role</div>
                      <div>{selectedRole.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Số lượng nhân viên</div>
                      <div>{selectedRole.userCount}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">Mô tả</div>
                      <div>{selectedRole.description}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Danh sách nhân viên có role này</h3>
                  {selectedRole.users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên nhân viên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRole.users.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">Không có nhân viên nào có role này</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
