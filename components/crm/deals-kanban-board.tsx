"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DragEndEvent } from "@dnd-kit/core"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { DealFinishDialog } from "@/components/crm/deal-finish-dialog"
import { DealKanbanCard } from "@/components/crm/deal-kanban-card"
import { Button } from "@/components/ui/button"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import {
  DEAL_KANBAN_COLUMN_LABELS,
  DEAL_KANBAN_STATUSES,
} from "@/lib/crm/deal-kanban"
import {
  isDealWorkflowStatusChange,
  requiresDealFinishDialog,
} from "@/lib/crm/deal-status-transition"
import { buildDealEngagementCountMap } from "@/lib/crm/deal-engagement-counts"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client, Deal, DealStatus, DemoUser } from "@/types/crm"

type DealsKanbanBoardProps = {
  deals: Deal[]
  onAddDeal?: () => void
}

function buildDealColumns(deals: Deal[]): Record<DealStatus, Deal[]> {
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
  return Object.fromEntries(
    DEAL_KANBAN_STATUSES.map((status) => [status, grouped.get(status) ?? []]),
  ) as Record<DealStatus, Deal[]>
}

function findDealColumn(
  dealId: string,
  columns: Record<DealStatus, Deal[]>,
): DealStatus | null {
  for (const status of DEAL_KANBAN_STATUSES) {
    if (columns[status]?.some((deal) => deal.id === dealId)) {
      return status
    }
  }
  return null
}

export function DealsKanbanBoard({ deals, onAddDeal }: DealsKanbanBoardProps) {
  const router = useRouter()
  const { user } = useSession()
  const {
    deals: allDeals,
    users,
    clients,
    tasks,
    meetings,
    dealDocuments,
    updateDeal,
    addDealActivity,
  } = useDemoData()
  const [columns, setColumns] = React.useState(() => buildDealColumns(deals))
  const [finishDealId, setFinishDealId] = React.useState<string | null>(null)
  const [finishMode, setFinishMode] = React.useState<"won" | "lost" | undefined>(
    undefined,
  )

  React.useEffect(() => {
    setColumns(buildDealColumns(deals))
  }, [deals])

  const ownerById = React.useMemo(
    () => new Map(users.map((u: DemoUser) => [u.id, u])),
    [users],
  )

  const clientById = React.useMemo(
    () => new Map(clients.map((c: Client) => [c.id, c])),
    [clients],
  )

  const dealById = React.useMemo(
    () => new Map(deals.map((deal) => [deal.id, deal])),
    [deals],
  )

  const engagementByDealId = React.useMemo(
    () =>
      buildDealEngagementCountMap(
        deals.map((deal) => deal.id),
        { tasks, meetings, dealDocuments },
      ),
    [deals, tasks, meetings, dealDocuments],
  )

  const finishDeal = finishDealId
    ? allDeals.find((deal) => deal.id === finishDealId)
    : undefined

  const handleMove = React.useCallback(
    (event: DragEndEvent & { activeIndex: number; overIndex: number }) => {
      if (!user) {
        setColumns(buildDealColumns(deals))
        return
      }

      const dealId = String(event.active.id)
      const deal = dealById.get(dealId)
      if (!deal) {
        setColumns(buildDealColumns(deals))
        return
      }

      setColumns((currentColumns) => {
        const newStatus = findDealColumn(dealId, currentColumns)
        if (!newStatus || newStatus === deal.status) {
          return buildDealColumns(deals)
        }

        if (requiresDealFinishDialog(newStatus, deal.status)) {
          setFinishDealId(dealId)
          setFinishMode(newStatus)
          return buildDealColumns(deals)
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
          return currentColumns
        }

        toast.message("Nie można zmienić statusu", {
          description:
            "Deale zakończone (Wygrany / Utracony) nie mogą wrócić do wcześniejszego etapu w demo.",
        })
        return buildDealColumns(deals)
      })
    },
    [user, dealById, deals, updateDeal, addDealActivity],
  )

  function handleFinishOpenChange(open: boolean) {
    if (!open) {
      setFinishDealId(null)
      setFinishMode(undefined)
    }
  }

  return (
    <>
      <Kanban
        value={columns}
        getItemValue={(deal) => deal.id}
        onValueChange={setColumns}
        onMove={handleMove}
        orientation="horizontal"
      >
        <KanbanBoard className="min-w-0 overflow-x-auto">
          {DEAL_KANBAN_STATUSES.map((status) => {
            const columnDeals = columns[status] ?? []
            return (
              <KanbanColumn
                key={status}
                value={status}
                className="w-72 shrink-0"
              >
                <div className="flex items-center justify-between gap-2 text-sm font-medium">
                  <span>{DEAL_KANBAN_COLUMN_LABELS[status]}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {columnDeals.length}
                  </span>
                </div>

                {columnDeals.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    Upuść deal tutaj
                  </p>
                ) : (
                  columnDeals.map((deal) => (
                    <KanbanItem key={deal.id} value={deal.id}>
                      <DealKanbanCard
                        deal={deal}
                        status={status}
                        owner={ownerById.get(deal.ownerId)}
                        client={
                          deal.clientId
                            ? clientById.get(deal.clientId)
                            : undefined
                        }
                        engagement={
                          engagementByDealId.get(deal.id) ?? {
                            tasks: 0,
                            meetings: 0,
                            documents: 0,
                          }
                        }
                        onOpen={() => router.push(`/pipeline/${deal.id}`)}
                      />
                    </KanbanItem>
                  ))
                )}

                {onAddDeal && status === "new" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={onAddDeal}
                  >
                    <PlusIcon data-icon="inline-start" />
                    Dodaj
                  </Button>
                ) : null}
              </KanbanColumn>
            )
          })}
        </KanbanBoard>

        <KanbanOverlay>
          {({ value }) => {
            const deal = dealById.get(String(value))
            if (!deal) return null
            const overlayStatus =
              findDealColumn(deal.id, columns) ?? deal.status
            return (
              <DealKanbanCard
                deal={deal}
                status={overlayStatus}
                owner={ownerById.get(deal.ownerId)}
                client={
                  deal.clientId ? clientById.get(deal.clientId) : undefined
                }
                engagement={
                  engagementByDealId.get(deal.id) ?? {
                    tasks: 0,
                    meetings: 0,
                    documents: 0,
                  }
                }
                isDragOverlay
              />
            )
          }}
        </KanbanOverlay>
      </Kanban>

      {finishDeal ? (
        <DealFinishDialog
          deal={finishDeal}
          open={finishDealId !== null}
          onOpenChange={handleFinishOpenChange}
          defaultMode={finishMode}
        />
      ) : null}
    </>
  )
}
