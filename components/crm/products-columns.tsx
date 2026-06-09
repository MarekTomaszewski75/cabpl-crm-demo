"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  formatProductPrice,
  PRODUCT_AVAILABILITY_LABELS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_GOODS_OR_SERVICE_LABELS,
  PRODUCT_TYPE_LABELS,
  productAvailabilityBadgeVariant,
  productConditionBadgeVariant,
} from "@/lib/crm/product-labels"
import type { Product, ProductCategory } from "@/types/crm"

export type ProductTableRow = Product & {
  categoryName: string
  _filter: string
}

export const PRODUCT_GROUPING_OPTIONS = [
  { columnId: "categoryName", label: "Kategoria" },
  { columnId: "goodsOrService", label: "Towar/Usługa" },
  { columnId: "availability", label: "Dostępność" },
  { columnId: "condition", label: "Stan" },
  { columnId: "productType", label: "Typ produktu" },
] as const

type ProductsColumnsContext = {
  selectedIds: Set<string>
  onToggleRow: (id: string, checked: boolean) => void
  showCategoryColumn?: boolean
}

export function createProductsColumns(
  ctx: ProductsColumnsContext,
): ColumnDef<ProductTableRow>[] {
  const columns: ColumnDef<ProductTableRow>[] = [
    {
      id: "select",
      meta: { title: "Zaznaczenie" },
      header: () => null,
      cell: ({ row }) => (
        <Checkbox
          checked={ctx.selectedIds.has(row.original.id)}
          onCheckedChange={(checked) =>
            ctx.onToggleRow(row.original.id, checked === true)
          }
          onClick={(event) => event.stopPropagation()}
          aria-label={`Zaznacz ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    createFilterSearchColumn<ProductTableRow>(),
  ]

  if (ctx.showCategoryColumn) {
    columns.push({
      accessorKey: "categoryName",
      meta: { title: "Kategoria" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategoria" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">{row.original.categoryName}</span>
      ),
    })
  }

  columns.push(
    {
      id: "goodsOrService",
      accessorFn: (row) =>
        PRODUCT_GOODS_OR_SERVICE_LABELS[row.goodsOrService],
      meta: { title: "Towar/Usługa" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Towar/Usługa" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {PRODUCT_GOODS_OR_SERVICE_LABELS[row.original.goodsOrService]}
        </span>
      ),
    },
    {
      accessorKey: "name",
      meta: { title: "Artykuł" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Artykuł" />
      ),
      cell: ({ row }) => (
        <div className="flex max-w-64 flex-col gap-0.5">
          <span className="truncate font-medium">{row.original.name}</span>
          {row.original.sku ? (
            <span className="truncate text-xs text-muted-foreground">
              {row.original.sku}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "price",
      accessorFn: (row) => formatProductPrice(row),
      meta: { title: "Cena" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cena" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatProductPrice(row.original)}
        </span>
      ),
    },
    {
      id: "productType",
      accessorFn: (row) => PRODUCT_TYPE_LABELS[row.productType],
      meta: { title: "Typ produktu" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ produktu" />
      ),
      cell: ({ row }) => PRODUCT_TYPE_LABELS[row.original.productType],
    },
    {
      id: "availability",
      accessorFn: (row) => PRODUCT_AVAILABILITY_LABELS[row.availability],
      meta: { title: "Dostępność" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dostępność" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={productAvailabilityBadgeVariant(row.original.availability)}
        >
          {PRODUCT_AVAILABILITY_LABELS[row.original.availability]}
        </Badge>
      ),
    },
    {
      id: "condition",
      accessorFn: (row) => PRODUCT_CONDITION_LABELS[row.condition],
      meta: { title: "Stan" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stan" />
      ),
      cell: ({ row }) => (
        <Badge variant={productConditionBadgeVariant(row.original.condition)}>
          {PRODUCT_CONDITION_LABELS[row.original.condition]}
        </Badge>
      ),
    },
  )

  return columns
}

export function buildProductTableRow(
  product: Product,
  categories: readonly ProductCategory[],
): ProductTableRow {
  const categoryName =
    categories.find((category) => category.id === product.categoryId)?.name ??
    "—"
  return {
    ...product,
    categoryName,
    _filter:
      `${product.name} ${product.sku} ${product.description} ${categoryName}`.toLowerCase(),
  }
}
