"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { ContactComboboxField } from "@/components/crm/contact-combobox"
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
  COMPANY_SOURCE_OPTIONS,
  COMPANY_TYPE_OPTIONS,
} from "@/lib/crm/company-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client, CompanySource, CompanyType } from "@/types/crm"

const SOURCE_NONE = "__none__"

type CompanyDetailSidebarProps = {
  client: Client
}

function StringListEditor({
  label,
  values,
  placeholder,
  onSave,
}: {
  label: string
  values: string[]
  placeholder: string
  onSave: (values: string[]) => void
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

  const display =
    values.length > 0 ? values.join(", ") : ""

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

export function CompanyDetailSidebar({ client }: CompanyDetailSidebarProps) {
  const { updateClient } = useDemoData()

  function patch(partial: Partial<Client>) {
    updateClient(client.id, partial)
  }

  return (
    <div className="flex w-full max-w-sm shrink-0 flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">O firmie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <InlineEditableField
            label="Nazwa firmy"
            value={client.name}
            onSave={(name) => patch({ name })}
          >
            {(props) => (
              <Input
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <InlineEditableField
            label="Media społecznościowe"
            value={client.socialMedia}
            onSave={(socialMedia) => patch({ socialMedia })}
          >
            {(props) => (
              <Input
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <StringListEditor
            label="Telefon"
            values={client.phones}
            placeholder="Wprowadź wartość…"
            onSave={(phones) => patch({ phones })}
          />

          <StringListEditor
            label="E-mail"
            values={client.emails}
            placeholder="Wprowadź wartość…"
            onSave={(emails) => patch({ emails })}
          />

          <InlineEditableField
            label="Link"
            value={client.website}
            onSave={(website) => patch({ website })}
          >
            {(props) => (
              <Input
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
              />
            )}
          </InlineEditableField>

          <ContactComboboxField
            value={client.contactIds}
            onChange={(contactIds) => patch({ contactIds })}
          />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">Dodatkowo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Komentarze</span>
            <Textarea
              value={client.comments}
              placeholder="Wprowadź wartość…"
              onChange={(e) => patch({ comments: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Źródło</span>
            <Select
              value={client.source ?? SOURCE_NONE}
              onValueChange={(v) =>
                patch({
                  source: v === SOURCE_NONE ? null : (v as CompanySource),
                })
              }
            >
              <SelectTrigger>
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
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Typ firmy</span>
            <Select
              value={client.companyType}
              onValueChange={(v) =>
                patch({ companyType: v as CompanyType })
              }
            >
              <SelectTrigger>
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
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Adres</span>
            <Textarea
              value={client.address}
              placeholder="Wprowadź wartość…"
              onChange={(e) => patch({ address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
