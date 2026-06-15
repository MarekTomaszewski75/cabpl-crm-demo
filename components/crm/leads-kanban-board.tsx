"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DragEndEvent } from "@dnd-kit/core"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { LeadFinishDialog } from "@/components/crm/lead-finish-dialog"
import { LeadKanbanCard } from "@/components/crm/lead-kanban-card"
import { Button } from "@/components/ui/button"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban"
import { leadStatusChangeNote } from "@/lib/crm/lead-activity"
import {
  LEAD_KANBAN_COLUMN_LABELS,
  LEAD_KANBAN_STATUSES,
} from "@/lib/crm/lead-kanban"
import {
  isWorkflowStatusChange,
  requiresLeadFinishDialog,
} from "@/lib/crm/lead-status-transition"
import { buildLeadEngagementCountMap } from "@/lib/crm/lead-engagement-counts"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { DemoUser, Lead, LeadStatus } from "@/types/crm"

type LeadsKanbanBoardProps = {
  leads: Lead[]
  onAddLead?: () => void
}

function buildLeadColumns(leads: Lead[]): Record<LeadStatus, Lead[]> {
  const grouped = new Map<LeadStatus, Lead[]>()
  for (const status of LEAD_KANBAN_STATUSES) {
    grouped.set(status, [])
  }
  for (const lead of leads) {
    grouped.get(lead.status)?.push(lead)
  }
  for (const status of LEAD_KANBAN_STATUSES) {
    const list = grouped.get(status) ?? []
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }
  return Object.fromEntries(
    LEAD_KANBAN_STATUSES.map((status) => [status, grouped.get(status) ?? []]),
  ) as Record<LeadStatus, Lead[]>
}

function findLeadColumn(
  leadId: string,
  columns: Record<LeadStatus, Lead[]>,
): LeadStatus | null {
  for (const status of LEAD_KANBAN_STATUSES) {
    if (columns[status]?.some((lead) => lead.id === leadId)) {
      return status
    }
  }
  return null
}

export function LeadsKanbanBoard({ leads, onAddLead }: LeadsKanbanBoardProps) {
  const router = useRouter()
  const { user } = useSession()
  const {
    leads: allLeads,
    users,
    tasks,
    meetings,
    leadDocuments,
    leadFiles,
    updateLead,
    addLeadActivity,
  } = useDemoData()
  const [columns, setColumns] = React.useState(() => buildLeadColumns(leads))
  const [finishLeadId, setFinishLeadId] = React.useState<string | null>(null)
  const [finishTab, setFinishTab] = React.useState<"won" | "lost" | undefined>(
    undefined,
  )

  React.useEffect(() => {
    setColumns(buildLeadColumns(leads))
  }, [leads])

  const ownerById = React.useMemo(
    () => new Map(users.map((u: DemoUser) => [u.id, u])),
    [users],
  )

  const leadById = React.useMemo(
    () => new Map(leads.map((lead) => [lead.id, lead])),
    [leads],
  )

  const engagementByLeadId = React.useMemo(
    () =>
      buildLeadEngagementCountMap(
        leads.map((lead) => lead.id),
        { tasks, meetings, leadDocuments, leadFiles },
      ),
    [leads, tasks, meetings, leadDocuments, leadFiles],
  )

  const finishLead = finishLeadId
    ? allLeads.find((lead) => lead.id === finishLeadId)
    : undefined

  const handleMove = React.useCallback(
    (event: DragEndEvent & { activeIndex: number; overIndex: number }) => {
      if (!user) {
        setColumns(buildLeadColumns(leads))
        return
      }

      const leadId = String(event.active.id)
      const lead = leadById.get(leadId)
      if (!lead) {
        setColumns(buildLeadColumns(leads))
        return
      }

      setColumns((currentColumns) => {
        const newStatus = findLeadColumn(leadId, currentColumns)
        if (!newStatus || newStatus === lead.status) {
          return buildLeadColumns(leads)
        }

        if (requiresLeadFinishDialog(newStatus, lead.status)) {
          setFinishLeadId(leadId)
          setFinishTab(newStatus)
          return buildLeadColumns(leads)
        }

        if (isWorkflowStatusChange(newStatus, lead.status)) {
          const previousStatus = lead.status
          updateLead(leadId, { status: newStatus })
          addLeadActivity(leadId, "lead_status_changed", user, {
            note: leadStatusChangeNote(previousStatus, newStatus),
          })
          toast.success(
            `Przeniesiono do „${LEAD_KANBAN_COLUMN_LABELS[newStatus]}”`,
          )
          return currentColumns
        }

        toast.message("Nie można zmienić statusu", {
          description:
            "Leady zakończone (Wygrano / Niepowodzenie) nie mogą wrócić do wcześniejszego etapu w demo.",
        })
        return buildLeadColumns(leads)
      })
    },
    [user, leadById, leads, updateLead, addLeadActivity],
  )

  function handleFinishOpenChange(open: boolean) {
    if (!open) {
      setFinishLeadId(null)
      setFinishTab(undefined)
    }
  }

  return (
    <>
      <Kanban
        value={columns}
        getItemValue={(lead) => lead.id}
        onValueChange={setColumns}
        onMove={handleMove}
        orientation="horizontal"
      >
        <KanbanBoard className="min-w-0 overflow-x-auto">
          {LEAD_KANBAN_STATUSES.map((status) => {
            const columnLeads = columns[status] ?? []
            return (
              <KanbanColumn
                key={status}
                value={status}
                className="w-72 shrink-0"
              >
                <div className="flex items-center justify-between gap-2 text-sm font-medium">
                  <span>{LEAD_KANBAN_COLUMN_LABELS[status]}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {columnLeads.length}
                  </span>
                </div>

                {columnLeads.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    Upuść lead tutaj
                  </p>
                ) : (
                  columnLeads.map((lead) => (
                    <KanbanItem key={lead.id} value={lead.id}>
                      <LeadKanbanCard
                        lead={lead}
                        status={status}
                        owner={ownerById.get(lead.ownerId)}
                        engagement={
                          engagementByLeadId.get(lead.id) ?? {
                            tasks: 0,
                            meetings: 0,
                            documents: 0,
                          }
                        }
                        onOpen={() => router.push(`/leads/${lead.id}`)}
                      />
                    </KanbanItem>
                  ))
                )}

                {onAddLead && status === "new" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={onAddLead}
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
            const lead = leadById.get(String(value))
            if (!lead) return null
            const overlayStatus =
              findLeadColumn(lead.id, columns) ?? lead.status
            return (
              <LeadKanbanCard
                lead={lead}
                status={overlayStatus}
                owner={ownerById.get(lead.ownerId)}
                engagement={
                  engagementByLeadId.get(lead.id) ?? {
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

      {finishLead ? (
        <LeadFinishDialog
          lead={finishLead}
          open={finishLeadId !== null}
          onOpenChange={handleFinishOpenChange}
          defaultTab={finishTab}
        />
      ) : null}
    </>
  )
}
