"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getPipelineWorkflowSteps,
  isPipelineCategoryId,
  DEFAULT_PIPELINE_CATEGORY_ID,
} from "@/lib/crm/deal-pipeline"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { canFinishDeal } from "@/lib/crm/deal-labels"
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
  const pipelineCategoryId = isPipelineCategoryId(deal.pipelineCategoryId)
    ? deal.pipelineCategoryId
    : DEFAULT_PIPELINE_CATEGORY_ID
  const workflowStatuses = getPipelineWorkflowSteps(pipelineCategoryId)

  if (deal.status === "won" || deal.status === "lost") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <span className="text-sm text-muted-foreground">Wynik:</span>
        <Badge
          variant={deal.status === "won" ? "outline" : "destructive"}
        >
          {getDealStatusLabel(deal.status, pipelineCategoryId)}
        </Badge>
      </div>
    )
  }

  const active = workflowStatuses.indexOf(deal.status)

  return (
    <div
      className="grid overflow-hidden rounded-lg border border-border"
      style={{
        gridTemplateColumns: `repeat(${workflowStatuses.length + 1}, minmax(0, 1fr))`,
      }}
    >
      {workflowStatuses.map((status, idx) => (
        <button
          key={status}
          type="button"
          className={cn(
            "px-4 py-2.5 text-sm",
            idx === active
              ? "bg-primary text-primary-foreground"
              : idx < active
                ? "bg-muted/80"
                : "bg-muted/40 hover:bg-muted/60",
          )}
          onClick={() => onStatusChange(status)}
        >
          {getDealStatusLabel(status, pipelineCategoryId)}
        </button>
      ))}
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 text-sm",
          canFinishDeal(deal.status, pipelineCategoryId)
            ? "bg-muted/40 hover:bg-muted/60"
            : "cursor-not-allowed bg-muted/30 text-muted-foreground",
        )}
        disabled={!canFinishDeal(deal.status, pipelineCategoryId)}
        onClick={onFinishClick}
      >
        Zakończ przetwarzanie
      </button>
    </div>
  )
}
