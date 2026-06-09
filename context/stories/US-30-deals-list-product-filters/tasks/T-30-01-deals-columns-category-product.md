# T-30-01 — Kolumny Kategoria i Produkt w tabeli dealów

**Story:** [US-30](../story.md)  
**Status:** Done

## Cel

Wyświetlić powiązanie deala z linią produktową w widoku listy.

## Zakres techniczny

### `components/crm/deals-columns.tsx`

- Rozszerzyć `DealTableRow`:
  - `categoryName: string`
  - `productName: string`
- Kolumny (po kolumnie „Deal” lub przed „Status”):
  - **Kategoria** — `categoryName`, `enableGrouping: true`, sortowanie `localeCompare` PL.
  - **Produkt** — `productName`, `enableGrouping: true`, `max-w-48 truncate`.

### `buildDealTableRow` (w tym samym pliku lub `deals-table.tsx`)

- Lookup: `productCategories`, `products` z kontekstu.
- `categoryName` ← `DEAL_PIPELINE_CATEGORY_LABELS[deal.pipelineCategoryId]` lub `ProductCategory.name`.
- `productName` ← `Product.name` lub „—”.

### `createDealGroupingOptions`

- Dodać `{ columnId: 'categoryName', label: 'Kategoria' }`, `{ columnId: 'productName', label: 'Produkt' }`.

## Done when

- [x] Tabela listy dealów ma kolumny Kategoria i Produkt z poprawnymi danymi seedu.
- [x] Grupowanie po kategorii / produkcie działa w `DataTable`.
- [x] `_filter` string uwzględnia nazwy kategorii i produktu (wyszukiwanie globalne w tabeli).

## Poza zakresem

- Faceted filters (→ T-30-02).
