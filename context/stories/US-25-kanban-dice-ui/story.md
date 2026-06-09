# US-25 — Kanban Dice UI + domyślny widok pipeline

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-17 (leady), US-18 (deale)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §5](../../crm-specialists-feedback-spec.md#5-kanban--komponent-dice-ui), [§7](../../crm-specialists-feedback-spec.md#7-leady-i-deale--kanban-jako-widok-domyślny)

## Jako

doradca / menedżer (demo)

## Chcę

pracować z leadami i dealami w **kanbanie jako widoku domyślnym**, z przeciąganiem na sprawdzonym komponencie Dice UI

## Aby

prezentacja odzwierciedlała codzienną pracę ze lejkiem — lista jest widokiem uzupełniającym

## Zakres

### W zakresie

- Instalacja [Kanban — Dice UI](https://www.diceui.com/docs/components/radix/kanban): `npx shadcn@latest add @diceui/kanban` → `components/ui/kanban.tsx`.
- Migracja `LeadsKanbanBoard` na API Dice UI (`Kanban`, `KanbanBoard`, `KanbanColumn`, `KanbanItem`, `KanbanOverlay`).
- Migracja `DealsKanbanBoard` — analogicznie.
- Zachowanie biznesowe:
  - DnD zmienia `status` w `DemoDataContext` (`updateLead` / `updateDeal`);
  - walidacja: `lib/crm/lead-status-transition.ts` + reguły deala US-18;
  - toast przy niedozwolonym przejściu.
- Reuse kart: `LeadKanbanCard`, odpowiednik deala — treść w `KanbanItem`.
- Kolory kolumn: `LEAD_KANBAN_THEME`, `DEAL_KANBAN_THEME` — bez regresji wizualnej.
- **Domyślny widok:** `viewMode` domyślnie `"kanban"` w `leads-table.tsx` i `deals-table.tsx`.
- Toolbar: przycisk Kanban przed Listą; Kanban wizualnie „primary” (`secondary` gdy aktywny).
- Usunięcie legacy DnD (`@dnd-kit` w kanban boardach — po migracji); stare pliki mogą zostać cienkimi wrapperami lub zostać zastąpione.

### Poza zakresem

- Kanban zadań / innych modułów.
- Przeciąganie całych kolumn.
- Zapisywanie `viewMode` w `localStorage` (nice-to-have — osobny follow-up).

## Kryteria akceptacji (story)

- [x] `/leads` i `/pipeline` otwierają się na kanbanie.
- [x] Leady i deale używają `components/ui/kanban` (Dice UI).
- [x] DnD persystuje status; niedozwolone przejścia blokowane.
- [x] DnD klawiaturą (Esc anuluje).
- [x] Przełączenie na listę zachowuje filtry i zakładki statusów.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-25-01](./tasks/T-25-01-install-dice-kanban.md) | Done | — |
| [T-25-02](./tasks/T-25-02-migrate-leads-kanban.md) | Done | T-25-01 |
| [T-25-03](./tasks/T-25-03-migrate-deals-kanban.md) | Done | T-25-01 |
| [T-25-04](./tasks/T-25-04-default-kanban-view-mode.md) | Done | T-25-02, T-25-03 |

## Kolejność implementacji (agent)

1. T-25-01 → T-25-02 ∥ T-25-03 → T-25-04

## Wpływ na dokumentację

[`reuse-and-conventions.md`](../../reuse-and-conventions.md), [`requirements.md`](../../requirements.md) §6 (pokaz kanbanu jako pierwszy ekran modułu).
