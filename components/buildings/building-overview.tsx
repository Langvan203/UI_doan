"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts"

interface Building {
  id: number
  name: string
  address: string
  occupancyRate: number
  constructionYear: number
  status: string
  soTangHam: number
  soTangNoi: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
}

interface BuildingOverviewProps {
  building: Building
}

// Mock data for charts
const buildingStatsData = [
  { name: "Blocks", value: 4 },
  { name: "Floors", value: 16 },
  { name: "Premises", value: 60 },
  { name: "Residents", value: 120 },
]

const occupancyData = [
  { name: "Occupied", value: 48 },
  { name: "Vacant", value: 8 },
  { name: "Maintenance", value: 4 },
]

const expensesData = [
  { month: "Jan", amount: 120000000 },
  { month: "Feb", amount: 115000000 },
  { month: "Mar", amount: 125000000 },
  { month: "Apr", amount: 118000000 },
  { month: "May", amount: 130000000 },
  { month: "Jun", amount: 122000000 },
]

const COLORS = ["#2563eb", "#0ea5e9", "#7c3aed", "#059669", "#f97316"]

export function BuildingOverview({ building }: BuildingOverviewProps) {
  // Update chart data based on the building
  const updatedBuildingStatsData = [
    { name: "Tầng nổi", value: building.soTangNoi },
    { name: "Tầng hầm", value: building.soTangHam },
    { name: "Diện tích xây dựng", value: building.dienTichXayDung },
    { name: "Diện tích sàn", value: building.tongDienTichSan },
  ]

  const updatedOccupancyData = [
    { name: "Diện tích cho thuê NET", value: building.tongDienTichChoThueNET },
    { name: "Diện tích cho thuê Gross", value: building.tongDienTichChoThueGross },
  ]

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tòa nhà</CardTitle>
          <CardDescription>Phân bố các thành phần của tòa nhà</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={updatedBuildingStatsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb">
                {updatedBuildingStatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diện tích cho thuê</CardTitle>
          <CardDescription>Phân bổ diện tích cho thuê</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={updatedOccupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {updatedOccupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Chi phí hàng tháng</CardTitle>
          <CardDescription>Chi phí vận hành và bảo trì tòa nhà</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expensesData}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value: number) => formatCurrency(value).replace("₫", "")} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), "Số tiền"]} />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
