# T-43-04 — Usunięcie selecta wiersza w tabeli produktów

**Story:** [US-43](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć nieużywaną kolumnę checkbox w tabeli produktów.

## Zakres

- `products-columns.tsx`: usunąć kolumnę `select`.
- `products-table.tsx`: usunąć `selectedIds` state i props do kolumn.

## Done when

- [x] Tabela produktów bez checkboxów wyboru wiersza.

## Poza zakresem

- Bulk actions (nie planowane).
