"use client"

import { AnalyticsMiniSparkline } from "@/components/crm/analytics/widgets/analytics-mini-sparkline"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdvisorRankingRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"
import { cn } from "@/lib/utils"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type AdvisorRankingTableWidgetProps = {
  rows: AdvisorRankingRow[]
  onAdvisorSelect?: (ownerId: string) => void
}

export function AdvisorRankingTableWidget({
  rows,
  onAdvisorSelect,
}: AdvisorRankingTableWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty message="Brak danych rankingu w wybranym okresie" />
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doradca</TableHead>
            <TableHead className="text-right">Wygrane</TableHead>
            <TableHead className="text-right">Otwarte deale</TableHead>
            <TableHead className="text-right">Nowe leady</TableHead>
            <TableHead className="text-right">Po terminie</TableHead>
            <TableHead className="text-right">Spotkania</TableHead>
            <TableHead className="text-right">Plan %</TableHead>
            <TableHead className="min-w-28">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.ownerId}
              className={cn(onAdvisorSelect && "cursor-pointer")}
              onClick={() => onAdvisorSelect?.(row.ownerId)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(row.ownerName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{row.ownerName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.wonAmountPln)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <div className="flex flex-col items-end gap-0.5">
                  <span>{row.openDealsCount}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrencyPln(row.openDealsAmountPln)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.newLeadsCount}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.overdueTasksCount > 0 ? (
                  <Badge variant="destructive">{row.overdueTasksCount}</Badge>
                ) : (
                  row.overdueTasksCount
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.meetingsCount}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.planRealizationPercent}%
              </TableCell>
              <TableCell>
                <AnalyticsMiniSparkline
                  data={row.wonTrend}
                  gradientId={`ranking-${row.ownerId}`}
                  color="var(--chart-2)"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
