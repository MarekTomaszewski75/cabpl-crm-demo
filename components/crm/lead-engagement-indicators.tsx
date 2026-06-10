"use client"

import {
  CalendarCheckIcon,
  CalendarIcon,
  FileTextIcon,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { LeadEngagementCounts } from "@/lib/crm/lead-engagement-counts"
import { cn } from "@/lib/utils"

type LeadEngagementIndicatorsProps = {
  counts: LeadEngagementCounts
  className?: string
  /** Kanban: zatrzymanie propagacji kliknięcia karty. */
  onItemClick?: (event: React.MouseEvent) => void
  onTasksClick?: () => void
  onMeetingsClick?: () => void
  onDocumentsClick?: () => void
}

const INDICATORS = [
  {
    key: "tasks" as const,
    icon: CalendarCheckIcon,
    label: "Zadania",
  },
  {
    key: "meetings" as const,
    icon: CalendarIcon,
    label: "Spotkania",
  },
  {
    key: "documents" as const,
    icon: FileTextIcon,
    label: "Dokumenty",
  },
]

export function LeadEngagementIndicators({
  counts,
  className,
  onItemClick,
  onTasksClick,
  onMeetingsClick,
  onDocumentsClick,
}: LeadEngagementIndicatorsProps) {
  const handlers = {
    tasks: onTasksClick,
    meetings: onMeetingsClick,
    documents: onDocumentsClick,
  }

  return (
    <div
      className={cn("flex items-center gap-3 text-muted-foreground", className)}
    >
      {INDICATORS.map(({ key, icon: Icon, label }) => {
        const onClick = handlers[key]
        const content = (
          <>
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {counts[key]}
          </>
        )

        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              {onClick || onItemClick ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-sm text-xs tabular-nums hover:text-foreground"
                  onClick={(event) => {
                    onItemClick?.(event)
                    onClick?.()
                  }}
                  aria-label={label}
                >
                  {content}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs tabular-nums">
                  {content}
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
