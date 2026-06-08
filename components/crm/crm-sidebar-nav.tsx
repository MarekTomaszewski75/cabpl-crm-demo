"use client"

import Link from "next/link"
import {
  BoxesIcon,
  Building2Icon,
  CalendarIcon,
  ChartNoAxesCombinedIcon,
  CircleCheckBigIcon,
  ContactIcon,
  HandshakeIcon,
  NetworkIcon,
  ShieldCheckIcon,
  SunIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { CrmNavEntry, NavItemId } from "@/lib/rbac/nav-structure"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const NAV_ICONS: Record<NavItemId, LucideIcon> = {
  today: SunIcon,
  employees: UsersIcon,
  companyStructure: NetworkIcon,
  tasks: CircleCheckBigIcon,
  leads: UserPlusIcon,
  pipeline: HandshakeIcon,
  contacts: ContactIcon,
  clients: Building2Icon,
  products: BoxesIcon,
  analytics: ChartNoAxesCombinedIcon,
  calendar: CalendarIcon,
  compliance: ShieldCheckIcon,
}

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/clients") {
    return pathname === "/clients" || pathname.startsWith("/clients/")
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

type CrmSidebarNavProps = {
  structure: CrmNavEntry[]
  pathname: string
}

export function CrmSidebarNav({ structure, pathname }: CrmSidebarNavProps) {
  return (
    <>
      {structure.map((entry) => {
        if (entry.type === "item") {
          const { item } = entry
          const Icon = NAV_ICONS[item.id]
          const active = isNavItemActive(pathname, item.href)
          return (
            <SidebarGroup key={item.id}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        active &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground",
                      )}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.labelPl}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        }

        return (
          <SidebarGroup key={entry.labelPl}>
            <SidebarGroupLabel className="uppercase tracking-wide">
              {entry.labelPl}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {entry.items.map((item) => {
                  const Icon = NAV_ICONS[item.id]
                  const active = isNavItemActive(pathname, item.href)
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          active &&
                            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground",
                        )}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.labelPl}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      })}
    </>
  )
}
