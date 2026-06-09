"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
import { LeadEngagementIndicators } from "@/components/crm/lead-engagement-indicators"
import { InlineEditableField } from "@/components/crm/inline-editable-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  LEAD_SOURCE_OPTIONS,
  LEAD_TYPE_OPTIONS,
  isTerminalLeadStatus,
} from "@/lib/crm/lead-labels"
import { getLeadEngagementCounts } from "@/lib/crm/lead-engagement-counts"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead, LeadSource, LeadType } from "@/types/crm"

const LEAD_TYPE_NONE = "__none__"

type LeadDetailSidebarProps = {
  lead: Lead
}

function StringListEditor({
  label,
  values,
  placeholder,
  onSave,
  disabled,
}: {
  label: string
  values: string[]
  placeholder: string
  onSave: (values: string[]) => void
  disabled?: boolean
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(
    values.length > 0 ? values : [""],
  )

  React.useEffect(() => {
    if (!isEditing) {
      setDraft(values.length > 0 ? values : [""])
    }
  }, [values, isEditing])

  function commit() {
    setIsEditing(false)
    onSave(draft)
  }

  function cancel() {
    setDraft(values.length > 0 ? values : [""])
    setIsEditing(false)
  }

  const display = values.length > 0 ? values.join(", ") : ""

  if (disabled) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="px-2 py-1.5 text-sm text-muted-foreground">
          {display || "—"}
        </span>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <button
          type="button"
          className={`w-full rounded-md border border-transparent px-2 py-1.5 text-left text-sm transition-colors hover:border-border hover:bg-muted/40 ${!display ? "text-muted-foreground" : ""}`}
          onClick={() => setIsEditing(true)}
        >
          {display || placeholder}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {draft.map((item, index) => (
        <div key={`${label}-${index}`} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const list = [...draft]
              list[index] = e.target.value
              setDraft(list)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel()
              if (e.key === "Enter") commit()
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={draft.length <= 1}
            onClick={() => {
              const list = draft.filter((_, i) => i !== index)
              setDraft(list.length > 0 ? list : [""])
            }}
            aria-label={`Usuń ${label}`}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDraft((p) => [...p, ""])}
        >
          <PlusIcon data-icon="inline-start" />
          Dodaj
        </Button>
        <Button type="button" size="sm" onClick={commit}>
          Gotowe
        </Button>
      </div>
    </div>
  )
}

export function LeadDetailSidebar({ lead }: LeadDetailSidebarProps) {
  const { updateLead, tasks, meetings, leadDocuments } = useDemoData()
  const readOnly = isTerminalLeadStatus(lead.status)

  const engagementCounts = React.useMemo(
    () =>
      getLeadEngagementCounts(lead.id, {
        tasks,
        meetings,
        leadDocuments,
      }),
    [lead.id, tasks, meetings, leadDocuments],
  )

  function patch(partial: Partial<Lead>) {
    if (readOnly) return
    updateLead(lead.id, partial)
  }

  return (
    <div className="flex w-full max-w-sm shrink-0 flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">O leadzie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LeadEngagementIndicators counts={engagementCounts} />

          <InlineEditableField
            label="Nazwa"
            value={lead.name}
            onSave={(name) => patch({ name })}
          >
            {(props) => (
              <Input
                value={props.value}
                disabled={readOnly}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Kontakt</span>
            <ContactComboboxField
              value={lead.contactId ? [lead.contactId] : []}
              onChange={(ids) => patch({ contactId: ids[0] ?? null })}
              disabled={readOnly}
            />
          </div>

          <InlineEditableField
            label="Nazwa firmy"
            value={lead.companyName}
            onSave={(companyName) => patch({ companyName })}
          >
            {(props) => (
              <Input
                value={props.value}
                disabled={readOnly}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <InlineEditableField
            label="Stanowisko"
            value={lead.position}
            onSave={(position) => patch({ position })}
          >
            {(props) => (
              <Input
                value={props.value}
                disabled={readOnly}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <StringListEditor
            label="Telefon"
            values={lead.phones}
            placeholder="Wprowadź wartość…"
            onSave={(phones) => patch({ phones })}
            disabled={readOnly}
          />

          <StringListEditor
            label="E-mail"
            values={lead.emails}
            placeholder="Wprowadź wartość…"
            onSave={(emails) => patch({ emails })}
            disabled={readOnly}
          />

          <InlineEditableField
            label="Media społecznościowe"
            value={lead.socialMedia}
            onSave={(socialMedia) => patch({ socialMedia })}
          >
            {(props) => (
              <Input
                value={props.value}
                disabled={readOnly}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">Dodatkowo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Komentarz</span>
            <Textarea
              value={lead.comments}
              placeholder="Wprowadź wartość…"
              disabled={readOnly}
              onChange={(e) => patch({ comments: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Źródło</span>
            <Select
              value={lead.source}
              disabled={readOnly}
              onValueChange={(v) => patch({ source: v as LeadSource })}
            >
              <SelectTrigger>
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
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Typ leada</span>
            <Select
              value={lead.leadType ?? LEAD_TYPE_NONE}
              disabled={readOnly}
              onValueChange={(v) =>
                patch({
                  leadType:
                    v === LEAD_TYPE_NONE ? null : (v as LeadType),
                })
              }
            >
              <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
