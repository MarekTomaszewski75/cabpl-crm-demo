import type { DemoUser, UserRole } from "@/types/crm"

/** Identyfikatory pozycji sidebaru. */
export type NavItemId =
  | "today"
  | "employees"
  | "companyStructure"
  | "tasks"
  | "teamActivities"
  | "leads"
  | "pipeline"
  | "contacts"
  | "clients"
  | "products"
  | "analytics"
  | "calendar"
  | "compliance"

const ALL_ROLES: UserRole[] = ["advisor", "regional_manager", "executive"]

export interface CrmNavItem {
  id: NavItemId
  labelPl: string
  href: string
  roles: UserRole[]
}

export type CrmNavGroup = {
  type: "group"
  /** Wyświetlany w UPPERCASE w sidebarze. */
  labelPl: string
  items: CrmNavItem[]
}

export type CrmNavEntry =
  | { type: "item"; item: CrmNavItem }
  | CrmNavGroup

const NAV_ITEM_BY_ID = new Map<NavItemId, CrmNavItem>()

function defineNavItem(config: CrmNavItem): CrmNavItem {
  NAV_ITEM_BY_ID.set(config.id, config)
  return config
}

const today = defineNavItem({
  id: "today",
  labelPl: "Dziś",
  href: "/today",
  roles: ["advisor"],
})

const calendar = defineNavItem({
  id: "calendar",
  labelPl: "Kalendarz",
  href: "/calendar",
  roles: ["advisor", "regional_manager"],
})

const teamActivities = defineNavItem({
  id: "teamActivities",
  labelPl: "Aktywność zespołu",
  href: "/activities",
  roles: ["regional_manager"],
})

defineNavItem({
  id: "employees",
  labelPl: "Pracownicy",
  href: "/employees",
  roles: ALL_ROLES,
})

defineNavItem({
  id: "companyStructure",
  labelPl: "Struktura firmy",
  href: "/company-structure",
  roles: ALL_ROLES,
})

const tasks = defineNavItem({
  id: "tasks",
  labelPl: "Zadania",
  href: "/tasks",
  roles: ["advisor", "regional_manager"],
})

const leads = defineNavItem({
  id: "leads",
  labelPl: "Leady",
  href: "/leads",
  roles: ALL_ROLES,
})

const pipeline = defineNavItem({
  id: "pipeline",
  labelPl: "Deale",
  href: "/pipeline",
  roles: ALL_ROLES,
})

const contacts = defineNavItem({
  id: "contacts",
  labelPl: "Kontakty",
  href: "/contacts",
  roles: ALL_ROLES,
})

const clients = defineNavItem({
  id: "clients",
  labelPl: "Firmy",
  href: "/clients",
  roles: ALL_ROLES,
})

const products = defineNavItem({
  id: "products",
  labelPl: "Produkty",
  href: "/products",
  roles: ALL_ROLES,
})

const analytics = defineNavItem({
  id: "analytics",
  labelPl: "Analityka",
  href: "/dashboard",
  roles: ["executive", "regional_manager"],
})

defineNavItem({
  id: "compliance",
  labelPl: "Zgodność i roadmapa",
  href: "/compliance",
  roles: ALL_ROLES,
})

/** Moduły poza widoczną nawigacją prezentacji (trasy i breadcrumb nadal działają). */
export const PRESENTATION_HIDDEN_NAV_IDS: readonly NavItemId[] = [
  "employees",
  "companyStructure",
]

/** Kolejność sidebara (EXP-001; US-24: bez grupy „Firma i ludzie”). */
export const CRM_NAV_STRUCTURE: readonly CrmNavEntry[] = [
  { type: "item", item: today },
  { type: "item", item: calendar },
  { type: "item", item: teamActivities },
  { type: "item", item: tasks },
  {
    type: "group",
    labelPl: "CRM i sprzedaż",
    items: [leads, pipeline, contacts, clients, products],
  },
  { type: "item", item: analytics },
]

/** Płaska lista (breadcrumb, wyszukiwarka). */
export const CRM_NAV_ITEMS: readonly CrmNavItem[] = Array.from(
  NAV_ITEM_BY_ID.values(),
)

export function canSeeNavItem(id: NavItemId, user: DemoUser): boolean {
  const navItem = NAV_ITEM_BY_ID.get(id)
  if (!navItem) return false
  return navItem.roles.includes(user.role)
}

export function getVisibleNavItems(user: DemoUser): CrmNavItem[] {
  return CRM_NAV_ITEMS.filter((entry) => canSeeNavItem(entry.id, user))
}

function filterGroup(group: CrmNavGroup, user: DemoUser): CrmNavGroup | null {
  const items = group.items.filter((i) => canSeeNavItem(i.id, user))
  if (items.length === 0) return null
  return { ...group, items }
}

export function getVisibleNavStructure(user: DemoUser): CrmNavEntry[] {
  const result: CrmNavEntry[] = []
  for (const entry of CRM_NAV_STRUCTURE) {
    if (entry.type === "item") {
      if (canSeeNavItem(entry.item.id, user)) {
        result.push(entry)
      }
    } else {
      const group = filterGroup(entry, user)
      if (group) result.push(group)
    }
  }

  if (user.role === "executive") {
    const analyticsIndex = result.findIndex(
      (entry) => entry.type === "item" && entry.item.id === "analytics",
    )
    if (analyticsIndex > 0) {
      const [analyticsEntry] = result.splice(analyticsIndex, 1)
      result.unshift(analyticsEntry)
    }
  }

  return result
}

export function getNavItemByHref(pathname: string): CrmNavItem | undefined {
  if (pathname.startsWith("/clients/")) {
    return NAV_ITEM_BY_ID.get("clients")
  }
  return CRM_NAV_ITEMS.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
}
