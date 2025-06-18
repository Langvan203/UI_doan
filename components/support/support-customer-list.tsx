"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for customer conversations - Thêm nhiều khách hàng để test scroll
const mockCustomers = [
  {
    id: "C-1001",
    name: "Trần Thị Trinh",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Kế hoạch và Danh sách phân công GVHD TTTN/ TTDN của ĐH K16 và các khóa cũ về trả nợ...",
    timestamp: "10 giờ",
    unreadCount: 0,
    isOnline: true,
    premise: "Block A, Floor 3, Unit 302",
  },
  {
    id: "C-1002",
    name: "Nhóm đồ án TN K16",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "PHẠM QUÝ QUỐC: Thầy ơi tuần sau...",
    timestamp: "2 ngày",
    unreadCount: 5,
    isOnline: false,
    premise: "Block B, Floor 5, Unit 505",
  },
  {
    id: "C-1003",
    name: "Nguyễn Văn An",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Xin chào, tôi cần hỗ trợ về hóa đơn điện nước tháng này",
    timestamp: "1 giờ",
    unreadCount: 2,
    isOnline: true,
    premise: "Block A, Floor 2, Unit 201",
  },
  {
    id: "C-1004",
    name: "Lê Thị Mai",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Khi nào sẽ sửa chữa thang máy Block B?",
    timestamp: "3 giờ",
    unreadCount: 1,
    isOnline: false,
    premise: "Block B, Floor 8, Unit 802",
  },
  {
    id: "C-1005",
    name: "Phạm Minh Tuấn",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Cảm ơn bạn đã hỗ trợ, vấn đề đã được giải quyết",
    timestamp: "5 giờ",
    unreadCount: 0,
    isOnline: true,
    premise: "Block C, Floor 4, Unit 403",
  },
  {
    id: "C-1006",
    name: "Hoàng Thị Lan",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Tôi muốn đăng ký thêm dịch vụ giữ xe",
    timestamp: "1 ngày",
    unreadCount: 3,
    isOnline: false,
    premise: "Block A, Floor 6, Unit 601",
  },
  {
    id: "C-1007",
    name: "Trần Văn Hùng",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Có thể hẹn lịch bảo trì điều hòa không?",
    timestamp: "1 ngày",
    unreadCount: 0,
    isOnline: false,
    premise: "Block C, Floor 2, Unit 203",
  },
  {
    id: "C-1008",
    name: "Nguyễn Thị Hoa",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Phí quản lý tháng này có tăng không?",
    timestamp: "2 ngày",
    unreadCount: 1,
    isOnline: true,
    premise: "Block B, Floor 3, Unit 305",
  },
  {
    id: "C-1009",
    name: "Lê Văn Đức",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Khi nào có thể sử dụng hồ bơi trở lại?",
    timestamp: "2 ngày",
    unreadCount: 0,
    isOnline: false,
    premise: "Block A, Floor 5, Unit 501",
  },
  {
    id: "C-1010",
    name: "Phạm Thị Thu",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Tôi cần báo cáo sự cố rò rỉ nước",
    timestamp: "3 ngày",
    unreadCount: 4,
    isOnline: true,
    premise: "Block C, Floor 7, Unit 701",
  },
  {
    id: "C-1011",
    name: "Võ Minh Khang",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Có thể thay đổi ngày thanh toán không?",
    timestamp: "3 ngày",
    unreadCount: 0,
    isOnline: false,
    premise: "Block B, Floor 6, Unit 602",
  },
  {
    id: "C-1012",
    name: "Đặng Thị Linh",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Xin lỗi, tôi chuyển nhầm tiền",
    timestamp: "4 ngày",
    unreadCount: 2,
    isOnline: false,
    premise: "Block A, Floor 4, Unit 401",
  },
  {
    id: "C-1013",
    name: "Bùi Văn Nam",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Khi nào có thể đăng ký thêm thẻ xe?",
    timestamp: "5 ngày",
    unreadCount: 0,
    isOnline: true,
    premise: "Block C, Floor 1, Unit 101",
  },
  {
    id: "C-1014",
    name: "Trịnh Thị Nga",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Cần hỗ trợ về dịch vụ internet",
    timestamp: "1 tuần",
    unreadCount: 1,
    isOnline: false,
    premise: "Block B, Floor 4, Unit 404",
  },
  {
    id: "C-1015",
    name: "Lý Văn Tài",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Cảm ơn đội ngũ hỗ trợ nhiệt tình",
    timestamp: "1 tuần",
    unreadCount: 0,
    isOnline: false,
    premise: "Block A, Floor 7, Unit 702",
  },
]

interface SupportCustomerListProps {
  onSelectCustomer: (customerId: string) => void
  selectedCustomerId: string | null
}

export function SupportCustomerList({ onSelectCustomer, selectedCustomerId }: SupportCustomerListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter customers based on search query
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <CardHeader className="flex-shrink-0 border-b pb-4">
        <CardTitle className="text-lg font-semibold">Tin nhắn hỗ trợ</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {filteredCustomers.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Không tìm thấy khách hàng nào</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-muted/80 ${
                      selectedCustomerId === customer.id ? "bg-muted shadow-sm" : ""
                    }`}
                    onClick={() => onSelectCustomer(customer.id)}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {customer.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate text-sm font-medium leading-tight">{customer.name}</h4>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <span className="text-xs text-muted-foreground">{customer.timestamp}</span>
                          {customer.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs font-medium">
                              {customer.unreadCount > 99 ? "99+" : customer.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {customer.lastMessage}
                      </p>

                      {customer.premise !== "N/A" && (
                        <p className="mt-1 truncate text-xs text-muted-foreground/60">📍 {customer.premise}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
