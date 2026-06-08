import { Badge } from "@/components/ui/badge"
import { ANALYTICS_DOMAIN_LABELS } from "@/lib/analytics/analytics-labels"
import type { AnalyticsDomainTag } from "@/types/analytics"

type AnalyticsDomainBadgeProps = {
  domain: AnalyticsDomainTag
}

export function AnalyticsDomainBadge({ domain }: AnalyticsDomainBadgeProps) {
  return (
    <Badge variant="secondary" className="font-normal">
      {ANALYTICS_DOMAIN_LABELS[domain]}
    </Badge>
  )
}
