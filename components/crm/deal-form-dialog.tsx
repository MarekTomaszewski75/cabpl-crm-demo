"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { DealForm } from "@/components/crm/deal-form"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Deal } from "@/types/crm"

export function DealFormDialog({
  trigger,
  onSuccess,
  open,
  onOpenChange,
  defaultClientId = null,
  defaultContactId = null,
  defaultProductId = null,
  defaultBankAccountId = null,
}: {
  trigger?: React.ReactNode
  onSuccess?: (deal: Deal) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultClientId?: string | null
  defaultContactId?: string | null
  defaultProductId?: string | null
  defaultBankAccountId?: string | null
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {open === undefined ? (
        <SheetTrigger asChild>{trigger ?? <Button size="lg"><PlusIcon />Nowy deal</Button>}</SheetTrigger>
      ) : trigger}
      {isOpen ? (
        <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl data-[side=right]:sm:max-w-5xl">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle>Nowy deal</SheetTitle>
          </SheetHeader>
          <DealForm
            key={`new-${defaultClientId ?? "none"}-${defaultProductId ?? "none"}-${defaultBankAccountId ?? "none"}`}
            layout="sheet"
            defaultClientId={defaultClientId}
            defaultContactId={defaultContactId}
            defaultProductId={defaultProductId}
            defaultBankAccountId={defaultBankAccountId}
            onSuccess={(deal) => {
              setOpen(false)
              onSuccess?.(deal)
            }}
          />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
