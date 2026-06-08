"use client"

import * as React from "react"
import { AnalyticsFiltersBar } from "@/components/crm/analytics-filters-bar"
import { AnalyticsPanelGrid } from "@/components/crm/analytics/analytics-panel-grid"
import { ExecutiveDashboard } from "@/components/crm/executive-dashboard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  DEFAULT_ANALYTICS_PANEL_PRESET_ID,
  getAnalyticsPanelPreset,
} from "@/lib/analytics/widget-registry"
import type { AnalyticsGlobalFilters } from "@/types/analytics"

export function AnalyticsWorkspace() {
  const { user } = useSession()
  const { leads, deals, tasks, users } = useDemoData()
  const [activeTab, setActiveTab] = React.useState("panels")
  const [isLoading, setIsLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<AnalyticsGlobalFilters>({
    timePeriod: "month",
    ownerIds: [],
    panelPresetId: DEFAULT_ANALYTICS_PANEL_PRESET_ID,
  })
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>(() => {
    const preset = getAnalyticsPanelPreset(DEFAULT_ANALYTICS_PANEL_PRESET_ID)
    return preset ? [...preset.widgetIds] : []
  })
  const loadingTimerRef = React.useRef<number | null>(null)

  const advisors = React.useMemo(
    () => users.filter((entry) => entry.role === "advisor"),
    [users],
  )

  const analyticsData = React.useMemo(
    () => ({ leads, deals, tasks, users }),
    [leads, deals, tasks, users],
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
    if (next.panelPresetId !== filters.panelPresetId) {
      const preset = getAnalyticsPanelPreset(next.panelPresetId)
      if (preset) {
        setWidgetOrder([...preset.widgetIds])
      }
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

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Analityka
        </h1>
        <p className="text-sm text-muted-foreground">
          Panele operacyjne i plan sprzedaży — demo BK.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="panels">Panele</TabsTrigger>
          <TabsTrigger value="plan">Plan i cele</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Raporty
            <Badge variant="secondary" className="ml-2 font-normal">
              Wkrótce
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="panels" className="mt-4 flex flex-col gap-4">
          <AnalyticsFiltersBar
            filters={filters}
            advisors={advisors}
            onChange={handleFiltersChange}
          />
          <AnalyticsPanelGrid
            widgetIds={widgetOrder}
            filters={filters}
            user={user}
            isLoading={isLoading}
            data={analyticsData}
            onReorder={setWidgetOrder}
          />
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <ExecutiveDashboard embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
