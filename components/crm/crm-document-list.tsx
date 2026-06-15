"use client"

import { FileIcon, FileTextIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import type { CrmDocumentListItem } from "@/lib/crm/entity-documents"
import { formatFileSize } from "@/lib/crm/file-upload-validation"
import { formatDatePl } from "@/lib/format/pl"
import { cn } from "@/lib/utils"
import type { DemoUser } from "@/types/crm"

type CrmDocumentListProps = {
  items: readonly CrmDocumentListItem[]
  users: readonly DemoUser[]
  onRemoveFile?: (id: string) => void
  emptyTitle?: string
  emptyDescription?: string
}

const ROW_CLASS =
  "relative flex items-start gap-2.5 rounded-md border p-3"

const PREVIEW_CLASS =
  "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50 text-muted-foreground [&>svg]:size-5"

function getDocumentIcon(item: CrmDocumentListItem) {
  if (item.source === "legacy-document") {
    return <FileTextIcon />
  }

  const extension = item.fileName?.split(".").pop()?.toLowerCase() ?? ""
  const mimeType = item.mimeType ?? ""
  if (mimeType.startsWith("image/")) {
    return <FileIcon />
  }
  if (
    mimeType === "application/pdf" ||
    extension === "pdf" ||
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension)
  ) {
    return <FileTextIcon />
  }
  return <FileIcon />
}

function formatFileMeta(item: CrmDocumentListItem): string {
  if (item.source === "legacy-document") {
    return "Dokument tekstowy"
  }

  const parts: string[] = []
  if (item.fileName) {
    parts.push(item.fileName)
  }
  if (typeof item.fileSize === "number") {
    parts.push(formatFileSize(item.fileSize))
  }
  return parts.join(" · ")
}

export function CrmDocumentList({
  items,
  users,
  onRemoveFile,
  emptyTitle = "Brak dokumentów",
  emptyDescription = "Dodaj dokument z plikiem, nazwą i opcjonalnym opisem.",
}: CrmDocumentListProps) {
  if (items.length === 0) {
    return (
      <Empty className="border py-6">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const author = users.find((user) => user.id === item.ownerId)

        return (
          <li key={item.id}>
            <div className={ROW_CLASS}>
              <div className={cn(PREVIEW_CLASS)}>
                {getDocumentIcon(item)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate font-medium text-sm">
                  {item.displayName}
                </span>
                <span className="text-muted-foreground text-xs">
                  Opis: {item.description?.trim() || "—"}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {formatFileMeta(item)}
                  {" · "}Dodano {formatDatePl(item.uploadedAt)}
                  {author ? ` · ${author.displayName}` : null}
                </span>
              </div>
              {item.source === "file" && onRemoveFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Usuń dokument ${item.displayName}`}
                  onClick={() => onRemoveFile(item.id)}
                >
                  <Trash2Icon />
                </Button>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
