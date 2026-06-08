# T-02-03 — DemoDataProvider & useDemoData

**Story:** [US-02](../story.md)  
**Status:** Done  
**Zależy od:** T-02-02

## Cel

Jeden Context z kolekcjami i mutacjami CRUD w pamięci.

## Zakres

- `lib/data/demo-data-context.tsx` — `"use client"`
- Init state z importów JSON
- API min.: getters kolekcji + `updateOpportunity(id, patch)`, `addTask`, `addMeeting`, `updateLead`, … (rozszerzaj w US-06+)
- Opakuj w `app/layout.tsx` lub `(dashboard)/layout.tsx` (decyzja: dashboard only — zapisz w reuse)

## Done when

- [ ] DevTools / prosty test: zmiana opportunity stage utrzymuje się do odświeżenia strony
- [ ] Wpis w [`reuse-and-conventions.md`](../../../reuse-and-conventions.md) dla `useDemoData`
