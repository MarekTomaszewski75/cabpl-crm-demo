"use client"

import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  CalendarCheckIcon,
  CalendarIcon,
  FileTextIcon,
  LogInIcon,
  MoreVerticalIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LEAD_SOURCE_LABELS, isTerminalLeadStatus } from "@/lib/crm/lead-labels"
import { LEAD_KANBAN_THEME } from "@/lib/crm/lead-kanban"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import { cn } from "@/lib/utils"
import type { DemoUser, Lead, LeadStatus } from "@/types/crm"

type LeadKanbanCardProps = {
  lead: Lead
  status: LeadStatus
  owner?: DemoUser
  isDragOverlay?: boolean
  onOpen?: () => void
}

export function LeadKanbanCard({
  lead,
  status,
  owner,
  isDragOverlay = false,
  onOpen,
}: LeadKanbanCardProps) {
  const theme = LEAD_KANBAN_THEME[status]
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const dragDisabled = isDragOverlay || isTerminalLeadStatus(lead.status)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead.id,
      disabled: dragDisabled,
    })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  function handlePointerDown(event: React.PointerEvent) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY }
  }

  function handleClick(event: React.MouseEvent) {
    if (isDragOverlay || isDragging) return
    const start = pointerStartRef.current
    if (!start) return
    const dx = Math.abs(event.clientX - start.x)
    const dy = Math.abs(event.clientY - start.y)
    if (dx + dy > 6) return
    onOpen?.()
  }

  const dragListeners = dragDisabled
    ? {}
    : {
        ...attributes,
        ...listeners,
        onPointerDown: (event: React.PointerEvent) => {
          handlePointerDown(event)
          listeners?.onPointerDown?.(event)
        },
      }

  return (
    <article
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      onClick={handleClick}
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-border/80 bg-card p-3 shadow-sm",
        "border-l-4",
        theme.accent,
        dragDisabled
          ? "cursor-pointer"
          : "cursor-grab touch-none active:cursor-grabbing",
        isDragging && !isDragOverlay && "opacity-45",
        isDragOverlay && "rotate-1 shadow-lg ring-2 ring-primary/35",
      )}
      {...dragListeners}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug">
          {lead.name}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label="Menu leada"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onOpen?.()}>
                Otwórz lead
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <LogInIcon className="size-3.5 shrink-0" aria-hidden />
          {LEAD_SOURCE_LABELS[lead.source]}
        </span>
      </div>

      <time
        className="w-fit rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
        dateTime={lead.createdAt}
      >
        {formatDatePl(lead.createdAt)}, {formatTimePl(lead.createdAt)}
      </time>

      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-xs tabular-nums">
            <CalendarCheckIcon className="size-3.5" aria-hidden />
            0
          </span>
          <span className="inline-flex items-center gap-1 text-xs tabular-nums">
            <CalendarIcon className="size-3.5" aria-hidden />
            0
          </span>
          <span className="inline-flex items-center gap-1 text-xs tabular-nums">
            <FileTextIcon className="size-3.5" aria-hidden />
            0
          </span>
        </div>
        {owner ? (
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-[10px] font-semibold">
              {displayInitials(owner.displayName)}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    </article>
  )
}
