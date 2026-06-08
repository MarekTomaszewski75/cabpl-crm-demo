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
import { LeadFinishDialog } from "@/components/crm/lead-finish-dialog"
import { LeadKanbanCard } from "@/components/crm/lead-kanban-card"
import { LeadKanbanColumn } from "@/components/crm/lead-kanban-column"
import { leadStatusChangeNote } from "@/lib/crm/lead-activity"
import {
  LEAD_KANBAN_COLUMN_LABELS,
  LEAD_KANBAN_STATUSES,
} from "@/lib/crm/lead-kanban"
import {
  isWorkflowStatusChange,
  requiresLeadFinishDialog,
} from "@/lib/crm/lead-status-transition"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { DemoUser, Lead, LeadStatus } from "@/types/crm"

type LeadsKanbanBoardProps = {
  leads: Lead[]
  onAddLead?: () => void
}

export function LeadsKanbanBoard({ leads, onAddLead }: LeadsKanbanBoardProps) {
  const router = useRouter()
  const { user } = useSession()
  const { leads: allLeads, users, updateLead, addLeadActivity } = useDemoData()
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [finishLeadId, setFinishLeadId] = React.useState<string | null>(null)
  const [finishTab, setFinishTab] = React.useState<"won" | "lost" | undefined>(
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

  const leadsByStatus = React.useMemo(() => {
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
    return grouped
  }, [leads])

  const activeLead = activeId
    ? leads.find((lead) => lead.id === activeId)
    : undefined

  const finishLead = finishLeadId
    ? allLeads.find((lead) => lead.id === finishLeadId)
    : undefined

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || !user) return

    const newStatus = String(over.id) as LeadStatus
    if (!LEAD_KANBAN_STATUSES.includes(newStatus)) return

    const leadId = String(active.id)
    const lead = leads.find((item) => item.id === leadId)
    if (!lead || lead.status === newStatus) return

    if (requiresLeadFinishDialog(newStatus, lead.status)) {
      setFinishLeadId(leadId)
      setFinishTab(newStatus)
      return
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
      return
    }

    toast.message("Nie można zmienić statusu", {
      description:
        "Leady zakończone (Wygrano / Niepowodzenie) nie mogą wrócić do wcześniejszego etapu w demo.",
    })
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleFinishOpenChange(open: boolean) {
    if (!open) {
      setFinishLeadId(null)
      setFinishTab(undefined)
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
            {LEAD_KANBAN_STATUSES.map((status) => (
              <LeadKanbanColumn
                key={status}
                status={status}
                leads={leadsByStatus.get(status) ?? []}
                ownerById={ownerById}
                onAddLead={status === "new" ? onAddLead : undefined}
                onOpenLead={(lead) => router.push(`/leads/${lead.id}`)}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeLead ? (
            <LeadKanbanCard
              lead={activeLead}
              status={activeLead.status}
              owner={ownerById.get(activeLead.ownerId)}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {finishLead ? (
        <LeadFinishDialog
          lead={finishLead}
          open={finishLeadId !== null}
          onOpenChange={handleFinishOpenChange}
          defaultTab={finishTab}
        />
      ) : null}
    </div>
  )
}
