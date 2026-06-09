# T-31-01 — Domyślny widok drzewa na /products

**Story:** [US-31](../story.md)  
**Status:** Done

## Cel

Ustawić drzewo kategorii jako pierwszy widok modułu Produktów.

## Zakres techniczny

### `components/crm/products-table.tsx`

- `useState<ProductsViewMode>("tree")` — zmiana z `"list"`.
- Toolbar: ikona `FolderTree` z `variant="secondary"` gdy `viewMode === "tree"` (spójnie z kanban w `deals-table.tsx`).

### Smoke

- Wejście na `/products` — widoczny panel „Kategorie” po lewej.

## Done when

- [x] Domyślny widok to drzewo po odświeżeniu strony.
- [x] Przełączenie na listę i z powrotem działa.

## Poza zakresem

- Zmiana filtrów (→ T-31-02, T-31-03).
