"use client"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/status"
import {
  isTerminalLeadStatus,
  leadStatusIndicatorVariant,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/lead-labels"
import type { LeadStatus } from "@/types/crm"

type LeadStatusBadgeProps = {
  status: LeadStatus
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const showIndicator = !isTerminalLeadStatus(status)

  return (
    <Status variant={leadStatusIndicatorVariant(status)}>
      {showIndicator ? <StatusIndicator /> : null}
      <StatusLabel>{LEAD_STATUS_LABELS[status]}</StatusLabel>
    </Status>
  )
}
