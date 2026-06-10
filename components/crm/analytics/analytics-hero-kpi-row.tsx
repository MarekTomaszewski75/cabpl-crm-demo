"use client"

import * as React from "react"
import { AnalyticsRadialChart } from "@/components/crm/analytics/charts/analytics-radial-chart"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getAdvisorWonAmountRows,
  getBankWideKpiTotals,
  getOpenPipelineAmountPln,
  getOverdueTasksCount,
  getRegionPlanRealization,
  getWonDealsAmountPln,
} from "@/lib/analytics/metrics"
import { ANALYTICS_TIME_PERIOD_LABELS } from "@/lib/analytics/analytics-labels"
import { formatCurrencyPln } from "@/lib/format/pl"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type {
  Client,
  Deal,
  DemoUser,
  KpiSnapshot,
  Lead,
  Task,
} from "@/types/crm"

type AnalyticsHeroKpiRowProps = {
  user: DemoUser
  filters: AnalyticsGlobalFilters
  kpi: KpiSnapshot
  data: {
    leads: readonly Lead[]
    deals: readonly Deal[]
    tasks: readonly Task[]
    users: readonly DemoUser[]
    clients: readonly Client[]
    kpi: KpiSnapshot
  }
}

function HeroKpiCard({
  title,
  description,
  value,
  badge,
  highlight,
  chart,
}: {
  title: string
  description: string
  value: string
  badge?: React.ReactNode
  highlight?: boolean
  chart?: React.ReactNode
}) {
  return (
    <Card
      size="sm"
      className={highlight ? "border-primary/25 bg-primary/5" : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {badge}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </p>
        {chart}
      </CardContent>
    </Card>
  )
}

function ManagerHeroRow({
  user,
  filters,
  kpi,
  data,
}: AnalyticsHeroKpiRowProps) {
  const timeLabel = ANALYTICS_TIME_PERIOD_LABELS[filters.timePeriod]
  const regionId = user.regionId ?? "mazowsze"
  const regionPlan = getRegionPlanRealization(kpi, regionId, filters.timePeriod)
  const wonAmount = getWonDealsAmountPln(data, user, filters)
  const openPipeline = getOpenPipelineAmountPln(data, user, filters)
  const overdueTasks = getOverdueTasksCount(data, user, filters)
  const advisorRows = getAdvisorWonAmountRows(data, user, filters, kpi)
  const wonFromAdvisors = advisorRows.reduce(
    (sum, row) => sum + row.amountPln,
    0,
  )

  return (
    <>
      <HeroKpiCard
        title="Realizacja planu regionu"
        description={timeLabel}
        value={formatCurrencyPln(regionPlan.actualPln)}
        badge={
          <Badge variant="secondary">
            {regionPlan.realizationPercent}% · {timeLabel}
          </Badge>
        }
        highlight
        chart={
          <AnalyticsRadialChart
            value={regionPlan.realizationPercent}
            size="sm"
          />
        }
      />
      <HeroKpiCard
        title="Wygrane deale (kwota)"
        description={`Suma wygranych · ${timeLabel.toLowerCase()}`}
        value={formatCurrencyPln(wonAmount || wonFromAdvisors)}
      />
      <HeroKpiCard
        title="Otwarty lejek (kwota)"
        description="Deale w toku w scope"
        value={formatCurrencyPln(openPipeline)}
      />
      <HeroKpiCard
        title="Zadania po terminie"
        description="Zespół w scope"
        value={String(overdueTasks)}
        badge={
          overdueTasks > 0 ? (
            <Badge variant="destructive">Wymaga uwagi</Badge>
          ) : undefined
        }
        highlight={overdueTasks > 0}
      />
    </>
  )
}

function ExecutiveHeroRow({
  user,
  filters,
  kpi,
  data,
}: AnalyticsHeroKpiRowProps) {
  const timeLabel = ANALYTICS_TIME_PERIOD_LABELS[filters.timePeriod]
  const totals = getBankWideKpiTotals(kpi, filters)
  const openPipeline = getOpenPipelineAmountPln(data, user, filters)

  return (
    <>
      <HeroKpiCard
        title="Plan YTD"
        description={timeLabel}
        value={formatCurrencyPln(totals.planPln)}
      />
      <HeroKpiCard
        title="Realizacja YTD"
        description={timeLabel}
        value={formatCurrencyPln(totals.actualPln)}
        badge={
          <Badge variant="secondary">
            {totals.realizationPercent}% · {timeLabel}
          </Badge>
        }
        highlight
        chart={
          <AnalyticsRadialChart value={totals.realizationPercent} size="sm" />
        }
      />
      <HeroKpiCard
        title="Forecast YTD"
        description="Scenariusz bazowy"
        value={formatCurrencyPln(totals.forecastPln)}
        badge={<Badge variant="secondary">{timeLabel}</Badge>}
      />
      <HeroKpiCard
        title="Otwarty pipeline"
        description="Bank-wide w scope"
        value={formatCurrencyPln(openPipeline)}
      />
    </>
  )
}

export function AnalyticsHeroKpiRow(props: AnalyticsHeroKpiRowProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {props.user.role === "executive" ? (
        <ExecutiveHeroRow {...props} />
      ) : (
        <ManagerHeroRow {...props} />
      )}
    </section>
  )
}
