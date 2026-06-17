import { filterByScope } from "@/lib/rbac/scope"
import type {
  BankAccount,
  ClientBankingProduct,
  DemoUser,
  Product,
  ProductCategory,
  ProductType,
} from "@/types/crm"

export type ClientBankingProductsData = {
  clientBankingProducts: readonly ClientBankingProduct[]
  products: readonly Product[]
  productCategories: readonly ProductCategory[]
  bankAccounts: readonly BankAccount[]
}

export type EnrichedClientBankingProduct = ClientBankingProduct & {
  product: Product
  categoryName: string
  bankAccount: BankAccount | null
  isAccountProduct: boolean
}

const ACCOUNT_PRODUCT_TYPES: ProductType[] = ["payment", "deposit"]

export function isAccountCatalogProduct(product: Product): boolean {
  return ACCOUNT_PRODUCT_TYPES.includes(product.productType)
}

function enrichItem(
  item: ClientBankingProduct,
  productById: Map<string, Product>,
  categoryById: Map<string, string>,
  accountById: Map<string, BankAccount>,
): EnrichedClientBankingProduct | null {
  const product = productById.get(item.productId)
  if (!product) return null
  const bankAccount = item.bankAccountId
    ? accountById.get(item.bankAccountId) ?? null
    : null
  return {
    ...item,
    product,
    categoryName: categoryById.get(product.categoryId) ?? "—",
    bankAccount,
    isAccountProduct: isAccountCatalogProduct(product),
  }
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
  const accountById = new Map(
    data.bankAccounts.map((account) => [account.id, account]),
  )

  return filterByScope(data.clientBankingProducts, user)
    .filter((item) => item.clientId === clientId)
    .flatMap((item) => {
      const enriched = enrichItem(item, productById, categoryById, accountById)
      return enriched ? [enriched] : []
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
  const accountById = new Map(
    data.bankAccounts.map((account) => [account.id, account]),
  )

  const item = filterByScope(data.clientBankingProducts, user).find(
    (entry) => entry.id === productId,
  )
  if (!item) return null
  return enrichItem(item, productById, categoryById, accountById)
}
