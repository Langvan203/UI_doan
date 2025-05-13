import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface TrendProps {
  value: string
  direction: "up" | "down"
  label: string
}

interface DashboardSummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  trend?: TrendProps
}

export function DashboardSummaryCard({ title, value, icon, description, trend }: DashboardSummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="rounded-md bg-muted p-2">{icon}</div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <p className="text-muted-foreground">{description}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend.direction === "up" ? "text-green-500" : "text-red-500"}>{trend.value}</span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
