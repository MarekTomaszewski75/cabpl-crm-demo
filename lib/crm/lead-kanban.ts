import type { LeadStatus } from "@/types/crm"

export const LEAD_KANBAN_STATUSES: LeadStatus[] = [
  "new",
  "in_progress",
  "won",
  "lost",
]

/** Etykiety kolumn kanban (UI prezentacji). */
export const LEAD_KANBAN_COLUMN_LABELS: Record<LeadStatus, string> = {
  new: "Nowy",
  in_progress: "W toku",
  won: "Wygrano",
  lost: "Niepowodzenie",
}

export type LeadKanbanColumnTheme = {
  header: string
  body: string
  accent: string
  countBadge: string
}

export const LEAD_KANBAN_THEME: Record<LeadStatus, LeadKanbanColumnTheme> = {
  new: {
    header: "bg-pipeline-qualification text-pipeline-qualification-fg",
    body: "bg-pipeline-qualification/25",
    accent: "border-l-pipeline-qualification-fg",
    countBadge: "bg-card/90 text-pipeline-qualification-fg",
  },
  in_progress: {
    header: "bg-pipeline-lead text-pipeline-lead-fg",
    body: "bg-pipeline-lead/30",
    accent: "border-l-pipeline-lead-fg",
    countBadge: "bg-card/90 text-pipeline-lead-fg",
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
