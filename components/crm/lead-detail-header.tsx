"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  CheckIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { canFinishLead } from "@/lib/crm/lead-labels"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import type { DemoUser, Lead } from "@/types/crm"

type LeadDetailHeaderProps = {
  lead: Lead
  owner?: DemoUser
  onWonClick: () => void
  onLostClick: () => void
}

export function LeadDetailHeader({
  lead,
  owner,
  onWonClick,
  onLostClick,
}: LeadDetailHeaderProps) {
  const canFinish = canFinishLead(lead.status)

  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" size="sm" className="w-fit px-2" asChild>
        <Link href="/leads">
          <ArrowLeftIcon data-icon="inline-start" />
          Leady
        </Link>
      </Button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserPlusIcon />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {lead.name}
            </h1>
            {owner ? (
              <div className="flex flex-wrap items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="bg-primary/15 text-[10px] font-semibold">
                    {displayInitials(owner.displayName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Opiekun: {owner.displayName}
                </span>
                <Badge variant="secondary">{owner.roleLabelPl}</Badge>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canFinish ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onLostClick}
              >
                <XIcon data-icon="inline-start" />
                Niepowodzenie
              </Button>
              <Button type="button" onClick={onWonClick}>
                <CheckIcon data-icon="inline-start" />
                Wygrano
              </Button>
            </>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Menu leada"
              >
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  Edytuj (w przygotowaniu)
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Usuń (w przygotowaniu)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
