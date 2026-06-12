# T-41-05 — Kanban deala: data zamknięcia i ikony

**Story:** [US-41](../story.md)  
**Status:** Done  
**Zależy od:** [T-41-01](./T-41-01-close-date-urgency-helper.md), [T-41-04](./T-41-04-deals-list-close-date-column.md)

## Cel

Na karcie kanbanu deala pokazać **planowaną datę zamknięcia** zamiast daty utworzenia oraz ikony pilności.

## Zakres

### `deal-kanban-card.tsx`

- Zamienić wyświetlanie `createdAt` na `expectedCloseDate`.
- Tooltip: „Planowana data zamknięcia”; fallback „Brak terminu” gdy pole puste.
- `DealCloseDateUrgencyIcon` na karcie (spójnie z listą).

## Done when

- [x] Karta kanbanu nie pokazuje daty utworzenia jako głównej daty.
- [x] Ikony pilności działają na kanbanie.

## Poza zakresem

- Usunięcie `createdAt` z innych widoków.
