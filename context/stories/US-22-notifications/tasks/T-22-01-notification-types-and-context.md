# T-22-01 — Typy, seed i NotificationContext

**Story:** [US-22](../story.md)  
**Status:** Done

## Cel

Model powiadomień, provider i generator reguł MVP — bez UI headera.

## Zakres techniczny

### `types/crm.ts`

```ts
export type NotificationType =
  | "deal_deadline"
  | "task_deadline"
  | "lead_stale"
  | "meeting_soon"
  | "system"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  titlePl: string
  bodyPl: string
  createdAt: string
  read: boolean
  entityType: "deal" | "lead" | "task" | "meeting" | null
  entityId: string | null
  href: string | null
}
```

### `data/notifications.json`

- 2–3 wpisy na użytkownika demo (`user-anna`, itd.) — mix read/unread.

### `lib/crm/notification-rules.ts`

- `generateNotificationsForUser(user, data, asOfDate): Notification[]` — reguły ze story US-22.
- Reuse logiki z `today-pipeline-summary.ts` gdzie możliwe (DRY bez over-abstraction).

### `lib/notifications/notification-context.tsx` (lub `context/notifications-context.tsx`)

- Stan: `notifications[]`.
- API: `markAsRead(id)`, `markAllAsRead()`, `unreadCount`.
- Init: merge seed + wygenerowane przy mount (deduplikacja po `entityType+entityId+type`).

### `AppProviders`

- Owinąć `NotificationProvider` wewnątrz `SessionProvider` + `DemoDataProvider` (potrzebuje user + data).

## Done when

- [x] Typy i seed załadowane.
- [x] Context dostępny przez `useNotifications()`.
- [x] Generator tworzy sensowne wpisy dla doradcy po logowaniu.
- [x] `unreadCount` poprawny.

## Poza zakresem

- Bell UI (→ T-22-02).
