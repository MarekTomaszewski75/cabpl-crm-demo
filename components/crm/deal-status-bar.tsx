"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import {
  getPipelineWorkflowSteps,
  isPipelineCategoryId,
  DEFAULT_PIPELINE_CATEGORY_ID,
} from "@/lib/crm/deal-pipeline"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { canFinishDeal } from "@/lib/crm/deal-labels"
import { isDealWorkflowStatusChange } from "@/lib/crm/deal-status-transition"
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
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <span className="text-sm text-muted-foreground">Wynik:</span>
        <Badge
          variant={deal.status === "won" ? "outline" : "destructive"}
        >
          {getDealStatusLabel(deal.status, pipelineCategoryId)}
        </Badge>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3 sm:flex-row sm:items-center"
      aria-label="Status deala"
    >
      <Stepper
        value={deal.status}
        onValueChange={(value) => onStatusChange(value as DealStatus)}
        onValidate={(value) =>
          isDealWorkflowStatusChange(
            deal.status,
            value as DealStatus,
            deal.pipelineCategoryId,
          )
        }
        orientation="horizontal"
        activationMode="manual"
        className="min-w-0 flex-1 gap-0"
      >
        <StepperList className="w-full">
          {workflowStatuses.map((status) => (
            <StepperItem key={status} value={status}>
              <StepperTrigger className="gap-2 rounded-md px-1 py-1">
                <StepperIndicator />
                <StepperTitle className="hidden text-xs lg:inline">
                  {getDealStatusLabel(status, pipelineCategoryId)}
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        disabled={!canFinishDeal(deal.status, pipelineCategoryId)}
        onClick={onFinishClick}
      >
        Zakończ przetwarzanie
      </Button>
    </div>
  )
}
