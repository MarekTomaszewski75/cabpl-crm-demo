# T-18-09 — Karta deala: prawa kolumna — composer i feed aktywności

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-05](./T-18-05-post-create-redirect-and-timeline.md), [T-18-06](./T-18-06-deal-detail-layout-shell.md)

## Cel

Prawa kolumna zakładki **Ogólne** — jak screen i karta leada: panel interakcji + feed z filtrami.

## Panel interakcji (góra)

- Zakładki wejścia: **Notatka** (aktywna), **Aktywność**, **Pliki**, **Dokumenty**, **Poczta** — ostatnie cztery stub/disabled + tooltip „Etap 1”.
- Textarea placeholder „Zostaw notatkę”.
- Przycisk **+ Nowe zadanie** — stub (link do `/tasks` lub disabled).

**Notatka:** submit → `addDealNote` + wpis w feedzie.

## Feed (dół)

- Filtry poziome: **Wszystkie** (badge z liczbą), **Aktywności**, **Notatki**, **Pliki**, **Zadania** (dropdown stub).
- Wpis timeline: data/czas, badge statusu (np. „Utworzono deal” — fiolet), autor (`displayName`).

Reuse wzorca z `lead-detail-activity-feed.tsx` / `company-detail-activity-feed.tsx` — wspólne komponenty filtrów jeśli możliwe.

## Done when

- [ ] Notatka zapisuje się i pojawia w feedzie.
- [ ] Wpis `deal_created` widoczny po utworzeniu (T-18-05).
- [ ] Filtry przełączają widoczne typy (minimum: Wszystkie / Notatki).
- [ ] Stub zakładek Pliki/Dokumenty/Poczta nie psuje layoutu.

## Poza zakresem

- Pełna zakładka **Historia** (→ stub w T-18-06).
- Integracja zadań / plików.
