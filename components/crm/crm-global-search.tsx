"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2Icon,
  CheckSquareIcon,
  KanbanIcon,
  SearchIcon,
  SparklesIcon,
  UserPlusIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  GLOBAL_SEARCH_GROUP_LABELS,
  GLOBAL_SEARCH_GROUP_ORDER,
  buildGlobalSearchItems,
  type GlobalSearchItem,
} from "@/lib/crm/global-search-items"
import { getVisibleNavItems } from "@/lib/rbac/nav-items"
import { filterByScope } from "@/lib/rbac/scope"
import type { LucideIcon } from "lucide-react"

const KIND_ICONS: Record<GlobalSearchItem["kind"], LucideIcon> = {
  page: SearchIcon,
  action: SparklesIcon,
  client: Building2Icon,
  opportunity: KanbanIcon,
  lead: UserPlusIcon,
  task: CheckSquareIcon,
}

type CrmGlobalSearchProps = {
  className?: string
}

export function CrmGlobalSearch({ className }: CrmGlobalSearchProps) {
  const router = useRouter()
  const { user } = useSession()
  const { clients, opportunities, leads, tasks } = useDemoData()
  const [open, setOpen] = React.useState(false)

  const allItems = React.useMemo(() => {
    if (!user) return []
    const navItems = getVisibleNavItems(user)
    const scopedClients = filterByScope(clients, user)
    const scopedOpportunities = filterByScope(opportunities, user)
    const scopedLeads = filterByScope(leads, user)
    const scopedTasks = filterByScope(tasks, user)
    return buildGlobalSearchItems(
      navItems,
      scopedClients,
      scopedOpportunities,
      scopedLeads,
      scopedTasks,
    )
  }, [user, clients, opportunities, leads, tasks])

  const grouped = React.useMemo(() => {
    const map = new Map<GlobalSearchItem["kind"], GlobalSearchItem[]>()
    for (const item of allItems) {
      const list = map.get(item.kind) ?? []
      list.push(item)
      map.set(item.kind, list)
    }
    return map
  }, [allItems])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function handleSelect(href: string) {
    setOpen(false)
    router.push(href)
  }

  if (!user) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otwórz wyszukiwarkę globalną"
        className={cn("hidden w-full min-w-0 sm:block", className)}
      >
        <InputGroup className="h-9 min-h-9 cursor-pointer bg-background transition-colors hover:bg-muted/30">
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupText className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            Szukaj stron, klientów, deali…
          </InputGroupText>
          <InputGroupAddon align="inline-end" className="hidden lg:flex">
            <kbd className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </InputGroupAddon>
        </InputGroup>
      </button>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0 sm:hidden"
        aria-label="Szukaj"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Wyszukiwarka globalna"
        description="Nawigacja po stronach, akcjach i rekordach w Twoim zakresie"
        className="sm:max-w-xl"
      >
        <Command shouldFilter>
          <CommandInput
            placeholder="Szukaj stron, klientów, deali, leadów, zadań…"
            className="text-sm"
          />
          <CommandList>
            <CommandEmpty>Brak wyników.</CommandEmpty>
            {GLOBAL_SEARCH_GROUP_ORDER.map((kind) => {
              const items = grouped.get(kind)
              if (!items?.length) return null
              return (
                <CommandGroup
                  key={kind}
                  heading={GLOBAL_SEARCH_GROUP_LABELS[kind]}
                >
                  {items.map((item) => {
                    const Icon = KIND_ICONS[kind]
                    return (
                      <CommandItem
                        key={`${kind}-${item.id}`}
                        value={`${item.label} ${item.keywords}`}
                        onSelect={() => handleSelect(item.href)}
                      >
                        <Icon />
                        <span className="truncate">{item.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
