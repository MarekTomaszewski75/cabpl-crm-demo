"use client"

import Link from "next/link"
import { ArrowLeftIcon, CheckIcon, MoreHorizontalIcon, XIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { canFinishDeal } from "@/lib/crm/deal-labels"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import type { Deal, DemoUser } from "@/types/crm"

export function DealDetailHeader({ deal, owner, onWonClick, onLostClick }: { deal: Deal; owner?: DemoUser; onWonClick: () => void; onLostClick: () => void }) {
  const canFinish = canFinishDeal(deal.status)
  return <div className="flex flex-col gap-3"><Button variant="ghost" size="sm" className="w-fit px-2" asChild><Link href="/pipeline"><ArrowLeftIcon data-icon="inline-start" />Deale</Link></Button><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 flex-col gap-1"><h1 className="truncate text-xl font-semibold tracking-tight">{deal.name}</h1>{owner ? <div className="flex flex-wrap items-center gap-2"><Avatar className="size-6"><AvatarFallback className="bg-primary/15 text-[10px] font-semibold">{displayInitials(owner.displayName)}</AvatarFallback></Avatar><span className="text-sm text-muted-foreground">Opiekun: {owner.displayName}</span><Badge variant="secondary">{owner.roleLabelPl}</Badge></div> : null}</div><div className="flex flex-wrap items-center gap-2">{canFinish ? <><Button type="button" variant="outline" onClick={onLostClick}><XIcon data-icon="inline-start" />Stracony deal</Button><Button type="button" onClick={onWonClick}><CheckIcon data-icon="inline-start" />Wygrany deal</Button></> : null}<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon-sm" aria-label="Menu deala"><MoreHorizontalIcon /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuGroup><DropdownMenuItem disabled>Opcje w przygotowaniu</DropdownMenuItem></DropdownMenuGroup></DropdownMenuContent></DropdownMenu></div></div></div>
}

