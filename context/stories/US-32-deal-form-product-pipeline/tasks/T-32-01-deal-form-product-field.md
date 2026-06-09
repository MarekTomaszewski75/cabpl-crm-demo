# T-32-01 — Pole produktu w formularzu nowego deala

**Story:** [US-32](../story.md)  
**Status:** Done

## Cel

Wymusić wybór produktu bankowego przy tworzeniu deala.

## Zakres techniczny

### `components/crm/deal-form.tsx`

- Pole **Produkt** — Combobox / Command z listą `products` gdzie `isActive === true` (opcjonalnie wykluczyć `archived`).
- Grupowanie opcji po kategorii (nice-to-have) lub flat lista z `categoryName` w drugiej linii.
- Po `productId`:
  - ustawić `pipelineCategoryId` przez `resolvePipelineCategoryId(product.categoryId)`;
  - pokazać readonly **Kategoria** (`DEAL_PIPELINE_CATEGORY_LABELS`).
- Walidacja Zod / form: `productId` required.
- `name` — `useEffect` lub handler: prefill `"${product.name}"` lub z klientem.

### `DealFormDialog` / `addDeal`

- Przekazać `productId`, `pipelineCategoryId` do `addDeal`.
- Toast sukcesu bez zmian.

## Done when

- [x] Sheet „Nowy deal” nie zapisuje bez produktu.
- [x] Nowy deal w kanbanie / liście ma poprawne `productId` i lejek kategorii.
- [x] UI po polsku; błąd walidacji czytelny.

## Poza zakresem

- Sidebar karty (→ T-32-03).
