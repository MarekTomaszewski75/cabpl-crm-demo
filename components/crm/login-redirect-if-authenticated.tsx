"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { useSession } from "@/lib/auth/demo-session"
import { getPostLoginPath } from "@/lib/auth/post-login-path"

export function LoginRedirectIfAuthenticated() {
  const router = useRouter()
  const { user, isReady } = useSession()

  React.useEffect(() => {
    if (isReady && user) {
      router.replace(getPostLoginPath(user))
    }
  }, [isReady, user, router])

  return null
}
