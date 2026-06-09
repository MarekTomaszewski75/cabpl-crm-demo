# T-25-02 — Migracja kanbanu leadów na Dice UI

**Story:** [US-25](../story.md)  
**Status:** Done  
**Zależy od:** T-25-01

## Cel

Przebudować `LeadsKanbanBoard` na API `@diceui/kanban` z zachowaniem logiki biznesowej US-17.

## Zakres techniczny

### `components/crm/leads-kanban-board.tsx`

- Stan kolumn: `Record<LeadStatus, string[]>` lub mapowanie status → ids leadów.
- `getItemValue={(lead) => lead.id}` przy obiektach — lub ids jako stringi.
- `onValueChange` / `onMove` → `updateLead` w Context po walidacji `canTransitionLeadStatus` (`lib/crm/lead-status-transition.ts`).
- Kolumny: statusy z `LEAD_KANBAN_STATUSES` (bez `won`/`lost` na boardzie aktywnym — jak dziś).
- `LeadKanbanColumn` → uproszczenie do nagłówka + `KanbanColumn`; `LeadKanbanCard` wewnątrz `KanbanItem`.
- `KanbanOverlay` — podgląd karty przy drag.

### Usunięcie legacy

- Usunąć bezpośrednie użycie `@dnd-kit` z tego pliku (jeśli Dice UI opakowuje DnD wewnętrznie).
- Zachować props `leads`, `onAddLead` jak dziś.

### Toast

- Niedozwolone przejście: `toast.error` PL.

## Done when

- [x] Kanban leadów działa na `/leads` (widok kanban).
- [x] Przeciągnięcie zmienia status w sesji.
- [x] Walidacja przejść działa.
- [x] Wygląd kolumn zgodny z `LEAD_KANBAN_THEME`.

## Poza zakresem

- Domyślny view mode (→ T-25-04).
- Deale (→ T-25-03).
