import { PRESENTATION_HIDDEN_NAV_IDS } from "@/lib/rbac/nav-structure"
import type { CrmNavItem } from "@/lib/rbac/nav-items"
import type { Client, Deal, Lead, Task } from "@/types/crm"

const HIDDEN_SEARCH_NAV_IDS = new Set(PRESENTATION_HIDDEN_NAV_IDS)

export type GlobalSearchItem =
  | {
      kind: "page"
      id: string
      label: string
      keywords: string
      href: string
    }
  | {
      kind: "action"
      id: string
      label: string
      keywords: string
      href: string
    }
  | {
      kind: "client"
      id: string
      label: string
      keywords: string
      href: string
    }
  | {
      kind: "opportunity"
      id: string
      label: string
      keywords: string
      href: string
    }
  | {
      kind: "lead"
      id: string
      label: string
      keywords: string
      href: string
    }
  | {
      kind: "task"
      id: string
      label: string
      keywords: string
      href: string
    }

const ACTION_ITEMS: readonly Omit<GlobalSearchItem, "kind">[] = [
  {
    id: "action-new-task",
    label: "Nowe zadanie",
    keywords: "zadanie dodaj utwórz tasks",
    href: "/tasks",
  },
  {
    id: "action-new-meeting",
    label: "Nowe spotkanie",
    keywords: "spotkanie kalendarz meeting calendar",
    href: "/calendar",
  },
  {
    id: "action-new-lead",
    label: "Nowy lead",
    keywords: "lead prospekt dodaj leads",
    href: "/leads",
  },
  {
    id: "action-pipeline",
    label: "Otwórz lejek sprzedażowy",
    keywords: "lejek pipeline kanban szanse",
    href: "/pipeline",
  },
]

export function buildGlobalSearchItems(
  navItems: readonly CrmNavItem[],
  clients: readonly Client[],
  opportunities: readonly Deal[],
  leads: readonly Lead[],
  tasks: readonly Task[],
): GlobalSearchItem[] {
  const pages: GlobalSearchItem[] = navItems
    .filter((item) => !HIDDEN_SEARCH_NAV_IDS.has(item.id))
    .map((item) => ({
      kind: "page",
      id: `page-${item.id}`,
      label: item.labelPl,
      keywords: `${item.labelPl} ${item.href} nawigacja moduł`,
      href: item.href,
    }))

  const actions: GlobalSearchItem[] = ACTION_ITEMS.map((item) => ({
    kind: "action",
    ...item,
  }))

  const clientItems: GlobalSearchItem[] = clients.map((client) => ({
    kind: "client",
    id: client.id,
    label: client.name,
    keywords: `${client.name} ${client.nip} klient nip`,
    href: `/clients/${client.id}`,
  }))

  const opportunityItems: GlobalSearchItem[] = opportunities.map((opp) => ({
    kind: "opportunity",
    id: opp.id,
    label: opp.name,
    keywords: `${opp.name} deal deale pipeline`,
    href: `/pipeline/${opp.id}`,
  }))

  const leadItems: GlobalSearchItem[] = leads.map((lead) => ({
    kind: "lead",
    id: lead.id,
    label: lead.name,
    keywords: `${lead.name} ${lead.companyName} lead prospekt`,
    href: `/leads/${lead.id}`,
  }))

  const taskItems: GlobalSearchItem[] = tasks.map((task) => ({
    kind: "task",
    id: task.id,
    label: task.title,
    keywords: `${task.title} zadanie task`,
    href: "/tasks",
  }))

  return [
    ...pages,
    ...actions,
    ...clientItems,
    ...opportunityItems,
    ...leadItems,
    ...taskItems,
  ]
}

export const GLOBAL_SEARCH_GROUP_LABELS: Record<GlobalSearchItem["kind"], string> =
  {
    page: "Strony",
    action: "Akcje",
    client: "Klienci",
    opportunity: "Szanse",
    lead: "Leady",
    task: "Zadania",
  }

export const GLOBAL_SEARCH_GROUP_ORDER: GlobalSearchItem["kind"][] = [
  "page",
  "action",
  "client",
  "opportunity",
  "lead",
  "task",
]
