"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  UserPlusIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
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
import { canFinishLead } from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
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
  const router = useRouter()
  const { deleteLead } = useDemoData()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const canFinish = canFinishLead(lead.status)

  function handleDelete() {
    deleteLead(lead.id)
    toast.success("Lead został usunięty")
    router.push("/leads")
  }

  const showDealWarning =
    lead.status === "won" && lead.opportunityId !== null

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
            <AlertDialogTitle>Usunąć leada?</AlertDialogTitle>
            <AlertDialogDescription>
              Lead „{lead.name}” zostanie trwale usunięty.
              {showDealWarning
                ? " Powiązany deal pozostanie w pipeline — lead zostanie odłączony."
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
