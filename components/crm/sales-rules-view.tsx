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
import {
  canDecideSalesDictionaryChange,
  SALES_DICTIONARY_APPROVER_ROLES,
} from "@/lib/crm/sales-dictionary-rules"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import type { LeadSource } from "@/types/crm"

export function SalesRulesView() {
  const { user, isReady } = useSession()
  const {
    users,
    salesDictionary,
    auditLog,
    proposeSalesDictionaryLabel,
    approveSalesDictionaryLabel,
    rejectSalesDictionaryLabel,
  } = useDemoData()
  const [drafts, setDrafts] = React.useState<Partial<Record<LeadSource, string>>>(
    {},
  )
  const [reasons, setReasons] = React.useState<
    Partial<Record<LeadSource, string>>
  >({})

  if (!isReady || !user) return null

  const isApprover = SALES_DICTIONARY_APPROVER_ROLES.includes(user.role)
  /** Audyt zawiera nazwy rekordów spoza portfela — need-to-know. */
  const canSeeAudit = isApprover || user.role === "executive"
  const entries = [...auditLog].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  )
  const userName = (id: string | null) =>
    users.find((item) => item.id === id)?.displayName ?? "Użytkownik"

  function handlePropose(sourceId: LeadSource) {
    const nextLabel = drafts[sourceId]?.trim() ?? ""
    const reason = reasons[sourceId]?.trim() ?? ""
    if (!nextLabel || !reason) {
      toast.message("Wpisz nową etykietę i uzasadnienie zmiany")
      return
    }
    proposeSalesDictionaryLabel(sourceId, nextLabel, reason, user!)
    setDrafts((prev) => ({ ...prev, [sourceId]: "" }))
    setReasons((prev) => ({ ...prev, [sourceId]: "" }))
    toast.success("Zmiana czeka na zatwierdzenie przez drugą osobę")
  }

  function handleApprove(sourceId: LeadSource) {
    approveSalesDictionaryLabel(sourceId, user!)
    toast.success("Zmiana słownika zatwierdzona")
  }

  function handleReject(sourceId: LeadSource) {
    rejectSalesDictionaryLabel(sourceId, user!)
    toast.message("Zmiana słownika odrzucona")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-lg font-medium">Reguły sprzedaży</h1>
        <p className="text-sm text-muted-foreground">
          Słownik źródeł leadów i szans. Zmianę zgłasza dowolny użytkownik z
          uzasadnieniem, a zatwierdza administrator biznesowy lub menedżer
          regionu, nigdy autor zgłoszenia. Każdy krok trafia do audytu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Źródła leadów</CardTitle>
          <CardDescription>
            {isApprover
              ? "Możesz zatwierdzać i odrzucać zmiany zgłoszone przez inne osoby."
              : "Zgłoś zmianę etykiety. Zatwierdza ją administrator biznesowy lub menedżer regionu."}
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
                <div className="flex flex-col gap-2">
                  <span>
                    Propozycja: <strong>{item.proposedLabelPl}</strong>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Zgłosił(a): {userName(item.proposedByUserId)} · Uzasadnienie:{" "}
                    {item.proposedJustificationPl}
                  </span>
                  {canDecideSalesDictionaryChange(user, item) ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                      >
                        Zatwierdź
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(item.id)}
                      >
                        Odrzuć
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {item.proposedByUserId === user.id
                        ? "Twoja zmiana czeka na zatwierdzenie przez drugą osobę."
                        : "Czeka na zatwierdzenie przez administratora biznesowego lub menedżera regionu."}
                    </span>
                  )}
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
                    <FieldLabel
                      htmlFor={`dict-reason-${item.id}`}
                      className="sr-only"
                    >
                      Uzasadnienie
                    </FieldLabel>
                    <Input
                      id={`dict-reason-${item.id}`}
                      value={reasons[item.id] ?? ""}
                      onChange={(event) =>
                        setReasons((prev) => ({
                          ...prev,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Uzasadnienie zmiany"
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

      {canSeeAudit ? (
        <Card>
          <CardHeader>
            <CardTitle>Audyt</CardTitle>
            <CardDescription>
              Zgłoszenia i decyzje w słowniku (stan przed i po), odmowy dostępu
              oraz ponowienia integracji. Wpisów nie można edytować.
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
                        {formatDatePl(entry.occurredAt)}{" "}
                        {formatTimePl(entry.occurredAt)} · {entry.areaPl} ·{" "}
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
      ) : null}
    </div>
  )
}
