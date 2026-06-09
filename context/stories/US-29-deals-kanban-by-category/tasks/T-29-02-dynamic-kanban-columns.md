# T-29-02 — Dynamiczne kolumny kanban per kategoria

**Story:** [US-29](../story.md)  
**Status:** Done  
**Zależy od:** [T-29-01](./T-29-01-category-select-kanban-header.md)

## Cel

Wyrenderować kolumny kanban z konfiguracji lejka wybranej kategorii.

## Zakres techniczny

### `components/crm/deals-kanban-board.tsx`

- Props: `pipelineCategoryId: string`.
- `buildDealColumns(deals, pipelineCategoryId)` — klucze z `getDealKanbanStatuses(pipelineCategoryId)`.
- Mapowanie kolumn: etykiety z `getDealKanbanColumnLabels(pipelineCategoryId)`; motywy z `getDealKanbanTheme(pipelineCategoryId)`.
- DnD:
  - `findDealColumn` — iteracja po statusach danego lejka;
  - `updateDeal` + `addDealActivity` przy zmianie statusu;
  - `requiresDealFinishDialog` przy `won`/`lost`.
- Pusty stan per kategoria (komponent `Empty`).

### Usunąć

- Import / użycie globalnego `DEAL_KANBAN_STATUSES` US-18.

### `components/crm/deal-status-badge.tsx` (jeśli używany na karcie kanban)

- Przyjąć opcjonalny `pipelineCategoryId` dla poprawnej etykiety (przygotowanie pod US-30).

## Done when

- [x] Kanban dla `pcat-credit` ma kolumny: Nowy → … → Komitet kredytowy → Wygrany → Utracony.
- [x] Kanban dla `pcat-factoring` ma inne etykiety środkowych kroków.
- [x] DnD między kolumnami tego samego lejka działa; toast przy błędzie.
- [x] Liczniki kart w nagłówkach kolumn poprawne.

## Poza zakresem

- Linia produktu na karcie (→ T-29-03).
