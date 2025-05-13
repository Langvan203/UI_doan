import { Button } from "@/components/ui/button"
import { BarChart } from "lucide-react"

export function DashboardEmptyState() {
  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <BarChart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No data available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start adding buildings, tenants, and services to see your dashboard data.
        </p>
        <Button className="mt-4">Add Your First Building</Button>
      </div>
    </div>
  )
}
