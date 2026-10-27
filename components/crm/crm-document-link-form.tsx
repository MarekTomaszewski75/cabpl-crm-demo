"use client"

import * as React from "react"
import { Link2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
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
  DOCUMENT_REPOSITORY_OPTIONS,
  type CrmDocumentLinkInput,
} from "@/lib/crm/document-repositories"
import type { DocumentRepositoryId } from "@/types/crm"

type CrmDocumentLinkFormProps = {
  disabled?: boolean
  onSubmit: (input: CrmDocumentLinkInput) => boolean
}

/** Dodanie odnośnika do dokumentu w AIDA / SharePoint / dysku S / CASE PRO (QW-17, US-60). */
export function CrmDocumentLinkForm({
  disabled = false,
  onSubmit,
}: CrmDocumentLinkFormProps) {
  const [repositoryId, setRepositoryId] =
    React.useState<DocumentRepositoryId>("aida")
  const [displayName, setDisplayName] = React.useState("")
  const [externalRef, setExternalRef] = React.useState("")
  const [description, setDescription] = React.useState("")

  const canSubmit =
    !disabled && displayName.trim().length > 0 && externalRef.trim().length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    const saved = onSubmit({
      repositoryId,
      externalRef: externalRef.trim(),
      displayName: displayName.trim(),
      description: description.trim() || undefined,
    })
    if (saved) {
      setDisplayName("")
      setExternalRef("")
      setDescription("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-md border border-dashed p-3"
    >
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Link2Icon className="size-4 text-muted-foreground" aria-hidden />
          Odnośnik do repozytorium Banku
        </span>
        <span className="text-xs text-muted-foreground">
          Dokument zostaje w systemie źródłowym — CRM zapisuje nazwę, sygnaturę
          i odnośnik.
        </span>
      </div>
      <FieldGroup>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="doc-link-repository">Repozytorium</FieldLabel>
            <Select
              value={repositoryId}
              onValueChange={(value) =>
                setRepositoryId(value as DocumentRepositoryId)
              }
              disabled={disabled}
            >
              <SelectTrigger id="doc-link-repository" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DOCUMENT_REPOSITORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="doc-link-ref">Sygnatura lub ścieżka</FieldLabel>
            <Input
              id="doc-link-ref"
              value={externalRef}
              onChange={(event) => setExternalRef(event.target.value)}
              placeholder="np. AIDA-2026-004512"
              disabled={disabled}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="doc-link-name">Nazwa dokumentu</FieldLabel>
          <Input
            id="doc-link-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="np. Sprawozdanie finansowe 2025"
            disabled={disabled}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="doc-link-description">Opis (opcjonalnie)</FieldLabel>
          <Textarea
            id="doc-link-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={disabled}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" variant="outline" className="w-fit" disabled={!canSubmit}>
        Dodaj odnośnik
      </Button>
    </form>
  )
}
