# T-17-09 — Karta leada: prawa kolumna — composer + feed

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-05](./T-17-05-post-create-redirect-and-timeline.md), [T-17-06](./T-17-06-lead-detail-layout-shell.md)

## Cel

Prawa kolumna jak screen / US-16: zakładki interakcji + timeline z filtrami.

## Zakładki górne (composer)

| Zakładka | Stan demo |
| --- | --- |
| Notatka | **aktywna** — textarea „Zostaw notatkę” + zapis do feedu |
| Aktywność | stub / disabled + „Etap 1” |
| Pliki | stub |
| Dokumenty | stub |
| Poczta | stub |

- Przycisk **+ Nowe zadanie** — stub (link `/tasks` lub toast).
- Zapis notatki → `addLeadActivity` typ `lead_note` + aktualizacja `lastActivityAt` (pole opcjonalne na `Lead` — jeśli brak, użyć `createdAt`).

## Filtry feedu

`Tabs` lub `ToggleGroup`: **Wszystkie** (z licznikiem), **Aktywności**, **Notatki**, **Pliki**, **Zadania** — filtrowanie po `kind` wpisu (demo: Wszystkie + Notatki wystarczą na Done).

## Wpisy systemowe

- `lead_created` (T-17-05)
- `lead_status_changed`
- `lead_won` / `lead_lost` (po T-17-10)

## Komponenty

- Reuse wzorzec `company-activity-form.tsx` / `company-activity-feed.tsx` — `lead-activity-form.tsx`, `lead-activity-feed.tsx`.

## Done when

- [ ] Composer notatki zapisuje wpis widoczny w feedzie.
- [ ] Wpis „Utworzono lead” widoczny dla nowego rekordu.
- [ ] Filtry demo działają minimum dla Wszystkie / Notatki.
- [ ] Stuby zakładek bez custom div-callout — `Alert` lub disabled `TabsTrigger`.

## Poza zakresem

- Pełna integracja zadań/plików.
- E-mail.
