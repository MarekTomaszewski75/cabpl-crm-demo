# T-34-03 — Karta deala: sekcja Zdarzenia (Timeline)

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-02](../US-33-lead-detail-rebuild/tasks/T-33-02-lead-events-timeline.md), [T-34-01](./T-34-01-deal-detail-layout-cleanup.md)

## Cel

Feed deala jako sekcja **Zdarzenia** na Dice UI Timeline — reuse komponentu z US-33.

## Zakres

- Mirror [`lead-activity-feed.tsx`](../../../components/crm/lead-activity-feed.tsx) + [`lib/crm/lead-activity.ts`](../../../lib/crm/lead-activity.ts) → `deal-activity-feed.tsx` / `lib/crm/deal-activity.ts`.
- `buildDealActivityFeed({ dealId, dealCreatedAt, dealActivities, dealDocuments, tasks, users })`:
  - wpisy z `deal-activities.json`;
  - synteza dokumentów (`dealDocuments`) i zadań (`opportunityId === deal.id`);
  - `authorId` na każdym itemie; clamp dat względem `deal.createdAt`.
- Timeline już w `@/components/ui/timeline` — **nie** reinstalować.
- Tytuł sekcji: **Zdarzenia**.
- Awatar: **`CrmUserHoverCard`** (nie plain `Avatar`) — patrz US-33.
- Filtry **Pliki** / **Zadania** działają na timeline; liczniki z `filterDealActivityFeed(allItems, …)`.

## Done when

- [ ] Sekcja **Zdarzenia** na Timeline (bez custom `border-l`).
- [ ] Filtry feedu (w tym Pliki, Zadania) działają na tej samej liście.
- [ ] Hover card na awatarze autora.
- [ ] Brak zdarzeń przed `deal.createdAt` (runtime clamp + seed — T-34-05/ osobny skrypt sync).

## Poza zakresem

- Treść dawnej zakładki Historia (była pusta).
