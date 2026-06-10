# T-35-03 — Karta firmy: sekcja Zdarzenia (Timeline)

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-01](./T-35-01-company-detail-layout-cleanup.md)

## Cel

Feed firmy jako sekcja **Zdarzenia** na Dice UI Timeline — reuse z US-33.

## Zakres

- Refaktor `company-activity-feed.tsx` lub użycie wspólnego `crm-events-timeline.tsx` (z US-33).
- Mapowanie `CompanyActivityItem` → Timeline API.
- Tytuł karty: **Zdarzenia** (nie „Aktywność”).
- Treść `body` jako `TimelineDescription` — bez dodatkowej ramki `bg-muted/30` z obecnego feedu.
- Filtry z `company-activity-panel` bez zmian.
- Nie duplikować instalacji `@diceui/timeline` jeśli już w projekcie.

## Done when

- [ ] Sekcja **Zdarzenia** na Timeline.
- [ ] Filtry Wszystkie / Aktywności / Notatki / … działają.
- [ ] Zakładka composera **Aktywność** — nazwa bez zmian.
- [ ] Pusty stan po polsku.

## Poza zakresem

- Wpisy spotkań w timeline (→ T-35-06).
