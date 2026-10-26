
"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Users,
  Building2,
  Shirt,
  ShoppingCart,
  Factory,
  Package,
  Truck,
  ClipboardCheck,
  Settings,
} from "lucide-react"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Buyers",
      url: "/dashboard/buyers",
      icon: Users,
    },
    {
      title: "Suppliers",
      url: "/dashboard/suppliers",
      icon: Building2,
    },
    {
      title: "Styles",
      url: "/dashboard/styles",
      icon: Shirt,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Production",
      url: "/dashboard/production",
      icon: Factory,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Package,
    },
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Truck,
    },
    {
      title: "Quality Inspection",
      url: "/dashboard/inspections",
      icon: ClipboardCheck,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ] as any,
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Factory className="size-5" />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">
              Garment ERP
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Management System
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

