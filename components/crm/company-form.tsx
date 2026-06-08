"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  COMPANY_SOURCE_OPTIONS,
  COMPANY_TYPE_OPTIONS,
} from "@/lib/crm/company-labels"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { AddClientInput, Client, CompanySource, CompanyType } from "@/types/crm"

const SOURCE_NONE = "__none__"

type CompanyFormErrors = {
  name?: string
}

type CompanyFormState = {
  name: string
  phones: string[]
  emails: string[]
  contactIds: string[]
  comments: string
  source: CompanySource | null
  companyType: CompanyType
  address: string
}

function emptyFormState(): CompanyFormState {
  return {
    name: "",
    phones: [""],
    emails: [""],
    contactIds: [],
    comments: "",
    source: null,
    companyType: "unknown",
    address: "",
  }
}

function validateForm(state: CompanyFormState): CompanyFormErrors {
  const errors: CompanyFormErrors = {}
  if (!state.name.trim()) errors.name = "Nazwa firmy jest wymagana"
  return errors
}

function buildInput(state: CompanyFormState): AddClientInput {
  return {
    name: state.name.trim(),
    phones: state.phones,
    emails: state.emails,
    contactIds: state.contactIds,
    comments: state.comments,
    source: state.source,
    companyType: state.companyType,
    address: state.address,
    website: "",
    socialMedia: "",
  }
}

type CompanyFormProps = {
  onSuccess: (client: Client) => void
  layout?: "page" | "sheet"
}

export function CompanyForm({
  onSuccess,
  layout = "page",
}: CompanyFormProps) {
  const { user } = useSession()
  const { addClient } = useDemoData()
  const [form, setForm] = React.useState(() => emptyFormState())
  const [errors, setErrors] = React.useState<CompanyFormErrors>({})

  function updateListItem(key: "phones" | "emails", index: number, value: string) {
    setForm((prev) => {
      const list = [...prev[key]]
      list[index] = value
      return { ...prev, [key]: list }
    })
  }

  function addListItem(key: "phones" | "emails") {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }))
  }

  function removeListItem(key: "phones" | "emails", index: number) {
    setForm((prev) => {
      const list = prev[key].filter((_, i) => i !== index)
      return { ...prev, [key]: list.length > 0 ? list : [""] }
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const nextErrors = validateForm(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    const created = addClient(buildInput(form), user)
    toast.success("Firma została dodana")
    onSuccess(created)
  }

  const fields = (
    <FieldGroup>
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="company-name">Nazwa firmy</FieldLabel>
        <Input
          id="company-name"
          value={form.name}
          aria-invalid={!!errors.name}
          onChange={(e) => {
            setErrors((p) => {
              const next = { ...p }
              delete next.name
              return next
            })
            setForm((p) => ({ ...p, name: e.target.value }))
          }}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Telefony</FieldLabel>
        <div className="flex flex-col gap-2">
          {form.phones.map((phone, index) => (
            <div key={`phone-${index}`} className="flex items-center gap-2">
              <Input
                value={phone}
                placeholder="+48 …"
                onChange={(e) => updateListItem("phones", index, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={form.phones.length <= 1}
                onClick={() => removeListItem("phones", index)}
                aria-label="Usuń telefon"
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => addListItem("phones")}
          >
            <PlusIcon data-icon="inline-start" />
            Dodaj telefon
          </Button>
        </div>
      </Field>

      <Field>
        <FieldLabel>E-maile</FieldLabel>
        <div className="flex flex-col gap-2">
          {form.emails.map((email, index) => (
            <div key={`email-${index}`} className="flex items-center gap-2">
              <Input
                type="email"
                value={email}
                placeholder="email@firma.pl"
                onChange={(e) => updateListItem("emails", index, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={form.emails.length <= 1}
                onClick={() => removeListItem("emails", index)}
                aria-label="Usuń e-mail"
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => addListItem("emails")}
          >
            <PlusIcon data-icon="inline-start" />
            Dodaj e-mail
          </Button>
        </div>
      </Field>

      <ContactComboboxField
        value={form.contactIds}
        onChange={(contactIds) => setForm((p) => ({ ...p, contactIds }))}
      />

      <Field>
        <FieldLabel htmlFor="company-comments">Komentarze</FieldLabel>
        <Textarea
          id="company-comments"
          value={form.comments}
          onChange={(e) => setForm((p) => ({ ...p, comments: e.target.value }))}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="company-source">Źródło</FieldLabel>
        <Select
          value={form.source ?? SOURCE_NONE}
          onValueChange={(v) =>
            setForm((p) => ({
              ...p,
              source: v === SOURCE_NONE ? null : (v as CompanySource),
            }))
          }
        >
          <SelectTrigger id="company-source">
            <SelectValue placeholder="Wybierz źródło" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={SOURCE_NONE}>—</SelectItem>
              {COMPANY_SOURCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="company-type">Typ firmy</FieldLabel>
        <Select
          value={form.companyType}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, companyType: v as CompanyType }))
          }
        >
          <SelectTrigger id="company-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {COMPANY_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="company-address">Adres</FieldLabel>
        <Input
          id="company-address"
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />
      </Field>
    </FieldGroup>
  )

  if (layout === "sheet") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto px-6 py-4">{fields}</div>
        <SheetFooter className="shrink-0 border-t border-border px-6 py-4">
          <Button type="submit" size="lg">
            Zapisz firmę
          </Button>
        </SheetFooter>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields}
      <Button type="submit">Zapisz firmę</Button>
    </form>
  )
}
