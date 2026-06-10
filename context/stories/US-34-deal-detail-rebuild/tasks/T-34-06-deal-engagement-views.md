# T-34-06 — Karta deala: klikalne wskaźniki zadań / spotkań / dokumentów

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-06](../US-33-lead-detail-rebuild/tasks/T-33-06-lead-engagement-views.md), [T-34-05](./T-34-05-deal-documents-and-task-button.md)

## Cel

Ikony engagement na karcie deala prowadzą do treści — parity z US-33.

## Zakres

- Wzorzec: [`lead-detail-view.tsx`](../../../components/crm/lead-detail-view.tsx) + [`lead-detail-sidebar.tsx`](../../../components/crm/lead-detail-sidebar.tsx) + `lead-activity-panel`.
- `DealComposerTab` includes `"tasks"`; stan `composerTab` / `engagementSection` w `deal-detail-view`.
- **Dokumenty** → `onComposerTabChange("documents")`.
- **Zadania** → `onComposerTabChange("tasks")` (zakładka composera — ustalenie po US-33).
- **Spotkania** → `engagementSection: "meetings"` + lista pod composerem (`lead-meetings-list.tsx` / `deal-meetings-list.tsx`, filtr `opportunityId`).
- Filtr historii **Zadania** → przełącza zakładkę Zadania w composerze.
- RBAC: `getScopedDealEngagementCounts` (mirror lead) + `filterByScope`.

## Done when

- [ ] Wszystkie trzy ikony klikalne z akcjami jak wyżej.
- [ ] Zadania widoczne w zakładce composera, nie w osobnej sekcji pod feedem.
- [ ] Listy spotkań zgodne z licznikami w scope użytkownika.

## Poza zakresem

- CRUD zadań/spotkań na karcie deala.
