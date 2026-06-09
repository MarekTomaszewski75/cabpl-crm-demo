"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CrmBannerController } from "@/components/crm/crm-banner-controller"
import { CreditAgricoleLogo } from "@/components/crm/credit-agricole-logo"
import { CrmGlobalSearch } from "@/components/crm/crm-global-search"
import { CrmNotificationsBell } from "@/components/crm/crm-notifications-bell"
import { CrmSidebarNav } from "@/components/crm/crm-sidebar-nav"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Banners } from "@/components/ui/banner"
import { useSession } from "@/lib/auth/demo-session"
import {
  getNavItemByHref,
  getVisibleNavStructure,
} from "@/lib/rbac/nav-structure"

function userInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getBreadcrumbSegments(
  pathname: string
): { label: string; href?: string }[] {
  if (pathname === "/") {
    return [{ label: "CRM" }]
  }

  const segments: { label: string; href?: string }[] = [
    { label: "CRM", href: "/" },
  ]

  if (pathname.startsWith("/clients/") && pathname !== "/clients") {
    segments.push({ label: "Firmy", href: "/clients" })
    segments.push({ label: "Szczegóły firmy" })
    return segments
  }

  const navItem = getNavItemByHref(pathname)
  if (navItem) {
    segments.push({ label: navItem.labelPl })
    return segments
  }

  const fallback = pathname.split("/").filter(Boolean).pop() ?? "Moduł"
  segments.push({ label: fallback })
  return segments
}

function CrmAppHeader({ pathname }: { pathname: string }) {
  const router = useRouter()
  const { user, logout } = useSession()
  const segments = getBreadcrumbSegments(pathname)

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1
            return (
              <React.Fragment key={`${segment.label}-${index}`}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {isLast || !segment.href ? (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href}>{segment.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <CrmGlobalSearch className="min-w-0 flex-1 sm:max-w-xs md:max-w-sm lg:max-w-md" />
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <CrmNotificationsBell />
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/15 font-semibold text-foreground">
            {userInitials(user.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col sm:flex">
          <span className="text-sm font-medium leading-none">
            {user.displayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.roleLabelPl}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout()
            router.replace("/login")
          }}
        >
          Wyloguj
        </Button>
      </div>
    </header>
  )
}

type CrmAppShellProps = {
  children: React.ReactNode
}

export function CrmAppShell({ children }: CrmAppShellProps) {
  const pathname = usePathname()
  const { user } = useSession()

  if (!user) return null

  const navStructure = getVisibleNavStructure(user)

  return (
    <SidebarProvider className="h-svh max-h-svh overflow-hidden">
      <Sidebar collapsible="offcanvas" className="border-sidebar-border">
        <SidebarHeader className="gap-3 p-4">
          <CreditAgricoleLogo />
          <p className="text-xs leading-snug text-sidebar-foreground/90">
            CRM Korporacyjny — Demo
          </p>
        </SidebarHeader>
        <SidebarContent>
          <CrmSidebarNav structure={navStructure} pathname={pathname} />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Badge variant="outline" className="w-fit">
            Demo
          </Badge>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex h-svh max-h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <CrmAppHeader pathname={pathname} />
        <Banners side="top" maxVisible={2} strategy="static">
          <CrmBannerController />
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-y-contain p-6">
            {children}
          </div>
        </Banners>
      </SidebarInset>
    </SidebarProvider>
  )
}
