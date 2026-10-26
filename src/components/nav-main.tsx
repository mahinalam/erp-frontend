"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { ChevronRightIcon } from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const pathname = usePathname()

  const isCurrentPath = (url: string) =>
    pathname === url ||
    (url !== "/dashboard" &&
      pathname.startsWith(url + "/"))

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Main Menu
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon
          const hasSubmenu = Boolean(item.items?.length)

          const isActive =
            isCurrentPath(item.url) ||
            (item.items?.some((sub) =>
              isCurrentPath(sub.url)
            ) ?? false)

          // Normal menu item
          if (!hasSubmenu) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link href={item.url}>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Menu item with submenu
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive || item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    {Icon && <Icon />}

                    <span>{item.title}</span>

                    <ChevronRightIcon
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                      >
                        <SidebarMenuSubButton
                          asChild
                          isActive={isCurrentPath(
                            subItem.url
                          )}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

