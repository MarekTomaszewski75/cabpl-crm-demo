# T-33-04 — Karta leada: przycisk + Nowe zadanie przy filtrach

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-01](./T-33-01-lead-detail-layout-cleanup.md)

## Cel

Przenieść **+ Nowe zadanie** z nagłówka composera do rzędu filtrów historii, wyrównany do prawej.

## Zakres

### `lead-activity-panel.tsx`

- Usunąć przycisk z `div` obok `TabsList` composera.
- Dodać przycisk w rzędzie filtrów (`FEED_FILTERS`):

```
flex flex-wrap items-center justify-between gap-2
  [filtry po lewej]
  [+ Nowe zadanie po prawej — shrink-0]
```

- Zachować `Link href="/tasks"`, `variant="outline"`, `size="sm"`, `PlusIcon`.

## Done when

- [ ] Przycisk nie w rzędzie zakładek Notatka / Aktywność / …
- [ ] Przycisk w jednym rzędzie z filtrami, wyrównany do prawej.
- [ ] `flex-wrap` na wąskim ekranie — przycisk po prawej w swoim rzędzie.

## Poza zakresem

- Sheet tworzenia zadania z `leadId` (US-09).
- Zmiana na karcie deala (→ T-34-05).
