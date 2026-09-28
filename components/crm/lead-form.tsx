"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SheetFooter } from "@/components/ui/sheet"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MaskInput } from "@/components/ui/mask-input"
import { NIP_MASK, PL_PHONE_MASK } from "@/lib/crm/mask-patterns"
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/auth/demo-session"
import { createNextLeadId } from "@/lib/crm/lead-id"
import { LEAD_TYPE_OPTIONS } from "@/lib/crm/lead-labels"
import {
  findProspectDuplicates,
  formatNipPl,
  type ProspectDuplicate,
} from "@/lib/crm/prospect-duplicate"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { DemoUser, Lead, LeadSource, LeadType } from "@/types/crm"

const LEAD_TYPE_NONE = "__none__"

type LeadFormErrors = {
  name?: string
  companyName?: string
  ownerId?: string
}

type LeadFormState = {
  name: string
  companyName: string
  nip: string
  phone: string
  contactId: string | null
  comments: string
  source: LeadSource
  leadType: LeadType | null
  ownerId: string
}

function emptyFormState(ownerId = ""): LeadFormState {
  return {
    name: "",
    companyName: "",
    nip: "",
    phone: "",
    contactId: null,
    comments: "",
    source: "recommendation",
    leadType: null,
    ownerId,
  }
}

function validateForm(state: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {}
  if (!state.name.trim()) errors.name = "Nazwa jest wymagana"
  if (!state.companyName.trim()) errors.companyName = "Firma jest wymagana"
  if (!state.ownerId) errors.ownerId = "Wybierz opiekuna"
  return errors
}

function emptyLeadFields(): Pick<
  Lead,
  | "position"
  | "phones"
  | "emails"
  | "socialMedia"
  | "lostReason"
  | "opportunityId"
  | "clientId"
> {
  return {
    position: "",
    phones: [],
    emails: [],
    socialMedia: "",
    lostReason: null,
    opportunityId: null,
    clientId: null,
  }
}

function duplicateSummary(
  duplicates: readonly ProspectDuplicate[],
  users: readonly DemoUser[],
): string {
  return duplicates
    .map((match) => {
      const owner = users.find((user) => user.id === match.ownerId)
      const nip = match.nip ? `, NIP ${formatNipPl(match.nip)}` : ""
      const ownerLabel = owner ? `, opiekun ${owner.displayName}` : ""
      return `${match.kind === "firma" ? "Firma" : "Lead"} „${match.name}” (${match.reasonPl}${nip}${ownerLabel})`
    })
    .join(" ")
}

type LeadFormProps = {
  onSuccess: (lead: Lead) => void
  layout?: "page" | "sheet"
  defaultClientId?: string | null
}

export function LeadForm({
  onSuccess,
  layout = "sheet",
  defaultClientId = null,
}: LeadFormProps) {
  const router = useRouter()
  const { user } = useSession()
  const { leads, clients, users, salesDictionary, addLead } = useDemoData()
  const [form, setForm] = React.useState(() => emptyFormState(user?.id ?? ""))
  const [errors, setErrors] = React.useState<LeadFormErrors>({})
  const [duplicateOpen, setDuplicateOpen] = React.useState(false)
  const [duplicates, setDuplicates] = React.useState<ProspectDuplicate[]>([])
  const pendingLead = React.useRef<Lead | null>(null)

  const owners = React.useMemo(
    () =>
      users.filter((candidate) => {
        if (candidate.role !== "advisor") return false
        if (!user?.regionId) return true
        return candidate.regionId === user.regionId
      }),
    [users, user?.regionId],
  )

  React.useEffect(() => {
    if (!user) return
    setForm((prev) => {
      if (prev.ownerId && owners.some((owner) => owner.id === prev.ownerId)) {
        return prev
      }
      const fallback =
        owners.find((owner) => owner.id === user.id)?.id ?? owners[0]?.id ?? ""
      return { ...prev, ownerId: fallback }
    })
  }, [user, owners])

  React.useEffect(() => {
    if (!defaultClientId) return
    const client = clients.find((entry) => entry.id === defaultClientId)
    if (!client) return
    setForm((prev) => ({
      ...prev,
      companyName: prev.companyName || client.name,
      nip: prev.nip || (client.nip ?? "").replace(/\D/g, ""),
    }))
  }, [defaultClientId, clients])

  function clearError(key: keyof LeadFormErrors) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function saveLead(lead: Lead) {
    if (!user) return
    addLead(lead, user)
    toast.success("Lead został dodany")
    onSuccess(lead)
    router.push(`/leads/${lead.id}`)
  }

  function buildLead(): Lead | null {
    if (!user?.regionId && !form.ownerId) return null
    const owner = owners.find((candidate) => candidate.id === form.ownerId)
    if (!owner?.regionId) return null
    const now = new Date().toISOString()
    return {
      id: createNextLeadId(leads),
      name: form.name.trim(),
      status: "new",
      contactId: form.contactId,
      comments: form.comments.trim(),
      source: form.source,
      leadType: form.leadType,
      createdAt: now,
      ownerId: owner.id,
      regionId: owner.regionId,
      ...emptyLeadFields(),
      clientId: defaultClientId,
      companyName: form.companyName.trim(),
      nip: form.nip.replace(/\D/g, ""),
      phones: form.phone ? [form.phone] : [],
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const lead = buildLead()
    if (!lead) return

    const found = findProspectDuplicates({
      companyName: lead.companyName,
      nip: lead.nip ?? "",
      clients,
      leads,
      ignoreClientId: defaultClientId,
    })
    if (found.length > 0) {
      pendingLead.current = lead
      setDuplicates(found)
      setDuplicateOpen(true)
      return
    }

    saveLead(lead)
  }

  const formBody = (
    <FieldGroup>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="lead-name">Nazwa</FieldLabel>
        <Input
          id="lead-name"
          value={form.name}
          onChange={(event) => {
            clearError("name")
            setForm((prev) => ({ ...prev, name: event.target.value }))
          }}
          aria-invalid={errors.name ? true : undefined}
          placeholder="np. Kredyt obrotowy — Nordic Components"
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>

      <Field data-invalid={errors.companyName ? true : undefined}>
        <FieldLabel htmlFor="lead-company">Firma</FieldLabel>
        <Input
          id="lead-company"
          value={form.companyName}
          onChange={(event) => {
            clearError("companyName")
            setForm((prev) => ({ ...prev, companyName: event.target.value }))
          }}
          aria-invalid={errors.companyName ? true : undefined}
          placeholder="np. Polska Logistyka S.A."
        />
        {errors.companyName ? (
          <FieldError>{errors.companyName}</FieldError>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-nip">NIP</FieldLabel>
        <MaskInput
          id="lead-nip"
          mask={NIP_MASK}
          maskPlaceholder="__________"
          placeholder="NIP firmy"
          value={form.nip}
          onValueChange={(_masked, unmasked) =>
            setForm((prev) => ({ ...prev, nip: unmasked }))
          }
        />
      </Field>

      <Field data-invalid={errors.ownerId ? true : undefined}>
        <FieldLabel htmlFor="lead-owner">Opiekun</FieldLabel>
        <Select
          value={form.ownerId || undefined}
          onValueChange={(value) => {
            clearError("ownerId")
            setForm((prev) => ({ ...prev, ownerId: value }))
          }}
        >
          <SelectTrigger id="lead-owner" className="w-full">
            <SelectValue placeholder="Wybierz opiekuna" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.ownerId ? <FieldError>{errors.ownerId}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-phone">Telefon</FieldLabel>
        <MaskInput
          id="lead-phone"
          mask={PL_PHONE_MASK}
          maskPlaceholder="+48 ___ ___ ___"
          placeholder="Numer telefonu"
          value={form.phone}
          onValueChange={(_masked, unmasked) =>
            setForm((prev) => ({ ...prev, phone: unmasked }))
          }
        />
      </Field>

      <Field>
        <FieldLabel>Kontakt</FieldLabel>
        <ContactComboboxField
          single
          value={form.contactId ? [form.contactId] : []}
          onChange={(ids) =>
            setForm((prev) => ({ ...prev, contactId: ids[0] ?? null }))
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-comments">Komentarz</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="lead-comments"
            value={form.comments}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, comments: event.target.value }))
            }
            placeholder="Opcjonalny komentarz"
            rows={3}
          />
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-source">Źródło</FieldLabel>
        <Select
          value={form.source}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, source: value as LeadSource }))
          }
        >
          <SelectTrigger id="lead-source" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {salesDictionary.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.labelPl}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-type">Typ leada</FieldLabel>
        <Select
          value={form.leadType ?? LEAD_TYPE_NONE}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              leadType: value === LEAD_TYPE_NONE ? null : (value as LeadType),
            }))
          }
        >
          <SelectTrigger id="lead-type" className="w-full">
            <SelectValue placeholder="Brak" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={LEAD_TYPE_NONE}>Brak</SelectItem>
              {LEAD_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )

  const duplicateDialog = (
    <AlertDialog open={duplicateOpen} onOpenChange={setDuplicateOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Możliwy duplikat</AlertDialogTitle>
          <AlertDialogDescription>
            {duplicateSummary(duplicates, users)} Możesz przerwać zapis albo
            dodać lead mimo podobnego rekordu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const lead = pendingLead.current
              if (lead) saveLead(lead)
            }}
          >
            Zapisz mimo to
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  if (layout === "sheet") {
    return (
      <>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {formBody}
          </div>
          <SheetFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button type="submit">Zapisz</Button>
          </SheetFooter>
        </form>
        {duplicateDialog}
      </>
    )
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {formBody}
        <Button type="submit">Zapisz</Button>
      </form>
      {duplicateDialog}
    </>
  )
}
