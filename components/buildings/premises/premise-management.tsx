import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PremiseList } from "@/components/buildings/premises/premise-list"

export function PremiseManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Premise Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Premise
        </Button>
      </div>
      <PremiseList />
    </div>
  )
}
