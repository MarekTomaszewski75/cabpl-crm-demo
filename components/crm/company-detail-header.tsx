"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  Building2Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"
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
import { useDemoData } from "@/lib/data/demo-data-context"
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
  const router = useRouter()
  const { deleteClient, deals, tasks } = useDemoData()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const relatedDeals = deals.filter((deal) => deal.clientId === client.id)
  const openTasks = tasks.filter(
    (task) => task.clientId === client.id && !task.completed,
  )

  function handleDelete() {
    deleteClient(client.id)
    toast.success("Firma została usunięta")
    router.push("/clients")
  }

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
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="Menu firmy">
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
            <AlertDialogTitle>Usunąć firmę?</AlertDialogTitle>
            <AlertDialogDescription>
              Firma „{client.name}” zostanie trwale usunięta.
              {relatedDeals.length > 0
                ? ` Powiązane deale (${relatedDeals.length}) pozostaną w pipeline — zostaną odłączone od firmy.`
                : null}
              {openTasks.length > 0
                ? ` Otwarte zadania (${openTasks.length}) pozostaną bez przypisania do firmy.`
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
