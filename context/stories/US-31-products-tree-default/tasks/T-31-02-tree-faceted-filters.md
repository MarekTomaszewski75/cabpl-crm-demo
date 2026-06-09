# T-31-02 — Filtry faceted w widoku drzewa

**Story:** [US-31](../story.md)  
**Status:** Done  
**Zależy od:** [T-31-01](./T-31-01-default-tree-view.md)

## Cel

Zastąpić dropdowny filtrów w trybie drzewa komponentami `DataTableFacetedFilter` — bez filtra kategorii.

## Zakres techniczny

### `components/crm/products-table.tsx` (tryb `tree`)

- Zachować filtry: Aktywność, Dostępność, Typ produktu, Stan, Cena — jako **`DataTableFacetedFilter`** (wzorzec `deals-table.tsx` / `leads-table.tsx`), jeśli jeszcze są zwykłymi `Select`.
- **Nie** pokazywać filtra Kategoria w toolbarze drzewa.
- Filtrowanie: `filterProducts()` + `selectedCategoryId` z panelu bocznego.

### Agregacja kategorii grupujących

- Gdy `selectedCategoryId === 'pcat-leasing'` (korzeń bez produktów): pokaż produkty gdzie `categoryId` ∈ dzieci (`pcat-leasing-op`, `pcat-factoring`).
- Helper: `getProductIdsForCategorySelection(categoryId, categories)` w `lib/crm/product-filters.ts` lub lokalnie.

### Kolumny ukryte pod faceted (jeśli potrzebne)

- Jak w innych modułach — `createFilterSearchColumn` + meta kolumn.

## Done when

- [x] Wybór „Leasing” w panelu pokazuje leasing + faktoring (jeśli grupa).
- [x] Faceted filtry w drzewie zawężają tabelę po prawej bez filtra kategorii w toolbarze.
- [x] Tag „Aktywne produkty” nadal działa łącznie z faceted.

## Poza zakresem

- Widok lista (→ T-31-03).
