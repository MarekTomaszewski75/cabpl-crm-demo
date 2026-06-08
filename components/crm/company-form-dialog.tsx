"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"
import { CompanyForm } from "@/components/crm/company-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Client } from "@/types/crm"

type CompanyFormDialogProps = {
  trigger?: React.ReactNode
}

export function CompanyFormDialog({ trigger }: CompanyFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  function handleSuccess(client: Client) {
    setOpen(false)
    router.push(`/clients/${client.id}`)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="lg">
            <PlusIcon />
            Nowa firma
          </Button>
        )}
      </SheetTrigger>
      {open ? (
        <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg data-[side=right]:sm:max-w-lg">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle>Nowa firma</SheetTitle>
          </SheetHeader>
          <CompanyForm key="new" layout="sheet" onSuccess={handleSuccess} />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
