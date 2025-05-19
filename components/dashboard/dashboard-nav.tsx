"use client"

import React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Building2,
  Users,
  Home,
  Wallet,
  BarChart3,
  MessageSquare,
  Settings,
  Layers,
  Building,
  Bell,
  ScrollText,
  Receipt,
  LayoutDashboard,
  PenToolIcon as Tool,
  ClipboardList,
  Wrench,
  ChevronDown,
  ChevronRight,
  List,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
  color: string
  bgColor: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán", "Cư dân", "Nhân viên kỹ thuật", "Nhân viên tòa nhà"],
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    title: "Dự án tòa nhà",
    href: "/dashboard/buildings",
    icon: <Building2 className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà"],
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    children: [
      {
        title: "Tòa nhà",
        href: "/dashboard/buildings/building-list",
        icon: <List className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        title: "Khối nhà",
        href: "/dashboard/buildings/blocks",
        icon: <Layers className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        title: "Tầng lầu",
        href: "/dashboard/buildings/floors",
        icon: <Layers className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        title: "Căn hộ",
        href: "/dashboard/buildings/premises",
        icon: <Building className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
    ],
  },
  {
    title: "Nhân viên & Phòng ban",
    href: "/dashboard/staff",
    icon: <Users className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà"],
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    title: "Cư dân căn hộ",
    href: "/dashboard/residents",
    icon: <Home className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    title: "Dịch vụ tòa nhà",
    href: "/dashboard/services",
    icon: <Bell className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán", "Nhân viên tòa nhà"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Hệ thống",
    href: "/dashboard/building-systems",
    icon: <Tool className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán"],
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    children: [
      {
        title: "Danh sách hệ thống",
        href: "/dashboard/building-systems/list",
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà", "Kế toán"],
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        title: "Kế hoạch bảo trì",
        href: "/dashboard/building-systems/maintenance",
        icon: <Wrench className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà", "Kế toán"],
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        title: "Yêu cầu bảo trì",
        href: "/dashboard/building-systems/requests",
        icon: <ScrollText className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà", "Kế toán", "Cư dân"],
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
    ],
  },
  {
    title: "Hóa đơn",
    href: "/dashboard/invoices",
    icon: <Receipt className="h-5 w-5" />,
    roles: ["Kế toán", "Quản lý tòa nhà", "Cư dân"],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Tài chính",
    href: "/dashboard/finances",
    icon: <Wallet className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Báo cáo",
    href: "/dashboard/reports",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán", "Nhân viên kỹ thuật"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Hỗ trợ khách hàng",
    href: "/dashboard/support",
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà", "Cư dân"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán", "Nhân viên kỹ thuật", "Nhân viên tòa nhà"],
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
]

interface DashboardNavProps {
  role: string
  className?: string
}

export function DashboardNav({ role, className }: DashboardNavProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Check if user's role matches any of the allowed roles for this item
    return item.roles.includes(role) || role === "Quản lý tòa nhà";
  });

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }))
  }

  // Check if a path is active or has active children
  const isPathActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className={cn("flex flex-col h-full bg-white border-r", className)}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl">
          <Building2 className="h-8 w-8 text-primary" />
          <span>Menu</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {filteredNavItems.map((item) => {
            const isActive = isPathActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isExpanded =
              expandedItems[item.href] || (hasChildren && item.children!.some((child) => isPathActive(child.href)))

            return (
              <div key={item.href} className="flex flex-col">
                <div className="flex items-center">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(item.href)}
                      className={cn(
                        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                        "transition-all duration-300 ease-in-out",
                        isActive && !isExpanded
                          ? cn(
                              item.bgColor,
                              item.color,
                              "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current relative"
                            )
                          : "text-muted-foreground hover:text-primary hover:bg-accent",
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-3",
                        isActive && !isExpanded ? item.color : "group-hover:text-primary"
                      )}>
                        <div className={cn("h-5 w-5 shrink-0", 
                          isActive && !isExpanded
                            ? item.color
                            : "text-muted-foreground group-hover:text-primary"
                        )}>
                          {item.icon}
                        </div>
                        <span className="truncate">{item.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {isActive && !isExpanded ? (
                        <span className="absolute inset-y-0 right-0 w-1 bg-current rounded-l-full opacity-70" />
                      ) : null}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                        "transition-all duration-300 ease-in-out",
                        "hover:bg-accent",
                        isActive
                          ? cn(
                              item.bgColor,
                              item.color,
                              "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current relative"
                            )
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      <div className={cn("h-5 w-5 shrink-0", 
                        isActive 
                          ? item.color
                          : "text-muted-foreground group-hover:text-primary"
                      )}>
                        {item.icon}
                      </div>
                      <span className="truncate">{item.title}</span>
                      {isActive ? (
                        <span className="absolute inset-y-0 right-0 w-1 bg-current rounded-l-full opacity-70" />
                      ) : null}
                    </Link>
                  )}
                </div>

                {/* Render children if expanded */}
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item
                      .children!.filter((child) => child.roles.includes(role) || role === "Quản lý tòa nhà")
                      .map((child) => {
                        const isChildActive = isPathActive(child.href)

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                              "transition-all duration-300 ease-in-out",
                              isChildActive
                                ? cn(
                                    child.bgColor,
                                    child.color,
                                    "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current relative"
                                  )
                                : "text-muted-foreground hover:text-primary hover:bg-accent",
                            )}
                          >
                            <div className={cn("h-5 w-5 shrink-0", 
                              isChildActive
                                ? child.color
                                : "text-muted-foreground group-hover:text-primary"
                            )}>
                              {child.icon}
                            </div>
                            <span className="truncate">{child.title}</span>
                            {isChildActive ? (
                              <span className="absolute inset-y-0 right-0 w-1 bg-current rounded-l-full opacity-70" />
                            ) : null}
                          </Link>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </div>
  )
}

// We don't need the color function anymore as we're using Tailwind classes directly
