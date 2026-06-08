"use client"

import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { LogInIcon, MoreVerticalIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DEAL_SOURCE_LABELS,
  isTerminalDealStatus,
} from "@/lib/crm/deal-labels"
import { DEAL_KANBAN_THEME } from "@/lib/crm/deal-kanban"
import { formatCurrencyPln, formatDatePl, formatTimePl } from "@/lib/format/pl"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import { cn } from "@/lib/utils"
import type { Client, DemoUser, Deal, DealStatus } from "@/types/crm"

type DealKanbanCardProps = {
  deal: Deal
  status: DealStatus
  owner?: DemoUser
  client?: Client
  isDragOverlay?: boolean
  onOpen?: () => void
}

export function DealKanbanCard({
  deal,
  status,
  owner,
  client,
  isDragOverlay = false,
  onOpen,
}: DealKanbanCardProps) {
  const theme = DEAL_KANBAN_THEME[status]
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const dragDisabled = isDragOverlay || isTerminalDealStatus(deal.status)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
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
          {deal.name}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label="Menu deala"
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
                Otwórz deal
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {client ? (
        <p className="truncate text-xs text-muted-foreground">{client.name}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {deal.source ? (
          <span className="inline-flex items-center gap-1">
            <LogInIcon className="size-3.5 shrink-0" aria-hidden />
            {DEAL_SOURCE_LABELS[deal.source]}
          </span>
        ) : null}
        {deal.amount !== null ? (
          <span className="font-medium tabular-nums text-foreground">
            {formatCurrencyPln(deal.amount)}
          </span>
        ) : null}
      </div>

      <time
        className="w-fit rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
        dateTime={deal.createdAt}
      >
        {formatDatePl(deal.createdAt)}, {formatTimePl(deal.createdAt)}
      </time>

      <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-2">
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
