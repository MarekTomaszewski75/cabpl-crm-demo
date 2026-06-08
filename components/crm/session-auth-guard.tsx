"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { useSession } from "@/lib/auth/demo-session"

export function SessionAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isReady } = useSession()

  React.useEffect(() => {
    if (isReady && !user) {
      router.replace("/login")
    }
  }, [isReady, user, router])

  if (!isReady || !user) {
    return null
  }

  return <>{children}</>
}
