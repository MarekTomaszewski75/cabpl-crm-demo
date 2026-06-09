# T-25-03 — Migracja kanbanu deali na Dice UI

**Story:** [US-25](../story.md)  
**Status:** Done  
**Zależy od:** T-25-01

## Cel

Przebudować `DealsKanbanBoard` na API `@diceui/kanban` — analogicznie do leadów.

## Zakres techniczny

### `components/crm/deals-kanban-board.tsx`

- Kolumny: `DEAL_KANBAN_STATUSES` (aktywne — bez `won`/`lost` na boardzie otwartym, jak dziś).
- `onMove` → `updateDeal` / `updateOpportunity` po walidacji statusów US-18.
- Reuse kart deala (istniejący komponent karty kanban).
- `KanbanOverlay`, tematy `DEAL_KANBAN_THEME`.

### Reguły przejść

- Sprawdzić `lib/crm/deal-status-transition.ts` lub logikę w boardzie — nie psuć finalizacji won/lost (te na karcie deala, nie DnD na terminalne kolumny jeśli dziś ukryte).

## Done when

- [x] Kanban deali działa na `/pipeline`.
- [x] DnD persystuje status.
- [x] Toast przy błędzie przejścia.
- [x] Brak regresji wizualnej.

## Poza zakresem

- Domyślny view mode (→ T-25-04).
