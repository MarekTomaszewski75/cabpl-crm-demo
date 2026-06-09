# T-25-04 — Kanban jako domyślny widok leadów i deali

**Story:** [US-25](../story.md)  
**Status:** Done  
**Zależy od:** T-25-02, T-25-03

## Cel

Ustawić kanban jako widok startowy modułów Leady i Deale.

## Zakres techniczny

### `components/crm/leads-table.tsx`

- `useState<LeadsViewMode>("kanban")` zamiast `"table"`.
- Toolbar: przycisk Kanban **przed** Listą; `aria-pressed` / `variant="secondary"` dla aktywnego kanbanu.

### `components/crm/deals-table.tsx`

- To samo dla `DealsViewMode`.

### Weryfikacja

- Filtry statusów i zakładki działają w obu widokach po przełączeniu.
- Wejście na `/leads` i `/pipeline` bez klikania toggle.

## Done when

- [x] Domyślny widok to kanban na obu trasach.
- [x] Przełączenie na listę działa.
- [x] Filtry bez regresji.

## Poza zakresem

- `localStorage` persistence preferencji użytkownika.
