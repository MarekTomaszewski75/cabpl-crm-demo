# T-27-04 — Rozszerzenie seedu produktów

**Story:** [US-27](../story.md)  
**Status:** Done

## Cel

Uzupełnić katalog produktów bankowych korporacyjnych pod powiązanie z dealami.

## Zakres techniczny

### `data/products.json`

Dodać / zaktualizować produkty wg [spec §2.3](../../../products-deal-pipelines-spec.md#23-katalog-produktów-bankowych-propozycja-seed):

| `id` | Nazwa | `categoryId` |
| --- | --- | --- |
| `prod-014` | Linia kredytowa | `pcat-credit` |
| `prod-015` | Leasing floty pojazdów | `pcat-leasing-op` |
| `prod-016` | Faktoring kontraktowy | `pcat-factoring` |
| `prod-017` | Gwarancja realizacji kontraktu | `pcat-guarantees` |
| `prod-018` | Terminal płatniczy — sieć sklepów | `pcat-accounts` |

- Zachować istniejące `prod-001` … `prod-013` z sensownymi polami `sku`, `availability`, `condition`, `isActive`.
- Min. **15 aktywnych / widocznych** produktów w katalogu po filtrze „Aktywne produkty”.

### `data/product-categories.json`

- Weryfikacja drzewa §2.2 — bez nowych kategorii, chyba że brakuje spójności nazw (np. etykieta `pcat-leasing-op` → „Leasing” w panelu).

### `lib/crm/product-id.ts`

- Upewnić się, że `createNextProductId` obsługuje nowe id (kontynuacja numeracji).

## Done when

- [ ] `/products` po restarcie dev pokazuje nowe produkty.
- [ ] Każdy produkt ma `categoryId` wskazujący na kategorię liścia (lejek).
- [ ] Mix `isActive` / `condition` / `availability` nadaje się do filtrów faceted (US-31).

## Poza zakresem

- Zmiany UI `/products` (→ US-31).
- Powiązanie deal → produkt (→ US-28).
