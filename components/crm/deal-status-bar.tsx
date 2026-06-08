"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DEAL_STATUS_LABELS, DEAL_WORKFLOW_STATUSES, canFinishDeal } from "@/lib/crm/deal-labels"
import type { Deal, DealStatus } from "@/types/crm"

export function DealStatusBar({
  deal,
  onFinishClick,
  onStatusChange,
}: {
  deal: Deal
  onFinishClick: () => void
  onStatusChange: (status: DealStatus) => void
}) {
  if (deal.status === "won" || deal.status === "lost") {
    return <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"><span className="text-sm text-muted-foreground">Wynik:</span><Badge variant={deal.status === "won" ? "outline" : "destructive"}>{DEAL_STATUS_LABELS[deal.status]}</Badge></div>
  }
  const active = DEAL_WORKFLOW_STATUSES.indexOf(deal.status)
  return (
    <div className="grid grid-cols-6 overflow-hidden rounded-lg border border-border">
      {DEAL_WORKFLOW_STATUSES.map((status, idx) => (
        <button key={status} type="button" className={cn("px-4 py-2.5 text-sm", idx === active ? "bg-primary text-primary-foreground" : idx < active ? "bg-muted/80" : "bg-muted/40 hover:bg-muted/60")} onClick={() => onStatusChange(status)}>
          {DEAL_STATUS_LABELS[status]}
        </button>
      ))}
      <button type="button" className={cn("px-4 py-2.5 text-sm", canFinishDeal(deal.status) ? "bg-muted/40 hover:bg-muted/60" : "cursor-not-allowed bg-muted/30 text-muted-foreground")} disabled={!canFinishDeal(deal.status)} onClick={onFinishClick}>Zakończ przetwarzanie</button>
    </div>
  )
}

