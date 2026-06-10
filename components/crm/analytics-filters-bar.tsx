"use client"

import {
  ANALYTICS_OWNER_ALL,
  ANALYTICS_REGION_ALL,
  ANALYTICS_SEGMENT_ALL,
  ANALYTICS_TIME_PERIOD_LABELS,
} from "@/lib/analytics/analytics-labels"
import {
  getAnalyticsPresetsForRole,
} from "@/lib/analytics/widget-registry"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { DemoUser, KpiSnapshot, UserRole } from "@/types/crm"
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
  userRole: UserRole
  advisors: DemoUser[]
  kpi: KpiSnapshot
  onChange: (filters: AnalyticsGlobalFilters) => void
}

export function AnalyticsFiltersBar({
  filters,
  userRole,
  advisors,
  kpi,
  onChange,
}: AnalyticsFiltersBarProps) {
  const presets = getAnalyticsPresetsForRole(userRole)
  const ownerValue =
    filters.ownerIds.length === 1 ? filters.ownerIds[0] : ANALYTICS_OWNER_ALL
  const regionValue = filters.regionId ?? ANALYTICS_REGION_ALL
  const segmentValue = filters.segmentId ?? ANALYTICS_SEGMENT_ALL
  const isManager = userRole === "regional_manager"
  const isExecutive = userRole === "executive"

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
            {presets.map((preset) => (
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

      {isManager ? (
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
            <SelectValue placeholder="Doradca" />
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
      ) : null}

      {isExecutive ? (
        <>
          <Select
            value={regionValue}
            onValueChange={(value) =>
              onChange({
                ...filters,
                regionId: value === ANALYTICS_REGION_ALL ? null : value,
              })
            }
          >
            <SelectTrigger className="w-full min-w-44 sm:w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ANALYTICS_REGION_ALL}>
                  Wszyscy regiony
                </SelectItem>
                {kpi.byRegion.map((region) => (
                  <SelectItem key={region.regionId} value={region.regionId}>
                    {region.regionName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={segmentValue}
            onValueChange={(value) =>
              onChange({
                ...filters,
                segmentId: value === ANALYTICS_SEGMENT_ALL ? null : value,
              })
            }
          >
            <SelectTrigger className="w-full min-w-44 sm:w-52">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ANALYTICS_SEGMENT_ALL}>
                  Wszyscy segmenty
                </SelectItem>
                {kpi.bySegment.map((segment) => (
                  <SelectItem key={segment.segmentId} value={segment.segmentId}>
                    {segment.segmentName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ) : null}
    </div>
  )
}
