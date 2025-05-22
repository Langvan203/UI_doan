import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PremiseList } from "@/components/buildings/premises/premise-list"

export function PremiseManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý căn hộ</h1>
      </div>
      <PremiseList />
    </div>
  )
}
