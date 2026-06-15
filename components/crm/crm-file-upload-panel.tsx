"use client"

import * as React from "react"
import {
  FileIcon,
  FileTextIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import {
  CRM_FILE_UPLOAD_ACCEPT,
  CRM_FILE_UPLOAD_MAX_FILES,
  CRM_FILE_UPLOAD_MAX_SIZE,
  formatFileSize,
  validateCrmUploadFile,
} from "@/lib/crm/file-upload-validation"
import { formatDatePl } from "@/lib/format/pl"
import { cn } from "@/lib/utils"
import type { DemoUser } from "@/types/crm"

export type CrmUploadedFileRecord = {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  ownerId: string
}

type CrmFileUploadPanelProps = {
  files: readonly CrmUploadedFileRecord[]
  onUpload: (file: File) => boolean | Promise<boolean>
  onRemove?: (id: string) => void
  disabled?: boolean
  users?: readonly DemoUser[]
  showStoredFiles?: boolean
  onFileQueued?: (file: File) => void
}

type ActiveUpload = {
  key: string
  fileName: string
  fileSize: number
  mimeType: string
  progress: number
  error?: string
}

const FILE_ROW_CLASS =
  "relative flex items-center gap-2.5 rounded-md border p-3"

const FILE_PREVIEW_CLASS =
  "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50 [&>svg]:size-5"

function demoUploadDelayMs(): number {
  return 300 + Math.floor(Math.random() * 500)
}

function uploadKey(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`
}

function getStoredFileIcon(fileName: string, mimeType: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? ""
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

type CrmFileListProps = {
  files: readonly CrmUploadedFileRecord[]
  activeUploads: readonly ActiveUpload[]
  users: readonly DemoUser[]
  onRemove?: (id: string) => void
  onCancelUpload?: (key: string) => void
}

function CrmFileList({
  files,
  activeUploads,
  users,
  onRemove,
  onCancelUpload,
}: CrmFileListProps) {
  if (activeUploads.length === 0 && files.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col gap-2">
      {activeUploads.map((upload) => (
        <li key={upload.key}>
          <div className={FILE_ROW_CLASS}>
            <div className={cn(FILE_PREVIEW_CLASS, "text-muted-foreground")}>
              {getStoredFileIcon(upload.fileName, upload.mimeType)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                  {upload.fileName}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {formatFileSize(upload.fileSize)}
                  {upload.error ? null : ` · Przesyłanie ${upload.progress}%`}
                </span>
              </div>
              {upload.error ? (
                <span className="text-destructive text-xs">{upload.error}</span>
              ) : (
                <Progress value={upload.progress} />
              )}
            </div>
            {onCancelUpload ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Anuluj przesyłanie ${upload.fileName}`}
                onClick={() => onCancelUpload(upload.key)}
              >
                <Trash2Icon />
              </Button>
            ) : null}
          </div>
        </li>
      ))}

      {files.map((file) => {
        const author = users.find((user) => user.id === file.ownerId)
        return (
          <li key={file.id}>
            <div className={FILE_ROW_CLASS}>
              <div className={cn(FILE_PREVIEW_CLASS, "text-muted-foreground")}>
                {getStoredFileIcon(file.fileName, file.mimeType)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                  {file.fileName}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {formatFileSize(file.fileSize)} · Dodano{" "}
                  {formatDatePl(file.uploadedAt)}
                  {author ? ` · ${author.displayName}` : null}
                </span>
              </div>
              {onRemove ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Usuń plik ${file.fileName}`}
                  onClick={() => onRemove(file.id)}
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

export function CrmFileUploadPanel({
  files,
  onUpload,
  onRemove,
  disabled = false,
  users = [],
  showStoredFiles = true,
  onFileQueued,
}: CrmFileUploadPanelProps) {
  const [queueValue, setQueueValue] = React.useState<File[]>([])
  const [activeUploads, setActiveUploads] = React.useState<ActiveUpload[]>([])

  const remainingSlots = Math.max(0, CRM_FILE_UPLOAD_MAX_FILES - files.length)
  const uploadDisabled = disabled || remainingSlots === 0

  const updateActiveUpload = React.useCallback(
    (key: string, patch: Partial<ActiveUpload>) => {
      setActiveUploads((prev) =>
        prev.map((item) => (item.key === key ? { ...item, ...patch } : item)),
      )
    },
    [],
  )

  const removeActiveUpload = React.useCallback((key: string) => {
    setActiveUploads((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const handleUpload = React.useCallback(
    async (
      uploadFiles: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void
        onSuccess: (file: File) => void
        onError: (file: File, error: Error) => void
      },
    ) => {
      for (const file of uploadFiles) {
        const key = uploadKey(file)
        onFileQueued?.(file)
        setActiveUploads((prev) => [
          ...prev.filter((item) => item.key !== key),
          {
            key,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || "application/octet-stream",
            progress: 0,
          },
        ])

        try {
          const delayMs = demoUploadDelayMs()
          const steps = 4
          for (let step = 1; step <= steps; step += 1) {
            await new Promise((resolve) => {
              window.setTimeout(resolve, delayMs / steps)
            })
            const progress = Math.round((step / steps) * 100)
            updateActiveUpload(key, { progress })
            onProgress(file, progress)
          }

          const saved = await onUpload(file)
          if (saved) {
            onSuccess(file)
            removeActiveUpload(key)
            setQueueValue((prev) => prev.filter((item) => item !== file))
          } else {
            const message = "Nie udało się zapisać pliku."
            updateActiveUpload(key, { error: message, progress: 0 })
            onError(file, new Error(message))
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Nie udało się zapisać pliku."
          updateActiveUpload(key, { error: message, progress: 0 })
          onError(
            file,
            error instanceof Error
              ? error
              : new Error("Nie udało się zapisać pliku."),
          )
        }
      }
    },
    [onUpload, onFileQueued, removeActiveUpload, updateActiveUpload],
  )

  const handleFileValidate = React.useCallback(
    (file: File) => validateCrmUploadFile(file, files.length),
    [files.length],
  )

  const handleCancelUpload = React.useCallback(
    (key: string) => {
      removeActiveUpload(key)
      setQueueValue((prev) =>
        prev.filter((file) => uploadKey(file) !== key),
      )
    },
    [removeActiveUpload],
  )

  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        value={queueValue}
        onValueChange={setQueueValue}
        accept={CRM_FILE_UPLOAD_ACCEPT}
        maxFiles={remainingSlots}
        maxSize={CRM_FILE_UPLOAD_MAX_SIZE}
        multiple
        disabled={uploadDisabled}
        onUpload={handleUpload}
        onFileValidate={handleFileValidate}
        onFileReject={(_, message) => toast.error(message)}
      >
        <FileUploadDropzone className="flex flex-col gap-2 p-8 text-center text-sm">
          <UploadIcon className="mx-auto text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">
            Przeciągnij pliki do tego obszaru lub kliknij, aby wybrać
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, obrazy lub Office — maks. {CRM_FILE_UPLOAD_MAX_FILES} plików po{" "}
            {formatFileSize(CRM_FILE_UPLOAD_MAX_SIZE)}
          </p>
          <FileUploadTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadDisabled}
            >
              Wybierz pliki
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      </FileUpload>

      <CrmFileList
        files={showStoredFiles ? files : []}
        activeUploads={activeUploads}
        users={users}
        onRemove={onRemove}
        onCancelUpload={handleCancelUpload}
      />
    </div>
  )
}
