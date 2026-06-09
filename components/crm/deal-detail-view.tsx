"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldAlertIcon } from "lucide-react"
import { DealActivityPanel } from "@/components/crm/deal-activity-panel"
import { DealDetailHeader } from "@/components/crm/deal-detail-header"
import { DealDetailSidebar } from "@/components/crm/deal-detail-sidebar"
import { DealFinishDialog } from "@/components/crm/deal-finish-dialog"
import { DealStatusBar } from "@/components/crm/deal-status-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import { isDealWorkflowStatusChange } from "@/lib/crm/deal-status-transition"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { isPipelineCategoryId } from "@/lib/crm/deal-pipeline"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"
import type { DealStatus } from "@/types/crm"

export function DealDetailView({ dealId }: { dealId: string }) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { deals, users, updateDeal, addDealActivity } = useDemoData()
  const [open, setOpen] = React.useState(false)
  const [defaultMode, setDefaultMode] = React.useState<"won" | "lost" | undefined>(undefined)
  const deal = deals.find((d) => d.id === dealId)
  const owner = users.find((u) => u.id === deal?.ownerId)
  React.useEffect(() => { if (isReady && user && deal && !canAccessEntity(deal, user)) router.replace("/pipeline") }, [isReady, user, deal, router])
  if (!isReady || !user) return null
  if (!deal) return <Alert variant="destructive"><AlertTitle>Nie znaleziono deala</AlertTitle><AlertDescription>Brak deala o podanym identyfikatorze.</AlertDescription></Alert>
  if (!canAccessEntity(deal, user)) return <Alert variant="destructive"><ShieldAlertIcon /><AlertTitle>Brak dostępu</AlertTitle><AlertDescription>Ten deal nie należy do Twojego zakresu.</AlertDescription></Alert>
  return (
    <div className="flex flex-col gap-4">
      <DealDetailHeader deal={deal} owner={owner} onWonClick={() => { setDefaultMode("won"); setOpen(true) }} onLostClick={() => { setDefaultMode("lost"); setOpen(true) }} />
      <DealStatusBar
        deal={deal}
        onFinishClick={() => { setDefaultMode(undefined); setOpen(true) }}
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
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="history">Historia</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4"><div className="flex flex-col gap-6 lg:flex-row lg:items-start"><DealDetailSidebar deal={deal} /><DealActivityPanel deal={deal} /></div></TabsContent>
        <TabsContent value="history" className="mt-4"><Empty className="border py-10"><EmptyHeader><EmptyTitle>Historia</EmptyTitle><EmptyDescription>Pełna historia — Etap 1 w przygotowaniu.</EmptyDescription></EmptyHeader></Empty></TabsContent>
      </Tabs>
      <DealFinishDialog deal={deal} open={open} onOpenChange={setOpen} defaultMode={defaultMode} />
    </div>
  )
}
