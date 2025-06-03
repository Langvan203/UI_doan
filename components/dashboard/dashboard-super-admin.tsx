"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  UsersIcon,
  PackageIcon,
  ActivityIcon,
  Building2,
  Home,
  AlertTriangle,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Wrench,
  Clock,
  CheckCircle,
  ThumbsUp,
  MoreHorizontal,
  FilterIcon,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import axios from "axios"

// Type definitions for overview data
interface RevenueByQuarter {
  quarter: string;
  revenue: number;
  target: number;
}

interface BuildingStatus {
  name: string;
  occupancy: number;
  maintaince: number;
}

interface ServiceDistribution {
  name: string;
  value: number;
}

interface RecentTransaction {
  id?: string;
  resident?: string;
  apartment?: string;
  amount?: number;
  type?: string;
  date?: string;
}

interface IssueByPriority {
  name: string;
  value: number;
}

interface OverviewData {
  revenueByQuarter: RevenueByQuarter[];
  buildingStatus: BuildingStatus[];
  serviceDistribution: ServiceDistribution[];
  recentTransactions: RecentTransaction[];
  issueByPriority: IssueByPriority[];
}

// Dữ liệu giả lập cho tab Tổng quan
const defaultOverviewData: OverviewData = {
  revenueByQuarter: [
    { quarter: "Q1", revenue: 0, target: 0 },
    { quarter: "Q2", revenue: 0, target: 0 },
    { quarter: "Q3", revenue: 0, target: 0 },
    { quarter: "Q4", revenue: 0, target: 0 },
  ],
  buildingStatus: [],
  serviceDistribution: [],
  recentTransactions: [],
  issueByPriority: []
}

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Format số tiền VND
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

// Type definitions for building data
interface BuildingDetail {
  name: string;
  units: number;
  occupied: number;
  vacant: number;
}

interface OccupancyBuilding {
  name: string;
  value: number;
}

interface BuildingsData {
  totalBuildings: number;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  maintenanceIssues: number;
  totalRevenue: number;
  totalRevenueGroth: number;
  newCustomers: number;
  newCustomersGroth: number;
  totalRequest: number;
  totalRequestGroth: number;
  totalCompletedRequest: number;
  totalCompletedRequestGroth: number;
  buildingDetails: BuildingDetail[];
  occupancyByBuilding: OccupancyBuilding[];
}

// Type definitions for finances data
interface RevenueByMonth {
  month: string;
  revenue: number;
}

interface ExpenseCategory {
  name: string;
  value: number;
}

interface OverduePayment {
  id: string;
  apartment: string;
  resident: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

interface FinancesData {
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingPayments: number;
  collectionRate: number;
  revenueGrowth: number;
  revenuePaid: number;
  monthlyExpenses: number;
  revenueByMonth: RevenueByMonth[];
  expenseCategories: ExpenseCategory[];
  overduePayments: OverduePayment[];
}

// Type definitions for services data
interface ServiceRequestCategory {
  name: string;
  total: number;
  pending: number;
  completed: number;
}

interface ServiceRequestByMonth {
  month: string;
  requests: number;
}

interface ServiceRequest {
  id: string;
  title: string;
  apartment: string;
  status: string;
  date: string;
}

interface ServicesData {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  completionRate: number;
  satisfactionRate: number;
  requestsByCategory: ServiceRequestCategory[];
  requestsByMonth: ServiceRequestByMonth[];
  recentRequests: ServiceRequest[];
}

// Component hiển thị thống kê tòa nhà
function BuildingsStats({ buildingsData }: { buildingsData: BuildingsData }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tòa nhà</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingsData.totalBuildings}</div>
            <p className="text-xs text-muted-foreground">Tổng số tòa nhà đang quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số căn hộ</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingsData.totalUnits}</div>
            <p className="text-xs text-muted-foreground">{buildingsData.occupiedUnits} căn hộ đã có người ở</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingsData.occupancyRate.toFixed(2)}%</div>
            <div className="mt-2">
              <Progress value={buildingsData.occupancyRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sự cố bảo trì</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingsData.maintenanceIssues}</div>
            <p className="text-xs text-muted-foreground">Sự cố đang chờ xử lý</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố căn hộ theo tòa nhà</CardTitle>
            <CardDescription>Số lượng căn hộ đã có người ở và còn trống theo từng tòa nhà</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                occupied: {
                  label: "Đã có người ở",
                  color: "hsl(var(--chart-1))",
                },
                vacant: {
                  label: "Còn trống",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildingsData.buildingDetails} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="occupied" fill="var(--color-occupied)" name="Đã có người ở" />
                  <Bar dataKey="vacant" fill="var(--color-vacant)" name="Còn trống" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ lấp đầy theo tòa nhà</CardTitle>
            <CardDescription>Phần trăm căn hộ đã có người ở theo từng tòa nhà</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-md">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={buildingsData.occupancyByBuilding}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${Number(value).toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {buildingsData.occupancyByBuilding.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    formatter={(value: number) => [`${Number(value).toFixed(2)}%`, "Tỷ lệ lấp đầy"]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component hiển thị thống kê tài chính
function FinancesStats({ financesData }: { financesData: FinancesData }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financesData.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +{financesData.revenueGrowth}%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi phí tháng</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financesData.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                {financesData.revenuePaid}%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khoản chưa thu</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financesData.outstandingPayments)}</div>
            <p className="text-xs text-muted-foreground">Tỷ lệ thu: {financesData.collectionRate.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu năm</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financesData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Dự kiến đạt 1.5 tỷ vào cuối năm</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>Biểu đồ doanh thu theo từng tháng trong năm</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Doanh thu",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financesData.revenueByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 1,
                      }).format(value)
                    }
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.2}
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ chi phí</CardTitle>
            <CardDescription>Phân bổ chi phí theo từng hạng mục</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-md">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financesData.expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {financesData.expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value: number) => [formatCurrency(value), "Chi phí"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Khoản thanh toán quá hạn</CardTitle>
          <CardDescription>Danh sách các khoản thanh toán đang quá hạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financesData.overduePayments.map((payment) => (
              <div key={payment.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{payment.resident}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.apartment} • Hạn: {format(new Date(payment.dueDate), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <div className="text-right">
                    <div>{formatCurrency(payment.amount)}</div>
                    <Badge variant="destructive" className="mt-1">
                      Quá hạn {payment.daysOverdue} ngày
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component hiển thị thống kê dịch vụ
function ServicesStats({ servicesData }: { servicesData: ServicesData }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData.totalRequests}</div>
            <p className="text-xs text-muted-foreground">{servicesData.completedRequests} yêu cầu đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Yêu cầu đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData.completionRate.toFixed(2)}%</div>
            <div className="mt-2">
              <Progress value={servicesData.completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Độ hài lòng</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">Dựa trên đánh giá của cư dân</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu dịch vụ theo loại</CardTitle>
            <CardDescription>Số lượng yêu cầu đã hoàn thành và đang xử lý theo từng loại</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {
                  label: "Đã hoàn thành",
                  color: "hsl(var(--chart-1))",
                },
                pending: {
                  label: "Đang xử lý",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicesData.requestsByCategory} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Đã hoàn thành" />
                  <Bar dataKey="pending" fill="var(--color-pending)" name="Đang xử lý" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng yêu cầu dịch vụ</CardTitle>
            <CardDescription>Số lượng yêu cầu dịch vụ theo từng tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: {
                  label: "Yêu cầu",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={servicesData.requestsByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="var(--color-requests)"
                    strokeWidth={2}
                    name="Yêu cầu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu dịch vụ gần đây</CardTitle>
          <CardDescription>Danh sách các yêu cầu dịch vụ gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Mã yêu cầu</th>
                  <th className="p-2 text-left font-medium">Tiêu đề</th>
                  <th className="p-2 text-left font-medium">Căn hộ</th>
                  <th className="p-2 text-left font-medium">Ngày</th>
                  <th className="p-2 text-left font-medium">Trạng thái</th>
                  <th className="p-2 text-left font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {servicesData.recentRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="p-2 font-medium">{request.id}</td>
                    <td className="p-2">{request.title}</td>
                    <td className="p-2">{request.apartment}</td>
                    <td className="p-2">{format(new Date(request.date), "dd/MM/yyyy", { locale: vi })}</td>
                    <td className="p-2">
                      <Badge
                        variant={request.status === "Đã hoàn thành" ? "default" : "secondary"}
                        className={
                          request.status === "Đã hoàn thành" 
                            ? "bg-green-500" 
                            : request.status === "Chờ duyệt" 
                            ? "bg-yellow-500" 
                            : "bg-blue-500"
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Hủy yêu cầu</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component chính của dashboard
export default function DashboardSuperAdmin() {
  const [activeTab, setActiveTab] = useState("overview")
  const currentDate = new Date()
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), // Last day of current month
  })
  const [buildingsData, setBuildingsData] = useState<BuildingsData>({
    totalBuildings: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    occupancyRate: 0,
    maintenanceIssues: 0,
    buildingDetails: [],
    occupancyByBuilding: [],
    totalRevenue: 0,
    totalRevenueGroth: 0,
    newCustomers: 0,
    newCustomersGroth: 0,
    totalRequest: 0,
    totalRequestGroth: 0,
    totalCompletedRequest: 0,
    totalCompletedRequestGroth: 0,
  })
  const [financesData, setFinancesData] = useState<FinancesData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    outstandingPayments: 0,
    collectionRate: 0,
    revenueGrowth: 0,
    revenuePaid: 0,
    monthlyExpenses: 0,
    revenueByMonth: [],
    expenseCategories: [],
    overduePayments: []
  })
  const [servicesData, setServicesData] = useState<ServicesData>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    completionRate: 0,
    satisfactionRate: 0,
    requestsByCategory: [],
    requestsByMonth: [],
    recentRequests: []
  })
  const [filteredData, setFilteredData] = useState({
    overview: { ...defaultOverviewData },
    buildings: { ...buildingsData },
    finances: { ...financesData },
    services: { ...servicesData },
  })

  // State for overview data
  const [overviewData, setOverviewData] = useState<OverviewData>(defaultOverviewData)

  // Fetch Overview Data
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Get the current year from the date range
        const year = dateRange.from.getFullYear()

        const response = await axios.get(`https://localhost:7246/api/ToaNha/GetOverViewData?year=${year}`)
        const data = response.data

        // Transform the data to match the component's expected structure
        const transformedData: OverviewData = {
          revenueByQuarter: data.revenueByQuarter.map((item: any) => ({
            quarter: `Q${item.quarter}`,
            revenue: item.revenue,
            target: item.target
          })),
          buildingStatus: data.buildingStatus.map((building: any) => ({
            name: building.name,
            occupancy: building.occupancy,
            maintaince: building.maintaince
          })),
          serviceDistribution: data.serviceDistribution.map((service: any) => ({
            name: service.name,
            value: service.value
          })),
          recentTransactions: data.recentTransactions.map((transaction: any) => ({
            id: transaction.id,
            resident: transaction.resident,
            apartment: transaction.apartment,
            amount: transaction.amount,
            type: transaction.type,
            date: transaction.date
          })),
          issueByPriority: data.issueByPriority.map((issue: any) => ({
            name: issue.name,
            value: issue.value
          }))
        }

        // Update the overviewData state
        setOverviewData(transformedData)

        // Update the filteredData state
        setFilteredData(prev => ({
          ...prev,
          overview: transformedData
        }))
      } catch (error) {
        console.error("Error fetching overview data:", error)
        // Reset to default state on error
        setOverviewData(defaultOverviewData)
        setFilteredData(prev => ({
          ...prev,
          overview: defaultOverviewData
        }))
      }
    }

    // Fetch overview data when the year changes
    if (dateRange.from) {
      fetchOverviewData()
    }
  }, [dateRange])

  // Fetch Buildings Data
  useEffect(() => {
    const fetchBuildingsData = async () => {
      try {
        // Format the date to match the API requirement
        const fromDate = format(dateRange.from, "yyyy-MM-dd")
        const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : fromDate

        const response = await axios.get(`https://localhost:7246/api/ToaNha/BuildingDataOverView?from=${fromDate}&to=${toDate}`)
        const data = response.data

        // Transform the data to match the existing component's structure
        const transformedData: BuildingsData = {
          totalBuildings: data.totalBuildings,
          totalUnits: data.totalUnits,
          occupiedUnits: data.occupiedUnits,
          occupancyRate: data.occupancyRate,
          maintenanceIssues: data.maintanceIssues,
          totalRevenue: data.totalRevenue,
          totalRevenueGroth: data.totalRevenueGroth,
          newCustomers: data.newCustomers,
          newCustomersGroth: data.newCustomersGroth,
          totalRequest: data.totalRequest,
          totalRequestGroth: data.totalRequestGroth,
          totalCompletedRequest: data.totalCompletedRequest,
          totalCompletedRequestGroth: data.totalCompletedRequestGroth,
          buildingDetails: data.buildingDetails.map((building: any) => ({
            name: building.buildingName,
            units: building.units,
            occupied: building.occupied,
            vacant: building.vacant
          })),
          occupancyByBuilding: data.occupancyBuildings.map((building: any) => ({
            name: building.buildingName,
            value: building.value
          }))
        }

        setBuildingsData(transformedData)
        
        // Update filteredData state
        setFilteredData(prev => ({
          ...prev,
          buildings: transformedData
        }))
      } catch (error) {
        console.error("Error fetching buildings data:", error)
        // Reset to default state on error
        setBuildingsData({
          totalBuildings: 0,
          totalUnits: 0,
          occupiedUnits: 0,
          occupancyRate: 0,
          maintenanceIssues: 0,
          buildingDetails: [],
          occupancyByBuilding: [],
          totalRevenue: 0,
          totalRevenueGroth: 0,
          newCustomers: 0,
          newCustomersGroth: 0,
          totalRequest: 0,
          totalRequestGroth: 0,
          totalCompletedRequest: 0,
          totalCompletedRequestGroth: 0,
        })
        
        // Update filteredData state
        setFilteredData(prev => ({
          ...prev,
          buildings: {
            totalBuildings: 0,
            totalUnits: 0,
            occupiedUnits: 0,
            occupancyRate: 0,
            maintenanceIssues: 0,
            buildingDetails: [],
            occupancyByBuilding: [],
            totalRevenue: 0,
            totalRevenueGroth: 0,
            newCustomers: 0,
            newCustomersGroth: 0,
            totalRequest: 0,
            totalRequestGroth: 0,
            totalCompletedRequest: 0,
            totalCompletedRequestGroth: 0,
          }
        }))
      }
    }

    // Only fetch if date range is set
    if (dateRange.from) {
      fetchBuildingsData()
    }
  }, [dateRange])

  // Fetch Finances Data
  useEffect(() => {
    const fetchFinancesData = async () => {
      try {
        // Format the date to match the API requirement
        const fromDate = format(dateRange.from, "yyyy-MM-dd")
        const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : fromDate

        const response = await axios.get(`https://localhost:7246/api/ToaNha/GetFinnancesData?from=${fromDate}&to=${toDate}`)
        const data = response.data

        // Transform the data to match the component's expected structure
        const transformedData: FinancesData = {
          totalRevenue: data.totalRevenue,
          monthlyRevenue: data.monthlyRevenue,
          outstandingPayments: data.outstandingPayments,
          collectionRate: data.collectionRate,
          revenueGrowth: data.revenueGrowth,
          revenuePaid: data.revenuePaid,
          monthlyExpenses: data.monthlyExpenses,
          revenueByMonth: data.revenueByMonth.map((item: any) => ({
            month: item.month,
            revenue: item.revenue
          })),
          expenseCategories: data.expenseCategories.map((item: any) => ({
            name: item.name,
            value: item.value
          })),
          overduePayments: data.overduePayments.map((item: any) => ({
            id: item.id,
            apartment: item.apartment,
            resident: item.resident,
            amount: item.amount,
            dueDate: item.dueDate,
            daysOverdue: item.daysOverdue
          }))
        }

        // Update the financesData state
        setFinancesData(transformedData)
      } catch (error) {
        console.error("Error fetching finances data:", error)
        // Optionally set some default or error state
        setFinancesData({
          totalRevenue: 0,
          monthlyRevenue: 0,
          outstandingPayments: 0,
          collectionRate: 0,
          revenueGrowth: 0,
          revenuePaid: 0,
          monthlyExpenses: 0,
          revenueByMonth: [],
          expenseCategories: [],
          overduePayments: []
        })
      }
    }

    // Only fetch if date range is set
    if (dateRange.from) {
      fetchFinancesData()
    }
  }, [dateRange])

  // Fetch Services Data
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        // Format the date to match the API requirement
        const fromDate = format(dateRange.from, "yyyy-MM-dd")
        const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : fromDate

        const response = await axios.get(`https://localhost:7246/api/ToaNha/GetServicesData?from=${fromDate}&to=${toDate}`)
        const data = response.data

        // Transform the data to match the component's expected structure
        const transformedData: ServicesData = {
          totalRequests: data.totalRequest,
          pendingRequests: data.pendingRequest,
          completedRequests: data.completedRequest,
          completionRate: data.completionRate,
          satisfactionRate: data.satisfactionRate,
          requestsByCategory: data.requestsByCategory.map((category: any) => ({
            name: category.name,
            total: category.total,
            pending: category.peding, // Note: typo in API response
            completed: category.completed
          })),
          requestsByMonth: data.requestsByMonth.map((item: any) => ({
            month: item.month,
            requests: item.requests
          })),
          recentRequests: data.recentRequests.map((request: any) => ({
            id: request.id,
            title: request.title,
            apartment: request.apartment,
            status: request.status,
            date: request.date
          }))
        }

        // Update the servicesData state
        setServicesData(transformedData)
      } catch (error) {
        console.error("Error fetching services data:", error)
        // Optionally set some default or error state
        setServicesData({
          totalRequests: 0,
          pendingRequests: 0,
          completedRequests: 0,
          completionRate: 0,
          satisfactionRate: 0,
          requestsByCategory: [],
          requestsByMonth: [],
          recentRequests: []
        })
      }
    }

    // Only fetch if date range is set
    if (dateRange.from) {
      fetchServicesData()
    }
  }, [dateRange])

  // Filter data based on selected date range
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    // Filter overview data
    const filteredOverview = {
      ...filteredData.overview,
      // Filter transactions by date range
      recentTransactions: filteredData.overview.recentTransactions.filter(transaction => {
        const [day, month, year] = transaction.date?.split('/').map(Number) ?? []
        const transactionDate = new Date(year, month - 1, day)
        return transactionDate >= dateRange.from && dateRange.to && transactionDate <= dateRange.to
      })
    }

    // Filter finances data
    const filteredFinances = {
      ...filteredData.finances,
      // Filter overdue payments by date range
      overduePayments: filteredData.finances.overduePayments.filter(payment => {
        const [day, month, year] = payment.dueDate.split('/').map(Number)
        const paymentDate = new Date(year, month - 1, day)
        return paymentDate >= dateRange.from && dateRange.to && paymentDate <= dateRange.to
      })
    }

    // Filter service data
    const filteredServices = {
      ...filteredData.services,
      // Filter service requests by date range
      recentRequests: filteredData.services.recentRequests.filter(request => {
        const requestDate = new Date(request.date)
        return requestDate >= dateRange.from && dateRange.to && requestDate <= dateRange.to
      }),
      // Filter requests by month based on date range
      requestsByMonth: filteredData.services.requestsByMonth.map(monthData => ({
        ...monthData,
        // You might want to adjust this logic based on your specific requirements
        requests: monthData.month === format(dateRange.from, "M") ? monthData.requests : 0
      }))
    }

    setFilteredData({
      overview: filteredOverview,
      buildings: buildingsData, // Buildings data typically doesn't change with date range
      finances: filteredFinances,
      services: filteredServices,
    })
  }, [dateRange])

  const handleLogout = () => {
    // Xử lý đăng xuất - có thể thêm logic gọi API đăng xuất ở đây
    console.log("Logout clicked")
  }

  // Updated DateRangePicker that uses 'dateRange' state and 'setDateRange' function
  const CustomDateRangePicker = () => {
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    
    // Hàm định dạng ngày tháng
    const formatDateRange = () => {
      if (dateRange.from && dateRange.to) {
        return `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`
      }
      return "Chọn khoảng thời gian"
    }
    
    // Hàm xử lý khi chọn ngày
    const handleDayClick = (day: Date) => {
      if (!dateRange.from || dateRange.to) {
        // Nếu chưa chọn ngày bắt đầu hoặc đã chọn đủ cả khoảng (reset để chọn mới)
        setDateRange({ from: day, to: undefined })
        // Không đóng popup sau khi chọn ngày đầu tiên
      } else if (day < dateRange.from) {
        setDateRange({ from: day, to: dateRange.from })
        // Không đóng popup sau khi chọn xong khoảng thời gian
      } else {
        setDateRange({ from: dateRange.from, to: day })
        // Không đóng popup sau khi chọn xong khoảng thời gian
      }
    }
    
    // Hàm đóng/mở popup calendar
    const handleOpenChange = (open: boolean) => {
      setIsCalendarOpen(open);
    }
    
    // Chuyển tháng trước
    const previousMonth = () => {
      setCurrentMonth(prev => prev > 0 ? prev - 1 : prev)
    }
    
    // Chuyển tháng sau
    const nextMonth = () => {
      setCurrentMonth(prev => prev < 11 ? prev + 1 : prev)
    }
    
    const getDaysInMonth = (year: number, month: number): number => {
      return new Date(year, month + 1, 0).getDate()
    }
    
    interface DayObject {
      day: number;
      isCurrentMonth?: boolean;
      isPrevMonth?: boolean;
      isNextMonth?: boolean;
    }
    
    const renderMonthCalendar = (year: number, month: number, isSecondMonth = false) => {
      const monthName = format(new Date(year, month), "MMMM yyyy", { locale: vi })
      const daysInMonth = getDaysInMonth(year, month)
      const firstDayOfMonth = new Date(year, month, 1).getDay()
      // Adjust firstDayOfMonth to start from Monday (1) instead of Sunday (0)
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
      
      // Create array for days in previous month
      const prevMonthDays: DayObject[] = []
      if (adjustedFirstDay > 0) {
        const daysInPrevMonth = getDaysInMonth(year, month - 1)
        for (let i = 0; i < adjustedFirstDay; i++) {
          prevMonthDays.push({ day: daysInPrevMonth - adjustedFirstDay + i + 1, isPrevMonth: true })
        }
      }
      
      // Create array for days in current month
      const currentMonthDays: DayObject[] = []
      for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push({ day: i, isCurrentMonth: true })
      }
      
      // Create array for days in next month
      const nextMonthDays: DayObject[] = []
      const totalDaysToShow = 42 // 6 rows of 7 days
      const remainingDays = totalDaysToShow - prevMonthDays.length - currentMonthDays.length
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push({ day: i, isNextMonth: true })
      }
      
      // Combine all days
      const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
      
      const weekDays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"]
  
      const dayClassName = (dayObj: DayObject): string => {
        if (!dayObj.isCurrentMonth) return "text-gray-400"
        
        const currentDay = new Date(year, month, dayObj.day)
        const isDayInRange = dateRange.from && dateRange.to && 
                         currentDay >= dateRange.from && 
                         currentDay <= dateRange.to
        const isStart = dateRange.from && currentDay.getTime() === dateRange.from.getTime()
        const isEnd = dateRange.to && currentDay.getTime() === dateRange.to.getTime()
        const isToday = new Date().setHours(0, 0, 0, 0) === currentDay.setHours(0, 0, 0, 0)
        
        if (isStart || isEnd) return "bg-blue-600 text-white rounded-full hover:bg-blue-700"
        if (isDayInRange) return "bg-blue-100 hover:bg-blue-200"
        if (isToday) return "border border-blue-600 rounded-full"
        
        return "hover:bg-gray-100"
      }
  
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            {!isSecondMonth && (
              <button 
                onClick={previousMonth} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h3 className="text-center font-medium capitalize">{monthName}</h3>
            {isSecondMonth && (
              <button 
                onClick={nextMonth} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-sm font-medium py-1">
                {day}
              </div>
            ))}
            {allDays.map((dayObj, i) => (
              <button
                key={i}
                onClick={() => dayObj.isCurrentMonth && handleDayClick(new Date(year, month, dayObj.day))}
                className={`w-8 h-8 mx-auto flex items-center justify-center text-sm ${dayClassName(dayObj)}`}
                disabled={!dayObj.isCurrentMonth}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
      )
    }
  
    return (
      <Popover open={isCalendarOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="min-w-[250px] justify-start text-left font-normal border-dashed hover:bg-gray-100 transition-colors"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 flex space-x-6">
            {renderMonthCalendar(currentDate.getFullYear(), currentMonth)}
            {renderMonthCalendar(currentDate.getFullYear(), currentMonth + 1, true)}
          </div>
          <div className="flex items-center justify-between p-3 border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDateRange({
                from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                to: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
              })}
            >
              Tháng hiện tại
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <CustomDateRangePicker />
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger 
              value="overview"
              className={cn(
                "transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-opacity-70",
                activeTab === "overview" ? "bg-white text-primary shadow-sm" : "hover:bg-gray-200"
              )}
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger 
              value="buildings"
              className={cn(
                "transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-opacity-70",
                activeTab === "buildings" ? "bg-white text-primary shadow-sm" : "hover:bg-gray-200"
              )}
            >
              Tòa nhà
            </TabsTrigger>
            <TabsTrigger 
              value="finances"
              className={cn(
                "transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-opacity-70",
                activeTab === "finances" ? "bg-white text-primary shadow-sm" : "hover:bg-gray-200"
              )}
            >
              Tài chính
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className={cn(
                "transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-opacity-70",
                activeTab === "services" ? "bg-white text-primary shadow-sm" : "hover:bg-gray-200"
              )}
            >
              Dịch vụ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(filteredData.buildings.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {filteredData.buildings.totalRevenueGroth}%
                    </span>{" "}
                    so với tháng trước
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.buildings?.newCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {filteredData.buildings?.newCustomersGroth}%
                    </span>{" "}
                    so với tháng trước
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yêu cầu</CardTitle>
                  <PackageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.buildings?.totalRequest}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {filteredData.buildings?.totalRequestGroth}%
                    </span>{" "}
                    so với tháng trước
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
                  <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.buildings?.totalCompletedRequest.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-rose-500 flex items-center">
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                      {filteredData.buildings?.totalCompletedRequestGroth.toFixed(2) ?? 0}%
                    </span>{" "}
                    so với tháng trước
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Doanh thu theo quý</CardTitle>
                  <CardDescription>So sánh doanh thu thực tế với mục tiêu theo từng quý</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Doanh thu thực tế",
                        color: "hsl(var(--chart-1))",
                      },
                      target: {
                        label: "Mục tiêu",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredData.overview.revenueByQuarter}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="quarter" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 1,
                            }).format(value)
                          }
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" name="Doanh thu thực tế" />
                        <Bar dataKey="target" fill="var(--color-target)" name="Mục tiêu" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Giao dịch gần đây</CardTitle>
                  <CardDescription>Danh sách các giao dịch mới nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredData.overview.recentTransactions.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        Không có giao dịch gần đây
                      </div>
                    ) : (
                      filteredData.overview.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center">
                          <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.resident}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.apartment} • {transaction.date}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {transaction.type === "payment" ? "+" : "-"}
                          {formatCurrency(transaction.amount ?? 0)}
                        </div>
                      </div>
                    )))
                  }
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Tình trạng tòa nhà</CardTitle>
                  <CardDescription>Tỷ lệ lấp đầy và số lượng sự cố bảo trì theo từng tòa nhà</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      occupancy: {
                        label: "Tỷ lệ lấp đầy (%)",
                        color: "hsl(var(--chart-1))",
                      },
                      maintenance: {
                        label: "Sự cố bảo trì",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredData.overview.buildingStatus}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="occupancy"
                          stroke="var(--color-occupancy)"
                          strokeWidth={2}
                          name="Tỷ lệ lấp đầy (%)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="maintaince"
                          stroke="var(--color-maintenance)"
                          strokeWidth={2}
                          name="Sự cố bảo trì"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Phân bố dịch vụ</CardTitle>
                  <CardDescription>Phân bố yêu cầu dịch vụ theo loại</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="h-[300px] w-full max-w-md">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={filteredData.overview.serviceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {filteredData.overview.serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip formatter={(value) => [`${value} yêu cầu`, "Số lượng"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Tỷ lệ lấp đầy theo tòa nhà</CardTitle>
                  <CardDescription>Tỷ lệ phần trăm căn hộ đã có người ở theo từng tòa nhà</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredData.buildings.buildingDetails.map((building) => {
                      const occupancyRate = building.units > 0 ? (building.occupied / building.units) * 100 : 0
                      return (
                        <div key={building.name} className="flex items-center">
                          <div className="w-[100px] flex-shrink-0">
                            <p className="text-sm font-medium">{building.name}</p>
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="flex items-center">
                              <Progress value={occupancyRate} className="h-2 flex-1" />
                              <span className="ml-2 text-sm font-medium">{occupancyRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>
                                {building.occupied} / {building.units} căn hộ
                              </span>
                              <span>{building.vacant} căn trống</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sự cố theo mức độ ưu tiên</CardTitle>
                  <CardDescription>Phân loại sự cố theo mức độ ưu tiên</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredData.overview.issueByPriority}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {filteredData.overview.issueByPriority.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#ef4444" : index === 1 ? "#f97316" : "#22c55e"}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip formatter={(value) => [`${value} sự cố`, "Số lượng"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buildings" className="space-y-4">
            <BuildingsStats buildingsData={buildingsData} />
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <FinancesStats financesData={financesData} />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServicesStats servicesData={servicesData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
