# T-33-02 — Karta leada: sekcja Zdarzenia (Dice UI Timeline)

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-01](./T-33-01-lead-detail-layout-cleanup.md)

## Cel

Zastąpić custom timeline w feedzie komponentem [Dice UI Timeline](https://www.diceui.com/docs/components/radix/timeline). Sekcja **Zdarzenia** — odróżnienie od zakładki composera **Aktywność**.

## Zakres

- `npx shadcn@latest add @diceui/timeline` (rejestr `@diceui` w `components.json`).
- Refaktor `lead-activity-feed.tsx` lub wydzielenie `crm-events-timeline.tsx` (wspólny dla lead/deal w US-34).
- Mapowanie `LeadActivityItem` → `Timeline` / `TimelineItem` / `TimelineTitle` / `TimelineTime` / `TimelineDescription` (+ autor opcjonalnie).
- Tytuł karty: **Zdarzenia** (nie „Aktywność”).
- Orientacja vertical; sortowanie najnowsze na górze.
- **Bez** dodatkowego custom CSS (`border-l` timeline).
- Pusty stan PL; filtry z `lead-activity-panel` bez zmian.

## Done when

- [ ] `@/components/ui/timeline` zainstalowany.
- [ ] Sekcja **Zdarzenia** używa Timeline API.
- [ ] Filtry Wszystkie / Aktywności / Notatki… działają.
- [ ] Zakładka composera nadal **Aktywność**.

## Poza zakresem

- Wpisy zadań w timeline (→ T-33-06).
- Horizontal / alternate variant.
