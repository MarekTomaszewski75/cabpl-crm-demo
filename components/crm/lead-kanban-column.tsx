"use client"

import { useDroppable } from "@dnd-kit/core"
import { PlusIcon } from "lucide-react"
import { LeadKanbanCard } from "@/components/crm/lead-kanban-card"
import { Button } from "@/components/ui/button"
import { LEAD_KANBAN_COLUMN_LABELS, LEAD_KANBAN_THEME } from "@/lib/crm/lead-kanban"
import { cn } from "@/lib/utils"
import type { DemoUser, Lead, LeadStatus } from "@/types/crm"

type LeadKanbanColumnProps = {
  status: LeadStatus
  leads: Lead[]
  ownerById: Map<string, DemoUser>
  onAddLead?: () => void
  onOpenLead: (lead: Lead) => void
}

export function LeadKanbanColumn({
  status,
  leads,
  ownerById,
  onAddLead,
  onOpenLead,
}: LeadKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const theme = LEAD_KANBAN_THEME[status]
  const label = LEAD_KANBAN_COLUMN_LABELS[status]

  return (
    <div className="mr-1.5 flex w-[17rem] shrink-0 flex-col overflow-hidden rounded-xl ring-1 ring-border/70 last:mr-0 sm:w-[18.5rem]">
      <div
        className={cn(
          "relative shrink-0 px-3 py-2.5",
          theme.header,
          "after:absolute after:top-0 after:right-0 after:h-full after:w-2 after:translate-x-full after:bg-inherit after:content-['']",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold leading-tight">
            {label}
            <span
              className={cn(
                "ml-2 inline-flex size-5 items-center justify-center rounded-full text-[0.6875rem] font-medium tabular-nums",
                theme.countBadge,
              )}
            >
              {leads.length}
            </span>
          </h2>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex max-h-[min(65vh,640px)] min-h-48 flex-1 flex-col gap-2 overflow-y-auto p-2",
          theme.body,
          isOver && "ring-2 ring-inset ring-primary/45",
        )}
      >
        {leads.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">
            Upuść lead tutaj
          </p>
        ) : (
          leads.map((lead) => (
            <LeadKanbanCard
              key={lead.id}
              lead={lead}
              status={status}
              owner={ownerById.get(lead.ownerId)}
              onOpen={() => onOpenLead(lead)}
            />
          ))
        )}
      </div>

      {onAddLead ? (
        <div className="shrink-0 border-t border-border/50 p-2">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full border border-dashed border-border/80 text-muted-foreground hover:bg-muted/50"
            onClick={onAddLead}
          >
            <PlusIcon data-icon="inline-start" />
            Dodaj
          </Button>
        </div>
      ) : null}
    </div>
  )
}
