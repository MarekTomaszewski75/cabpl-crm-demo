"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { computeRealizationPercent } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"
import type { KpiSegmentRow } from "@/types/crm"
import type { ExecutiveTimePeriod } from "@/lib/dashboard/executive-metrics"

type PlanSegmentTableProps = {
  segments: readonly KpiSegmentRow[]
  timePeriod: ExecutiveTimePeriod
}

function pickPeriodValues(
  row: KpiSegmentRow,
  timePeriod: ExecutiveTimePeriod,
) {
  if (timePeriod === "quarter") {
    return {
      planPln: row.planQuarterPln,
      actualPln: row.actualQuarterPln,
      forecastPln: row.forecastQuarterPln,
    }
  }
  return {
    planPln: row.planPln,
    actualPln: row.actualPln,
    forecastPln: row.forecastPln,
  }
}

export function PlanSegmentTable({
  segments,
  timePeriod,
}: PlanSegmentTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Segment</TableHead>
            <TableHead className="text-right">Plan</TableHead>
            <TableHead className="text-right">Realizacja</TableHead>
            <TableHead className="text-right">%</TableHead>
            <TableHead className="text-right">Forecast</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => {
            const { planPln, actualPln, forecastPln } = pickPeriodValues(
              segment,
              timePeriod,
            )
            const realizationPercent = computeRealizationPercent(
              actualPln,
              planPln,
            )
            return (
              <TableRow key={segment.segmentId}>
                <TableCell className="font-medium">
                  {segment.segmentName}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyPln(planPln)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyPln(actualPln)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {realizationPercent}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyPln(forecastPln)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
