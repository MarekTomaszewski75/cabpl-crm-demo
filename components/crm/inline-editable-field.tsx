"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type InlineEditableFieldProps = {
  label: string
  value: string
  placeholder?: string
  onSave: (value: string) => void
  children: (props: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }) => React.ReactNode
  className?: string
}

export function InlineEditableField({
  label,
  value,
  placeholder = "Wprowadź wartość…",
  onSave,
  children,
  className,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    if (!isEditing) setDraft(value)
  }, [value, isEditing])

  function commit() {
    setIsEditing(false)
    if (draft !== value) onSave(draft)
  }

  function cancel() {
    setDraft(value)
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      commit()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      cancel()
    }
  }

  if (isEditing) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <span className="text-xs text-muted-foreground">{label}</span>
        {children({
          value: draft,
          onChange: setDraft,
          onBlur: commit,
          onKeyDown: handleKeyDown,
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <button
        type="button"
        className={cn(
          "w-full rounded-md border border-transparent px-2 py-1.5 text-left text-sm transition-colors hover:border-border hover:bg-muted/40",
          !value.trim() && "text-muted-foreground",
        )}
        onClick={() => setIsEditing(true)}
      >
        {value.trim() || placeholder}
      </button>
    </div>
  )
}
