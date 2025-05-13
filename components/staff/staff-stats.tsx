"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface StaffStatsProps {
  staffData: any[]
  departmentsData: any[]
}

export function StaffStats({ staffData, departmentsData }: StaffStatsProps) {
  // Calculate department distribution
  const departmentDistribution = departmentsData.map((department) => {
    const count = staffData.filter((staff) => staff.departments.includes(department.id)).length
    return {
      name: department.name,
      value: count,
      color: department.color,
    }
  })

  // Calculate role distribution
  const roleDistribution = [
    { name: "Building Manager", value: staffData.filter((s) => s.roles.includes("BUILDING_MANAGER")).length },
    { name: "Financial Manager", value: staffData.filter((s) => s.roles.includes("FINANCIAL_MANAGER")).length },
    { name: "Service Manager", value: staffData.filter((s) => s.roles.includes("SERVICE_MANAGER")).length },
    { name: "Customer Service", value: staffData.filter((s) => s.roles.includes("CUSTOMER_SERVICE")).length },
    { name: "Maintenance", value: staffData.filter((s) => s.roles.includes("MAINTENANCE_STAFF")).length },
    { name: "Security", value: staffData.filter((s) => s.roles.includes("SECURITY_STAFF")).length },
  ]

  // Calculate building distribution
  const buildingDistribution = [
    { name: "Happy Residence", value: staffData.filter((s) => s.buildings.includes(1)).length },
    { name: "Sunshine Apartments", value: staffData.filter((s) => s.buildings.includes(2)).length },
  ]

  // Calculate status distribution
  const statusDistribution = [
    { name: "Active", value: staffData.filter((s) => s.status === "active").length, color: "#10b981" },
    { name: "Inactive", value: staffData.filter((s) => s.status === "inactive").length, color: "#6b7280" },
  ]

  // Calculate join date distribution (by month)
  const joinDateDistribution = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2022, i, 1).toLocaleString("default", { month: "short" })
    const count = staffData.filter((s) => {
      const joinDate = new Date(s.joinDate)
      return joinDate.getMonth() === i && joinDate.getFullYear() === 2022
    }).length
    return { name: month, value: count }
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffData.length}</div>
            <p className="text-xs text-muted-foreground">
              {statusDistribution[0].value} active, {statusDistribution[1].value} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentsData.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                departmentDistribution.reduce(
                  (max, dept) => (dept.value > max.value ? dept : max),
                  departmentDistribution[0],
                ).name
              }{" "}
              has the most staff
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buildings Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              {buildingDistribution[0].value > buildingDistribution[1].value
                ? buildingDistribution[0].name
                : buildingDistribution[1].name}{" "}
              has more staff
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleDistribution.filter((role) => role.value > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              {roleDistribution.reduce((max, role) => (role.value > max.value ? role : max), roleDistribution[0]).name}{" "}
              is the most common
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Staff distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Onboarding</CardTitle>
            <CardDescription>New staff members by month (2022)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={joinDateDistribution}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Staff distribution across roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleDistribution} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building Assignment</CardTitle>
            <CardDescription>Staff distribution across buildings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={buildingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#0ea5e9" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
