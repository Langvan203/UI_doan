import { DepartmentList } from "./department-list"
import { DepartmentFilterForm } from "./department-filter-form"

export default function DepartmentsPages() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Phòng ban</h2>
        </div>
        <div className="space-y-4">
          <DepartmentFilterForm />
          <DepartmentList />
        </div>
      </div>
    </div>
  )
}
