"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DragEndEvent } from "@dnd-kit/core"
import { BriefcaseIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { DealFinishDialog } from "@/components/crm/deal-finish-dialog"
import { DealKanbanCard } from "@/components/crm/deal-kanban-card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban"
import {
  getDealStatusLabel,
  getPipelineCategoryLabel,
} from "@/lib/crm/deal-pipeline-labels"
import type { PipelineCategoryId } from "@/lib/crm/deal-pipeline"
import {
  getDealKanbanColumnLabels,
  getDealKanbanStatuses,
  getDealKanbanTheme,
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
  pipelineCategoryId: PipelineCategoryId
  onAddDeal?: () => void
}

function buildDealColumns(
  deals: Deal[],
  pipelineCategoryId: PipelineCategoryId,
): Record<string, Deal[]> {
  const statuses = getDealKanbanStatuses(pipelineCategoryId)
  const grouped = new Map<string, Deal[]>()
  for (const status of statuses) {
    grouped.set(status, [])
  }
  for (const deal of deals) {
    const column = grouped.get(deal.status)
    if (column) {
      column.push(deal)
    }
  }
  for (const status of statuses) {
    const list = grouped.get(status) ?? []
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }
  return Object.fromEntries(
    statuses.map((status) => [status, grouped.get(status) ?? []]),
  )
}

function findDealColumn(
  dealId: string,
  columns: Record<string, Deal[]>,
  statuses: DealStatus[],
): DealStatus | null {
  for (const status of statuses) {
    if (columns[status]?.some((deal) => deal.id === dealId)) {
      return status
    }
  }
  return null
}

export function DealsKanbanBoard({
  deals,
  pipelineCategoryId,
  onAddDeal,
}: DealsKanbanBoardProps) {
  const router = useRouter()
  const { user } = useSession()
  const {
    deals: allDeals,
    users,
    clients,
    products,
    tasks,
    meetings,
    dealDocuments,
    updateDeal,
    addDealActivity,
  } = useDemoData()

  const kanbanStatuses = React.useMemo(
    () => getDealKanbanStatuses(pipelineCategoryId),
    [pipelineCategoryId],
  )

  const columnLabels = React.useMemo(
    () => getDealKanbanColumnLabels(pipelineCategoryId),
    [pipelineCategoryId],
  )

  const columnThemes = React.useMemo(
    () => getDealKanbanTheme(pipelineCategoryId),
    [pipelineCategoryId],
  )

  const [columns, setColumns] = React.useState(() =>
    buildDealColumns(deals, pipelineCategoryId),
  )
  const [finishDealId, setFinishDealId] = React.useState<string | null>(null)
  const [finishMode, setFinishMode] = React.useState<"won" | "lost" | undefined>(
    undefined,
  )

  React.useEffect(() => {
    setColumns(buildDealColumns(deals, pipelineCategoryId))
  }, [deals, pipelineCategoryId])

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
        setColumns(buildDealColumns(deals, pipelineCategoryId))
        return
      }

      const dealId = String(event.active.id)
      const deal = dealById.get(dealId)
      if (!deal) {
        setColumns(buildDealColumns(deals, pipelineCategoryId))
        return
      }

      setColumns((currentColumns) => {
        const newStatus = findDealColumn(
          dealId,
          currentColumns,
          kanbanStatuses,
        )
        if (!newStatus || newStatus === deal.status) {
          return buildDealColumns(deals, pipelineCategoryId)
        }

        if (requiresDealFinishDialog(newStatus)) {
          setFinishDealId(dealId)
          setFinishMode(newStatus)
          return buildDealColumns(deals, pipelineCategoryId)
        }

        if (
          isDealWorkflowStatusChange(
            deal.status,
            newStatus,
            pipelineCategoryId,
          )
        ) {
          const previousStatus = deal.status
          updateDeal(dealId, { status: newStatus })
          addDealActivity(dealId, "deal_status_changed", user, {
            note: `${getDealStatusLabel(previousStatus, pipelineCategoryId)} → ${getDealStatusLabel(newStatus, pipelineCategoryId)}`,
          })
          toast.success(
            `Przeniesiono do „${columnLabels[newStatus]}”`,
          )
          return currentColumns
        }

        toast.message("Nie można zmienić statusu", {
          description:
            "Deale zakończone (Wygrany / Utracony) nie mogą wrócić do wcześniejszego etapu w demo.",
        })
        return buildDealColumns(deals, pipelineCategoryId)
      })
    },
    [
      user,
      dealById,
      deals,
      pipelineCategoryId,
      kanbanStatuses,
      columnLabels,
      updateDeal,
      addDealActivity,
    ],
  )

  function handleFinishOpenChange(open: boolean) {
    if (!open) {
      setFinishDealId(null)
      setFinishMode(undefined)
    }
  }

  if (deals.length === 0) {
    const categoryLabel = getPipelineCategoryLabel(pipelineCategoryId)
    return (
      <Empty className="rounded-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BriefcaseIcon />
          </EmptyMedia>
          <EmptyTitle>
            Brak deali w kategorii {categoryLabel}
          </EmptyTitle>
          <EmptyDescription>
            Dodaj deal w tej linii produktowej lub wybierz inną kategorię.
          </EmptyDescription>
        </EmptyHeader>
        {onAddDeal ? (
          <Button type="button" onClick={onAddDeal}>
            <PlusIcon data-icon="inline-start" />
            Nowy deal
          </Button>
        ) : null}
      </Empty>
    )
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
          {kanbanStatuses.map((status) => {
            const columnDeals = columns[status] ?? []
            const theme = columnThemes[status]
            return (
              <KanbanColumn
                key={status}
                value={status}
                className="w-72 shrink-0"
              >
                <div
                  className={
                    theme
                      ? `flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-medium ${theme.header}`
                      : "flex items-center justify-between gap-2 text-sm font-medium"
                  }
                >
                  <span>{columnLabels[status]}</span>
                  <span
                    className={
                      theme
                        ? `tabular-nums ${theme.countBadge} rounded px-1.5 py-0.5 text-xs`
                        : "text-muted-foreground tabular-nums"
                    }
                  >
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
                        products={products}
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
              findDealColumn(deal.id, columns, kanbanStatuses) ?? deal.status
            return (
              <DealKanbanCard
                deal={deal}
                status={overlayStatus}
                owner={ownerById.get(deal.ownerId)}
                client={
                  deal.clientId ? clientById.get(deal.clientId) : undefined
                }
                products={products}
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
