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
import { AnalyticsWidget } from "@/components/crm/analytics-widget"
import { WidgetRenderer } from "@/components/crm/analytics/widgets/widget-renderer"
import { getAnalyticsWidgetById } from "@/lib/analytics/widget-registry"
import { isAnalyticsWidgetRestricted } from "@/lib/analytics/widget-access"
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
    users: readonly DemoUser[]
  }
  onReorder: (widgetIds: string[]) => void
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
}

function SortableAnalyticsWidget({
  widgetId,
  filters,
  user,
  isLoading,
  data,
}: SortableAnalyticsWidgetProps) {
  const definition = getAnalyticsWidgetById(widgetId)
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: widgetId })
  const { setNodeRef: setDropRef } = useDroppable({ id: widgetId })

  if (!definition) return null

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
      className={cn(isDragging && "opacity-50")}
    >
      <AnalyticsWidget
        definition={definition}
        isRestricted={isAnalyticsWidgetRestricted(definition, user)}
        isLoading={isLoading}
        dragHandleProps={{ attributes, listeners }}
      >
        <WidgetRenderer
          definition={definition}
          filters={filters}
          user={user}
          data={data}
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
        {widgetIds.map((widgetId) => (
          <SortableAnalyticsWidget
            key={widgetId}
            widgetId={widgetId}
            filters={filters}
            user={user}
            isLoading={isLoading}
            data={data}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDefinition ? (
          <AnalyticsWidget
            definition={activeDefinition}
            isRestricted={isAnalyticsWidgetRestricted(activeDefinition, user)}
            className="shadow-lg"
          >
            <div className="min-h-24" />
          </AnalyticsWidget>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
