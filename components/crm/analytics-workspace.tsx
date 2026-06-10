"use client"

import * as React from "react"
import { AnalyticsHeroKpiRow } from "@/components/crm/analytics/analytics-hero-kpi-row"
import { AnalyticsFiltersBar } from "@/components/crm/analytics-filters-bar"
import { AnalyticsPanelGrid } from "@/components/crm/analytics/analytics-panel-grid"
import { ExecutiveDashboard } from "@/components/crm/executive-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  getDefaultPresetForRole,
  getDefaultTimePeriodForRole,
  getWidgetsForPreset,
} from "@/lib/analytics/widget-registry"
import { getAnalyticsWorkspaceSubtitle } from "@/lib/analytics/workspace-subtitle"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { UserRole } from "@/types/crm"

function createInitialFilters(role: UserRole): AnalyticsGlobalFilters {
  const presetId = getDefaultPresetForRole(role)
  return {
    timePeriod: getDefaultTimePeriodForRole(role),
    ownerIds: [],
    panelPresetId: presetId,
    regionId: null,
    segmentId: null,
  }
}

export function AnalyticsWorkspace() {
  const { user } = useSession()
  const { leads, deals, tasks, meetings, users, clients, kpi } = useDemoData()
  const [activeTab, setActiveTab] = React.useState("panels")
  const [isLoading, setIsLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<AnalyticsGlobalFilters | null>(
    null,
  )
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>([])
  const loadingTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!user || filters) return
    const initialFilters = createInitialFilters(user.role)
    setFilters(initialFilters)
    setWidgetOrder(getWidgetsForPreset(initialFilters.panelPresetId, user.role))
  }, [user, filters])

  const advisors = React.useMemo(() => {
    if (!user) return []
    return users.filter(
      (entry) =>
        entry.role === "advisor" &&
        (user.role !== "regional_manager" ||
          entry.regionId === user.regionId),
    )
  }, [users, user])

  const analyticsData = React.useMemo(
    () => ({ leads, deals, tasks, meetings, users, clients, kpi }),
    [leads, deals, tasks, meetings, users, clients, kpi],
  )

  const startLoadingPulse = React.useCallback(() => {
    setIsLoading(true)
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current)
    }
    loadingTimerRef.current = window.setTimeout(() => {
      setIsLoading(false)
      loadingTimerRef.current = null
    }, 300)
  }, [])

  const handleAdvisorSelect = React.useCallback(
    (ownerId: string) => {
      if (!filters) return
      setFilters({ ...filters, ownerIds: [ownerId] })
      startLoadingPulse()
    },
    [filters, startLoadingPulse],
  )

  const handleRegionSelect = React.useCallback(
    (regionId: string) => {
      if (!filters) return
      setFilters({
        ...filters,
        regionId: filters.regionId === regionId ? null : regionId,
      })
      startLoadingPulse()
    },
    [filters, startLoadingPulse],
  )

  const handleSegmentSelect = React.useCallback(
    (segmentId: string) => {
      if (!filters) return
      setFilters({
        ...filters,
        segmentId: filters.segmentId === segmentId ? null : segmentId,
      })
      startLoadingPulse()
    },
    [filters, startLoadingPulse],
  )

  React.useEffect(() => {
    loadingTimerRef.current = window.setTimeout(() => {
      setIsLoading(false)
      loadingTimerRef.current = null
    }, 300)
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current)
      }
    }
  }, [])

  const handleFiltersChange = (next: AnalyticsGlobalFilters) => {
    if (!user) return
    if (next.panelPresetId !== filters?.panelPresetId) {
      setWidgetOrder(getWidgetsForPreset(next.panelPresetId, user.role))
    }
    setFilters(next)
    if (activeTab === "panels") {
      startLoadingPulse()
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "panels") {
      startLoadingPulse()
    }
  }

  if (!user || !filters) return null

  const subtitle = getAnalyticsWorkspaceSubtitle(user, filters, users, kpi)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Analityka
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="panels">Panel główny</TabsTrigger>
          <TabsTrigger value="plan">Plan i cele</TabsTrigger>
        </TabsList>

        <TabsContent value="panels" className="mt-4 flex flex-col gap-4">
          <AnalyticsFiltersBar
            filters={filters}
            userRole={user.role}
            advisors={advisors}
            kpi={kpi}
            onChange={handleFiltersChange}
          />
          <AnalyticsHeroKpiRow
            user={user}
            filters={filters}
            kpi={kpi}
            data={analyticsData}
          />
          <AnalyticsPanelGrid
            widgetIds={widgetOrder}
            filters={filters}
            user={user}
            isLoading={isLoading}
            data={analyticsData}
            onReorder={setWidgetOrder}
            onAdvisorSelect={handleAdvisorSelect}
            onRegionSelect={handleRegionSelect}
            onSegmentSelect={handleSegmentSelect}
          />
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <ExecutiveDashboard
            embedded
            lockedRegionId={
              user.role === "regional_manager"
                ? (user.regionId ?? undefined)
                : undefined
            }
            showSegmentTable={user.role === "executive"}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
