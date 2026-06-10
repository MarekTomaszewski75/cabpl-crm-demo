"use client"

import Link from "next/link"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import type { TopOpenDealRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"

type TopOpenDealsTableWidgetProps = {
  rows: TopOpenDealRow[]
}

export function TopOpenDealsTableWidget({ rows }: TopOpenDealsTableWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty message="Brak otwartych dealów w scope" />
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deal</TableHead>
            <TableHead>Firma</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Kwota</TableHead>
            <TableHead>Etap</TableHead>
            <TableHead>Opiekun</TableHead>
            <TableHead>Przewidywane zamknięcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.dealId}>
              <TableCell>
                <Link
                  href={`/pipeline/${row.dealId}`}
                  className="font-medium text-primary hover:underline"
                >
                  {row.title}
                </Link>
              </TableCell>
              <TableCell>{row.clientName}</TableCell>
              <TableCell>
                <Badge variant="secondary">{row.regionName}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.amountPln)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {DEAL_STATUS_LABELS[row.status]}
                </Badge>
              </TableCell>
              <TableCell>{row.ownerName}</TableCell>
              <TableCell className="tabular-nums">
                {row.expectedCloseDate
                  ? formatDatePl(row.expectedCloseDate)
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
