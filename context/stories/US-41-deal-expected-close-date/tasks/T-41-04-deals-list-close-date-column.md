# T-41-04 — Lista dealów: kolumna i ikony pilności

**Story:** [US-41](../story.md)  
**Status:** Done  
**Zależy od:** [T-41-01](./T-41-01-close-date-urgency-helper.md)

## Cel

Wyświetlić planowaną datę zamknięcia na liście dealów wraz z ikonami pilności.

## Zakres

### `deals-columns.tsx`

- Kolumna **Planowana data zamknięcia** (`expectedCloseDate`, `formatDatePl`, „—” gdy brak).
- W komórce lub obok: `DealCloseDateUrgencyIcon` (reuse T-41-01).

### `deals-table.tsx`

- Brak regresji filtrów / sortowania (opcjonalne sort po terminie — P2).

## Done when

- [x] Lista pokazuje datę i ikony żółta/czerwona z tooltipami.
- [x] Deale `won`/`lost` bez ikon pilności.

## Poza zakresem

- Kanban (→ T-41-05).
