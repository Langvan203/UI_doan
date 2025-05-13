"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Rent", value: 320000000 },
  { name: "Electricity", value: 60000000 },
  { name: "Water", value: 35000000 },
  { name: "Parking", value: 25000000 },
  { name: "Other Services", value: 10000000 },
]

const COLORS = ["#0ea5e9", "#2563eb", "#059669", "#f97316", "#7c3aed"]

export function RevenueBreakdownChart() {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [formatValue(value), "Revenue"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
