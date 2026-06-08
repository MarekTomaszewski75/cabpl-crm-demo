"use client"

import * as React from "react"
import usersSeed from "@/data/users.json"
import type { DemoUser } from "@/types/crm"

const SESSION_STORAGE_KEY = "cabpl-demo-session"

type StoredSession = {
  userId: string
}

const usersById = new Map(
  (usersSeed as DemoUser[]).map((user) => [user.id, user])
)

function readStoredUserId(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSession
    return parsed.userId ?? null
  } catch {
    return null
  }
}

function resolveUser(userId: string): DemoUser | null {
  return usersById.get(userId) ?? null
}

type SessionContextValue = {
  user: DemoUser | null
  isReady: boolean
  login: (userId: string) => DemoUser | null
  logout: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<DemoUser | null>(null)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const storedId = readStoredUserId()
    if (storedId) {
      setUser(resolveUser(storedId))
    }
    setIsReady(true)
  }, [])

  const login = React.useCallback((userId: string) => {
    const nextUser = resolveUser(userId)
    if (!nextUser) return null
    setUser(nextUser)
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ userId: nextUser.id } satisfies StoredSession)
    )
    return nextUser
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }, [])

  const value = React.useMemo(
    () => ({ user, isReady, login, logout }),
    [user, isReady, login, logout]
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within SessionProvider")
  }
  return context
}
