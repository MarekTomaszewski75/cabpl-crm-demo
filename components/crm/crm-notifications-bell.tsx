"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BellIcon } from "lucide-react"
import { NotificationListItem } from "@/components/crm/notification-list-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNotifications } from "@/lib/notifications/notification-context"
import type { Notification } from "@/types/crm"

function unreadBadgeLabel(count: number): string {
  if (count > 9) return "9+"
  return String(count)
}

export function CrmNotificationsBell() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications()
  const [open, setOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (notification: Notification) => {
      markAsRead(notification.id)
      setOpen(false)
      if (notification.href) {
        router.push(notification.href)
      }
    },
    [markAsRead, router],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Powiadomienia"
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <Badge
              variant="destructive"
              className="pointer-events-none absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadBadgeLabel(unreadCount)}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <PopoverHeader className="border-b px-3 py-2.5">
          <PopoverTitle>Powiadomienia</PopoverTitle>
        </PopoverHeader>
        <div className="flex max-h-[400px] flex-col overflow-y-auto p-1">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Brak powiadomień
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
        {notifications.length > 0 ? (
          <div className="border-t px-3 py-2">
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
