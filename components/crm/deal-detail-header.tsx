"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
import { DealStatusBadge } from "@/components/crm/deal-status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { canFinishDeal } from "@/lib/crm/deal-labels"
import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import { useDemoData } from "@/lib/data/demo-data-context"
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
  const router = useRouter()
  const { deleteDeal } = useDemoData()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const canFinish = canFinishDeal(deal.status, deal.pipelineCategoryId)
  const isTerminal = isTerminalDealStatus(deal.status)

  function handleDelete() {
    deleteDeal(deal.id)
    toast.success("Deal został usunięty")
    router.push("/pipeline")
  }

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
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setDeleteOpen(true)}
                >
                  <Trash2Icon />
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć deala?</AlertDialogTitle>
            <AlertDialogDescription>
              Deal „{deal.name}” zostanie trwale usunięty.
              {isTerminal
                ? " Deal ma status końcowy (wygrany lub utracony) — usunięcie nie cofnie wyniku w raportach demo."
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              <Trash2Icon data-icon="inline-start" />
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
