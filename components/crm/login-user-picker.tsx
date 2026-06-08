"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth/demo-session"
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import type { DemoUser } from "@/types/crm"

function userInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type LoginUserPickerProps = {
  users: DemoUser[]
}

export function LoginUserPicker({ users }: LoginUserPickerProps) {
  const router = useRouter()
  const { login } = useSession()
  const [selectedId, setSelectedId] = React.useState<string | null>(
    users[0]?.id ?? null
  )

  const handleLogin = React.useCallback(
    (userId: string) => {
      const loggedIn = login(userId)
      if (!loggedIn) return
      router.replace(getPostLoginPath(loggedIn))
    },
    [login, router]
  )

  return (
    <Card className="rounded-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Zaloguj się</CardTitle>
        <CardDescription>
          Wybierz konto demo, aby wejść do CRM korporacyjnego.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          className="flex flex-col gap-1"
          role="listbox"
          aria-label="Konta demo"
        >
          {users.map((user) => {
            const isSelected = selectedId === user.id
            return (
              <Button
                key={user.id}
                type="button"
                variant="ghost"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left",
                  isSelected && "bg-muted ring-2 ring-ring"
                )}
                onClick={() => {
                  setSelectedId(user.id)
                  handleLogin(user.id)
                }}
              >
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary/15 font-semibold text-foreground">
                    {userInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-semibold text-foreground">
                    {user.displayName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.roleLabelPl}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.scopeDescriptionPl}
                  </span>
                </span>
              </Button>
            )
          })}
        </div>
        <Button
          size="lg"
          className="h-11 rounded-full text-sm font-semibold"
          disabled={!selectedId}
          onClick={() => selectedId && handleLogin(selectedId)}
        >
          Zaloguj
        </Button>
      </CardContent>
    </Card>
  )
}
