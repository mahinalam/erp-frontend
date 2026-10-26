"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Shirt,
  ClipboardList,
  Factory,
  Boxes,
  Truck,
  Package,
  ScanSearch,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Buyers",
    href: "/buyers",
    icon: Users,
  },

  {
    title: "Styles",
    href: "/styles",
    icon: Shirt,
  },

  {
    title: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },

  {
    title: "Production",
    href: "/production",
    icon: Factory,
  },

  {
    title: "Inventory",
    href: "/inventory",
    icon: Boxes,
  },

  {
    title: "Shipments",
    href: "/shipments",
    icon: Truck,
  },

  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Package,
  },

  {
    title: "Inspection",
    href: "/inspection",
    icon: ScanSearch,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-70 border-r bg-white dark:bg-zinc-950 flex flex-col">
      {/* LOGO */}
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
            <Factory className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight">Apparel ERP</h2>

            <p className="text-xs text-muted-foreground">
              Production Management
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",

                  isActive
                    ? "bg-black text-white shadow-lg dark:bg-white dark:text-black"
                    : "text-muted-foreground hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110",
                  )}
                />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </div>
    </aside>
  );
}
