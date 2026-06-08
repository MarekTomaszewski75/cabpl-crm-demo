"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/auth/demo-session"
import {
  LEAD_LOST_REASON_OPTIONS,
  canFinishLead,
} from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead, LeadLostReason } from "@/types/crm"

type FinishMode = "choose" | "won" | "lost"

type LeadFinishDialogProps = {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "won" | "lost"
}

export function LeadFinishDialog({
  lead,
  open,
  onOpenChange,
  defaultTab,
}: LeadFinishDialogProps) {
  const router = useRouter()
  const { user } = useSession()
  const { clients, winLead, loseLead } = useDemoData()
  const [mode, setMode] = React.useState<FinishMode>("choose")
  const [createContact, setCreateContact] = React.useState(false)
  const [lostReason, setLostReason] =
    React.useState<LeadLostReason>("other")

  const linkedClient = lead.clientId
    ? clients.find((c) => c.id === lead.clientId)
    : undefined

  React.useEffect(() => {
    if (!open) return
    if (defaultTab === "won") {
      setMode("won")
    } else if (defaultTab === "lost") {
      setMode("lost")
    } else {
      setMode("choose")
    }
    setCreateContact(!lead.contactId)
  }, [open, lead.name, lead.contactId, defaultTab])

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) setMode("choose")
  }

  function handleWinSubmit() {
    if (!user) return
    const opportunity = winLead(lead.id, {
      createContactFromLead: createContact && !lead.contactId,
      user,
    })
    if (!opportunity) {
      toast.error("Nie udało się zakończyć leada jako wygrany")
      return
    }
    toast.success("Lead oznaczony jako wygrany i utworzono deal", {
      action: {
        label: "Przejdź do deala",
        onClick: () => router.push(`/pipeline/${opportunity.id}`),
      },
    })
    handleOpenChange(false)
  }

  function handleLostSubmit() {
    if (!user) return
    loseLead(lead.id, lostReason, user)
    toast.success("Lead oznaczony jako utracony")
    handleOpenChange(false)
  }

  if (!canFinishLead(lead.status)) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lead zakończony</DialogTitle>
            <DialogDescription>
              Ten lead ma już status końcowy i nie można go ponownie
              finalizować.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {mode === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Zakończ przetwarzanie</DialogTitle>
              <DialogDescription>
                Wybierz wynik pracy nad leadem „{lead.name}”.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button type="button" onClick={() => setMode("won")}>
                Wygrano
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("lost")}
              >
                Niepowodzenie
              </Button>
            </div>
          </>
        ) : null}

        {mode === "won" ? (
          <>
            <DialogHeader>
              <DialogTitle>Wygrano</DialogTitle>
              <DialogDescription>
                Oznaczymy lead jako wygrany i utworzymy nowy deal.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Firma</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  {linkedClient
                    ? `Powiązana firma: ${linkedClient.name}`
                    : `Zostanie utworzona firma: ${lead.companyName.trim() || lead.name}`}
                </p>
              </Field>

              <Field>
                <FieldLabel>Kontakt</FieldLabel>
                {lead.contactId ? (
                  <p className="text-sm text-muted-foreground">
                    Lead ma przypisany kontakt w CRM.
                  </p>
                ) : (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={createContact}
                      onCheckedChange={(checked) =>
                        setCreateContact(checked === true)
                      }
                    />
                    Utwórz kontakt z danych leada (telefon/e-mail)
                  </label>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("choose")}
              >
                Wstecz
              </Button>
              <Button
                type="button"
                onClick={handleWinSubmit}
              >
                Zapisz wygraną
              </Button>
            </DialogFooter>
          </>
        ) : null}

        {mode === "lost" ? (
          <>
            <DialogHeader>
              <DialogTitle>Niepowodzenie</DialogTitle>
              <DialogDescription>
                Wybierz uzasadnienie utraty leada.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="lost-reason">Uzasadnienie</FieldLabel>
                <Select
                  value={lostReason}
                  onValueChange={(v) =>
                    setLostReason(v as LeadLostReason)
                  }
                >
                  <SelectTrigger id="lost-reason" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {LEAD_LOST_REASON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("choose")}
              >
                Wstecz
              </Button>
              <Button type="button" onClick={handleLostSubmit}>
                Zapisz przegraną
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
