"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  buildDealProductListItems,
  type DealProductListItem,
} from "@/lib/crm/deal-product-select"
import type { Product } from "@/types/crm"

type DealProductComboboxProps = {
  id?: string
  products: readonly Product[]
  value: DealProductListItem | null
  onValueChange: (item: DealProductListItem | null) => void
  placeholder?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

export function DealProductCombobox({
  id,
  products,
  value,
  onValueChange,
  placeholder = "Wybierz produkt",
  disabled,
  "aria-invalid": ariaInvalid,
}: DealProductComboboxProps) {
  const items = buildDealProductListItems(products)

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(next) =>
        onValueChange((next as DealProductListItem | null) ?? null)
      }
      isItemEqualToValue={(a, b) => a.value === b.value}
      itemToStringLabel={(item) => item.label}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        showClear={!!value && !disabled}
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxList>
          {(item: DealProductListItem) => (
            <ComboboxItem key={item.value} value={item}>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate">{item.label}</span>
                <span className="truncate text-muted-foreground">
                  {item.categoryLabel}
                  {item.product.sku ? ` · ${item.product.sku}` : ""}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>Brak aktywnych produktów</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
