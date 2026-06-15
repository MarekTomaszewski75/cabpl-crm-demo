"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { computeRealizationPercent } from "@/lib/dashboard/executive-metrics"
import { formatCurrencyPln } from "@/lib/format/pl"
import type { ExecutiveTimePeriod } from "@/lib/dashboard/executive-metrics"
import type { KpiCategoryRow } from "@/types/crm"

type PlanCategoryTableProps = {
  categories: readonly KpiCategoryRow[]
  timePeriod: ExecutiveTimePeriod
}

function pickPeriodValues(
  row: KpiCategoryRow,
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

export function PlanCategoryTable({
  categories,
  timePeriod,
}: PlanCategoryTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategoria produktowa</TableHead>
            <TableHead className="text-right">Plan</TableHead>
            <TableHead className="text-right">Realizacja</TableHead>
            <TableHead className="text-right">%</TableHead>
            <TableHead className="text-right">Forecast</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const { planPln, actualPln, forecastPln } = pickPeriodValues(
              category,
              timePeriod,
            )
            const realizationPercent = computeRealizationPercent(
              actualPln,
              planPln,
            )
            return (
              <TableRow key={category.pipelineCategoryId}>
                <TableCell className="font-medium">
                  {category.categoryName}
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
