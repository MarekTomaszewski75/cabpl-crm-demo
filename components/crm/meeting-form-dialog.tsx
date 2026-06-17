"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDemoData } from "@/lib/data/demo-data-context"
import { createNextMeetingId } from "@/lib/crm/meeting-id"
import { toLocalDateKey } from "@/lib/crm/calendar-week"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, DemoUser, Meeting } from "@/types/crm"

const DEFAULT_DURATION_MS = 60 * 60 * 1000

type MeetingFormDialogProps = {
  user: DemoUser
  defaultClientId?: string | null
  defaultNote?: string | null
  defaultTitle?: string | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

function defaultDateValue(): string {
  return toLocalDateKey(new Date())
}

function defaultTimeValue(): string {
  return "09:00"
}

export function MeetingFormDialog({
  user,
  defaultClientId = null,
  defaultNote = null,
  defaultTitle = null,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
}: MeetingFormDialogProps) {
  const { meetings, clients, addMeeting } = useDemoData()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [clientId, setClientId] = React.useState<string | undefined>(
    defaultClientId ?? undefined,
  )
  const [date, setDate] = React.useState(defaultDateValue)
  const [time, setTime] = React.useState(defaultTimeValue)
  const [note, setNote] = React.useState(defaultNote ?? "")

  const open = openProp ?? internalOpen
  const setOpen = onOpenChangeProp ?? setInternalOpen

  const scopedClients = React.useMemo(
    () => filterByScope(clients, user),
    [clients, user],
  )

  function resetForm() {
    setClientId(defaultClientId ?? undefined)
    setDate(defaultDateValue())
    setTime(defaultTimeValue())
    setNote(defaultNote ?? "")
  }

  React.useEffect(() => {
    if (!open) return
    resetForm()
  }, [open, defaultClientId, defaultNote])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      resetForm()
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!clientId || !date || !time) {
      return
    }

    const client = scopedClients.find((c) => c.id === clientId)
    if (!client) {
      return
    }

    const startsAt = new Date(`${date}T${time}:00`)
    const endsAt = new Date(startsAt.getTime() + DEFAULT_DURATION_MS)

    const meeting: Meeting = {
      id: createNextMeetingId(meetings),
      title:
        defaultTitle?.trim() ||
        `Spotkanie — ${client.name}`,
      clientId: client.id,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      note: note.trim(),
      ownerId: client.ownerId,
      regionId: client.regionId,
    }

    addMeeting(meeting)
    toast.success("Spotkanie zostało dodane")
    handleOpenChange(false)
  }

  const canSubmit = Boolean(clientId) && date.length > 0 && time.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {openProp === undefined ? (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button>
              <PlusIcon data-icon="inline-start" />
              Nowe spotkanie
            </Button>
          )}
        </DialogTrigger>
      ) : (
        trigger
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nowe spotkanie</DialogTitle>
          <DialogDescription>
            Klient, data, godzina i opcjonalna notatka.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="meeting-client">Klient</FieldLabel>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="meeting-client" className="w-full">
                  <SelectValue placeholder="Wybierz klienta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {scopedClients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="meeting-date">Data</FieldLabel>
              <Input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="meeting-time">Godzina</FieldLabel>
              <Input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="meeting-note">Notatka</FieldLabel>
              <Input
                id="meeting-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="np. Siedziba klienta, online Teams"
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Zapisz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
