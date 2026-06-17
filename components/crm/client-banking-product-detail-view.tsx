"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldAlertIcon } from "lucide-react"
import { ClientBankingProductCrmActions } from "@/components/crm/client-banking-product-crm-actions"
import { ClientBankingProductDetailHeader } from "@/components/crm/client-banking-product-detail-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSession } from "@/lib/auth/demo-session"
import { CLIENT_BANKING_PRODUCT_STATUS_LABELS } from "@/lib/crm/client-banking-product-labels"
import {
  formatClientBankingProductAmountSummary,
  getClientBankingProductUtilizationPercent,
  isLimitBasedClientBankingProduct,
} from "@/lib/crm/client-banking-product-display"
import { getEnrichedClientBankingProductById } from "@/lib/crm/client-banking-products"
import { PRODUCT_TYPE_LABELS } from "@/lib/crm/product-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  formatCurrency,
  formatDatePl,
  formatIban,
} from "@/lib/format/pl"
import { canAccessEntity } from "@/lib/rbac/scope"

type ClientBankingProductDetailViewProps = {
  clientId: string
  productId: string
}

function ReadOnlyField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function ClientBankingProductDetailView({
  clientId,
  productId,
}: ClientBankingProductDetailViewProps) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { clients, users, clientBankingProducts, products, productCategories } =
    useDemoData()

  const client = clients.find((entry) => entry.id === clientId)
  const item = React.useMemo(() => {
    if (!user) return null
    return getEnrichedClientBankingProductById(
      productId,
      { clientBankingProducts, products, productCategories },
      user,
    )
  }, [user, productId, clientBankingProducts, products, productCategories])

  const owner = users.find((entry) => entry.id === item?.ownerId)
  const utilizationPercent = item
    ? getClientBankingProductUtilizationPercent(item)
    : null

  React.useEffect(() => {
    if (isReady && user && item && !canAccessEntity(item, user)) {
      router.replace(`/clients/${clientId}`)
    }
  }, [isReady, user, item, router, clientId])

  React.useEffect(() => {
    if (isReady && user && client && !canAccessEntity(client, user)) {
      router.replace("/clients")
    }
  }, [isReady, user, client, router])

  if (!isReady || !user) {
    return null
  }

  if (!client) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono firmy</AlertTitle>
        <AlertDescription>
          Brak firmy o podanym identyfikatorze w danych demo.
        </AlertDescription>
      </Alert>
    )
  }

  if (!item || item.clientId !== clientId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono produktu bankowego</AlertTitle>
        <AlertDescription>
          Brak produktu o podanym identyfikatorze dla tej firmy.
        </AlertDescription>
      </Alert>
    )
  }

  if (!canAccessEntity(item, user) || !canAccessEntity(client, user)) {
    return (
      <Alert variant="destructive">
        <ShieldAlertIcon />
        <AlertTitle>Brak dostępu</AlertTitle>
        <AlertDescription>
          Ten produkt bankowy nie należy do Twojego zakresu (RBAC).
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ClientBankingProductDetailHeader
        item={item}
        client={client}
        owner={owner}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ClientBankingProductCrmActions
          item={item}
          client={client}
          user={user}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Powiązania</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="Firma">
                <Link
                  href={`/clients/${client.id}?related=produkty`}
                  className="font-medium text-primary hover:underline"
                >
                  {client.name}
                </Link>
              </ReadOnlyField>
              <ReadOnlyField label="Produkt katalogowy">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {item.product.name}
                </Link>
              </ReadOnlyField>
              <ReadOnlyField label="Nr umowy">{item.contractNumber}</ReadOnlyField>
              <ReadOnlyField label="Status relacji">
                {CLIENT_BANKING_PRODUCT_STATUS_LABELS[item.status]}
              </ReadOnlyField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rachunek bankowy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="Numer IBAN">
                <span className="font-mono text-sm">
                  {formatIban(item.bankAccountNumber)}
                </span>
              </ReadOnlyField>
              <ReadOnlyField label="Waluta">{item.currency}</ReadOnlyField>
              <ReadOnlyField label="Opis rachunku">
                {item.bankAccountName}
              </ReadOnlyField>
              <ReadOnlyField label="Podsumowanie">
                {formatClientBankingProductAmountSummary(item)}
              </ReadOnlyField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Warunki finansowe</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isLimitBasedClientBankingProduct(item) ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField label="Limit">
                    {item.limitAmount != null
                      ? formatCurrency(item.limitAmount, item.currency)
                      : "—"}
                  </ReadOnlyField>
                  <ReadOnlyField label="Wykorzystanie">
                    {item.utilizedAmount != null
                      ? formatCurrency(item.utilizedAmount, item.currency)
                      : "—"}
                  </ReadOnlyField>
                  {utilizationPercent != null ? (
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Stopień wykorzystania limitu
                        </span>
                        <span className="font-medium tabular-nums">
                          {utilizationPercent}%
                        </span>
                      </div>
                      <Progress value={utilizationPercent} />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField label="Saldo">
                    {item.balanceAmount != null
                      ? formatCurrency(item.balanceAmount, item.currency)
                      : "—"}
                  </ReadOnlyField>
                </div>
              )}

              <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
                <ReadOnlyField label="Data otwarcia">
                  {formatDatePl(item.openedAt)}
                </ReadOnlyField>
                <ReadOnlyField label="Data wygaśnięcia">
                  {item.expiresAt ? formatDatePl(item.expiresAt) : "Bezterminowy"}
                </ReadOnlyField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacje o produkcie</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="Kategoria">{item.categoryName}</ReadOnlyField>
              <ReadOnlyField label="Typ produktu">
                <Badge variant="outline">
                  {PRODUCT_TYPE_LABELS[item.product.productType]}
                </Badge>
              </ReadOnlyField>
              <ReadOnlyField label="Kod produktu">{item.product.sku}</ReadOnlyField>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs text-muted-foreground">Opis produktu</span>
                <p className="text-sm whitespace-pre-wrap">
                  {item.product.description.trim() || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
