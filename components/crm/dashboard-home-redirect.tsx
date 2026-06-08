"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import { useSession } from "@/lib/auth/demo-session"

export function DashboardHomeRedirect() {
  const router = useRouter()
  const { user, isReady } = useSession()

  React.useEffect(() => {
    if (!isReady || !user) return
    router.replace(getPostLoginPath(user))
  }, [isReady, user, router])

  return null
}
