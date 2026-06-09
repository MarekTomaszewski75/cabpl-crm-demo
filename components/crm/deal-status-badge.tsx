"use client"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/status"
import {
  dealStatusIndicatorVariant,
  DEAL_STATUS_LABELS,
  isTerminalDealStatus,
} from "@/lib/crm/deal-labels"
import type { DealStatus } from "@/types/crm"

type DealStatusBadgeProps = {
  status: DealStatus
}

export function DealStatusBadge({ status }: DealStatusBadgeProps) {
  const showIndicator = !isTerminalDealStatus(status)

  return (
    <Status variant={dealStatusIndicatorVariant(status)}>
      {showIndicator ? <StatusIndicator /> : null}
      <StatusLabel>{DEAL_STATUS_LABELS[status]}</StatusLabel>
    </Status>
  )
}
