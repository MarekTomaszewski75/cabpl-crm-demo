"use client"

import {
  Building2Icon,
  CalendarIcon,
  GripVerticalIcon,
  LogInIcon,
  MoreVerticalIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
import { LeadEngagementIndicators } from "@/components/crm/lead-engagement-indicators"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KanbanItemHandle } from "@/components/ui/kanban"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DEAL_SOURCE_LABELS, isTerminalDealStatus } from "@/lib/crm/deal-labels"
import { DEAL_KANBAN_THEME } from "@/lib/crm/deal-kanban"
import type { DealEngagementCounts } from "@/lib/crm/deal-engagement-counts"
import { formatCurrencyPln, formatDatePl, formatTimePl } from "@/lib/format/pl"
import { cn } from "@/lib/utils"
import type { Client, DemoUser, Deal, DealStatus } from "@/types/crm"

type DealKanbanCardProps = {
  deal: Deal
  status: DealStatus
  owner?: DemoUser
  client?: Client
  engagement: DealEngagementCounts
  isDragOverlay?: boolean
  onOpen?: () => void
}

export function DealKanbanCard({
  deal,
  status,
  owner,
  client,
  engagement,
  isDragOverlay = false,
  onOpen,
}: DealKanbanCardProps) {
  const theme = DEAL_KANBAN_THEME[status]
  const dragDisabled = isDragOverlay || isTerminalDealStatus(deal.status)

  function handleOpen() {
    if (isDragOverlay) return
    onOpen?.()
  }

  return (
    <article
      onClick={handleOpen}
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-border/80 bg-card p-3 shadow-sm",
        "border-l-4",
        theme.accent,
        "cursor-pointer",
        isDragOverlay && "rotate-1 shadow-lg ring-2 ring-primary/35",
      )}
    >
      <div className="flex items-start gap-1">
        {!dragDisabled ? (
          <KanbanItemHandle
            className="mt-0.5 shrink-0 rounded-sm p-0.5 text-muted-foreground hover:bg-muted"
            aria-label="Przeciągnij deal"
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
          >
            <GripVerticalIcon />
          </KanbanItemHandle>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug">
              {deal.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  aria-label="Menu deala"
                  onClick={(event) => event.stopPropagation()}
                  onDoubleClick={(event) => event.stopPropagation()}
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={handleOpen}>
                    Otwórz deal
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {client ? (
            <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <Building2Icon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{client.name}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {deal.source ? (
          <span className="inline-flex items-center gap-1">
            <LogInIcon className="size-3.5 shrink-0" aria-hidden />
            {DEAL_SOURCE_LABELS[deal.source]}
          </span>
        ) : null}
        {deal.amount !== null ? (
          <span className="font-medium tabular-nums text-foreground">
            {formatCurrencyPln(deal.amount)}
          </span>
        ) : null}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <time
            className="inline-flex w-fit items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
            dateTime={deal.createdAt}
            onClick={(event) => event.stopPropagation()}
          >
            <CalendarIcon className="size-3.5 shrink-0" aria-hidden />
            {formatDatePl(deal.createdAt)}, {formatTimePl(deal.createdAt)}
          </time>
        </TooltipTrigger>
        <TooltipContent>Data utworzenia deala</TooltipContent>
      </Tooltip>

      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <LeadEngagementIndicators
          counts={engagement}
          onItemClick={(event) => event.stopPropagation()}
        />
        {owner ? (
          <CrmUserHoverCard
            user={owner}
            onClick={(event) => event.stopPropagation()}
          />
        ) : null}
      </div>
    </article>
  )
}
