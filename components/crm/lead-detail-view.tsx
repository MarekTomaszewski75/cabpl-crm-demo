"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldAlertIcon } from "lucide-react"
import {
  LeadActivityPanel,
  type LeadComposerTab,
} from "@/components/crm/lead-activity-panel"
import { LeadDetailHeader } from "@/components/crm/lead-detail-header"
import { LeadDetailSidebar } from "@/components/crm/lead-detail-sidebar"
import { LeadFinishDialog } from "@/components/crm/lead-finish-dialog"
import { LeadStatusBar } from "@/components/crm/lead-status-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@/lib/auth/demo-session"
import { leadStatusChangeNote } from "@/lib/crm/lead-activity"
import { LEAD_LOST_REASON_LABELS } from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"
import type { LeadStatus } from "@/types/crm"

type LeadDetailViewProps = {
  leadId: string
}

export type LeadEngagementSection = "meetings" | null

export function LeadDetailView({ leadId }: LeadDetailViewProps) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { leads, users, updateLead, addLeadActivity } = useDemoData()
  const [finishOpen, setFinishOpen] = React.useState(false)
  const [finishTab, setFinishTab] = React.useState<"won" | "lost" | undefined>(
    undefined,
  )
  const [composerTab, setComposerTab] = React.useState<LeadComposerTab>("note")
  const [engagementSection, setEngagementSection] =
    React.useState<LeadEngagementSection>(null)

  const lead = leads.find((l) => l.id === leadId)
  const owner = users.find((u) => u.id === lead?.ownerId)

  React.useEffect(() => {
    if (isReady && user && lead && !canAccessEntity(lead, user)) {
      router.replace("/leads")
    }
  }, [isReady, user, lead, router])

  function openFinish(tab?: "won" | "lost") {
    setFinishTab(tab)
    setFinishOpen(true)
  }

  function handleStatusChange(next: LeadStatus) {
    if (!lead || !user || lead.status === next) return
    const previous = lead.status
    updateLead(lead.id, { status: next })
    addLeadActivity(lead.id, "lead_status_changed", user, {
      note: leadStatusChangeNote(previous, next),
    })
  }

  if (!isReady || !user) {
    return null
  }

  if (!lead) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono leada</AlertTitle>
        <AlertDescription>
          Brak leada o podanym identyfikatorze w danych demo.
        </AlertDescription>
      </Alert>
    )
  }

  if (!canAccessEntity(lead, user)) {
    return (
      <Alert variant="destructive">
        <ShieldAlertIcon />
        <AlertTitle>Brak dostępu</AlertTitle>
        <AlertDescription>
          Ten lead nie należy do Twojego zakresu (RBAC).
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <LeadDetailHeader
        lead={lead}
        owner={owner}
        onWonClick={() => openFinish("won")}
        onLostClick={() => openFinish("lost")}
      />

      <LeadStatusBar
        lead={lead}
        onFinishClick={() => openFinish()}
        onStatusChange={handleStatusChange}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <LeadDetailSidebar
          lead={lead}
          onTasksClick={() => {
            setComposerTab("tasks")
            setEngagementSection(null)
          }}
          onMeetingsClick={() => setEngagementSection("meetings")}
          onDocumentsClick={() => {
            setComposerTab("documents")
            setEngagementSection(null)
          }}
        />
        <LeadActivityPanel
          lead={lead}
          composerTab={composerTab}
          onComposerTabChange={setComposerTab}
          engagementSection={engagementSection}
          onEngagementSectionChange={setEngagementSection}
        />
      </div>

      {lead.status === "lost" && lead.lostReason ? (
        <p className="text-sm text-muted-foreground">
          Uzasadnienie przegranej:{" "}
          {LEAD_LOST_REASON_LABELS[lead.lostReason]}
        </p>
      ) : null}

      <LeadFinishDialog
        lead={lead}
        open={finishOpen}
        onOpenChange={setFinishOpen}
        defaultTab={finishTab}
      />
    </div>
  )
}
