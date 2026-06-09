"use client"

import * as React from "react"
import notificationsSeed from "@/data/notifications.json"
import { getDemoToday } from "@/lib/crm/demo-today"
import {
  generateNotificationsForUser,
  mergeSeedAndGeneratedNotifications,
} from "@/lib/crm/notification-rules"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Notification } from "@/types/crm"

type NotificationContextValue = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationContext = React.createContext<NotificationContextValue | null>(
  null,
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isReady } = useSession()
  const { opportunities, tasks, leads, leadActivities, meetings } = useDemoData()
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  React.useEffect(() => {
    if (!isReady) return

    if (!user) {
      setNotifications([])
      return
    }

    const seed = (notificationsSeed as Notification[]).filter(
      (notification) => notification.userId === user.id,
    )
    const generated = generateNotificationsForUser(
      user,
      {
        deals: opportunities,
        tasks,
        leads,
        leadActivities,
        meetings,
      },
      getDemoToday(),
    )

    setNotifications(mergeSeedAndGeneratedNotifications(seed, generated))
  }, [
    isReady,
    user,
    opportunities,
    tasks,
    leads,
    leadActivities,
    meetings,
  ])

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }, [])

  const markAllAsRead = React.useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    )
  }, [])

  const unreadCount = React.useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
