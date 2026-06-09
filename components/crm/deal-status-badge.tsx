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
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { isPipelineCategoryId } from "@/lib/crm/deal-pipeline"
import type { DealStatus } from "@/types/crm"

type DealStatusBadgeProps = {
  status: DealStatus
  pipelineCategoryId: string
}

export function DealStatusBadge({
  status,
  pipelineCategoryId,
}: DealStatusBadgeProps) {
  const showIndicator = !isTerminalDealStatus(status)
  const statusLabel = isPipelineCategoryId(pipelineCategoryId)
    ? getDealStatusLabel(status, pipelineCategoryId)
    : DEAL_STATUS_LABELS[status]

  return (
    <Status variant={dealStatusIndicatorVariant(status, pipelineCategoryId)}>
      {showIndicator ? <StatusIndicator /> : null}
      <StatusLabel>{statusLabel}</StatusLabel>
    </Status>
  )
}
