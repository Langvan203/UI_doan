import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FloorList } from "@/components/buildings/floors/floor-list"

export function FloorManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Floor Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Floor
        </Button>
      </div>
      <FloorList />
    </div>
  )
}
