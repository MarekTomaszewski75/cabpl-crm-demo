"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import {
  PRODUCT_AVAILABILITY_LABELS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_GOODS_OR_SERVICE_LABELS,
  PRODUCT_TYPE_LABELS,
  productAvailabilityBadgeVariant,
  productConditionBadgeVariant,
} from "@/lib/crm/product-labels"
import type { Product, ProductCategory } from "@/types/crm"

type ProductDetailFieldsProps = {
  product: Product
  category?: ProductCategory
}

function ReadOnlyField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function ProductDetailFields({
  product,
  category,
}: ProductDetailFieldsProps) {
  const categoryName = category?.name ?? "—"

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ReadOnlyField label="Artykuł">{product.name}</ReadOnlyField>

      <ReadOnlyField label="Kod produktu">
        {product.sku.trim() ? product.sku : "—"}
      </ReadOnlyField>

      <ReadOnlyField label="Kategoria">{categoryName}</ReadOnlyField>

      <ReadOnlyField label="Towar/Usługa">
        {PRODUCT_GOODS_OR_SERVICE_LABELS[product.goodsOrService]}
      </ReadOnlyField>

      <ReadOnlyField label="Typ produktu">
        {PRODUCT_TYPE_LABELS[product.productType]}
      </ReadOnlyField>

      <ReadOnlyField label="Dostępność">
        <Badge variant={productAvailabilityBadgeVariant(product.availability)}>
          {PRODUCT_AVAILABILITY_LABELS[product.availability]}
        </Badge>
      </ReadOnlyField>

      <ReadOnlyField label="Stan">
        <Badge variant={productConditionBadgeVariant(product.condition)}>
          {PRODUCT_CONDITION_LABELS[product.condition]}
        </Badge>
      </ReadOnlyField>

      <ReadOnlyField label="Aktywność">
        {product.isActive ? "Aktywny" : "Nieaktywny"}
      </ReadOnlyField>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-xs text-muted-foreground">Opis</span>
        <p className="text-sm whitespace-pre-wrap">
          {product.description.trim() ? product.description : "—"}
        </p>
      </div>
    </div>
  )
}
