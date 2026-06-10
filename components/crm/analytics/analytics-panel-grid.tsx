"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  AnalyticsWidget,
  getAnalyticsWidgetGridClass,
} from "@/components/crm/analytics-widget"
import { WidgetRenderer } from "@/components/crm/analytics/widgets/widget-renderer"
import { getAnalyticsWidgetById } from "@/lib/analytics/widget-registry"
import { isWidgetAvailableForRole } from "@/lib/analytics/widget-access"
import { cn } from "@/lib/utils"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { Deal, DemoUser, Lead, Task } from "@/types/crm"

type AnalyticsPanelGridProps = {
  widgetIds: string[]
  filters: AnalyticsGlobalFilters
  user: DemoUser
  isLoading?: boolean
  data: {
    leads: readonly Lead[]
    deals: readonly Deal[]
    tasks: readonly Task[]
    meetings?: readonly import("@/types/crm").Meeting[]
    users: readonly DemoUser[]
    clients?: readonly import("@/types/crm").Client[]
    kpi?: import("@/types/crm").KpiSnapshot
  }
  onReorder: (widgetIds: string[]) => void
  onAdvisorSelect?: (ownerId: string) => void
  onRegionSelect?: (regionId: string) => void
  onSegmentSelect?: (segmentId: string) => void
}

function reorderWidgets(
  items: string[],
  activeId: string,
  overId: string,
): string[] {
  const oldIndex = items.indexOf(activeId)
  const newIndex = items.indexOf(overId)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return items
  const next = [...items]
  next.splice(oldIndex, 1)
  next.splice(newIndex, 0, activeId)
  return next
}

type SortableAnalyticsWidgetProps = {
  widgetId: string
  filters: AnalyticsGlobalFilters
  user: DemoUser
  isLoading?: boolean
  data: AnalyticsPanelGridProps["data"]
  onAdvisorSelect?: (ownerId: string) => void
  onRegionSelect?: (regionId: string) => void
  onSegmentSelect?: (segmentId: string) => void
}

function SortableAnalyticsWidget({
  widgetId,
  filters,
  user,
  isLoading,
  data,
  onAdvisorSelect,
  onRegionSelect,
  onSegmentSelect,
}: SortableAnalyticsWidgetProps) {
  const definition = getAnalyticsWidgetById(widgetId)
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: widgetId })
  const { setNodeRef: setDropRef } = useDroppable({ id: widgetId })

  if (!definition) return null
  if (!isWidgetAvailableForRole(definition, user.role)) return null

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node)
    setDropRef(node)
  }

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        getAnalyticsWidgetGridClass(definition.size),
        isDragging && "opacity-50",
      )}
    >
      <AnalyticsWidget
        definition={definition}
        isRestricted={false}
        isLoading={isLoading}
        dragHandleProps={{ attributes, listeners }}
      >
        <WidgetRenderer
          definition={definition}
          filters={filters}
          user={user}
          data={data}
          onAdvisorSelect={onAdvisorSelect}
          onRegionSelect={onRegionSelect}
          onSegmentSelect={onSegmentSelect}
        />
      </AnalyticsWidget>
    </div>
  )
}

export function AnalyticsPanelGrid({
  widgetIds,
  filters,
  user,
  isLoading = false,
  data,
  onReorder,
  onAdvisorSelect,
  onRegionSelect,
  onSegmentSelect,
}: AnalyticsPanelGridProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const activeDefinition = activeId
    ? getAnalyticsWidgetById(activeId)
    : undefined

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    onReorder(reorderWidgets(widgetIds, String(active.id), String(over.id)))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgetIds
          .filter((widgetId) => {
            const definition = getAnalyticsWidgetById(widgetId)
            return definition && isWidgetAvailableForRole(definition, user.role)
          })
          .map((widgetId) => (
          <SortableAnalyticsWidget
            key={widgetId}
            widgetId={widgetId}
            filters={filters}
            user={user}
            isLoading={isLoading}
            data={data}
            onAdvisorSelect={onAdvisorSelect}
            onRegionSelect={onRegionSelect}
            onSegmentSelect={onSegmentSelect}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDefinition &&
        isWidgetAvailableForRole(activeDefinition, user.role) ? (
          <AnalyticsWidget
            definition={activeDefinition}
            isRestricted={false}
            className="shadow-lg"
          >
            <div className="min-h-24" />
          </AnalyticsWidget>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
