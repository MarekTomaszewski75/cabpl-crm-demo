"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ACCEPTED_EXTENSIONS = "*.jpeg, *.jpg, *.png, *.gif"

type CompanyFilesUploadZoneProps = {
  className?: string
}

export function CompanyFilesUploadZone({
  className,
}: CompanyFilesUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    toast.message(
      `Wybrano ${files.length} plik(ów) — zapis plików w Etapie 2`,
    )
    if (inputRef.current) inputRef.current.value = ""
  }

  function openFilePicker() {
    inputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center text-sm transition-colors",
        isDragging
          ? "border-primary/60 bg-primary/5"
          : "border-border bg-muted/20",
        className,
      )}
      onDragEnter={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        multiple
        accept="image/jpeg,image/png,image/gif"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-muted-foreground">
        Przeciągnij pliki do tego obszaru lub{" "}
        <button
          type="button"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          onClick={openFilePicker}
        >
          <UploadIcon className="size-4" aria-hidden />
          Prześlij
        </button>
      </p>
      <p className="text-xs text-muted-foreground">
        Wybierz pliki w formacie {ACCEPTED_EXTENSIONS}
      </p>
    </div>
  )
}
