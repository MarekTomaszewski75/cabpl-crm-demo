"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import { cn } from "@/lib/utils"
import type { DemoUser } from "@/types/crm"

type CrmUserHoverCardProps = {
  user: DemoUser
  avatarClassName?: string
  fallbackClassName?: string
  onClick?: (event: React.MouseEvent) => void
}

export function CrmUserHoverCard({
  user,
  avatarClassName,
  fallbackClassName,
  onClick,
}: CrmUserHoverCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Opiekun: ${user.displayName}`}
          onClick={onClick}
        >
          <Avatar className={cn("size-7", avatarClassName)}>
            <AvatarFallback
              className={cn(
                "bg-primary/15 text-[10px] font-semibold",
                fallbackClassName,
              )}
            >
              {displayInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-72">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/15 text-xs font-semibold">
                {displayInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex flex-col gap-0.5">
              <p className="truncate text-sm font-medium">{user.displayName}</p>
              <Badge variant="secondary" className="w-fit">
                {user.roleLabelPl}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            {user.scopeDescriptionPl}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
