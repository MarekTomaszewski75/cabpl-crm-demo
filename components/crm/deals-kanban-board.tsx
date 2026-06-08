"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { toast } from "sonner"
import { DealFinishDialog } from "@/components/crm/deal-finish-dialog"
import { DealKanbanCard } from "@/components/crm/deal-kanban-card"
import { DealKanbanColumn } from "@/components/crm/deal-kanban-column"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import {
  DEAL_KANBAN_COLUMN_LABELS,
  DEAL_KANBAN_STATUSES,
} from "@/lib/crm/deal-kanban"
import {
  isDealWorkflowStatusChange,
  requiresDealFinishDialog,
} from "@/lib/crm/deal-status-transition"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client, Deal, DealStatus, DemoUser } from "@/types/crm"

type DealsKanbanBoardProps = {
  deals: Deal[]
  onAddDeal?: () => void
}

export function DealsKanbanBoard({ deals, onAddDeal }: DealsKanbanBoardProps) {
  const router = useRouter()
  const { user } = useSession()
  const { deals: allDeals, users, clients, updateDeal, addDealActivity } =
    useDemoData()
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [finishDealId, setFinishDealId] = React.useState<string | null>(null)
  const [finishMode, setFinishMode] = React.useState<"won" | "lost" | undefined>(
    undefined,
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const ownerById = React.useMemo(
    () => new Map(users.map((u: DemoUser) => [u.id, u])),
    [users],
  )

  const clientById = React.useMemo(
    () => new Map(clients.map((c: Client) => [c.id, c])),
    [clients],
  )

  const dealsByStatus = React.useMemo(() => {
    const grouped = new Map<DealStatus, Deal[]>()
    for (const status of DEAL_KANBAN_STATUSES) {
      grouped.set(status, [])
    }
    for (const deal of deals) {
      grouped.get(deal.status)?.push(deal)
    }
    for (const status of DEAL_KANBAN_STATUSES) {
      const list = grouped.get(status) ?? []
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
    return grouped
  }, [deals])

  const activeDeal = activeId
    ? deals.find((deal) => deal.id === activeId)
    : undefined

  const finishDeal = finishDealId
    ? allDeals.find((deal) => deal.id === finishDealId)
    : undefined

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || !user) return

    const newStatus = String(over.id) as DealStatus
    if (!DEAL_KANBAN_STATUSES.includes(newStatus)) return

    const dealId = String(active.id)
    const deal = deals.find((item) => item.id === dealId)
    if (!deal || deal.status === newStatus) return

    if (requiresDealFinishDialog(newStatus, deal.status)) {
      setFinishDealId(dealId)
      setFinishMode(newStatus)
      return
    }

    if (isDealWorkflowStatusChange(newStatus, deal.status)) {
      const previousStatus = deal.status
      updateDeal(dealId, { status: newStatus })
      addDealActivity(dealId, "deal_status_changed", user, {
        note: `${DEAL_STATUS_LABELS[previousStatus]} → ${DEAL_STATUS_LABELS[newStatus]}`,
      })
      toast.success(
        `Przeniesiono do „${DEAL_KANBAN_COLUMN_LABELS[newStatus]}”`,
      )
      return
    }

    toast.message("Nie można zmienić statusu", {
      description:
        "Deale zakończone (Wygrany / Utracony) nie mogą wrócić do wcześniejszego etapu w demo.",
    })
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleFinishOpenChange(open: boolean) {
    if (!open) {
      setFinishDealId(null)
      setFinishMode(undefined)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-xl bg-muted/30 p-3 ring-1 ring-border/50">
          <div className="flex w-max items-stretch gap-0 pb-1">
            {DEAL_KANBAN_STATUSES.map((status) => (
              <DealKanbanColumn
                key={status}
                status={status}
                deals={dealsByStatus.get(status) ?? []}
                ownerById={ownerById}
                clientById={clientById}
                onAddDeal={status === "new" ? onAddDeal : undefined}
                onOpenDeal={(deal) => router.push(`/pipeline/${deal.id}`)}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal ? (
            <DealKanbanCard
              deal={activeDeal}
              status={activeDeal.status}
              owner={ownerById.get(activeDeal.ownerId)}
              client={
                activeDeal.clientId
                  ? clientById.get(activeDeal.clientId)
                  : undefined
              }
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {finishDeal ? (
        <DealFinishDialog
          deal={finishDeal}
          open={finishDealId !== null}
          onOpenChange={handleFinishOpenChange}
          defaultMode={finishMode}
        />
      ) : null}
    </div>
  )
}
