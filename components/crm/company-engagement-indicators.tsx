"use client"

import {
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarIcon,
  FileTextIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CompanyEngagementCounts } from "@/lib/crm/company-engagement-counts"
import { cn } from "@/lib/utils"

type CompanyEngagementIndicatorsProps = {
  counts: CompanyEngagementCounts
  className?: string
  onTasksClick?: () => void
  onMeetingsClick?: () => void
  onDocumentsClick?: () => void
  onDealsClick?: () => void
  onLeadsClick?: () => void
  onContactsClick?: () => void
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
  {
    key: "deals" as const,
    icon: BriefcaseIcon,
    label: "Deale",
  },
  {
    key: "leads" as const,
    icon: UserPlusIcon,
    label: "Leady",
  },
  {
    key: "contacts" as const,
    icon: UsersIcon,
    label: "Kontakty",
  },
]

export function CompanyEngagementIndicators({
  counts,
  className,
  onTasksClick,
  onMeetingsClick,
  onDocumentsClick,
  onDealsClick,
  onLeadsClick,
  onContactsClick,
}: CompanyEngagementIndicatorsProps) {
  const handlers = {
    tasks: onTasksClick,
    meetings: onMeetingsClick,
    documents: onDocumentsClick,
    deals: onDealsClick,
    leads: onLeadsClick,
    contacts: onContactsClick,
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-muted-foreground", className)}>
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
              {onClick ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-sm text-xs tabular-nums hover:text-foreground"
                  onClick={onClick}
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
