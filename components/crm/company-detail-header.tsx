"use client"

import Link from "next/link"
import { ArrowLeftIcon, Building2Icon, MoreHorizontalIcon } from "lucide-react"
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
import { displayInitials } from "@/lib/pipeline/stage-theme"
import type { Client, DemoUser } from "@/types/crm"

type CompanyDetailHeaderProps = {
  client: Client
  owner?: DemoUser
}

export function CompanyDetailHeader({
  client,
  owner,
}: CompanyDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" size="sm" className="w-fit px-2" asChild>
        <Link href="/clients">
          <ArrowLeftIcon data-icon="inline-start" />
          Firmy
        </Link>
      </Button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2Icon />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {client.name}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Menu firmy">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>Edytuj (w przygotowaniu)</DropdownMenuItem>
              <DropdownMenuItem disabled>Usuń (w przygotowaniu)</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
