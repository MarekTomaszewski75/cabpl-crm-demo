"use client"

import { AlertCircleIcon, AlertTriangleIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  getDealCloseDateUrgency,
  getDealCloseDateUrgencyTooltip,
} from "@/lib/crm/deal-close-date-urgency"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/crm"

type DealCloseDateUrgencyIconProps = {
  deal: Deal
  className?: string
  onClick?: (event: React.MouseEvent) => void
}

export function DealCloseDateUrgencyIcon({
  deal,
  className,
  onClick,
}: DealCloseDateUrgencyIconProps) {
  const urgency = getDealCloseDateUrgency(deal)
  const tooltip = getDealCloseDateUrgencyTooltip(deal, urgency)

  if (urgency === "none" || !tooltip) return null

  const Icon = urgency === "overdue" ? AlertCircleIcon : AlertTriangleIcon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={tooltip}
          className={cn(
            "inline-flex shrink-0",
            urgency === "overdue" ? "text-destructive" : "text-ca-warning",
            className,
          )}
          onClick={onClick}
        >
          <Icon />
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
