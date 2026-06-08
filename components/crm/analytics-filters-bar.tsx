"use client"

import {
  ANALYTICS_OWNER_ALL,
  ANALYTICS_TIME_PERIOD_LABELS,
} from "@/lib/analytics/analytics-labels"
import { ANALYTICS_PANEL_PRESETS } from "@/lib/analytics/widget-registry"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { DemoUser } from "@/types/crm"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AnalyticsFiltersBarProps = {
  filters: AnalyticsGlobalFilters
  advisors: DemoUser[]
  onChange: (filters: AnalyticsGlobalFilters) => void
}

export function AnalyticsFiltersBar({
  filters,
  advisors,
  onChange,
}: AnalyticsFiltersBarProps) {
  const ownerValue =
    filters.ownerIds.length === 1 ? filters.ownerIds[0] : ANALYTICS_OWNER_ALL

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <Select
        value={filters.panelPresetId}
        onValueChange={(panelPresetId) =>
          onChange({ ...filters, panelPresetId })
        }
      >
        <SelectTrigger className="w-full min-w-44 sm:w-56">
          <SelectValue placeholder="Widok panelu" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ANALYTICS_PANEL_PRESETS.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.labelPl}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.timePeriod}
        onValueChange={(timePeriod) =>
          onChange({
            ...filters,
            timePeriod: timePeriod as AnalyticsGlobalFilters["timePeriod"],
          })
        }
      >
        <SelectTrigger className="w-full min-w-44 sm:w-52">
          <SelectValue placeholder="Okres" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(
              Object.entries(ANALYTICS_TIME_PERIOD_LABELS) as [
                AnalyticsGlobalFilters["timePeriod"],
                string,
              ][]
            ).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={ownerValue}
        onValueChange={(value) =>
          onChange({
            ...filters,
            ownerIds: value === ANALYTICS_OWNER_ALL ? [] : [value],
          })
        }
      >
        <SelectTrigger className="w-full min-w-44 sm:w-56">
          <SelectValue placeholder="Opiekunowie" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ANALYTICS_OWNER_ALL}>Wszyscy</SelectItem>
            {advisors.map((advisor) => (
              <SelectItem key={advisor.id} value={advisor.id}>
                {advisor.displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
