"use client"

import * as React from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatDatePl } from "@/lib/format/pl"
import type { LeadSource } from "@/types/crm"

export function SalesRulesView() {
  const { user, isReady } = useSession()
  const {
    users,
    salesDictionary,
    auditLog,
    proposeSalesDictionaryLabel,
    approveSalesDictionaryLabel,
  } = useDemoData()
  const [drafts, setDrafts] = React.useState<Partial<Record<LeadSource, string>>>(
    {},
  )

  if (!isReady || !user) return null

  const canApprove = user.role === "regional_manager"
  const entries = [...auditLog].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  )

  function handlePropose(sourceId: LeadSource) {
    const nextLabel = drafts[sourceId]?.trim() ?? ""
    if (!nextLabel) {
      toast.message("Wpisz nową etykietę")
      return
    }
    proposeSalesDictionaryLabel(sourceId, nextLabel, user!)
    setDrafts((prev) => ({ ...prev, [sourceId]: "" }))
    toast.success("Zmiana czeka na zatwierdzenie menedżera regionu")
  }

  function handleApprove(sourceId: LeadSource) {
    if (!canApprove) return
    approveSalesDictionaryLabel(sourceId, user!)
    toast.success("Zmiana słownika zatwierdzona")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-lg font-medium">Reguły sprzedaży</h1>
        <p className="text-sm text-muted-foreground">
          Słownik źródeł leada. Zmiana etykiety wymaga zatwierdzenia
          menedżera regionu i zostaje w audycie.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Źródła leadów</CardTitle>
          <CardDescription>
            {canApprove
              ? "Możesz zatwierdzić zgłoszone zmiany etykiet."
              : "Zgłoś zmianę etykiety. Zatwierdza ją Marek Wiśniewski."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {salesDictionary.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.labelPl}</span>
                <Badge
                  variant={item.status === "pending" ? "secondary" : "outline"}
                >
                  {item.status === "pending" ? "Do zatwierdzenia" : "Zatwierdzone"}
                </Badge>
              </div>
              {item.status === "pending" && item.proposedLabelPl ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">
                    Propozycja: {item.proposedLabelPl}
                  </span>
                  {canApprove ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleApprove(item.id)}
                    >
                      Zatwierdź
                    </Button>
                  ) : null}
                </div>
              ) : (
                <FieldGroup>
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor={`dict-${item.id}`} className="sr-only">
                      Nowa etykieta
                    </FieldLabel>
                    <Input
                      id={`dict-${item.id}`}
                      value={drafts[item.id] ?? ""}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Nowa etykieta"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePropose(item.id)}
                    >
                      Zgłoś zmianę
                    </Button>
                  </Field>
                </FieldGroup>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audyt</CardTitle>
          <CardDescription>
            Zgłoszenia słownika, zatwierdzenia i ponowienia integracji.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">Brak wpisów.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {entries.map((entry) => {
                const actor = users.find((item) => item.id === entry.actorUserId)
                return (
                  <li key={entry.id} className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground">
                      {formatDatePl(entry.occurredAt)} · {entry.areaPl} ·{" "}
                      {actor?.displayName ?? "Użytkownik"}
                    </span>
                    <span className="font-medium">{entry.actionPl}</span>
                    <span>{entry.detailPl}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
