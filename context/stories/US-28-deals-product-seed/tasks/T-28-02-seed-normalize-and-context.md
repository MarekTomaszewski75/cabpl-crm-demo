# T-28-02 — seed.ts i walidacja w DemoDataContext

**Story:** [US-28](../story.md)  
**Status:** Done  
**Zależy od:** [T-28-01](./T-28-01-migrate-opportunities-json.md)

## Cel

Załadować zmigrowane deale i egzekwować spójność produkt ↔ lejek przy mutacjach.

## Zakres techniczny

### `lib/data/seed.ts`

- Uprościć `normalizeDeals` — oczekiwany format US-18+ z `productId`, `pipelineCategoryId`, `status` (nowe kody).
- Legacy `mapLegacyStage` — usunąć lub zostawić jako dev-only fallback z `console.warn`.
- Opcjonalny assert dev: każdy deal ma poprawny `status` w lejku.

### `lib/data/demo-data-context.tsx`

- `addDeal` / `addOpportunity`:
  - wymaga `productId`;
  - ustawia `pipelineCategoryId` z produktu (`products.find` → `categoryId` → `resolvePipelineCategoryId`);
  - domyślny `status: 'new'`.
- `updateDeal`:
  - przy zmianie `status` — walidacja `isDealWorkflowStatusChange` / przynależności do lejka;
  - przy zmianie `productId` — tylko gdy `status === 'new'` (spec §4.1).

### Helper (opcjonalnie)

- `lib/crm/deal-product.ts` — `getDealProduct(deal, products)`, `getDealCategoryLabel(deal, categories)`.

## Done when

- [x] `useDemoData().deals` zwraca rekordy z `productId` i `pipelineCategoryId`.
- [x] `addDeal` bez `productId` — odrzucone (walidacja formularza w US-32; tutaj typ + guard w context).
- [x] `npm run dev` — brak błędów przy ładowaniu seedu.

## Poza zakresem

- UI formularza (→ US-32).
