import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import {
  getPipelineSteps,
  getPipelineWorkflowSteps,
  isPipelineCategoryId,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import type { DealStatus } from "@/types/crm"

export type DealKanbanColumnTheme = {
  header: string
  body: string
  accent: string
  countBadge: string
}

const LEAD_THEME: DealKanbanColumnTheme = {
  header: "bg-pipeline-lead text-pipeline-lead-fg",
  body: "bg-pipeline-lead/30",
  accent: "border-l-pipeline-lead-fg",
  countBadge: "bg-card/90 text-pipeline-lead-fg",
}

const QUALIFICATION_THEME: DealKanbanColumnTheme = {
  header: "bg-pipeline-qualification text-pipeline-qualification-fg",
  body: "bg-pipeline-qualification/25",
  accent: "border-l-pipeline-qualification-fg",
  countBadge: "bg-card/90 text-pipeline-qualification-fg",
}

const OFFER_THEME: DealKanbanColumnTheme = {
  header: "bg-pipeline-offer text-pipeline-offer-fg",
  body: "bg-pipeline-offer/25",
  accent: "border-l-pipeline-offer-fg",
  countBadge: "bg-card/90 text-pipeline-offer-fg",
}

const NEGOTIATION_THEME: DealKanbanColumnTheme = {
  header: "bg-pipeline-negotiation text-pipeline-negotiation-fg",
  body: "bg-pipeline-negotiation/25",
  accent: "border-l-pipeline-negotiation-fg",
  countBadge: "bg-card/90 text-pipeline-negotiation-fg",
}

const WON_THEME: DealKanbanColumnTheme = {
  header: "bg-pipeline-won text-pipeline-won-fg",
  body: "bg-pipeline-won/25",
  accent: "border-l-pipeline-won-fg",
  countBadge: "bg-card/90 text-pipeline-won-fg",
}

const LOST_THEME: DealKanbanColumnTheme = {
  header: "bg-destructive/15 text-destructive",
  body: "bg-destructive/5",
  accent: "border-l-destructive/70",
  countBadge: "bg-card/90 text-destructive",
}

function workflowStepRole(
  stepIndex: number,
  workflowLength: number,
): "lead" | "qualification" | "offer" | "negotiation" {
  if (stepIndex <= 0) return "lead"
  if (stepIndex >= workflowLength - 1) return "negotiation"
  if (stepIndex <= Math.ceil((workflowLength - 1) / 2)) return "qualification"
  return "offer"
}

export function getKanbanThemeForStepIndex(
  stepIndex: number,
  workflowLength: number,
  status: DealStatus,
): DealKanbanColumnTheme {
  if (status === "won") return WON_THEME
  if (status === "lost") return LOST_THEME

  switch (workflowStepRole(stepIndex, workflowLength)) {
    case "lead":
      return LEAD_THEME
    case "qualification":
      return stepIndex === 1
        ? QUALIFICATION_THEME
        : {
            ...QUALIFICATION_THEME,
            header: "bg-pipeline-qualification/90 text-pipeline-qualification-fg",
            body: "bg-pipeline-qualification/20",
          }
    case "offer":
      return OFFER_THEME
    case "negotiation":
      return NEGOTIATION_THEME
  }
}

export function getDealKanbanStatuses(
  pipelineCategoryId: PipelineCategoryId,
): DealStatus[] {
  return getPipelineSteps(pipelineCategoryId)
}

export function getDealKanbanColumnLabels(
  pipelineCategoryId: PipelineCategoryId,
): Record<DealStatus, string> {
  const labels = {} as Record<DealStatus, string>
  for (const status of getPipelineSteps(pipelineCategoryId)) {
    labels[status] = getDealStatusLabel(status, pipelineCategoryId)
  }
  return labels
}

export function getDealKanbanTheme(
  pipelineCategoryId: PipelineCategoryId,
): Partial<Record<DealStatus, DealKanbanColumnTheme>> {
  const workflow = getPipelineWorkflowSteps(pipelineCategoryId)
  const theme: Partial<Record<DealStatus, DealKanbanColumnTheme>> = {}

  for (const status of getPipelineSteps(pipelineCategoryId)) {
    const stepIndex =
      status === "won" || status === "lost"
        ? -1
        : workflow.indexOf(status)
    theme[status] = getKanbanThemeForStepIndex(
      stepIndex,
      workflow.length,
      status,
    )
  }

  return theme
}

export function getDealKanbanThemeForStatus(
  pipelineCategoryId: string,
  status: DealStatus,
): DealKanbanColumnTheme {
  const categoryId = isPipelineCategoryId(pipelineCategoryId)
    ? pipelineCategoryId
    : "pcat-credit"
  return (
    getDealKanbanTheme(categoryId)[status] ??
    getKanbanThemeForStepIndex(0, 5, status)
  )
}
