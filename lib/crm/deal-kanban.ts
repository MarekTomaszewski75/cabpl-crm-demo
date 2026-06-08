import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import type { DealStatus } from "@/types/crm"

export const DEAL_KANBAN_STATUSES: DealStatus[] = [
  "new",
  "association_created",
  "meeting_scheduled",
  "offer_submitted",
  "negotiation_started",
  "won",
  "lost",
]

export const DEAL_KANBAN_COLUMN_LABELS: Record<DealStatus, string> = {
  ...DEAL_STATUS_LABELS,
}

export type DealKanbanColumnTheme = {
  header: string
  body: string
  accent: string
  countBadge: string
}

export const DEAL_KANBAN_THEME: Record<DealStatus, DealKanbanColumnTheme> = {
  new: {
    header: "bg-pipeline-lead text-pipeline-lead-fg",
    body: "bg-pipeline-lead/30",
    accent: "border-l-pipeline-lead-fg",
    countBadge: "bg-card/90 text-pipeline-lead-fg",
  },
  association_created: {
    header: "bg-pipeline-qualification text-pipeline-qualification-fg",
    body: "bg-pipeline-qualification/25",
    accent: "border-l-pipeline-qualification-fg",
    countBadge: "bg-card/90 text-pipeline-qualification-fg",
  },
  meeting_scheduled: {
    header: "bg-pipeline-qualification/90 text-pipeline-qualification-fg",
    body: "bg-pipeline-qualification/20",
    accent: "border-l-pipeline-qualification-fg",
    countBadge: "bg-card/90 text-pipeline-qualification-fg",
  },
  offer_submitted: {
    header: "bg-pipeline-offer text-pipeline-offer-fg",
    body: "bg-pipeline-offer/25",
    accent: "border-l-pipeline-offer-fg",
    countBadge: "bg-card/90 text-pipeline-offer-fg",
  },
  negotiation_started: {
    header: "bg-pipeline-negotiation text-pipeline-negotiation-fg",
    body: "bg-pipeline-negotiation/25",
    accent: "border-l-pipeline-negotiation-fg",
    countBadge: "bg-card/90 text-pipeline-negotiation-fg",
  },
  won: {
    header: "bg-pipeline-won text-pipeline-won-fg",
    body: "bg-pipeline-won/25",
    accent: "border-l-pipeline-won-fg",
    countBadge: "bg-card/90 text-pipeline-won-fg",
  },
  lost: {
    header: "bg-destructive/15 text-destructive",
    body: "bg-destructive/5",
    accent: "border-l-destructive/70",
    countBadge: "bg-card/90 text-destructive",
  },
}
