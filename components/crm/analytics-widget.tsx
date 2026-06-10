"use client"

import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { GripVerticalIcon, MoreHorizontalIcon } from "lucide-react"
import { AnalyticsDomainBadge } from "@/components/crm/analytics-domain-badge"
import { AnalyticsWidgetRestricted } from "@/components/crm/analytics-widget-restricted"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { AnalyticsWidgetDefinition, AnalyticsWidgetSize } from "@/types/analytics"

const WIDGET_SIZE_CLASSES: Record<AnalyticsWidgetSize, string> = {
  "1x1": "col-span-1",
  "2x1": "col-span-1 md:col-span-2",
  "1x2": "col-span-1 row-span-2",
  "2x2": "col-span-1 md:col-span-2 row-span-2",
  "4x2": "col-span-1 md:col-span-2 xl:col-span-4 row-span-2",
}

export type AnalyticsWidgetDragHandleProps = {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}

type AnalyticsWidgetProps = {
  definition: AnalyticsWidgetDefinition
  isRestricted: boolean
  isLoading?: boolean
  dragHandleProps?: AnalyticsWidgetDragHandleProps
  className?: string
  children: React.ReactNode
}

export function getAnalyticsWidgetGridClass(size: AnalyticsWidgetSize): string {
  return WIDGET_SIZE_CLASSES[size]
}

export function AnalyticsWidget({
  definition,
  isRestricted,
  isLoading = false,
  dragHandleProps,
  className,
  children,
}: AnalyticsWidgetProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl shadow-sm ring-foreground/8",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/5 to-transparent"
        aria-hidden
      />
      <CardHeader className="relative flex flex-row items-center gap-2 border-b border-border/50 pb-3">
        {dragHandleProps ? (
          <button
            type="button"
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label="Przeciągnij widżet"
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}
          >
            <GripVerticalIcon aria-hidden />
          </button>
        ) : (
          <GripVerticalIcon
            className="text-muted-foreground/40"
            aria-hidden
          />
        )}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="truncate font-heading text-sm font-medium">
            {definition.titlePl}
          </span>
          <AnalyticsDomainBadge domain={definition.domainTag} />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Opcje widżetu"
            >
              <MoreHorizontalIcon aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Etap 1</TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="relative min-h-36 pt-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : isRestricted ? (
          <AnalyticsWidgetRestricted />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
