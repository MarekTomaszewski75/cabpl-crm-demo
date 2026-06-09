"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  CheckIcon,
  MoreHorizontalIcon,
  XIcon,
} from "lucide-react"
import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
import { DealStatusBadge } from "@/components/crm/deal-status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { canFinishDeal } from "@/lib/crm/deal-labels"
import type { Deal, DemoUser } from "@/types/crm"

type DealDetailHeaderProps = {
  deal: Deal
  owner?: DemoUser
  onWonClick: () => void
  onLostClick: () => void
}

export function DealDetailHeader({
  deal,
  owner,
  onWonClick,
  onLostClick,
}: DealDetailHeaderProps) {
  const canFinish = canFinishDeal(deal.status, deal.pipelineCategoryId)

  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" size="sm" className="w-fit px-2" asChild>
        <Link href="/pipeline">
          <ArrowLeftIcon data-icon="inline-start" />
          Deale
        </Link>
      </Button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {deal.name}
            </h1>
            <DealStatusBadge
              status={deal.status}
              pipelineCategoryId={deal.pipelineCategoryId}
            />
          </div>
          {owner ? (
            <div className="flex flex-wrap items-center gap-2">
              <CrmUserHoverCard
                user={owner}
                avatarClassName="size-6"
                fallbackClassName="text-[10px]"
              />
              <span className="text-sm text-muted-foreground">
                Opiekun: {owner.displayName}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canFinish ? (
            <>
              <Button type="button" variant="outline" onClick={onLostClick}>
                <XIcon data-icon="inline-start" />
                Stracony deal
              </Button>
              <Button type="button" onClick={onWonClick}>
                <CheckIcon data-icon="inline-start" />
                Wygrany deal
              </Button>
            </>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="Menu deala">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  Opcje w przygotowaniu
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
