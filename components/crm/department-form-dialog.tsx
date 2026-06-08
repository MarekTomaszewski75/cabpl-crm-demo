"use client"

import * as React from "react"
import { PencilIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDemoData } from "@/lib/data/demo-data-context"
import { createNextDepartmentId } from "@/lib/crm/department-id"
import { formatEmployeeName } from "@/lib/crm/employee-display"
import type { Department } from "@/types/crm"

const MANAGER_NONE = "__none__"

type DepartmentFormDialogProps = {
  department?: Department
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function DepartmentFormDialog({
  department,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: DepartmentFormDialogProps) {
  const { departments, employees, addDepartment, updateDepartment } =
    useDemoData()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isEdit = Boolean(department)

  const [name, setName] = React.useState(department?.name ?? "")
  const [managerId, setManagerId] = React.useState(
    department?.managerId ?? MANAGER_NONE,
  )

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  React.useEffect(() => {
    if (open) {
      setName(department?.name ?? "")
      setManagerId(department?.managerId ?? MANAGER_NONE)
    }
  }, [open, department])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error("Nazwa działu jest wymagana")
      return
    }
    const manager =
      managerId === MANAGER_NONE ? null : managerId

    if (isEdit && department) {
      updateDepartment(department.id, { name: trimmed, managerId: manager })
      toast.success(`Zaktualizowano dział: ${trimmed}`)
    } else {
      addDepartment({
        id: createNextDepartmentId(departments),
        name: trimmed,
        managerId: manager,
      })
      toast.success(`Dodano dział: ${trimmed}`)
    }
    setOpen(false)
  }

  const dialog = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edytuj dział" : "Nowy dział"}</DialogTitle>
        <DialogDescription>
          Kierownik działu wybierany z listy pracowników.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-4 py-2">
          <Field>
            <FieldLabel htmlFor="dept-name">Nazwa działu *</FieldLabel>
            <Input
              id="dept-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel>Kierownik działu</FieldLabel>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz kierownika" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MANAGER_NONE}>— Brak —</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {formatEmployeeName(emp)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button type="submit">{isEdit ? "Zapisz" : "Dodaj dział"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  if (isEdit && controlledOpen !== undefined) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialog}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon />
            Nowy dział
          </Button>
        )}
      </DialogTrigger>
      {dialog}
    </Dialog>
  )
}

export function DepartmentEditButton({
  department,
}: {
  department: Department
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <PencilIcon className="size-4" />
        Edytuj
      </Button>
      <DepartmentFormDialog
        department={department}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
