"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { useSession } from "@/lib/auth/demo-session"
import {
  PRODUCT_AVAILABILITY_OPTIONS,
  PRODUCT_CONDITION_OPTIONS,
  PRODUCT_CURRENCY_OPTIONS,
  PRODUCT_GOODS_OR_SERVICE_OPTIONS,
  PRODUCT_PRICE_KIND_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
} from "@/lib/crm/product-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import type {
  Product,
  ProductAvailability,
  ProductCondition,
  ProductCurrency,
  ProductGoodsOrService,
  ProductPriceKind,
  ProductType,
} from "@/types/crm"

type ProductFormErrors = {
  name?: string
  categoryId?: string
}

type ProductFormState = {
  name: string
  sku: string
  goodsOrService: ProductGoodsOrService
  categoryId: string
  price: string
  currency: ProductCurrency
  priceKind: ProductPriceKind
  availability: ProductAvailability
  productType: ProductType
  condition: ProductCondition
  isActive: boolean
  description: string
}

function emptyFormState(): ProductFormState {
  return {
    name: "",
    sku: "",
    goodsOrService: "service",
    categoryId: "",
    price: "",
    currency: "PLN",
    priceKind: "fixed",
    availability: "available",
    productType: "credit",
    condition: "active",
    isActive: true,
    description: "",
  }
}

function productToFormState(product: Product): ProductFormState {
  return {
    name: product.name,
    sku: product.sku,
    goodsOrService: product.goodsOrService,
    categoryId: product.categoryId,
    price: product.price != null ? String(product.price) : "",
    currency: product.currency,
    priceKind: product.priceKind,
    availability: product.availability,
    productType: product.productType,
    condition: product.condition,
    isActive: product.isActive,
    description: product.description,
  }
}

function validateForm(state: ProductFormState): ProductFormErrors {
  const errors: ProductFormErrors = {}
  if (!state.name.trim()) errors.name = "Nazwa jest wymagana"
  if (!state.categoryId) errors.categoryId = "Kategoria jest wymagana"
  return errors
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number.parseFloat(trimmed.replace(",", "."))
  return Number.isNaN(parsed) ? null : parsed
}

type ProductFormProps = {
  product?: Product
  onSuccess: (product: Product) => void
  layout?: "page" | "sheet"
}

export function ProductForm({
  product,
  onSuccess,
  layout = "sheet",
}: ProductFormProps) {
  const { user } = useSession()
  const { productCategories, addProduct, updateProduct } = useDemoData()
  const isEdit = Boolean(product)
  const [form, setForm] = React.useState<ProductFormState>(() =>
    product ? productToFormState(product) : emptyFormState(),
  )
  const [errors, setErrors] = React.useState<ProductFormErrors>({})

  const sortedCategories = React.useMemo(
    () =>
      [...productCategories].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
        return a.name.localeCompare(b.name, "pl")
      }),
    [productCategories],
  )

  function clearError(key: keyof ProductFormErrors) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.regionId) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const patch = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      goodsOrService: form.goodsOrService,
      categoryId: form.categoryId,
      price: parsePrice(form.price),
      currency: form.currency,
      priceKind: form.priceKind,
      availability: form.availability,
      productType: form.productType,
      condition: form.condition,
      isActive: form.isActive,
      description: form.description.trim(),
    }

    if (isEdit && product) {
      updateProduct(product.id, patch)
      const updated: Product = { ...product, ...patch }
      toast.success("Zaktualizowano produkt")
      onSuccess(updated)
      return
    }

    const created = addProduct({
      ...patch,
      ownerId: user.id,
      regionId: user.regionId,
    })

    toast.success("Dodano produkt")
    onSuccess(created)
  }

  const formBody = (
    <FieldGroup>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="product-name">Artykuł</FieldLabel>
        <Input
          id="product-name"
          value={form.name}
          onChange={(e) => {
            clearError("name")
            setForm((p) => ({ ...p, name: e.target.value }))
          }}
          aria-invalid={errors.name ? true : undefined}
          placeholder="np. Kredyt obrotowy"
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="product-sku">Kod produktu</FieldLabel>
        <Input
          id="product-sku"
          value={form.sku}
          onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
          placeholder="Opcjonalny kod SKU"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="product-goods-or-service">Towar/Usługa</FieldLabel>
        <Select
          value={form.goodsOrService}
          onValueChange={(value) =>
            setForm((p) => ({
              ...p,
              goodsOrService: value as ProductGoodsOrService,
            }))
          }
        >
          <SelectTrigger id="product-goods-or-service" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_GOODS_OR_SERVICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field data-invalid={errors.categoryId ? true : undefined}>
        <FieldLabel htmlFor="product-category">Kategoria</FieldLabel>
        <Select
          value={form.categoryId || undefined}
          onValueChange={(value) => {
            clearError("categoryId")
            setForm((p) => ({ ...p, categoryId: value }))
          }}
        >
          <SelectTrigger
            id="product-category"
            className="w-full"
            aria-invalid={errors.categoryId ? true : undefined}
          >
            <SelectValue placeholder="Wybierz kategorię" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortedCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.parentId ? `— ${category.name}` : category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.categoryId ? (
          <FieldError>{errors.categoryId}</FieldError>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="product-type">Typ produktu</FieldLabel>
        <Select
          value={form.productType}
          onValueChange={(value) =>
            setForm((p) => ({ ...p, productType: value as ProductType }))
          }
        >
          <SelectTrigger id="product-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-price">Cena</FieldLabel>
        <Input
          id="product-price"
          type="number"
          inputMode="decimal"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          placeholder="Opcjonalna wartość liczbowa"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="product-currency">Waluta</FieldLabel>
        <Select
          value={form.currency}
          onValueChange={(value) =>
            setForm((p) => ({ ...p, currency: value as ProductCurrency }))
          }
        >
          <SelectTrigger id="product-currency" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_CURRENCY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-price-kind">Rodzaj ceny</FieldLabel>
        <Select
          value={form.priceKind}
          onValueChange={(value) =>
            setForm((p) => ({ ...p, priceKind: value as ProductPriceKind }))
          }
        >
          <SelectTrigger id="product-price-kind" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_PRICE_KIND_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-availability">Dostępność</FieldLabel>
        <Select
          value={form.availability}
          onValueChange={(value) =>
            setForm((p) => ({
              ...p,
              availability: value as ProductAvailability,
            }))
          }
        >
          <SelectTrigger id="product-availability" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_AVAILABILITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-condition">Stan</FieldLabel>
        <Select
          value={form.condition}
          onValueChange={(value) =>
            setForm((p) => ({ ...p, condition: value as ProductCondition }))
          }
        >
          <SelectTrigger id="product-condition" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <div className="flex items-center gap-2">
          <Checkbox
            id="product-is-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm((p) => ({ ...p, isActive: checked === true }))
            }
          />
          <FieldLabel htmlFor="product-is-active" className="mb-0">
            Aktywny
          </FieldLabel>
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-description">Opis</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="product-description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Opcjonalny opis produktu"
            rows={3}
          />
        </InputGroup>
      </Field>
    </FieldGroup>
  )

  if (layout === "sheet") {
    return (
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {formBody}
        </div>
        <SheetFooter className="shrink-0 border-t border-border px-6 py-4">
          <Button type="submit">Zapisz</Button>
        </SheetFooter>
      </form>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {formBody}
      <Button type="submit">Zapisz</Button>
    </form>
  )
}
