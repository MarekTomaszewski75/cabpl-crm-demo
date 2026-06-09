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
  onItemClick?: (event: React.MouseEvent) => void
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
}: LeadEngagementIndicatorsProps) {
  return (
    <div
      className={cn("flex items-center gap-3 text-muted-foreground", className)}
    >
      {INDICATORS.map(({ key, icon: Icon, label }) => (
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <span
              className="inline-flex items-center gap-1 text-xs tabular-nums"
              onClick={onItemClick}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
              {counts[key]}
            </span>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
