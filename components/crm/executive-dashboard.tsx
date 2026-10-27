"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import { PlanCategoryTable } from "@/components/crm/analytics/plan-category-table"
import { PlanSegmentTable } from "@/components/crm/analytics/plan-segment-table"
import { KpiCard, KpiPlanActualCard } from "@/components/crm/kpi-card"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  EXECUTIVE_FILTER_ALL,
  getExecutiveChartRows,
  getExecutiveTimePeriodLabel,
  getExecutiveTotals,
  type ExecutiveDashboardFilters,
  type ExecutiveTimePeriod,
} from "@/lib/dashboard/executive-metrics"
import { DEAL_PIPELINE_CATEGORY_LABELS } from "@/lib/crm/deal-pipeline-labels"
import { getPipelineCategoryIds } from "@/lib/crm/deal-pipeline"
import { formatCurrencyPln } from "@/lib/format/pl"

const chartConfig = {
  planPln: {
    label: "Plan",
    color: "var(--chart-5)",
  },
  actualPln: {
    label: "Realizacja",
    color: "var(--chart-2)",
  },
  forecastPln: {
    label: "Prognoza bazowa",
    color: "var(--chart-1)",
  },
  forecastOptimisticPln: {
    label: "Prognoza optymistyczna",
    color: "var(--chart-3)",
  },
  forecastPessimisticPln: {
    label: "Prognoza pesymistyczna",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

type ExecutiveDashboardProps = {
  /** Ukrywa nagłówek modułu — używane w zakładce Plan i realizacja (US-20). */
  embedded?: boolean
  /** Wymusza region i ukrywa select (menedżer regionalny). */
  lockedRegionId?: string
  /** Tabela segmentów pod wykresem — tylko zarząd. */
  showSegmentTable?: boolean
  /** Tabela kategorii produktowych pod wykresem. */
  showCategoryTable?: boolean
}

export function ExecutiveDashboard({
  embedded = false,
  lockedRegionId,
  showSegmentTable = false,
  showCategoryTable = true,
}: ExecutiveDashboardProps) {
  const { kpi } = useDemoData()
  const [filters, setFilters] = React.useState<ExecutiveDashboardFilters>({
    timePeriod: "ytd",
    regionId: lockedRegionId ?? EXECUTIVE_FILTER_ALL,
    segmentId: EXECUTIVE_FILTER_ALL,
    pipelineCategoryId: EXECUTIVE_FILTER_ALL,
  })

  React.useEffect(() => {
    if (lockedRegionId) {
      setFilters((prev) => ({ ...prev, regionId: lockedRegionId }))
    }
  }, [lockedRegionId])

  const totals = React.useMemo(
    () => getExecutiveTotals(kpi, filters),
    [kpi, filters]
  )
  const chartRows = React.useMemo(
    () => getExecutiveChartRows(kpi, filters),
    [kpi, filters]
  )
  const timeLabel = getExecutiveTimePeriodLabel(filters.timePeriod)
  const lockedRegionName = lockedRegionId
    ? kpi.byRegion.find((region) => region.regionId === lockedRegionId)
        ?.regionName
    : null

  const setTimePeriod = (timePeriod: ExecutiveTimePeriod) => {
    setFilters((prev) => ({ ...prev, timePeriod }))
  }

  return (
    <div className="flex flex-col gap-6">
      {embedded ? (
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Plan i realizacja
          </h2>
          <p className="text-sm text-muted-foreground">
            {lockedRegionName
              ? `Plan i realizacja regionu ${lockedRegionName} — widok menedżera.`
              : "Plan, realizacja i prognoza z podziałem na regiony, segmenty i kategorie — cały bank."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Panel zarządczy
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan, realizacja i prognoza z podziałem na regiony, segmenty i kategorie — cały bank.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <Tabs
          value={filters.timePeriod}
          onValueChange={(value) => setTimePeriod(value as ExecutiveTimePeriod)}
        >
          <TabsList>
            <TabsTrigger value="ytd">YTD</TabsTrigger>
            <TabsTrigger value="quarter">Bieżący kwartał</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!lockedRegionId ? (
            <Select
              value={filters.regionId}
              onValueChange={(regionId) =>
                setFilters((prev) => ({ ...prev, regionId }))
              }
            >
              <SelectTrigger className="w-full min-w-44 sm:w-48">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={EXECUTIVE_FILTER_ALL}>
                    Wszystkie regiony
                  </SelectItem>
                  {kpi.byRegion.map((region) => (
                    <SelectItem key={region.regionId} value={region.regionId}>
                      {region.regionName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}

          <Select
            value={filters.segmentId}
            onValueChange={(segmentId) =>
              setFilters((prev) => ({ ...prev, segmentId }))
            }
          >
            <SelectTrigger className="w-full min-w-44 sm:w-52">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={EXECUTIVE_FILTER_ALL}>
                  Wszystkie segmenty
                </SelectItem>
                {kpi.bySegment.map((segment) => (
                  <SelectItem key={segment.segmentId} value={segment.segmentId}>
                    {segment.segmentName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.pipelineCategoryId}
            onValueChange={(pipelineCategoryId) =>
              setFilters((prev) => ({ ...prev, pipelineCategoryId }))
            }
          >
            <SelectTrigger className="w-full min-w-44 sm:w-56">
              <SelectValue placeholder="Kategoria produktowa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={EXECUTIVE_FILTER_ALL}>
                  Wszystkie kategorie
                </SelectItem>
                {getPipelineCategoryIds().map((categoryId) => (
                  <SelectItem key={categoryId} value={categoryId}>
                    {DEAL_PIPELINE_CATEGORY_LABELS[categoryId]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiPlanActualCard
          title="Realizacja planu"
          description={`Wykonanie vs plan · ${timeLabel}`}
          planPln={totals.planPln}
          actualPln={totals.actualPln}
          realizationPercent={totals.realizationPercent}
          timeLabel={timeLabel}
        />
        <KpiCard
          title="Plan"
          description={timeLabel}
          value={formatCurrencyPln(totals.planPln)}
        />
        <KpiCard
          title="Prognoza bazowa"
          description="Wygrane + lejek × prawdopodobieństwo"
          value={formatCurrencyPln(totals.forecastPln)}
          badge={timeLabel}
        />
        <KpiCard
          title="Luka do planu"
          description="Plan − realizacja"
          value={formatCurrencyPln(
            Math.max(0, totals.planPln - totals.actualPln)
          )}
        />
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Plan, realizacja i scenariusze prognozy</CardTitle>
            <Badge variant="outline">Etap 2: scenariusze</Badge>
          </div>
          <CardDescription>
            Trend miesięczny ({timeLabel.toLowerCase()}) — wartości w PLN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-2/1 min-h-72 w-full">
            <ComposedChart data={chartRows} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatAxisPln}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-mono tabular-nums">
                        {formatCurrencyPln(Number(value))}
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="planPln"
                fill="var(--color-planPln)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="actualPln"
                fill="var(--color-actualPln)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Line
                type="monotone"
                dataKey="forecastPln"
                stroke="var(--color-forecastPln)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="forecastOptimisticPln"
                stroke="var(--color-forecastOptimisticPln)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="forecastPessimisticPln"
                stroke="var(--color-forecastPessimisticPln)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {showSegmentTable ? (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-base font-semibold tracking-tight">
              Realizacja wg segmentu
            </h3>
            <p className="text-sm text-muted-foreground">
              Plan · realizacja · forecast per segment ({timeLabel.toLowerCase()})
            </p>
          </div>
          <PlanSegmentTable
            segments={kpi.bySegment}
            timePeriod={filters.timePeriod}
          />
        </section>
      ) : null}

      {showCategoryTable ? (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-base font-semibold tracking-tight">
              Realizacja wg kategorii produktowej
            </h3>
            <p className="text-sm text-muted-foreground">
              Plan · realizacja · forecast per kategoria ({timeLabel.toLowerCase()})
            </p>
          </div>
          <PlanCategoryTable
            categories={kpi.byCategory}
            timePeriod={filters.timePeriod}
          />
        </section>
      ) : null}
    </div>
  )
}
