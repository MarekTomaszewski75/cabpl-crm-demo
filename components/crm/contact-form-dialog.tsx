"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MaskInput } from "@/components/ui/mask-input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { formatContactName } from "@/lib/crm/contact-display"
import { PL_PHONE_MASK } from "@/lib/crm/mask-patterns"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { ContactCompanyBindingSource, CrmContact } from "@/types/crm"

type ContactFormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  roleAtCompany: string
}

type ContactFormErrors = {
  firstName?: string
  lastName?: string
}

const SOURCE_LABELS: Record<ContactCompanyBindingSource, string> = {
  company: "Firma",
  deal: "Deal",
  lead: "Lead",
}

function emptyFormState(): ContactFormState {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleAtCompany: "",
  }
}

function contactToFormState(
  contact: CrmContact,
  roleAtCompany = "",
): ContactFormState {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.emails[0] ?? "",
    phone: contact.phones[0] ?? "",
    roleAtCompany,
  }
}

type ContactFormDialogProps = {
  defaultClientId: string
  contact?: CrmContact
  initialRoleAtCompany?: string
  bindingSource?: ContactCompanyBindingSource
  trigger?: React.ReactNode
  onSuccess?: (contact: CrmContact) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ContactFormDialog({
  defaultClientId,
  contact,
  initialRoleAtCompany = "",
  bindingSource,
  trigger,
  onSuccess,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: ContactFormDialogProps) {
  const {
    clients,
    addContact,
    updateContact,
    updateClient,
    upsertContactClientLink,
  } = useDemoData()
  const isEdit = Boolean(contact)
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [form, setForm] = React.useState(emptyFormState)
  const [errors, setErrors] = React.useState<ContactFormErrors>({})

  const open = openProp ?? internalOpen
  const setOpen = onOpenChangeProp ?? setInternalOpen

  React.useEffect(() => {
    if (!open) return
    if (contact) {
      setForm(contactToFormState(contact, initialRoleAtCompany))
    } else {
      setForm(emptyFormState())
    }
    setErrors({})
  }, [open, contact, initialRoleAtCompany])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next && !isEdit) {
      setForm(emptyFormState())
      setErrors({})
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const nextErrors: ContactFormErrors = {}
    if (!form.firstName.trim()) nextErrors.firstName = "Imię jest wymagane"
    if (!form.lastName.trim()) nextErrors.lastName = "Nazwisko jest wymagane"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      emails: form.email.trim() ? [form.email.trim()] : [],
      phones: form.phone ? [form.phone] : [],
    }

    if (isEdit && contact) {
      updateContact(contact.id, payload)
      upsertContactClientLink(
        contact.id,
        defaultClientId,
        form.roleAtCompany,
      )
      const updated: CrmContact = {
        ...contact,
        ...payload,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
      }
      toast.success(`Zaktualizowano kontakt: ${formatContactName(updated)}`)
      handleOpenChange(false)
      onSuccess?.(updated)
      return
    }

    const created = addContact(payload)

    const client = clients.find((entry) => entry.id === defaultClientId)
    if (client && !client.contactIds.includes(created.id)) {
      updateClient(defaultClientId, {
        contactIds: [...client.contactIds, created.id],
      })
    }

    upsertContactClientLink(
      created.id,
      defaultClientId,
      form.roleAtCompany,
    )

    toast.success(`Dodano kontakt: ${formatContactName(created)}`)
    handleOpenChange(false)
    onSuccess?.(created)
  }

  const defaultTrigger = (
    <Button>
      <PlusIcon />
      Nowy kontakt
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {openProp === undefined && !isEdit ? (
        <SheetTrigger asChild>{trigger ?? defaultTrigger}</SheetTrigger>
      ) : (
        trigger
      )}
      {open ? (
        <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg data-[side=right]:sm:max-w-lg">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle>
              {isEdit ? "Edytuj kontakt" : "Nowy kontakt"}
            </SheetTitle>
          </SheetHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={handleSubmit}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <FieldGroup>
                <Field data-invalid={!!errors.firstName}>
                  <FieldLabel htmlFor="company-contact-firstName">
                    Imię
                  </FieldLabel>
                  <Input
                    id="company-contact-firstName"
                    value={form.firstName}
                    aria-invalid={!!errors.firstName}
                    autoFocus
                    onChange={(e) => {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.firstName
                        return next
                      })
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }}
                  />
                  <FieldError>{errors.firstName}</FieldError>
                </Field>
                <Field data-invalid={!!errors.lastName}>
                  <FieldLabel htmlFor="company-contact-lastName">
                    Nazwisko
                  </FieldLabel>
                  <Input
                    id="company-contact-lastName"
                    value={form.lastName}
                    aria-invalid={!!errors.lastName}
                    onChange={(e) => {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.lastName
                        return next
                      })
                      setForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }}
                  />
                  <FieldError>{errors.lastName}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="company-contact-email">E-mail</FieldLabel>
                  <Input
                    id="company-contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="company-contact-phone">Telefon</FieldLabel>
                  <MaskInput
                    id="company-contact-phone"
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
                  <FieldLabel htmlFor="company-contact-role">Relacja</FieldLabel>
                  <Input
                    id="company-contact-role"
                    value={form.roleAtCompany}
                    placeholder="np. Dyrektor finansowy"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        roleAtCompany: e.target.value,
                      }))
                    }
                  />
                  {bindingSource && bindingSource !== "company" ? (
                    <FieldDescription>
                      Kontakt powiązany także przez{" "}
                      {SOURCE_LABELS[bindingSource].toLowerCase()}. Relacja
                      dotyczy funkcji w tej firmie.
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      Stanowisko lub funkcja kontaktu w organizacji klienta.
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </div>
            <SheetFooter className="shrink-0 border-t border-border px-6 py-4">
              <Button type="submit">Zapisz</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
