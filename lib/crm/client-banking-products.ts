import { filterByScope } from "@/lib/rbac/scope"
import type {
  ClientBankingProduct,
  DemoUser,
  Product,
  ProductCategory,
} from "@/types/crm"

export type ClientBankingProductsData = {
  clientBankingProducts: readonly ClientBankingProduct[]
  products: readonly Product[]
  productCategories: readonly ProductCategory[]
}

export type EnrichedClientBankingProduct = ClientBankingProduct & {
  product: Product
  categoryName: string
}

export function getClientBankingProducts(
  clientId: string,
  data: ClientBankingProductsData,
  user: DemoUser,
): EnrichedClientBankingProduct[] {
  const categoryById = new Map(
    data.productCategories.map((category) => [category.id, category.name]),
  )
  const productById = new Map(data.products.map((product) => [product.id, product]))

  return filterByScope(data.clientBankingProducts, user)
    .filter((item) => item.clientId === clientId)
    .flatMap((item) => {
      const product = productById.get(item.productId)
      if (!product) return []
      return [
        {
          ...item,
          product,
          categoryName: categoryById.get(product.categoryId) ?? "—",
        },
      ]
    })
    .sort(
      (a, b) =>
        new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime(),
    )
}

export function getEnrichedClientBankingProductById(
  productId: string,
  data: ClientBankingProductsData,
  user: DemoUser,
): EnrichedClientBankingProduct | null {
  const categoryById = new Map(
    data.productCategories.map((category) => [category.id, category.name]),
  )
  const productById = new Map(data.products.map((product) => [product.id, product]))

  const item = filterByScope(data.clientBankingProducts, user).find(
    (entry) => entry.id === productId,
  )
  if (!item) return null

  const product = productById.get(item.productId)
  if (!product) return null

  return {
    ...item,
    product,
    categoryName: categoryById.get(product.categoryId) ?? "—",
  }
}
