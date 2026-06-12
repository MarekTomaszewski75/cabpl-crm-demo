export const CRM_FILE_UPLOAD_MAX_FILES = 10
export const CRM_FILE_UPLOAD_MAX_SIZE = 5 * 1024 * 1024

export const CRM_FILE_UPLOAD_ACCEPT =
  "application/pdf,image/jpeg,image/png,image/gif,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx"

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
])

const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"]
const ALLOWED_MIME_TYPES = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
])

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
}

export function isAllowedUploadFile(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (ALLOWED_EXTENSIONS.has(extension)) return true
  if (ALLOWED_MIME_TYPES.has(file.type)) return true
  return ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))
}

export function validateCrmUploadFile(
  file: File,
  existingCount: number,
): string | null {
  if (existingCount >= CRM_FILE_UPLOAD_MAX_FILES) {
    return "Możesz dodać maksymalnie 10 plików."
  }
  if (file.size > CRM_FILE_UPLOAD_MAX_SIZE) {
    return "Plik jest za duży — maksymalnie 5 MB."
  }
  if (!isAllowedUploadFile(file)) {
    return "Niedozwolony typ pliku. Dozwolone: PDF, obrazy, dokumenty Office."
  }
  return null
}
