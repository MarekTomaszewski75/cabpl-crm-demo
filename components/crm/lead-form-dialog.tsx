"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { LeadForm } from "@/components/crm/lead-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Lead } from "@/types/crm"

type LeadFormDialogProps = {
  trigger?: React.ReactNode
  onSuccess?: (lead: Lead) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LeadFormDialog({
  trigger,
  onSuccess,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: LeadFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChangeProp ?? setInternalOpen

  const defaultTrigger = (
    <Button size="lg">
      <PlusIcon />
      Nowy lead
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {openProp === undefined ? (
        <SheetTrigger asChild>{trigger ?? defaultTrigger}</SheetTrigger>
      ) : (
        trigger
      )}
      {open ? (
        <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl data-[side=right]:sm:max-w-5xl">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle>Nowy lead</SheetTitle>
          </SheetHeader>
          <LeadForm
            key="new"
            layout="sheet"
            onSuccess={(lead) => {
              setOpen(false)
              onSuccess?.(lead)
            }}
          />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
