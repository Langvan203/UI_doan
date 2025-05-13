"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    month: "Jan",
    revenue: 400000000,
  },
  {
    month: "Feb",
    revenue: 420000000,
  },
  {
    month: "Mar",
    revenue: 410000000,
  },
  {
    month: "Apr",
    revenue: 430000000,
  },
  {
    month: "May",
    revenue: 450000000,
  },
  {
    month: "Jun",
    revenue: 445000000,
  },
]

export function DashboardChart() {
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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatValue} />
        <Tooltip
          formatter={(value: number) => [formatValue(value), "Revenue"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="revenue" fill="#1a365d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
