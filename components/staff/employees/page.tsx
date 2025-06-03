"use client"

import { EmployeeList } from "./employee-list"

export function EmployeeManagementPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin nhân viên, phòng ban và quyền hạn trong hệ thống
          </p>
        </div>
      </div>
      
      <EmployeeList />
    </div>
  )
}