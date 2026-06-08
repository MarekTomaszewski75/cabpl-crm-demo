"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  canFinishLead,
  isTerminalLeadStatus,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/lead-labels"
import type { Lead, LeadStatus } from "@/types/crm"

const WORKFLOW_SEGMENTS: {
  status: LeadStatus
  label: string
}[] = [
  { status: "new", label: "Nowy" },
  { status: "in_progress", label: "W toku" },
]

type LeadStatusBarProps = {
  lead: Lead
  onFinishClick: () => void
  onStatusChange: (status: LeadStatus) => void
}

export function LeadStatusBar({
  lead,
  onFinishClick,
  onStatusChange,
}: LeadStatusBarProps) {
  const terminal = isTerminalLeadStatus(lead.status)

  if (terminal) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <span className="text-sm text-muted-foreground">Wynik:</span>
        <Badge
          variant={lead.status === "won" ? "outline" : "destructive"}
        >
          {LEAD_STATUS_LABELS[lead.status]}
        </Badge>
      </div>
    )
  }

  const activeIndex =
    lead.status === "in_progress" ? 1 : 0

  return (
    <div
      className="grid grid-cols-3 overflow-hidden rounded-lg border border-border"
      role="group"
      aria-label="Status leada"
    >
      {WORKFLOW_SEGMENTS.map((segment, index) => {
        const isActive = lead.status === segment.status
        const isPast = index < activeIndex
        return (
          <button
            key={segment.status}
            type="button"
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : isPast
                  ? "bg-muted/80 text-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60",
              "cursor-pointer",
            )}
            onClick={() => onStatusChange(segment.status)}
          >
            {segment.label}
          </button>
        )
      })}
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 text-sm font-medium transition-colors",
          canFinishLead(lead.status)
            ? "cursor-pointer bg-muted/40 text-foreground hover:bg-muted/60"
            : "cursor-not-allowed bg-muted/30 text-muted-foreground",
        )}
        disabled={!canFinishLead(lead.status)}
        onClick={onFinishClick}
      >
        Zakończ przetwarzanie
      </button>
    </div>
  )
}
