# T-06-01 — Pipeline board UI

**Story:** [US-06](../story.md)  
**Status:** Done

## Cel

`app/(dashboard)/pipeline/page.tsx` + `components/crm/pipeline-board.tsx`.

## Zakres

- Kolumny per `OpportunityStage`
- Karty `Card` z danymi szansy
- `useSession` + `filterByScope` na opportunities
- `lib/format/pl.ts` dla PLN i dat

## Done when

- [x] Lejek renderuje scoped dane bez DnD (następny task)
