"use client"

import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckSquareIcon,
  InfoIcon,
  UserRoundIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeTimePl } from "@/lib/format/pl"
import { getDemoToday } from "@/lib/crm/demo-today"
import type { Notification, NotificationType } from "@/types/crm"

function notificationTypeIcon(type: NotificationType) {
  switch (type) {
    case "deal_deadline":
      return BriefcaseIcon
    case "task_deadline":
      return CheckSquareIcon
    case "lead_stale":
      return UserRoundIcon
    case "meeting_soon":
      return CalendarIcon
    case "system":
      return InfoIcon
    default:
      return BellIcon
  }
}

type NotificationListItemProps = {
  notification: Notification
  onSelect: (notification: Notification) => void
  className?: string
}

export function NotificationListItem({
  notification,
  onSelect,
  className,
}: NotificationListItemProps) {
  const Icon = notificationTypeIcon(notification.type)
  const createdAt = new Date(notification.createdAt)

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        "flex w-full gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted/80",
        !notification.read && "bg-primary/5",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="text-muted-foreground" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm leading-snug",
              !notification.read && "font-medium",
            )}
          >
            {notification.titlePl}
          </span>
          {!notification.read ? (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {notification.bodyPl}
        </p>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTimePl(createdAt, getDemoToday())}
        </span>
      </div>
    </button>
  )
}
