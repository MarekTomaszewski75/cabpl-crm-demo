import { DEAL_PIPELINE_CATEGORY_LABELS } from "@/lib/crm/deal-pipeline-labels"
import { resolvePipelineCategoryId } from "@/lib/crm/deal-pipeline"
import type { Product } from "@/types/crm"

export type DealProductListItem = {
  value: string
  label: string
  product: Product
  categoryLabel: string
}

export function isSelectableDealProduct(product: Product): boolean {
  return product.isActive && product.condition !== "archived"
}

export function toDealProductListItem(product: Product): DealProductListItem {
  const pipelineCategoryId = resolvePipelineCategoryId(product.categoryId)
  return {
    value: product.id,
    label: product.name,
    product,
    categoryLabel: DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId],
  }
}

export function buildDealProductListItems(
  products: readonly Product[],
): DealProductListItem[] {
  return products
    .filter(isSelectableDealProduct)
    .map(toDealProductListItem)
    .sort((a, b) => a.label.localeCompare(b.label, "pl"))
}
