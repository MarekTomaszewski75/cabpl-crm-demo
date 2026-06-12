"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BoxesIcon,
  FolderIcon,
  FolderTreeIcon,
  Rows2Icon,
  SearchIcon,
} from "lucide-react"
import {
  buildProductTableRow,
  createProductsColumns,
  PRODUCT_GROUPING_OPTIONS,
  type ProductTableRow,
} from "@/components/crm/products-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useSession } from "@/lib/auth/demo-session"
import {
  expandCategoryFilterIds,
  filterProducts,
  getCategoryIdsForSelection,
  PRODUCT_ACTIVITY_ACTIVE,
  PRODUCT_ACTIVITY_INACTIVE,
  type ProductListFilters,
} from "@/lib/crm/product-filters"
import {
  PRODUCT_AVAILABILITY_LABELS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/crm/product-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { cn } from "@/lib/utils"
import type {
  ProductAvailability,
  ProductCategory,
  ProductCondition,
  ProductType,
} from "@/types/crm"

type ProductsViewMode = "list" | "tree"

function sortCategoriesForPanel(
  categories: readonly ProductCategory[],
): ProductCategory[] {
  const roots = categories
    .filter((category) => !category.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const result: ProductCategory[] = []
  for (const root of roots) {
    result.push(root)
    const children = categories
      .filter((category) => category.parentId === root.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    result.push(...children)
  }
  return result
}

export function ProductsTable() {
  const router = useRouter()
  const { isReady } = useSession()
  const { products, productCategories } = useDemoData()
  const [viewMode, setViewMode] = React.useState<ProductsViewMode>("tree")
  const [selectedTreeCategoryId, setSelectedTreeCategoryId] = React.useState<
    string | null
  >(null)
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activityFilters, setActivityFilters] = React.useState<string[]>([])
  const [availabilityFilters, setAvailabilityFilters] = React.useState<string[]>(
    [],
  )
  const [productTypeFilters, setProductTypeFilters] = React.useState<string[]>(
    [],
  )
  const [conditionFilters, setConditionFilters] = React.useState<string[]>([])

  const sortedCategories = React.useMemo(
    () => sortCategoriesForPanel(productCategories),
    [productCategories],
  )

  const expandedListCategoryIds = React.useMemo(
    () => expandCategoryFilterIds(categoryFilters, productCategories),
    [categoryFilters, productCategories],
  )

  const expandedTreeCategoryIds = React.useMemo(() => {
    if (!selectedTreeCategoryId) return null
    return getCategoryIdsForSelection(selectedTreeCategoryId, productCategories)
  }, [selectedTreeCategoryId, productCategories])

  const categoryScopedProducts = React.useMemo(() => {
    if (viewMode !== "tree" || !expandedTreeCategoryIds) {
      return [...products]
    }
    return products.filter((product) =>
      expandedTreeCategoryIds.includes(product.categoryId),
    )
  }, [viewMode, products, expandedTreeCategoryIds])

  const listFilters = React.useMemo(
    (): ProductListFilters => ({
      categoryFilters: viewMode === "list" ? expandedListCategoryIds : [],
      searchQuery,
      activityFilters,
      availabilityFilters: availabilityFilters as ProductAvailability[],
      productTypeFilters: productTypeFilters as ProductType[],
      conditionFilters: conditionFilters as ProductCondition[],
    }),
    [
      viewMode,
      expandedListCategoryIds,
      searchQuery,
      activityFilters,
      availabilityFilters,
      productTypeFilters,
      conditionFilters,
    ],
  )

  const filteredProducts = React.useMemo(
    () => filterProducts(categoryScopedProducts, listFilters),
    [categoryScopedProducts, listFilters],
  )

  const facetedCountBase =
    viewMode === "tree" ? categoryScopedProducts : products

  const categoryFacetedOptions = React.useMemo(
    () =>
      sortedCategories
        .map((category) => {
          const categoryIds = getCategoryIdsForSelection(
            category.id,
            productCategories,
          )
          const count = products.filter((product) =>
            categoryIds.includes(product.categoryId),
          ).length
          return {
            label: category.parentId ? `— ${category.name}` : category.name,
            value: category.id,
            count,
          }
        })
        .filter((opt) => opt.count > 0),
    [products, sortedCategories, productCategories],
  )

  const activityFacetedOptions = React.useMemo(() => {
    const counts = { active: 0, inactive: 0 }
    for (const product of facetedCountBase) {
      if (product.isActive) counts.active += 1
      else counts.inactive += 1
    }
    return [
      { label: "Aktywny", value: PRODUCT_ACTIVITY_ACTIVE, count: counts.active },
      {
        label: "Nieaktywny",
        value: PRODUCT_ACTIVITY_INACTIVE,
        count: counts.inactive,
      },
    ].filter((opt) => (opt.count ?? 0) > 0)
  }, [facetedCountBase])

  const availabilityFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of facetedCountBase) {
      counts.set(
        product.availability,
        (counts.get(product.availability) ?? 0) + 1,
      )
    }
    return (Object.keys(PRODUCT_AVAILABILITY_LABELS) as ProductAvailability[])
      .map((value) => ({
        label: PRODUCT_AVAILABILITY_LABELS[value],
        value,
        count: counts.get(value) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [facetedCountBase])

  const productTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of facetedCountBase) {
      counts.set(product.productType, (counts.get(product.productType) ?? 0) + 1)
    }
    return (Object.keys(PRODUCT_TYPE_LABELS) as ProductType[])
      .map((value) => ({
        label: PRODUCT_TYPE_LABELS[value],
        value,
        count: counts.get(value) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [facetedCountBase])

  const conditionFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of facetedCountBase) {
      counts.set(product.condition, (counts.get(product.condition) ?? 0) + 1)
    }
    return (Object.keys(PRODUCT_CONDITION_LABELS) as ProductCondition[])
      .map((value) => ({
        label: PRODUCT_CONDITION_LABELS[value],
        value,
        count: counts.get(value) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [facetedCountBase])

  const tableData = React.useMemo(
    (): ProductTableRow[] =>
      filteredProducts.map((product) =>
        buildProductTableRow(product, productCategories),
      ),
    [filteredProducts, productCategories],
  )

  const columns = React.useMemo(
    () =>
      createProductsColumns({
        showCategoryColumn: viewMode === "list",
      }),
    [viewMode],
  )

  const resultCountLabel = React.useMemo(() => {
    const n = filteredProducts.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [filteredProducts.length])

  if (!isReady) {
    return null
  }

  const categoryPanel = (
    <aside className="flex w-full shrink-0 flex-col gap-2 rounded-md border border-border bg-card p-3 lg:w-64 xl:w-72">
      <h2 className="px-1 text-sm font-semibold">Kategorie</h2>
      <div className="flex flex-col gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-full justify-start gap-2 px-2 font-normal",
            selectedTreeCategoryId === null &&
              "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
          )}
          onClick={() => setSelectedTreeCategoryId(null)}
        >
          <FolderIcon />
          Wszystkie kategorie
        </Button>
        {sortedCategories.map((category) => (
          <Button
            key={category.id}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start gap-2 px-2 font-normal",
              category.parentId && "pl-6",
              selectedTreeCategoryId === category.id &&
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
            )}
            onClick={() => setSelectedTreeCategoryId(category.id)}
          >
            <FolderIcon />
            <span className="truncate">{category.name}</span>
          </Button>
        ))}
      </div>
    </aside>
  )

  const filterBar = (
    <div className="flex flex-wrap items-center gap-2">
      {viewMode === "list" ? (
        <DataTableFacetedFilter
          title="Kategoria"
          options={categoryFacetedOptions}
          selectedValues={categoryFilters}
          onSelectedValuesChange={setCategoryFilters}
        />
      ) : null}
      <DataTableFacetedFilter
        title="Aktywność"
        options={activityFacetedOptions}
        selectedValues={activityFilters}
        onSelectedValuesChange={setActivityFilters}
      />
      <DataTableFacetedFilter
        title="Dostępność"
        options={availabilityFacetedOptions}
        selectedValues={availabilityFilters}
        onSelectedValuesChange={setAvailabilityFilters}
      />
      <DataTableFacetedFilter
        title="Typ produktu"
        options={productTypeFacetedOptions}
        selectedValues={productTypeFilters}
        onSelectedValuesChange={setProductTypeFilters}
      />
      <DataTableFacetedFilter
        title="Stan"
        options={conditionFacetedOptions}
        selectedValues={conditionFilters}
        onSelectedValuesChange={setConditionFilters}
      />
    </div>
  )

  const dataTable = (
    <DataTable
      columns={columns}
      data={tableData}
      emptyMessage="Brak wyników dla podanych filtrów."
      pageSize={20}
      showSearchInToolbar={false}
      showToolbar={products.length > 0}
      groupingOptions={[...PRODUCT_GROUPING_OPTIONS]}
      onRowClick={(row) => router.push(`/products/${row.id}`)}
    />
  )

  const filteredEmpty = (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>Teraz jest tu pusto…</EmptyTitle>
        <EmptyDescription>
          Brak produktów dla wybranych filtrów. Zmień kryteria wyszukiwania.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-col gap-2 pb-0">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Produkty</CardTitle>
            <div
              className="flex shrink-0 items-center rounded-md border border-border p-0.5"
              role="group"
              aria-label="Widok katalogu produktów"
            >
              <Button
                type="button"
                variant={viewMode === "tree" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Widok drzewa kategorii"
                aria-pressed={viewMode === "tree"}
                onClick={() => setViewMode("tree")}
              >
                <FolderTreeIcon />
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Widok listy"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                <Rows2Icon />
              </Button>
            </div>
            <InputGroup className="h-9 min-h-9 min-w-0 flex-1 basis-0">
              <InputGroupInput
                type="search"
                placeholder="Szukaj"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj produktów"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end" className="tabular-nums">
                {resultCountLabel}
              </InputGroupAddon>
            </InputGroup>
          </div>

          {filterBar}
        </CardHeader>
      </Card>

      <Card size="sm" className="gap-3">
        <CardContent className="pt-3">
          {products.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BoxesIcon />
                </EmptyMedia>
                <EmptyTitle>Teraz jest tu pusto…</EmptyTitle>
                <EmptyDescription>
                  Katalog produktów bankowych jest pusty w danych demo.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : viewMode === "tree" ? (
            <div className="flex flex-col gap-4 lg:flex-row">
              {categoryPanel}
              <div className="min-w-0 flex-1">
                {filteredProducts.length === 0 ? filteredEmpty : dataTable}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            filteredEmpty
          ) : (
            dataTable
          )}
        </CardContent>
      </Card>
    </div>
  )
}
