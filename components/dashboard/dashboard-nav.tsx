"use client"

import type React from "react"

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
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER", "FINANCIAL_MANAGER", "CUSTOMER_SERVICE", "TENANT"],
  },
  {
    title: "Buildings",
    href: "/dashboard/buildings",
    icon: <Building2 className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
    children: [
      {
        title: "Building List",
        href: "/dashboard/buildings/building-list",
        icon: <List className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
      },
      {
        title: "Blocks",
        href: "/dashboard/buildings/blocks",
        icon: <Layers className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
      },
      {
        title: "Floors",
        href: "/dashboard/buildings/floors",
        icon: <Layers className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
      },
      {
        title: "Premises",
        href: "/dashboard/buildings/premises",
        icon: <Building className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
      },
    ],
  },
  {
    title: "Staff",
    href: "/dashboard/staff",
    icon: <Users className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER"],
  },
  {
    title: "Residents",
    href: "/dashboard/residents",
    icon: <Home className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "CUSTOMER_SERVICE"],
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: <Bell className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "SERVICE_MANAGER", "TENANT"],
  },
  {
    title: "Building Systems",
    href: "/dashboard/building-systems",
    icon: <Tool className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER"],
    children: [
      {
        title: "Systems List",
        href: "/dashboard/building-systems/list",
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER"],
      },
      {
        title: "Maintenance",
        href: "/dashboard/building-systems/maintenance",
        icon: <Wrench className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER"],
      },
      {
        title: "Maintenance Requests",
        href: "/dashboard/building-systems/requests",
        icon: <ScrollText className="h-5 w-5" />,
        roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER", "TENANT"],
      },
    ],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: <Receipt className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "FINANCIAL_MANAGER", "SERVICE_MANAGER", "TENANT"],
  },
  {
    title: "Finances",
    href: "/dashboard/finances",
    icon: <Wallet className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "FINANCIAL_MANAGER"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER", "FINANCIAL_MANAGER"],
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "CUSTOMER_SERVICE", "TENANT"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["SUPER_ADMIN", "BUILDING_MANAGER", "SERVICE_MANAGER", "FINANCIAL_MANAGER", "CUSTOMER_SERVICE"],
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
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

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
    <nav className={cn("flex flex-col gap-2 px-4 py-2", className)}>
      {filteredNavItems.map((item) => {
        const isActive = isPathActive(item.href)
        const hasChildren = item.children && item.children.length > 0
        const isExpanded =
          expandedItems[item.href] || (hasChildren && item.children!.some((child) => isPathActive(child.href)))
        const bgColorClass = getBgColorByRole(role, isActive && !hasChildren)

        return (
          <div key={item.href} className="flex flex-col">
            <div className="flex items-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive && !isExpanded ? bgColorClass : "hover:bg-accent",
                    isActive && !isExpanded ? "text-white" : "text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? bgColorClass : "hover:bg-accent",
                    isActive ? "text-white" : "text-foreground",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )}
            </div>

            {/* Render children if expanded */}
            {hasChildren && isExpanded && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                {item
                  .children!.filter((child) => child.roles.includes(role))
                  .map((child) => {
                    const isChildActive = isPathActive(child.href)
                    const childBgColorClass = getBgColorByRole(role, isChildActive)

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isChildActive ? childBgColorClass : "hover:bg-accent",
                          isChildActive ? "text-white" : "text-foreground",
                        )}
                      >
                        {child.icon}
                        {child.title}
                      </Link>
                    )
                  })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Function to get background color based on user role and active state
function getBgColorByRole(role: string, isActive: boolean): string {
  if (!isActive) return "transparent"

  switch (role) {
    case "SUPER_ADMIN":
      return "bg-[#1a365d]"
    case "BUILDING_MANAGER":
      return "bg-[#2563eb]"
    case "SERVICE_MANAGER":
      return "bg-[#059669]"
    case "FINANCIAL_MANAGER":
      return "bg-[#f97316]"
    case "CUSTOMER_SERVICE":
      return "bg-[#7c3aed]"
    case "TENANT":
      return "bg-[#0ea5e9]"
    default:
      return "bg-primary"
  }
}
