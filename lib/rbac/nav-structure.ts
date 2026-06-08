import type { DemoUser, UserRole } from "@/types/crm"

/** Identyfikatory pozycji sidebaru. */
export type NavItemId =
  | "today"
  | "employees"
  | "companyStructure"
  | "tasks"
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

const employees = defineNavItem({
  id: "employees",
  labelPl: "Pracownicy",
  href: "/employees",
  roles: ALL_ROLES,
})

const companyStructure = defineNavItem({
  id: "companyStructure",
  labelPl: "Struktura firmy",
  href: "/company-structure",
  roles: ALL_ROLES,
})

const tasks = defineNavItem({
  id: "tasks",
  labelPl: "Zadania",
  href: "/tasks",
  roles: ALL_ROLES,
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
  id: "calendar",
  labelPl: "Kalendarz",
  href: "/calendar",
  roles: ALL_ROLES,
})

defineNavItem({
  id: "compliance",
  labelPl: "Zgodność i roadmapa",
  href: "/compliance",
  roles: ALL_ROLES,
})

/** Kolejność sidebara (EXP-001 + EXP-003). */
export const CRM_NAV_STRUCTURE: readonly CrmNavEntry[] = [
  { type: "item", item: today },
  {
    type: "group",
    labelPl: "Firma i ludzie",
    items: [employees, companyStructure],
  },
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
