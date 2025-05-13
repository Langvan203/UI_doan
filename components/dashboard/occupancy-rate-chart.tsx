"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Building A", value: 92 },
  { name: "Building B", value: 85 },
  { name: "Building C", value: 76 },
  { name: "Building D", value: 74 },
]

const COLORS = ["#0ea5e9", "#2563eb", "#7c3aed", "#059669"]

export function OccupancyRateChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
