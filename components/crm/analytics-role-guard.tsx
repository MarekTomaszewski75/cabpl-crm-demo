"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import { useSession } from "@/lib/auth/demo-session"
import type { UserRole } from "@/types/crm"

const ANALYTICS_ROLES: UserRole[] = ["executive", "regional_manager"]

export function AnalyticsRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const hasRedirected = React.useRef(false)

  React.useEffect(() => {
    if (!isReady || !user || hasRedirected.current) return
    if (!ANALYTICS_ROLES.includes(user.role)) {
      hasRedirected.current = true
      toast.error("Brak dostępu do modułu Analityka.")
      router.replace(getPostLoginPath(user))
    }
  }, [isReady, user, router])

  if (!isReady || !user) {
    return null
  }

  if (!ANALYTICS_ROLES.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
