import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InvoiceStatsProps {
  title: string
  value: string
  description: string
}

export function InvoiceStats({ title, value, description }: InvoiceStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
