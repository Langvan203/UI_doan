"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

interface EmployeeFormProps {
  employee?: any
  onSave: (employee: any) => void
}

export function EmployeeForm({ employee, onSave }: EmployeeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const employeeData = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      department: formData.get("department") as string,
    }

    onSave(employeeData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhân viên</Label>
            <Input id="name" name="name" defaultValue={employee?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input id="username" name="username" defaultValue={employee?.username || ""} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={employee?.email || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" defaultValue={employee?.phone || ""} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Phòng ban</Label>
          <Select name="department" defaultValue={employee?.department || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
              <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
              <SelectItem value="Nhân sự">Nhân sự</SelectItem>
              <SelectItem value="Kế toán">Kế toán</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!employee && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">Lưu</Button>
      </DialogFooter>
    </form>
  )
}
