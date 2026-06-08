# T-19-01 — Typy produktu, kategorie i seed

**Story:** [US-19](../story.md)  
**Status:** Done

## Cel

Zdefiniować model **Product** / **ProductCategory**, enumy, etykiety PL i pliki seed — bez zmiany UI (→ kolejne taski).

## Zakres techniczny

### `types/crm.ts`

- `ProductCategory` — `id`, `name`, `parentId`, `sortOrder`.
- `Product` — pola jak w story.
- Enumy: `ProductGoodsOrService`, `ProductAvailability`, `ProductPriceKind`, `ProductType`, `ProductCondition`, `ProductCurrency`.

### `lib/crm/product-labels.ts` (nowy)

- Etykiety PL dla wszystkich enumów.
- `formatProductPrice(product)` — np. „1 200 PLN”, „od 0,5%”, „Bez opłaty”.
- `PRODUCT_FILTER_DEFAULTS` — domyślny tag „Aktywne produkty” → `isActive: true`.

### `lib/crm/product-id.ts` (nowy)

- `createNextProductId()` — wzorzec `createNextLeadId`.

### Seed

- `data/product-categories.json` — 6–8 kategorii BK (hierarchia max 1 poziom).
- `data/products.json` — 10–15 rekordów demo; sensowne wartości filtrów i kategorii.

### `lib/data/seed.ts`

- Załadowanie `productCategories`, `products` do stanu początkowego providera (przygotowanie pod T-19-02).

## Done when

- [x] Typy i enumy zgodne ze story.
- [x] `product-labels.ts` z etykietami PL i helperem ceny.
- [x] Oba pliki JSON w `data/` z rekordami demo.
- [x] Seed importowany w `seed.ts` (bez mutacji Context — → T-19-02).

## Poza zakresem

- `DemoDataContext` CRUD (→ T-19-02).
- Komponenty UI.
