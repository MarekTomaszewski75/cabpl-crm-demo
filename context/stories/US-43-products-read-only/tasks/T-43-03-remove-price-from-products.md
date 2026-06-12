# T-43-03 — Usunięcie ceny z widoków produktów

**Story:** [US-43](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Ukryć informacje o cenie produktu w UI (niedocjowanie w BK).

## Zakres

- `products-columns.tsx`: usunąć kolumnę **Cena**.
- `products-table.tsx`: usunąć filtr faceted **Rodzaj ceny** (`priceKindFilters`).
- `product-filters.ts`: nie filtrować po `priceKind` w UI (logika może zostać).
- Podgląd produktu: bez pól ceny (T-43-02).

## Done when

- [x] Żaden widok listy / podglądu nie pokazuje ceny ani filtra ceny.

## Poza zakresem

- Usuwanie `price` z `types/crm.ts` i seedu.
