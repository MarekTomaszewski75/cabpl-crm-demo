# T-31-03 — Lista produktów: faceted Kategoria

**Story:** [US-31](../story.md)  
**Status:** Done  
**Zależy od:** [T-31-01](./T-31-01-default-tree-view.md)

## Cel

W widoku listy zastąpić dropdown kategorii filtrem faceted i opcjonalnie dodać kolumnę Kategoria.

## Zakres techniczny

### `components/crm/products-table.tsx` (tryb `list`)

- Usunąć `Select` „Wszystkie kategorie…” nad tabelą.
- Dodać `DataTableFacetedFilter` **Kategoria**:
  - opcje: kategorie liścia + korzenie z `productCategories`;
  - wartość: `categoryId`; etykieta: `name`.
- `categoryFilters: string[]` w stanie; logika w `filterProducts` lub wrapperze.
- Współdziałanie z pozostałymi faceted i wyszukiwaniem.

### `components/crm/products-columns.tsx` (P1)

- Kolumna **Kategoria** — tylko w trybie list (`showCategoryColumn` prop lub warunek w `createProductsColumns`).
- `buildProductTableRow` — `categoryName`.

## Done when

- [x] Lista bez dropdownu kategorii; faceted Kategoria działa (wielokrotny wybór).
- [x] „Wszystkie kategorie” = brak wybranych wartości w faceted.
- [x] Opcjonalnie: kolumna Kategoria widoczna w liście.

## Poza zakresem

- Drzewo (→ T-31-02).
