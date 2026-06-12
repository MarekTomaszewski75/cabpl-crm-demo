"use client"

import * as React from "react"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
import { DealProductCombobox } from "@/components/crm/deal-product-combobox"
import { LeadEngagementIndicators } from "@/components/crm/lead-engagement-indicators"
import { InlineEditableField } from "@/components/crm/inline-editable-field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth/demo-session"
import { getScopedDealEngagementCounts } from "@/lib/crm/deal-engagement-counts"
import { DEAL_CURRENCY_OPTIONS, DEAL_SOURCE_OPTIONS, DEAL_TYPE_OPTIONS } from "@/lib/crm/deal-labels"
import { DEAL_PIPELINE_CATEGORY_LABELS } from "@/lib/crm/deal-pipeline-labels"
import { isPipelineCategoryId } from "@/lib/crm/deal-pipeline"
import {
  toDealProductListItem,
  type DealProductListItem,
} from "@/lib/crm/deal-product-select"
import { useDemoData } from "@/lib/data/demo-data-context"
import { DEAL_EXPECTED_CLOSE_DATE_LABEL } from "@/lib/crm/deal-close-date-urgency"
import { formatDatePl } from "@/lib/format/pl"
import type { Deal, DealCurrency, DealSource, DealType } from "@/types/crm"

const DEAL_TYPE_NONE = "__none__"

type DealDetailSidebarProps = {
  deal: Deal
  onTasksClick?: () => void
  onMeetingsClick?: () => void
  onDocumentsClick?: () => void
}

export function DealDetailSidebar({
  deal,
  onTasksClick,
  onMeetingsClick,
  onDocumentsClick,
}: DealDetailSidebarProps) {
  const { user } = useSession()
  const { updateDeal, users, clients, tasks, meetings, dealDocuments, products } =
    useDemoData()
  const readOnly = deal.status === "won" || deal.status === "lost"
  const productEditable = deal.status === "new"

  const product = products.find((item) => item.id === deal.productId)
  const productListItem = product ? toDealProductListItem(product) : null
  const [selectedProduct, setSelectedProduct] =
    React.useState<DealProductListItem | null>(productListItem)

  React.useEffect(() => {
    setSelectedProduct(product ? toDealProductListItem(product) : null)
  }, [deal.productId, product])

  const categoryLabel = isPipelineCategoryId(deal.pipelineCategoryId)
    ? DEAL_PIPELINE_CATEGORY_LABELS[deal.pipelineCategoryId]
    : "—"

  const engagementCounts = React.useMemo(() => {
    if (!user) {
      return { tasks: 0, meetings: 0, documents: 0 }
    }
    return getScopedDealEngagementCounts(
      deal.id,
      { tasks, meetings, dealDocuments },
      user,
    )
  }, [deal.id, tasks, meetings, dealDocuments, user])

  const finisher = deal.finishedByUserId ? users.find((u) => u.id === deal.finishedByUserId) : undefined
  const firstFinisher = deal.firstFinishedByUserId ? users.find((u) => u.id === deal.firstFinishedByUserId) : undefined
  const [expectedCloseDraft, setExpectedCloseDraft] = React.useState(
    deal.expectedCloseDate ?? "",
  )

  React.useEffect(() => {
    setExpectedCloseDraft(deal.expectedCloseDate ?? "")
  }, [deal.expectedCloseDate])

  function handleProductChange(next: DealProductListItem | null) {
    if (!next || !productEditable) return
    setSelectedProduct(next)
    updateDeal(deal.id, { productId: next.value })
  }

  function commitExpectedCloseDate() {
    if (!user || readOnly) return
    const previous = deal.expectedCloseDate ?? ""
    const nextValue = expectedCloseDraft.trim()
    if (nextValue === previous) return
    updateDeal(
      deal.id,
      { expectedCloseDate: nextValue || undefined },
      user,
    )
  }

  return (
    <div className="flex w-full max-w-sm shrink-0 flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">O dealu</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Produkt</span>
            {productEditable ? (
              <DealProductCombobox
                products={products}
                value={selectedProduct}
                onValueChange={handleProductChange}
              />
            ) : (
              <div className="flex flex-col gap-0.5 text-sm">
                <span>{product?.name ?? "—"}</span>
                {product?.sku ? (
                  <span className="text-muted-foreground">{product.sku}</span>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Kategoria</span>
            <Input readOnly value={categoryLabel} />
          </div>

          <LeadEngagementIndicators
            counts={engagementCounts}
            onTasksClick={onTasksClick}
            onMeetingsClick={onMeetingsClick}
            onDocumentsClick={onDocumentsClick}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">
              {DEAL_EXPECTED_CLOSE_DATE_LABEL}
            </span>
            {readOnly ? (
              <span className="text-sm text-muted-foreground">
                {deal.expectedCloseDate
                  ? formatDatePl(deal.expectedCloseDate)
                  : "—"}
              </span>
            ) : (
              <Input
                type="date"
                value={expectedCloseDraft}
                onChange={(e) => setExpectedCloseDraft(e.target.value)}
                onBlur={commitExpectedCloseDate}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    commitExpectedCloseDate()
                  }
                }}
              />
            )}
          </div>
          <InlineEditableField label="Kwota" value={deal.amount?.toString() ?? ""} onSave={(v) => updateDeal(deal.id, { amount: v ? Number(v) : null })}>{(props) => <Input type="number" value={props.value} disabled={readOnly} onChange={(e) => props.onChange(e.target.value)} onBlur={props.onBlur} onKeyDown={props.onKeyDown} />}</InlineEditableField>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Waluta</span><Select value={deal.currency} disabled={readOnly} onValueChange={(v) => updateDeal(deal.id, { currency: v as DealCurrency })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{DEAL_CURRENCY_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Kontakty</span><ContactComboboxField value={deal.contactId ? [deal.contactId] : []} onChange={(ids) => updateDeal(deal.id, { contactId: ids[0] ?? null })} disabled={readOnly} /></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Firmy</span><Select value={deal.clientId ?? "__none__"} disabled={readOnly} onValueChange={(v) => updateDeal(deal.id, { clientId: v === "__none__" ? null : v })}><SelectTrigger><SelectValue placeholder="Brak" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="__none__">Brak</SelectItem>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader><CardTitle className="text-base">Dodatkowo</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Komentarze</span><Textarea value={deal.comments} disabled={readOnly} onChange={(e) => updateDeal(deal.id, { comments: e.target.value })} /></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Źródło</span><Select value={deal.source ?? "recommendation"} disabled={readOnly} onValueChange={(v) => updateDeal(deal.id, { source: v as DealSource })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{DEAL_SOURCE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
          <div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">Typ dealu</span><Select value={deal.dealType ?? DEAL_TYPE_NONE} disabled={readOnly} onValueChange={(v) => updateDeal(deal.id, { dealType: v === DEAL_TYPE_NONE ? null : (v as DealType) })}><SelectTrigger><SelectValue placeholder="Brak" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value={DEAL_TYPE_NONE}>Brak</SelectItem>{DEAL_TYPE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader><CardTitle className="text-base">Inne</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div>Zakończono przez: <span className="text-muted-foreground">{finisher?.displayName ?? "—"}</span></div>
          <div>Data zakończenia: <span className="text-muted-foreground">{deal.finishedAt ? formatDatePl(deal.finishedAt) : "—"}</span></div>
          <div>Po raz pierwszy zakończono przez: <span className="text-muted-foreground">{firstFinisher?.displayName ?? "—"}</span></div>
        </CardContent>
      </Card>
    </div>
  )
}
