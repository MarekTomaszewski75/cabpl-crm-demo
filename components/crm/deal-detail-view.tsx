"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldAlertIcon } from "lucide-react"
import {
  DealActivityPanel,
  type DealComposerTab,
} from "@/components/crm/deal-activity-panel"
import { DealDetailHeader } from "@/components/crm/deal-detail-header"
import { DealDetailSidebar } from "@/components/crm/deal-detail-sidebar"
import { DealFinishDialog } from "@/components/crm/deal-finish-dialog"
import { DealStatusBar } from "@/components/crm/deal-status-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@/lib/auth/demo-session"
import { isDealWorkflowStatusChange } from "@/lib/crm/deal-status-transition"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { isPipelineCategoryId } from "@/lib/crm/deal-pipeline"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"
import type { DealStatus } from "@/types/crm"

export type DealEngagementSection = "meetings" | null

export function DealDetailView({ dealId }: { dealId: string }) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { deals, users, updateDeal, addDealActivity } = useDemoData()
  const [open, setOpen] = React.useState(false)
  const [defaultMode, setDefaultMode] = React.useState<"won" | "lost" | undefined>(undefined)
  const [composerTab, setComposerTab] = React.useState<DealComposerTab>("note")
  const [engagementSection, setEngagementSection] =
    React.useState<DealEngagementSection>(null)

  const deal = deals.find((d) => d.id === dealId)
  const owner = users.find((u) => u.id === deal?.ownerId)

  React.useEffect(() => {
    if (isReady && user && deal && !canAccessEntity(deal, user)) {
      router.replace("/pipeline")
    }
  }, [isReady, user, deal, router])

  if (!isReady || !user) return null

  if (!deal) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono deala</AlertTitle>
        <AlertDescription>Brak deala o podanym identyfikatorze.</AlertDescription>
      </Alert>
    )
  }

  if (!canAccessEntity(deal, user)) {
    return (
      <Alert variant="destructive">
        <ShieldAlertIcon />
        <AlertTitle>Brak dostępu</AlertTitle>
        <AlertDescription>Ten deal nie należy do Twojego zakresu.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <DealDetailHeader
        deal={deal}
        owner={owner}
        onWonClick={() => {
          setDefaultMode("won")
          setOpen(true)
        }}
        onLostClick={() => {
          setDefaultMode("lost")
          setOpen(true)
        }}
      />
      <DealStatusBar
        deal={deal}
        onFinishClick={() => {
          setDefaultMode(undefined)
          setOpen(true)
        }}
        onStatusChange={(next: DealStatus) => {
          if (!user || deal.status === next) return
          if (
            !isDealWorkflowStatusChange(
              deal.status,
              next,
              deal.pipelineCategoryId,
            )
          ) {
            toast.message("Nie można zmienić statusu", {
              description:
                "Ten etap nie jest dostępny w lejku tego deala.",
            })
            return
          }
          const prev = deal.status
          const categoryId = isPipelineCategoryId(deal.pipelineCategoryId)
            ? deal.pipelineCategoryId
            : undefined
          updateDeal(deal.id, { status: next })
          addDealActivity(deal.id, "deal_status_changed", user, {
            note: `${getDealStatusLabel(prev, categoryId)} → ${getDealStatusLabel(next, categoryId)}`,
          })
        }}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <DealDetailSidebar
          deal={deal}
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
        <DealActivityPanel
          deal={deal}
          composerTab={composerTab}
          onComposerTabChange={setComposerTab}
          engagementSection={engagementSection}
          onEngagementSectionChange={setEngagementSection}
        />
      </div>
      <DealFinishDialog
        deal={deal}
        open={open}
        onOpenChange={setOpen}
        defaultMode={defaultMode}
      />
    </div>
  )
}
