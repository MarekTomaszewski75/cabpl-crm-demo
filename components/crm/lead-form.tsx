"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
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
import { PL_PHONE_MASK } from "@/lib/crm/mask-patterns"
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
import {
  LEAD_SOURCE_OPTIONS,
  LEAD_TYPE_OPTIONS,
} from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead, LeadSource, LeadType } from "@/types/crm"

const LEAD_TYPE_NONE = "__none__"

type LeadFormErrors = {
  name?: string
}

type LeadFormState = {
  name: string
  phone: string
  contactId: string | null
  comments: string
  source: LeadSource
  leadType: LeadType | null
}

function emptyFormState(): LeadFormState {
  return {
    name: "",
    phone: "",
    contactId: null,
    comments: "",
    source: "recommendation",
    leadType: null,
  }
}

function validateForm(state: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {}
  if (!state.name.trim()) errors.name = "Nazwa jest wymagana"
  return errors
}

function emptyLeadFields(): Pick<
  Lead,
  | "companyName"
  | "position"
  | "phones"
  | "emails"
  | "socialMedia"
  | "lostReason"
  | "opportunityId"
  | "clientId"
> {
  return {
    companyName: "",
    position: "",
    phones: [],
    emails: [],
    socialMedia: "",
    lostReason: null,
    opportunityId: null,
    clientId: null,
  }
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
  const { leads, clients, addLead } = useDemoData()
  const [form, setForm] = React.useState(() => emptyFormState())
  const [errors, setErrors] = React.useState<LeadFormErrors>({})

  function clearError(key: keyof LeadFormErrors) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.regionId) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const client = defaultClientId
      ? clients.find((entry) => entry.id === defaultClientId)
      : undefined
    const now = new Date().toISOString()
    const newLead: Lead = {
      id: createNextLeadId(leads),
      name: form.name.trim(),
      status: "new",
      contactId: form.contactId,
      comments: form.comments.trim(),
      source: form.source,
      leadType: form.leadType,
      createdAt: now,
      ownerId: user.id,
      regionId: user.regionId,
      ...emptyLeadFields(),
      clientId: defaultClientId,
      companyName: client?.name ?? "",
      phones: form.phone ? [form.phone] : [],
    }

    addLead(newLead, user)
    toast.success("Lead został dodany")
    onSuccess(newLead)
    router.push(`/leads/${newLead.id}`)
  }

  const formBody = (
    <FieldGroup>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="lead-name">Nazwa</FieldLabel>
        <Input
          id="lead-name"
          value={form.name}
          onChange={(e) => {
            clearError("name")
            setForm((p) => ({ ...p, name: e.target.value }))
          }}
          aria-invalid={errors.name ? true : undefined}
          placeholder="np. AutoParts Mazowsze"
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
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
            setForm((p) => ({ ...p, phone: unmasked }))
          }
        />
      </Field>

      <Field>
        <FieldLabel>Kontakt</FieldLabel>
        <ContactComboboxField
          value={form.contactId ? [form.contactId] : []}
          onChange={(ids) =>
            setForm((p) => ({ ...p, contactId: ids[0] ?? null }))
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-comments">Komentarz</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="lead-comments"
            value={form.comments}
            onChange={(e) =>
              setForm((p) => ({ ...p, comments: e.target.value }))
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
            setForm((p) => ({ ...p, source: value as LeadSource }))
          }
        >
          <SelectTrigger id="lead-source" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {LEAD_SOURCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
            setForm((p) => ({
              ...p,
              leadType:
                value === LEAD_TYPE_NONE ? null : (value as LeadType),
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

  if (layout === "sheet") {
    return (
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {formBody}
        </div>
        <SheetFooter className="shrink-0 border-t border-border px-6 py-4">
          <Button type="submit">Zapisz</Button>
        </SheetFooter>
      </form>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {formBody}
      <Button type="submit">Zapisz</Button>
    </form>
  )
}
