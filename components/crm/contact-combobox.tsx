"use client"

import * as React from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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
  formatContactName,
  formatContactOptionLabel,
} from "@/lib/crm/contact-display"
import { contactMatchesSearch } from "@/lib/crm/contact-search"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { CrmContact } from "@/types/crm"

type ContactListItem = {
  value: string
  label: string
  contact: CrmContact
}

type ContactComboboxFieldProps = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  /** Jeden kontakt (deal/lead) zamiast wielu (firma). */
  single?: boolean
  "aria-invalid"?: boolean
}

type CreateContactErrors = {
  firstName?: string
  lastName?: string
}

function toListItem(contact: CrmContact): ContactListItem {
  return {
    value: contact.id,
    label: formatContactOptionLabel(contact),
    contact,
  }
}

export function ContactComboboxField({
  value,
  onChange,
  disabled,
  single = false,
  "aria-invalid": ariaInvalid,
}: ContactComboboxFieldProps) {
  const anchorRef = useComboboxAnchor()
  const { contacts, addContact } = useDemoData()
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createForm, setCreateForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [createErrors, setCreateErrors] = React.useState<CreateContactErrors>(
    {},
  )

  const items = React.useMemo(() => contacts.map(toListItem), [contacts])

  const itemById = React.useMemo(
    () => new Map(items.map((item) => [item.value, item] as const)),
    [items],
  )

  const selectedItems = React.useMemo(
    () =>
      value
        .map((id) => itemById.get(id))
        .filter((item): item is ContactListItem => Boolean(item)),
    [value, itemById],
  )

  function openCreateForm() {
    setComboboxOpen(false)
    setCreateOpen(true)
  }

  function closeCreateForm() {
    setCreateOpen(false)
    setCreateForm({ firstName: "", lastName: "", email: "", phone: "" })
    setCreateErrors({})
  }

  function handleCreateSubmit() {
    const errors: CreateContactErrors = {}
    if (!createForm.firstName.trim()) errors.firstName = "Imię jest wymagane"
    if (!createForm.lastName.trim()) errors.lastName = "Nazwisko jest wymagane"
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors)
      return
    }
    const created = addContact({
      firstName: createForm.firstName,
      lastName: createForm.lastName,
      emails: createForm.email.trim() ? [createForm.email] : [],
      phones: createForm.phone ? [createForm.phone] : [],
    })
    onChange([...value, created.id])
    toast.success(`Dodano kontakt: ${formatContactName(created)}`)
    closeCreateForm()
  }

  return (
    <Field data-invalid={ariaInvalid || undefined}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>Kontakty</FieldLabel>
        {!createOpen ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2"
            disabled={disabled}
            onClick={openCreateForm}
          >
            <PlusIcon data-icon="inline-start" />
            Utwórz kontakt
          </Button>
        ) : null}
      </div>

      <Combobox
        multiple
        open={comboboxOpen}
        onOpenChange={setComboboxOpen}
        items={items}
        value={selectedItems}
        onValueChange={(next) => {
          const selected = Array.isArray(next) ? next : []
          const ids = selected.map((item) => item.value)
          if (single) {
            const lastId = ids[ids.length - 1]
            onChange(lastId ? [lastId] : [])
            setComboboxOpen(false)
            return
          }
          onChange(ids)
        }}
        isItemEqualToValue={(a, b) => a.value === b.value}
        itemToStringLabel={(item) => item.label}
        filter={(item, query) => contactMatchesSearch(item.contact, query)}
        disabled={disabled}
      >
        <ComboboxChips ref={anchorRef} aria-invalid={ariaInvalid}>
          {selectedItems.map((item) => (
            <ComboboxChip key={item.value} aria-label={item.label}>
              {formatContactName(item.contact)}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Szukaj kontaktu…" />
        </ComboboxChips>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxList>
            {(item: ContactListItem) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>Brak kontaktów</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>

      {createOpen ? (
        <Card size="sm" className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
            <CardTitle className="text-sm">Nowy kontakt</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Zamknij formularz kontaktu"
              onClick={closeCreateForm}
            >
              <XIcon />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className="flex flex-col gap-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCreateSubmit()
                }
              }}
            >
              <FieldGroup>
                <Field data-invalid={!!createErrors.firstName}>
                  <FieldLabel htmlFor="contact-firstName">Imię</FieldLabel>
                  <Input
                    id="contact-firstName"
                    value={createForm.firstName}
                    aria-invalid={!!createErrors.firstName}
                    autoFocus
                    onChange={(e) => {
                      setCreateErrors((p) => {
                        const next = { ...p }
                        delete next.firstName
                        return next
                      })
                      setCreateForm((p) => ({
                        ...p,
                        firstName: e.target.value,
                      }))
                    }}
                  />
                  <FieldError>{createErrors.firstName}</FieldError>
                </Field>
                <Field data-invalid={!!createErrors.lastName}>
                  <FieldLabel htmlFor="contact-lastName">Nazwisko</FieldLabel>
                  <Input
                    id="contact-lastName"
                    value={createForm.lastName}
                    aria-invalid={!!createErrors.lastName}
                    onChange={(e) => {
                      setCreateErrors((p) => {
                        const next = { ...p }
                        delete next.lastName
                        return next
                      })
                      setCreateForm((p) => ({
                        ...p,
                        lastName: e.target.value,
                      }))
                    }}
                  />
                  <FieldError>{createErrors.lastName}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-email">E-mail</FieldLabel>
                  <Input
                    id="contact-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-phone">Telefon</FieldLabel>
                  <MaskInput
                    id="contact-phone"
                    mask={PL_PHONE_MASK}
                    maskPlaceholder="+48 ___ ___ ___"
                    placeholder="Numer telefonu"
                    value={createForm.phone}
                    onValueChange={(_masked, unmasked) =>
                      setCreateForm((p) => ({ ...p, phone: unmasked }))
                    }
                  />
                </Field>
              </FieldGroup>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={handleCreateSubmit}>
                  Dodaj kontakt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeCreateForm}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </Field>
  )
}
