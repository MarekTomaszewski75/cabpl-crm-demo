# T-19-02 — DemoDataContext: produkty i kategorie

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-01](./T-19-01-product-types-and-seed.md)

## Cel

Udostępnić katalog produktów i kategorie w `useDemoData()` z mutacją **dodania** produktu (minimum pod prezentację).

## Zakres techniczny

### `lib/data/demo-data-context.tsx`

- Stan: `products`, `productCategories` (readonly w hooku + settery wewnętrzne).
- **`addProduct(input)`** — generuje `id`, ustawia `createdAt`, `ownerId` / `regionId` z argumentu lub domyślnych; append do tablicy.
- **`updateProduct(id, patch)`** — opcjonalnie w tym tasku (P2: jeśli brak czasu — tylko `addProduct`).
- Typ wejścia: `AddProductInput` (bez `id`, `createdAt`).

### Eksport w `useDemoData`

- `products`, `productCategories`, `addProduct` (+ `updateProduct` jeśli zrobione).

## Done when

- [x] Po `npm run dev` hook zwraca seed kategorii i produktów.
- [x] `addProduct` dodaje rekord w pamięci; ID unikalne.
- [x] Brak Route Handlers.

## Poza zakresem

- CRUD kategorii z UI (kategorie tylko z seedu w Etap 1).
- `filterByScope` na produktach.
