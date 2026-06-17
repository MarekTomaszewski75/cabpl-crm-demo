import type { ClientBankingProductStatus } from "@/types/crm"

export const CLIENT_BANKING_PRODUCT_STATUS_LABELS: Record<
  ClientBankingProductStatus,
  string
> = {
  active: "Aktywny",
  expiring: "Wygasający",
  blocked: "Zablokowany",
  closed: "Zamknięty",
}

export const CLIENT_BANKING_PRODUCT_STATUS_OPTIONS = (
  Object.keys(CLIENT_BANKING_PRODUCT_STATUS_LABELS) as ClientBankingProductStatus[]
).map((value) => ({
  value,
  label: CLIENT_BANKING_PRODUCT_STATUS_LABELS[value],
}))

export function clientBankingProductStatusBadgeVariant(
  status: ClientBankingProductStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "active":
      return "default"
    case "expiring":
      return "secondary"
    case "blocked":
      return "destructive"
    case "closed":
      return "outline"
  }
}
