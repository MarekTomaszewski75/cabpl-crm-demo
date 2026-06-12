# T-43-01 — Usunięcie CRUD produktów z UI

**Story:** [US-43](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć z modułu produktów możliwość tworzenia i edycji z listy.

## Zakres

### `products-table.tsx`

- Usunąć przycisk **Nowy produkt** i `ProductFormDialog`.
- Usunąć akcje edycji / usuwania w tabeli (jeśli istnieją).

### Nawigacja

- Klik wiersza → `/products/[id]` (podgląd) — bez zmian ścieżki.

## Done when

- [x] `/products` nie oferuje tworzenia ani edycji produktu.
- [x] `addProduct` / `updateProduct` nie wywoływane z UI.

## Poza zakresem

- Widok szczegółów (→ T-43-02).
