import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FloorList } from "@/components/buildings/floors/floor-list"

export function FloorManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Tầng lầu</h1>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tầng lầu
        </Button> */}
      </div>
      <FloorList />
    </div>
  )
}
