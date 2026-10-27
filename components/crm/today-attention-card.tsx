"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangleIcon,
  CheckSquareIcon,
  HourglassIcon,
  RefreshCwIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  RENEWAL_HORIZON_DAYS,
  STALE_DEAL_DAYS,
  type OverdueTask,
  type StaleDeal,
  type UpcomingRenewal,
} from "@/lib/crm/today-attention"
import { formatCurrencyPln, formatDatePl, pluralPl } from "@/lib/format/pl"
import type { LucideIcon } from "lucide-react"

const MAX_ITEMS = 5

function daysLabel(days: number): string {
  return `${days} ${pluralPl(days, "dzień", "dni", "dni")}`
}

function AttentionSection({
  icon: Icon,
  title,
  total,
  emptyText,
  footer,
  children,
}: {
  icon: LucideIcon
  title: string
  total: number
  emptyText: string
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        {title}
        <Badge variant="secondary" className="tabular-nums">
          {total}
        </Badge>
      </h3>
      {total === 0 ? (
        <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">{children}</ul>
      )}
      {footer}
    </section>
  )
}

type TodayAttentionCardProps = {
  overdueTasks: readonly OverdueTask[]
  staleDeals: readonly StaleDeal[]
  renewals: readonly UpcomingRenewal[]
  clientNameById: ReadonlyMap<string, string>
  productNameById: ReadonlyMap<string, string>
}

/** „Dziś” — zaległości, szanse bez postępu i odnowienia (Appendix B #5, QW-10). */
export function TodayAttentionCard({
  overdueTasks,
  staleDeals,
  renewals,
  clientNameById,
  productNameById,
}: TodayAttentionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangleIcon className="text-primary" />
          Wymaga uwagi
        </CardTitle>
        <CardDescription>
          Zaległe zadania, szanse bez aktywności od ponad {STALE_DEAL_DAYS} dni
          i produkty do odnowienia w ciągu {RENEWAL_HORIZON_DAYS} dni.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-3">
        <AttentionSection
          icon={CheckSquareIcon}
          title="Zaległe zadania"
          total={overdueTasks.length}
          emptyText="Brak zaległych zadań."
          footer={
            overdueTasks.length > 0 ? (
              <Button variant="link" className="h-auto w-fit p-0" asChild>
                <Link href="/tasks">Wszystkie zadania</Link>
              </Button>
            ) : null
          }
        >
          {overdueTasks.slice(0, MAX_ITEMS).map(({ task, daysOverdue }) => (
            <li
              key={task.id}
              className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3"
            >
              <span className="text-sm font-medium">{task.title}</span>
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="destructive">
                  {daysLabel(daysOverdue)} po terminie
                </Badge>
                {task.clientId
                  ? clientNameById.get(task.clientId) ?? task.clientId
                  : null}
              </span>
            </li>
          ))}
        </AttentionSection>

        <AttentionSection
          icon={HourglassIcon}
          title="Szanse bez postępu"
          total={staleDeals.length}
          emptyText="Wszystkie otwarte szanse mają aktualne aktywności."
          footer={
            staleDeals.length > MAX_ITEMS ? (
              <p className="text-xs text-muted-foreground">
                Pokazano {MAX_ITEMS} największych z {staleDeals.length}.
              </p>
            ) : null
          }
        >
          {staleDeals.slice(0, MAX_ITEMS).map(({ deal, daysWithoutActivity }) => (
            <li
              key={deal.id}
              className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3"
            >
              <Link
                href={`/pipeline/${deal.id}`}
                className="text-sm font-medium hover:underline"
              >
                {deal.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {deal.amount ? `${formatCurrencyPln(deal.amount)} · ` : null}
                bez aktywności od {daysLabel(daysWithoutActivity)}
              </span>
            </li>
          ))}
        </AttentionSection>

        <AttentionSection
          icon={RefreshCwIcon}
          title="Odnowienia"
          total={renewals.length}
          emptyText={`Brak produktów wygasających w ciągu ${RENEWAL_HORIZON_DAYS} dni.`}
        >
          {renewals.slice(0, MAX_ITEMS).map(({ product, daysUntilExpiry }) => (
            <li
              key={product.id}
              className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3"
            >
              <Link
                href={`/clients/${product.clientId}/banking-products/${product.id}`}
                className="text-sm font-medium hover:underline"
              >
                {productNameById.get(product.productId) ?? product.contractNumber}
              </Link>
              <span className="text-xs text-muted-foreground">
                {clientNameById.get(product.clientId) ?? product.clientId} ·
                ważny do {formatDatePl(product.expiresAt!)} (za{" "}
                {daysLabel(daysUntilExpiry)})
              </span>
            </li>
          ))}
        </AttentionSection>
      </CardContent>
    </Card>
  )
}
