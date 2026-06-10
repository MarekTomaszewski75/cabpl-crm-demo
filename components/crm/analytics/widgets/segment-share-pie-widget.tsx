"use client"

import { AnalyticsPieChart } from "@/components/crm/analytics/charts/analytics-pie-chart"
import type { SegmentShareRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"

type SegmentSharePieWidgetProps = {
  rows: SegmentShareRow[]
  activeSegmentId?: string | null
  onSegmentSelect?: (segmentId: string) => void
}

export function SegmentSharePieWidget({
  rows,
  activeSegmentId,
  onSegmentSelect,
}: SegmentSharePieWidgetProps) {
  const totalActual = rows.reduce((sum, row) => sum + row.actualPln, 0)

  return (
    <AnalyticsPieChart
      data={rows.map((row, index) => ({
        key: row.segmentId,
        label: row.segmentName,
        value: row.actualPln,
        fill: index === 0 ? "var(--chart-1)" : "var(--chart-3)",
      }))}
      centerLabel={formatCurrencyPln(totalActual)}
      centerSubLabel="Suma realizacji"
      valueFormatter={formatCurrencyPln}
      activeKey={activeSegmentId}
      onSliceClick={onSegmentSelect}
    />
  )
}
