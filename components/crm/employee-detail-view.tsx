"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { EmployeeForm } from "@/components/crm/employee-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "@/lib/auth/demo-session"
import { formatEmployeeName } from "@/lib/crm/employee-display"
import { employeeStatusBadgeVariant } from "@/lib/crm/employee-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { EMPLOYEE_STATUS_LABELS } from "@/types/crm"

type EmployeeDetailViewProps = {
  employeeId: string
}

export function EmployeeDetailView({ employeeId }: EmployeeDetailViewProps) {
  const { isReady } = useSession()
  const { employees } = useDemoData()
  const employee = employees.find((e) => e.id === employeeId)

  if (!isReady) {
    return null
  }

  if (!employee) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono pracownika</AlertTitle>
        <AlertDescription>
          Brak pracownika o podanym identyfikatorze w danych demo.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href="/employees">
          <ArrowLeftIcon data-icon="inline-start" />
          Pracownicy
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          {formatEmployeeName(employee)}
        </h1>
        <Badge variant={employeeStatusBadgeVariant(employee.status)}>
          {EMPLOYEE_STATUS_LABELS[employee.status]}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EmployeeForm
            key={employee.id}
            employee={employee}
            layout="page"
            onSuccess={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}
