"use client"

import * as React from "react"
import { toast } from "sonner"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
import { DealProductCombobox } from "@/components/crm/deal-product-combobox"
import { Button } from "@/components/ui/button"
import { SheetFooter } from "@/components/ui/sheet"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MaskInput } from "@/components/ui/mask-input"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/auth/demo-session"
import { formatContactName } from "@/lib/crm/contact-display"
import { DEAL_EXPECTED_CLOSE_DATE_LABEL } from "@/lib/crm/deal-close-date-urgency"
import { DEAL_CURRENCY_OPTIONS, DEAL_SOURCE_OPTIONS, DEAL_TYPE_OPTIONS } from "@/lib/crm/deal-labels"
import { DEAL_PIPELINE_CATEGORY_LABELS } from "@/lib/crm/deal-pipeline-labels"
import { resolvePipelineCategoryId } from "@/lib/crm/deal-pipeline"
import type { DealProductListItem } from "@/lib/crm/deal-product-select"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { CrmContact, Deal, DealCurrency, DealSource, DealType } from "@/types/crm"

const DEAL_TYPE_NONE = "__none__"

type Errors = {
  name?: string
  amount?: string
  productId?: string
}

function suggestDealName(productName: string, contact?: CrmContact | null): string {
  if (!contact) return productName
  return `${productName} — ${formatContactName(contact)}`
}

export function DealForm({
  onSuccess,
  layout = "sheet",
  defaultClientId = null,
  defaultContactId = null,
}: {
  onSuccess: (deal: Deal) => void
  layout?: "page" | "sheet"
  defaultClientId?: string | null
  defaultContactId?: string | null
}) {
  const { user } = useSession()
  const { addDeal, addDealActivity, products, contacts } = useDemoData()
  const [selectedProduct, setSelectedProduct] =
    React.useState<DealProductListItem | null>(null)
  const [name, setName] = React.useState("")
  const [nameManuallyEdited, setNameManuallyEdited] = React.useState(false)
  const [amount, setAmount] = React.useState("")
  const [currency, setCurrency] = React.useState<DealCurrency>("PLN")
  const [contactId, setContactId] = React.useState<string | null>(
    defaultContactId,
  )
  const [comments, setComments] = React.useState("")
  const [source, setSource] = React.useState<DealSource>("recommendation")
  const [dealType, setDealType] = React.useState<DealType | null>(null)
  const [expectedCloseDate, setExpectedCloseDate] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})

  const pipelineCategoryId = selectedProduct
    ? resolvePipelineCategoryId(selectedProduct.product.categoryId)
    : null

  const contactById = React.useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact])),
    [contacts],
  )

  const applySuggestedName = React.useCallback(
    (product: DealProductListItem | null, nextContactId: string | null) => {
      if (!product || nameManuallyEdited) return
      const contact = nextContactId
        ? contactById.get(nextContactId)
        : undefined
      setName(suggestDealName(product.label, contact))
    },
    [contactById, nameManuallyEdited],
  )

  function handleProductChange(next: DealProductListItem | null) {
    setSelectedProduct(next)
    setErrors((prev) => {
      const nextErrors = { ...prev }
      delete nextErrors.productId
      return nextErrors
    })
    applySuggestedName(next, contactId)
  }

  function handleContactChange(ids: string[]) {
    const nextContactId = ids[0] ?? null
    setContactId(nextContactId)
    applySuggestedName(selectedProduct, nextContactId)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.regionId) return

    const next: Errors = {}
    if (!selectedProduct) next.productId = "Produkt jest wymagany"
    if (!name.trim()) next.name = "Nazwa jest wymagana"
    if (amount && (Number.isNaN(Number(amount)) || Number(amount) < 0)) {
      next.amount = "Kwota musi być dodatnia"
    }
    setErrors(next)
    if (Object.keys(next).length > 0) {
      if (next.productId) {
        toast.error("Wybierz produkt bankowy", {
          description: next.productId,
        })
      }
      return
    }

    const created = addDeal({
      name,
      amount: amount ? Number(amount) : null,
      currency,
      contactId,
      clientId: defaultClientId,
      productId: selectedProduct!.value,
      comments,
      source,
      dealType,
      expectedCloseDate: expectedCloseDate.trim() || undefined,
      ownerId: user.id,
      regionId: user.regionId,
    })
    addDealActivity(created.id, "deal_created", user, {
      note: created.name,
      occurredAt: created.createdAt,
    })
    toast.success("Deal został dodany")
    onSuccess(created)
  }

  const body = (
    <FieldGroup>
      <Field data-invalid={errors.productId ? true : undefined}>
        <FieldLabel htmlFor="deal-product">Produkt</FieldLabel>
        <DealProductCombobox
          id="deal-product"
          products={products}
          value={selectedProduct}
          onValueChange={handleProductChange}
          aria-invalid={errors.productId ? true : undefined}
        />
        {errors.productId ? <FieldError>{errors.productId}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="deal-category">Kategoria</FieldLabel>
        <Input
          id="deal-category"
          readOnly
          value={
            pipelineCategoryId
              ? DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId]
              : ""
          }
          placeholder="Wybierz produkt, aby zobaczyć kategorię"
        />
        {pipelineCategoryId ? (
          <FieldDescription>
            Lejek: {DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId]}
          </FieldDescription>
        ) : null}
      </Field>

      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="deal-name">Nazwa</FieldLabel>
        <Input
          id="deal-name"
          value={name}
          onChange={(e) => {
            setNameManuallyEdited(true)
            setName(e.target.value)
          }}
          aria-invalid={errors.name ? true : undefined}
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>
      <Field data-invalid={errors.amount ? true : undefined}>
        <FieldLabel htmlFor="deal-amount">Kwota</FieldLabel>
        <MaskInput
          id="deal-amount"
          mask="currency"
          locale="pl-PL"
          currency="PLN"
          placeholder="Kwota w PLN"
          value={amount}
          aria-invalid={errors.amount ? true : undefined}
          onValueChange={(_masked, unmasked) => {
            setErrors((p) => {
              const next = { ...p }
              delete next.amount
              return next
            })
            setAmount(unmasked)
          }}
        />
        {errors.amount ? <FieldError>{errors.amount}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="deal-currency">Waluta</FieldLabel>
        <Select value={currency} onValueChange={(v) => setCurrency(v as DealCurrency)}>
          <SelectTrigger id="deal-currency" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{DEAL_CURRENCY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Kontakt</FieldLabel>
        <ContactComboboxField value={contactId ? [contactId] : []} onChange={handleContactChange} />
      </Field>
      <Field>
        <FieldLabel htmlFor="deal-comments">Komentarz</FieldLabel>
        <InputGroup><InputGroupTextarea id="deal-comments" value={comments} onChange={(e) => setComments(e.target.value)} rows={3} /></InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="deal-source">Źródło</FieldLabel>
        <Select value={source} onValueChange={(v) => setSource(v as DealSource)}>
          <SelectTrigger id="deal-source" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{DEAL_SOURCE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="deal-type">Typ dealu</FieldLabel>
        <Select value={dealType ?? DEAL_TYPE_NONE} onValueChange={(v) => setDealType(v === DEAL_TYPE_NONE ? null : (v as DealType))}>
          <SelectTrigger id="deal-type" className="w-full"><SelectValue placeholder="Brak" /></SelectTrigger>
          <SelectContent><SelectGroup><SelectItem value={DEAL_TYPE_NONE}>Brak</SelectItem>{DEAL_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="deal-expected-close-date">
          {DEAL_EXPECTED_CLOSE_DATE_LABEL}
        </FieldLabel>
        <Input
          id="deal-expected-close-date"
          type="date"
          value={expectedCloseDate}
          onChange={(e) => setExpectedCloseDate(e.target.value)}
        />
      </Field>
    </FieldGroup>
  )

  if (layout === "sheet") {
    return <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}><div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{body}</div><SheetFooter className="shrink-0 border-t border-border px-6 py-4"><Button type="submit">Zapisz</Button></SheetFooter></form>
  }
  return <form className="flex flex-col gap-4" onSubmit={submit}>{body}<Button type="submit">Zapisz</Button></form>
}
