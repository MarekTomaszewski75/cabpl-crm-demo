"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { ProductDetailFields } from "@/components/crm/product-detail-fields"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "@/lib/auth/demo-session"
import {
  PRODUCT_CONDITION_LABELS,
  productConditionBadgeVariant,
} from "@/lib/crm/product-labels"
import { useDemoData } from "@/lib/data/demo-data-context"

type ProductDetailViewProps = {
  productId: string
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { isReady } = useSession()
  const { products, productCategories } = useDemoData()
  const product = products.find((item) => item.id === productId)
  const category = product
    ? productCategories.find((item) => item.id === product.categoryId)
    : undefined

  if (!isReady) {
    return null
  }

  if (!product) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono produktu</AlertTitle>
        <AlertDescription>
          Brak produktu o podanym identyfikatorze w danych demo.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href="/products">
          <ArrowLeftIcon data-icon="inline-start" />
          Produkty
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
        <Badge variant={productConditionBadgeVariant(product.condition)}>
          {PRODUCT_CONDITION_LABELS[product.condition]}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Szczegóły produktu</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDetailFields product={product} category={category} />
        </CardContent>
      </Card>
    </div>
  )
}
