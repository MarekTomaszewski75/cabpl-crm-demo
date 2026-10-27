"use client"

import * as React from "react"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"
import type { DemoUser, ScopedEntity } from "@/types/crm"

/**
 * Próba otwarcia rekordu spoza zakresu RBAC — jeden wpis audytu na rekord (US-58).
 * Zwraca `true`, gdy dostęp jest zablokowany.
 */
export function useAccessDeniedAudit(
  entity: (ScopedEntity & { id: string }) | null | undefined,
  user: DemoUser | null,
  objectLabelPl: string,
): boolean {
  const { appendAuditEntry } = useDemoData()
  const loggedKey = React.useRef<string | null>(null)
  const denied = Boolean(entity && user && !canAccessEntity(entity, user))

  React.useEffect(() => {
    if (!denied || !entity || !user) return
    const key = `${user.id}:${entity.id}`
    if (loggedKey.current === key) return
    loggedKey.current = key
    appendAuditEntry({
      occurredAt: new Date().toISOString(),
      actorUserId: user.id,
      areaPl: "Uprawnienia",
      actionPl: "Odmowa dostępu",
      detailPl: `${objectLabelPl} — poza zakresem roli „${user.roleLabelPl}”.`,
    })
  }, [denied, entity, user, objectLabelPl, appendAuditEntry])

  return denied
}
