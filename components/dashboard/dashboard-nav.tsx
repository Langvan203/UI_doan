"use client"

import React, { useEffect } from "react"

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
  Tags,
  DollarSign,
  Gauge,
  UserCheck,
  CheckCircle,
  BarChart,
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
      {
        title: "Trạng thái & Loại",
        href: "/dashboard/premises",
        icon: <Layers className="h-5 w-5" />,
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
    href: "/dashboard/buildingServices",
    icon: <Bell className="h-5 w-5" />,
    roles: ["Quản lý tòa nhà", "Kế toán", "Nhân viên tòa nhà"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    children: [
      {
        title: "Quản lý dịch vụ",
        href: "/dashboard/buildingServices/management",
        icon: <Settings className="h-5 w-5" />,
        roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        children: [
          {
            title: "Loại dịch vụ",
            href: "/dashboard/buildingServices/management/types",
            icon: <Tags className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
          {
            title: "Dịch vụ",
            href: "/dashboard/buildingServices/management/services",
            icon: <Bell className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
          {
            title: "Định mức",
            href: "/dashboard/buildingServices/management/rates",
            icon: <DollarSign className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
          {
            title: "Đồng hồ đo",
            href: "/dashboard/buildingServices/management/meters",
            icon: <Gauge className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
        ],
      },
      {
        title: "Dịch vụ sử dụng",
        href: "/dashboard/buildingServices/operations",
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "SERVICE_MANAGER"],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        children: [
          {
            title: "Yêu cầu sử dụng",
            href: "/dashboard/buildingServices/operations/assignment",
            icon: <UserCheck className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
          {
            title: "Duyệt yêu cầu",
            href: "/dashboard/buildingServices/operations/approval",
            icon: <CheckCircle className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
          {
            title: "Đang sử dụng",
            href: "/dashboard/buildingServices/operations/usage",
            icon: <BarChart className="h-5 w-5" />,
            roles: ["Quản lý tòa nhà", "Nhân viên tòa nhà"],
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
          },
        ],
      },
    ],
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

  // Tự động mở các menu cha khi có menu con đang active
  useEffect(() => {
    const newExpandedItems = { ...expandedItems };
    
    // Kiểm tra và mở các menu cha
    navItems.forEach(item => {
      // Kiểm tra nếu menu có con và đường dẫn hiện tại thuộc về menu con
      if (item.children && pathname.startsWith(item.href)) {
        newExpandedItems[item.href] = true;
        
        // Kiểm tra và mở menu cháu nếu cần
        item.children.forEach(child => {
          if (child.children && pathname.startsWith(child.href)) {
            newExpandedItems[child.href] = true;
          }
        });
      }
    });
    
    setExpandedItems(newExpandedItems);
  }, [pathname]);

  // Hàm kiểm tra đường dẫn có active không
  const isPathActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  // Hàm toggle mở/đóng menu
  const toggleExpand = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setExpandedItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Check if user's role matches any of the allowed roles for this item
    return item.roles.includes(role) || role === "Quản lý tòa nhà";
  });

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
            const isActive = isPathActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.href];

            return (
              <div key={item.href} className="flex flex-col">
                <div className="flex items-center">
                  {hasChildren ? (
                    <button
                      onClick={(e) => toggleExpand(item.href, e)}
                      className={cn(
                        "group flex w-full items-center justify-between gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
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
                      <div className="flex items-center gap-3">
                        <div className={cn("h-5 w-5 shrink-0",
                          isActive && !isExpanded ? item.color : "text-muted-foreground group-hover:text-primary"
                        )}>
                          {item.icon}
                        </div>
                        <span className="truncate">{item.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                        "transition-all duration-300 ease-in-out",
                        "hover:bg-accent",
                        isActive
                          ? cn(item.bgColor, item.color, "relative before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current")
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      <div className={cn("h-5 w-5 shrink-0",
                        isActive ? item.color : "text-muted-foreground group-hover:text-primary"
                      )}>
                        {item.icon}
                      </div>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )}
                </div>

                {/* Render menu con cấp 1 */}
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item.children!
                      .filter((child) => child.roles.includes(role) || role === "Quản lý tòa nhà")
                      .map((child) => {
                        const isChildActive = isPathActive(child.href);
                        const hasGrandChildren = child.children && child.children.length > 0;
                        const isChildExpanded = expandedItems[child.href];

                        return (
                          <div key={child.href} className="flex flex-col">
                            {/* Render item con */}
                            {hasGrandChildren ? (
                              <button
                                onClick={(e) => toggleExpand(child.href, e)}
                                className={cn(
                                  "group flex w-full items-center justify-between gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                                  "transition-all duration-300 ease-in-out",
                                  isChildActive && !isChildExpanded
                                    ? cn(
                                      child.bgColor,
                                      child.color,
                                      "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current relative"
                                    )
                                    : "text-muted-foreground hover:text-primary hover:bg-accent",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn("h-5 w-5 shrink-0",
                                    isChildActive && !isChildExpanded ? child.color : "text-muted-foreground group-hover:text-primary"
                                  )}>
                                    {child.icon}
                                  </div>
                                  <span className="truncate">{child.title}</span>
                                </div>
                                {isChildExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </button>
                            ) : (
                              <Link
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
                                  isChildActive ? child.color : "text-muted-foreground group-hover:text-primary"
                                )}>
                                  {child.icon}
                                </div>
                                <span className="truncate">{child.title}</span>
                              </Link>
                            )}

                            {/* Render menu con cấp 2 (menu cháu) */}
                            {hasGrandChildren && isChildExpanded && (
                              <div className="ml-6 mt-1 flex flex-col gap-1">
                                {child.children!
                                  .filter((grandChild) => grandChild.roles.includes(role) || role === "Quản lý tòa nhà")
                                  .map((grandChild) => {
                                    const isGrandChildActive = isPathActive(grandChild.href);
                                    
                                    return (
                                      <Link
                                        key={grandChild.href}
                                        href={grandChild.href}
                                        className={cn(
                                          "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                                          "transition-all duration-300 ease-in-out",
                                          isGrandChildActive
                                            ? cn(
                                              grandChild.bgColor,
                                              grandChild.color,
                                              "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-current relative"
                                            )
                                            : "text-muted-foreground hover:text-primary hover:bg-accent",
                                        )}
                                      >
                                        <div className={cn("h-5 w-5 shrink-0",
                                          isGrandChildActive ? grandChild.color : "text-muted-foreground group-hover:text-primary"
                                        )}>
                                          {grandChild.icon}
                                        </div>
                                        <span className="truncate">{grandChild.title}</span>
                                      </Link>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
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
