"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCurrentQuarter, getDemoReferenceDate } from "@/lib/analytics/filters"
import {
  buildOrgPipelineTree,
  getRealizationPercent,
  type ForecastHorizon,
  type OrgPipelineFilters,
  type OrgPipelineNode,
} from "@/lib/analytics/org-pipeline"
import {
  getPipelineWorkflowSteps,
  isPipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatCurrencyPlnCompact } from "@/lib/format/pl"
import { cn } from "@/lib/utils"
import type { DealStatus, DemoUser } from "@/types/crm"

const ALL = "__all__"

const LEVEL_LABELS: Record<OrgPipelineNode["level"], string> = {
  division: "Pion",
  department: "Departament",
  region: "Region",
  team: "Zespół",
  rm: "RM",
}

type FlatRow = { node: OrgPipelineNode; depth: number }

function flattenVisible(
  nodes: readonly OrgPipelineNode[],
  collapsed: ReadonlySet<string>,
  depth = 0,
): FlatRow[] {
  return nodes.flatMap((node) => [
    { node, depth },
    ...(collapsed.has(node.id)
      ? []
      : flattenVisible(node.children, collapsed, depth + 1)),
  ])
}

function percentOfPlan(value: number, plan: number): string {
  return plan > 0 ? `${Math.round((value / plan) * 100)}% planu` : "—"
}

function ForecastTile({
  label,
  value,
  plan,
  hint,
}: {
  label: string
  value: number
  plan: number
  hint: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">
        {formatCurrencyPlnCompact(value)}
      </span>
      <span className="text-xs text-muted-foreground">
        {percentOfPlan(value, plan)} · {hint}
      </span>
    </div>
  )
}

/** Lejek zespołu z drill-down Pion → Departament → Region → Zespół → RM (Appendix B #6, US-59). */
export function OrgPipelineView({ user }: { user: DemoUser }) {
  const { salesStructure, users, deals, clients, kpiPlan } = useDemoData()
  const [filters, setFilters] = React.useState<OrgPipelineFilters>({
    horizon: "quarter",
    segmentName: null,
    pipelineCategoryId: null,
    status: null,
  })
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set())

  const tree = React.useMemo(
    () =>
      buildOrgPipelineTree({
        units: salesStructure,
        users,
        deals,
        clients,
        plan: kpiPlan,
        user,
        filters,
      }),
    [salesStructure, users, deals, clients, kpiPlan, user, filters],
  )
  const rows = flattenVisible(tree, collapsed)
  const root = tree[0]

  const year = getDemoReferenceDate().getUTCFullYear()
  const stageOptions: DealStatus[] =
    filters.pipelineCategoryId && isPipelineCategoryId(filters.pipelineCategoryId)
      ? getPipelineWorkflowSteps(filters.pipelineCategoryId)
      : []

  function patch(partial: Partial<OrgPipelineFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  function toggle(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lejek wg struktury</CardTitle>
        <CardDescription>
          Pion → Departament → Region → Zespół → RM. Rozwiń wiersz, aby zejść
          poziom niżej. Prognoza ważona liczy kwotę × prawdopodobieństwo,
          nieważona — pełną wartość szans z zamknięciem w horyzoncie.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="org-horizon">Horyzont prognozy</FieldLabel>
            <Select
              value={filters.horizon}
              onValueChange={(value) =>
                patch({ horizon: value as ForecastHorizon })
              }
            >
              <SelectTrigger id="org-horizon" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="quarter">
                    Bieżący kwartał (Q{getCurrentQuarter()})
                  </SelectItem>
                  <SelectItem value="year">Do końca roku {year}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="org-segment">Segment</FieldLabel>
            <Select
              value={filters.segmentName ?? ALL}
              onValueChange={(value) =>
                patch({ segmentName: value === ALL ? null : value })
              }
            >
              <SelectTrigger id="org-segment" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL}>Wszystkie segmenty</SelectItem>
                  {kpiPlan.bySegment.map((segment) => (
                    <SelectItem key={segment.segmentId} value={segment.segmentName}>
                      {segment.segmentName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="org-category">Produkt (lejek)</FieldLabel>
            <Select
              value={filters.pipelineCategoryId ?? ALL}
              onValueChange={(value) =>
                patch({
                  pipelineCategoryId: value === ALL ? null : value,
                  status: null,
                })
              }
            >
              <SelectTrigger id="org-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL}>Wszystkie produkty</SelectItem>
                  {kpiPlan.byCategory.map((category) => (
                    <SelectItem
                      key={category.pipelineCategoryId}
                      value={category.pipelineCategoryId}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="org-stage">Etap</FieldLabel>
            <Select
              value={filters.status ?? ALL}
              onValueChange={(value) =>
                patch({ status: value === ALL ? null : (value as DealStatus) })
              }
              disabled={stageOptions.length === 0}
            >
              <SelectTrigger id="org-stage" className="w-full">
                <SelectValue placeholder="Wybierz produkt" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL}>Wszystkie etapy</SelectItem>
                  {stageOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getDealStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {root ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <ForecastTile
              label="Wygrane w horyzoncie"
              value={root.wonPln}
              plan={root.planPln}
              hint={`plan ${formatCurrencyPlnCompact(root.planPln)}`}
            />
            <ForecastTile
              label="Prognoza ważona"
              value={root.forecastWeightedPln}
              plan={root.planPln}
              hint="wygrane + lejek × prawdopodobieństwo"
            />
            <ForecastTile
              label="Prognoza nieważona"
              value={root.forecastUnweightedPln}
              plan={root.planPln}
              hint="wygrane + pełna wartość lejka"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Etap 2</Badge>
          Korekty prognozy przez kierownictwo z audytem i miesięczne snapshoty.
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-64">Jednostka</TableHead>
              <TableHead className="text-right">Otwarte</TableHead>
              <TableHead className="text-right">Lejek</TableHead>
              <TableHead className="text-right">Lejek ważony</TableHead>
              <TableHead className="text-right">Wygrane</TableHead>
              <TableHead className="text-right">Plan</TableHead>
              <TableHead className="text-right">Realizacja</TableHead>
              <TableHead className="text-right">Prognoza ważona</TableHead>
              <TableHead className="text-right">Prognoza nieważona</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ node, depth }) => {
              const hasChildren = node.children.length > 0
              const isCollapsed = collapsed.has(node.id)
              return (
                <TableRow
                  key={node.id}
                  className={cn(node.level !== "rm" && "font-medium")}
                >
                  <TableCell>
                    <div
                      className="flex items-center gap-1.5"
                      style={{ paddingLeft: `${depth * 1.25}rem` }}
                    >
                      {hasChildren ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={
                            isCollapsed ? `Rozwiń ${node.name}` : `Zwiń ${node.name}`
                          }
                          aria-expanded={!isCollapsed}
                          onClick={() => toggle(node.id)}
                        >
                          <ChevronRightIcon
                            className={cn(
                              "transition-transform",
                              !isCollapsed && "rotate-90",
                            )}
                          />
                        </Button>
                      ) : (
                        <span className="size-7 shrink-0" aria-hidden />
                      )}
                      <span>{node.name}</span>
                      <Badge variant="secondary" className="font-normal">
                        {LEVEL_LABELS[node.level]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {node.openCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.pipelinePln)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.weightedPipelinePln)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.wonPln)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.planPln)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {getRealizationPercent(node)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.forecastWeightedPln)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyPlnCompact(node.forecastUnweightedPln)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
