"use client"

import { useRouter } from "next/navigation"
import { BellIcon } from "lucide-react"
import { NotificationListItem } from "@/components/crm/notification-list-item"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useNotifications } from "@/lib/notifications/notification-context"
import type { Notification } from "@/types/crm"

const TODAY_NOTIFICATIONS_LIMIT = 5

function selectTodayNotifications(
  notifications: readonly Notification[],
): Notification[] {
  const unread = notifications.filter((notification) => !notification.read)
  const source = unread.length > 0 ? unread : notifications
  return source.slice(0, TODAY_NOTIFICATIONS_LIMIT)
}

export function TodayNotificationsCard() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead } = useNotifications()

  const visibleNotifications = selectTodayNotifications(notifications)

  const handleSelect = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.href) {
      router.push(notification.href)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="text-primary" />
          Powiadomienia
          {unreadCount > 0 ? (
            <Badge variant="secondary">{unreadCount}</Badge>
          ) : null}
        </CardTitle>
        <CardDescription>
          {unreadCount > 0
            ? `${unreadCount} nieprzeczytanych — najważniejsze na dziś`
            : "Ostatnie powiadomienia w sesji"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {visibleNotifications.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>Brak powiadomień</EmptyTitle>
              <EmptyDescription>
                Gdy pojawią się terminy lub przypomnienia, zobaczysz je tutaj i
                przy dzwonku w nagłówku.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-1">
            {visibleNotifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
                className="rounded-lg border bg-muted/30"
              />
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Pełna lista — ikona dzwonka w nagłówku aplikacji.
        </p>
      </CardContent>
    </Card>
  )
}
