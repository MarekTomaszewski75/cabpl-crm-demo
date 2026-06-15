"use client"

import * as React from "react"
import { CrmFileUploadPanel } from "@/components/crm/crm-file-upload-panel"
import type { CrmUploadedFileRecord } from "@/components/crm/crm-file-upload-panel"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type CrmDocumentUploadInput = {
  file: File
  displayName: string
  description?: string
}

type CrmDocumentUploadFormProps = {
  storedFiles: readonly CrmUploadedFileRecord[]
  disabled?: boolean
  onSubmit: (input: CrmDocumentUploadInput) => boolean | Promise<boolean>
}

export function CrmDocumentUploadForm({
  storedFiles,
  disabled = false,
  onSubmit,
}: CrmDocumentUploadFormProps) {
  const [displayName, setDisplayName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const displayNameTouchedRef = React.useRef(false)

  const handleFileQueued = React.useCallback((file: File) => {
    if (!displayNameTouchedRef.current) {
      setDisplayName(file.name)
    }
  }, [])

  const handleUpload = React.useCallback(
    async (file: File) => {
      const trimmedName = displayName.trim() || file.name
      const trimmedDescription = description.trim()
      const saved = await onSubmit({
        file,
        displayName: trimmedName,
        description: trimmedDescription || undefined,
      })
      if (saved) {
        setDisplayName("")
        setDescription("")
        displayNameTouchedRef.current = false
      }
      return saved
    },
    [description, displayName, onSubmit],
  )

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="crm-document-display-name">Nazwa</FieldLabel>
          <Input
            id="crm-document-display-name"
            placeholder="np. Umowa ramowa"
            value={displayName}
            disabled={disabled}
            onChange={(event) => {
              displayNameTouchedRef.current = true
              setDisplayName(event.target.value)
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-document-description">Opis</FieldLabel>
          <Textarea
            id="crm-document-description"
            placeholder="Opcjonalny opis dokumentu"
            value={description}
            disabled={disabled}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
          />
        </Field>
      </FieldGroup>

      <CrmFileUploadPanel
        files={storedFiles}
        showStoredFiles={false}
        disabled={disabled}
        onUpload={handleUpload}
        onFileQueued={handleFileQueued}
      />
    </div>
  )
}
