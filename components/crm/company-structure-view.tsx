"use client"

import * as React from "react"
import { NetworkIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { DepartmentEditButton, DepartmentFormDialog } from "@/components/crm/department-form-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSession } from "@/lib/auth/demo-session"
import { formatEmployeeName } from "@/lib/crm/employee-display"
import { useDemoData } from "@/lib/data/demo-data-context"

export function CompanyStructureView() {
  const { isReady } = useSession()
  const { departments, employees, removeDepartment } = useDemoData()

  const employeeNameById = React.useMemo(
    () =>
      new Map(
        employees.map((e) => [e.id, formatEmployeeName(e)] as const),
      ),
    [employees],
  )

  const employeeCountByDept = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const emp of employees) {
      counts.set(emp.departmentId, (counts.get(emp.departmentId) ?? 0) + 1)
    }
    return counts
  }, [employees])

  if (!isReady) {
    return null
  }

  function handleRemove(id: string, name: string) {
    const result = removeDepartment(id)
    if (!result.ok) {
      toast.error(result.reason)
      return
    }
    toast.success(`Usunięto dział: ${name}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Struktura firmy
          </h1>
          <p className="text-sm text-muted-foreground">
            Działy banku i kierownicy — podstawa filtrów w module Pracownicy
          </p>
        </div>
        <DepartmentFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Działy</CardTitle>
          <CardDescription>
            {departments.length}{" "}
            {departments.length === 1 ? "dział" : "działów"} w strukturze demo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <NetworkIcon />
                </EmptyMedia>
                <EmptyTitle>Brak działów</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwszy dział, aby przypisywać pracowników.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa działu</TableHead>
                  <TableHead>Kierownik</TableHead>
                  <TableHead className="text-right">Pracownicy</TableHead>
                  <TableHead className="w-[140px] text-right">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>
                      {dept.managerId
                        ? (employeeNameById.get(dept.managerId) ?? "—")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {employeeCountByDept.get(dept.id) ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <DepartmentEditButton department={dept} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(dept.id, dept.name)}
                          disabled={
                            (employeeCountByDept.get(dept.id) ?? 0) > 0
                          }
                          title={
                            (employeeCountByDept.get(dept.id) ?? 0) > 0
                              ? "Usuń pracowników z działu przed usunięciem"
                              : "Usuń dział"
                          }
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
