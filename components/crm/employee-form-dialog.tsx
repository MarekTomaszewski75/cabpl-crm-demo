"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { EmployeeForm } from "@/components/crm/employee-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type EmployeeFormDialogProps = {
  trigger?: React.ReactNode
}

export function EmployeeFormDialog({ trigger }: EmployeeFormDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="lg">
            <PlusIcon />
            Nowy pracownik
          </Button>
        )}
      </SheetTrigger>
      {open ? (
        <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl data-[side=right]:sm:max-w-5xl">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle>Nowy pracownik</SheetTitle>
          </SheetHeader>
          <EmployeeForm
            key="new"
            layout="sheet"
            onSuccess={() => setOpen(false)}
          />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
