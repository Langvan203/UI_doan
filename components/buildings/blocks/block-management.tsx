import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BlockList } from "@/components/buildings/blocks/block-list"

export function BlockManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Block Management</h1>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Block
        </Button> */}
      </div>
      <BlockList />
    </div>
  )
}
