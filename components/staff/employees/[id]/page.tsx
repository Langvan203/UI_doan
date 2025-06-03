"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building, Mail, Phone, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { EmployeeForm } from "../employee-form"

// Dữ liệu mẫu cho nhân viên
const employeeData = {
  id: 1,
  name: "Nguyễn Văn A",
  username: "nguyenvana",
  email: "nguyenvana@example.com",
  phone: "0901234567",
  department: "Kỹ thuật",
  roles: ["Admin", "Manager"],
  buildings: ["Tòa nhà A", "Tòa nhà B"],
  address: "123 Đường ABC, Quận 1, TP.HCM",
  birthDate: "1990-01-01",
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState({
    id: params.id,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    phone: "0123456789",
    department: "IT",
    roles: ["Staff"],
    buildings: ["Building A"],
    birthDate: new Date(),
    address: "123 Street"
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState(employee.roles)

  const handleEditEmployee = () => {
    setIsEditDialogOpen(true)
  }

  const handleManageRoles = () => {
    setIsRoleDialogOpen(true)
  }

  const handleSaveEmployee = (updatedEmployee: any) => {
    setEmployee({ ...employee, ...updatedEmployee })
    setIsEditDialogOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/staff/employees">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Chi tiết Nhân viên</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleEditEmployee}>Chỉnh sửa</Button>
            <Button variant="outline" onClick={handleManageRoles}>Quản lý role</Button>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            </DialogHeader>
            <EmployeeForm employee={employee} onSave={handleSaveEmployee} />
          </DialogContent>
        </Dialog>

        {/* Role Management Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quản lý Roles</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                {["Admin", "Manager", "Staff"].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRoles([...selectedRoles, role])
                        } else {
                          setSelectedRoles(selectedRoles.filter(r => r !== role))
                        }
                      }}
                    />
                    <Label htmlFor={`role-${role}`}>{role}</Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => {
                  setEmployee({ ...employee, roles: selectedRoles })
                  setIsRoleDialogOpen(false)
                }}>
                  Lưu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                  <UserCog className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.username}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Roles</div>
                <div className="flex flex-wrap gap-1">
                  {employee.roles.map((role) => (
                    <Badge key={role} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Tòa nhà</div>
                <div className="flex flex-wrap gap-1">
                  {employee.buildings.map((building) => (
                    <Badge key={building} variant="secondary">
                      {building}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-5 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiếttt</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Thông tin</TabsTrigger>
                    <TabsTrigger value="activity">Hoạt</TabsTrigger>
                    <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Họ và tên</div>
                        <div>{employee.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Tên đăng nhập</div>
                        <div>{employee.username}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                        <div>{employee.email}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Số điện thoại</div>
                        <div>{employee.phone}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Ngày sinh</div>
                        <div>{new Date(employee.birthDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Phòng ban</div>
                        <div>{employee.department}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Địa chỉ</div>
                        <div>{employee.address}</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity" className="pt-4">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <p className="text-sm">Đăng nhập vào hệ thống</p>
                            <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="permissions" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Roles</h4>
                        <div className="flex flex-wrap gap-2">
                          {employee.roles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Quyền hạn</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quản lý nhân viên</span>
                            <Badge variant="outline">Được phép</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quản lý tòa nhà</span>
                            <Badge variant="outline">Được phép</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quản lý dịch vụ</span>
                            <Badge variant="outline">Được phép</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quản lý thanh toán</span>
                            <Badge variant="outline">Được phép</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tòa nhà được phân công</CardTitle>
                <CardDescription>Danh sách các tòa nhà mà nhân viên này được phân công quản lý</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.buildings.map((building) => (
                    <div key={building} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Building className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{building}</p>
                          <p className="text-sm text-muted-foreground">Quản lý từ {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
