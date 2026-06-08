"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { ProductForm } from "@/components/crm/product-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Product } from "@/types/crm"

type ProductFormDialogProps = {
  trigger?: React.ReactNode
  onSuccess?: (product: Product) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductFormDialog({
  trigger,
  onSuccess,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: ProductFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChangeProp ?? setInternalOpen

  const defaultTrigger = (
    <Button size="lg">
      <PlusIcon />
      Dodaj
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
            <SheetTitle>Nowy produkt</SheetTitle>
          </SheetHeader>
          <ProductForm
            key="new"
            layout="sheet"
            onSuccess={(product) => {
              setOpen(false)
              onSuccess?.(product)
            }}
          />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
