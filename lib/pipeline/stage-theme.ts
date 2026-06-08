import type { OpportunityStage } from "@/types/crm"

export type PipelineStageTheme = {
  header: string
  body: string
  accent: string
  sumBadge: string
}

export const PIPELINE_STAGE_THEME: Record<OpportunityStage, PipelineStageTheme> =
  {
    lead: {
      header: "bg-pipeline-lead text-pipeline-lead-fg",
      body: "bg-pipeline-lead/35",
      accent: "border-l-pipeline-lead-fg",
      sumBadge: "bg-card/80 text-pipeline-lead-fg",
    },
    qualification: {
      header: "bg-pipeline-qualification text-pipeline-qualification-fg",
      body: "bg-pipeline-qualification/35",
      accent: "border-l-pipeline-qualification-fg",
      sumBadge: "bg-card/80 text-pipeline-qualification-fg",
    },
    offer: {
      header: "bg-pipeline-offer text-pipeline-offer-fg",
      body: "bg-pipeline-offer/35",
      accent: "border-l-pipeline-offer-fg",
      sumBadge: "bg-card/80 text-pipeline-offer-fg",
    },
    negotiation: {
      header: "bg-pipeline-negotiation text-pipeline-negotiation-fg",
      body: "bg-pipeline-negotiation/35",
      accent: "border-l-pipeline-negotiation-fg",
      sumBadge: "bg-card/80 text-pipeline-negotiation-fg",
    },
    won: {
      header: "bg-pipeline-won text-pipeline-won-fg",
      body: "bg-pipeline-won/30",
      accent: "border-l-primary",
      sumBadge: "bg-card/80 text-pipeline-won-fg",
    },
    lost: {
      header: "bg-pipeline-lost text-pipeline-lost-fg",
      body: "bg-pipeline-lost/50",
      accent: "border-l-muted-foreground/50",
      sumBadge: "bg-card/80 text-pipeline-lost-fg",
    },
  }

export function getProbabilityBand(probability: number): {
  label: string
  variant: "default" | "secondary" | "outline"
} {
  if (probability >= 60) {
    return { label: "Wysokie", variant: "default" }
  }
  if (probability >= 30) {
    return { label: "Średnie", variant: "secondary" }
  }
  return { label: "Niskie", variant: "outline" }
}

export function displayInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
