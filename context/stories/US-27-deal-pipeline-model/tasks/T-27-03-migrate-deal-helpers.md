# T-27-03 — Migracja helperów deala (kanban, przejścia)

**Story:** [US-27](../story.md)  
**Status:** Done  
**Zależy od:** [T-27-01](./T-27-01-deal-types-and-pipeline-config.md), [T-27-02](./T-27-02-deal-pipeline-labels.md)

## Cel

Dostosować istniejące moduły deala do lejków per kategoria — bez zmiany komponentów React (to US-29).

## Zakres techniczny

### `lib/crm/deal-kanban.ts`

- Usunąć stałą `DEAL_KANBAN_STATUSES` (globalna lista US-18).
- Dodać:
  - `getDealKanbanStatuses(pipelineCategoryId): DealStatus[]` — wrapper na `getPipelineSteps`.
  - `getDealKanbanColumnLabels(pipelineCategoryId): Record<DealStatus, string>`.
  - `getDealKanbanTheme(pipelineCategoryId): Record<DealStatus, DealKanbanColumnTheme>` — motywy po indeksie kroku (0 = lead, środek = qualification/offer/negotiation, won/lost = finał).
- Zachować eksport typu `DealKanbanColumnTheme`.

### `lib/crm/deal-status-transition.ts`

- `isDealWorkflowStatusChange(from, to, pipelineCategoryId)` — oba statusy muszą należeć do tego samego lejka.
- `requiresDealFinishDialog(to)` — `to === 'won' | 'lost'`.
- Usunąć reguły oparte na starym uniwersalnym lejku US-18.

### `lib/crm/deal-labels.ts`

- `canFinishDeal(status, pipelineCategoryId)` — status w workflow steps danego lejka.
- `DEAL_WORKFLOW_STATUSES` — zastąpić funkcją `getPipelineWorkflowSteps(categoryId)`.

### Komponenty — minimalne poprawki kompilacji

- Jeśli `deals-kanban-board.tsx` / `deal-status-badge.tsx` nie kompilują po zmianie API — **tymczasowy** fallback na `pcat-credit` lub pierwszą kategorię, z komentarzem `// US-29`; nie implementować pełnego UI w tym tasku.

## Done when

- [ ] `getDealKanbanStatuses('pcat-credit')` zwraca 7 statusów w kolejności spec.
- [ ] Przejścia DnD między sąsiednimi krokami tego samego lejka są dozwolone; skok przez krok — dozwolony (demo); między lejkami — zablokowany.
- [ ] Projekt kompiluje się (`npm run dev`).

## Poza zakresem

- Select kategorii w kanban (→ US-29).
- Migracja seedu dealów (→ US-28).
