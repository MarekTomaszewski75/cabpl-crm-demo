"use client"

import { useDroppable } from "@dnd-kit/core"
import { PlusIcon } from "lucide-react"
import { DealKanbanCard } from "@/components/crm/deal-kanban-card"
import { Button } from "@/components/ui/button"
import {
  DEAL_KANBAN_COLUMN_LABELS,
  DEAL_KANBAN_THEME,
} from "@/lib/crm/deal-kanban"
import { cn } from "@/lib/utils"
import type { Client, DemoUser, Deal, DealStatus } from "@/types/crm"

type DealKanbanColumnProps = {
  status: DealStatus
  deals: Deal[]
  ownerById: Map<string, DemoUser>
  clientById: Map<string, Client>
  onAddDeal?: () => void
  onOpenDeal: (deal: Deal) => void
}

export function DealKanbanColumn({
  status,
  deals,
  ownerById,
  clientById,
  onAddDeal,
  onOpenDeal,
}: DealKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const theme = DEAL_KANBAN_THEME[status]
  const label = DEAL_KANBAN_COLUMN_LABELS[status]

  return (
    <div className="mr-1.5 flex w-[17rem] shrink-0 flex-col overflow-hidden rounded-xl ring-1 ring-border/70 last:mr-0 sm:w-[18.5rem]">
      <div
        className={cn(
          "relative shrink-0 px-3 py-2.5",
          theme.header,
          "after:absolute after:top-0 after:right-0 after:h-full after:w-2 after:translate-x-full after:bg-inherit after:content-['']",
        )}
      >
        <h2 className="text-sm font-semibold leading-tight">
          {label}
          <span
            className={cn(
              "ml-2 inline-flex size-5 items-center justify-center rounded-full text-[0.6875rem] font-medium tabular-nums",
              theme.countBadge,
            )}
          >
            {deals.length}
          </span>
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex max-h-[min(65vh,640px)] min-h-48 flex-1 flex-col gap-2 overflow-y-auto p-2",
          theme.body,
          isOver && "ring-2 ring-inset ring-primary/45",
        )}
      >
        {deals.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">
            Upuść deal tutaj
          </p>
        ) : (
          deals.map((deal) => (
            <DealKanbanCard
              key={deal.id}
              deal={deal}
              status={status}
              owner={ownerById.get(deal.ownerId)}
              client={
                deal.clientId ? clientById.get(deal.clientId) : undefined
              }
              onOpen={() => onOpenDeal(deal)}
            />
          ))
        )}
      </div>

      {onAddDeal ? (
        <div className="shrink-0 border-t border-border/50 p-2">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full border border-dashed border-border/80 text-muted-foreground hover:bg-muted/50"
            onClick={onAddDeal}
          >
            <PlusIcon data-icon="inline-start" />
            Dodaj
          </Button>
        </div>
      ) : null}
    </div>
  )
}
