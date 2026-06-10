# T-36-03 — Pasek filtrów per rola

**Story:** [US-36](../story.md)  
**Status:** Done  
**Zależy od:** T-36-02

## Cel

Różne zestawy filtrów globalnych dla `regional_manager` vs `executive`.

## Zakres

### `components/crm/analytics-filters-bar.tsx`

| Rola | Filtry |
| --- | --- |
| `regional_manager` | Widok panelu · Okres · **Doradca** (Wszyscy + doradcy z regionu menedżera) |
| `executive` | Widok panelu · Okres · **Region** (Wszyscie + Mazowsze/Małopolska/Pomorze z `kpi.byRegion`) · **Segment** (Wszyscy + MŚP/Enterprise z `kpi.bySegment`) |

- Presety z `getAnalyticsPresetsForRole(user.role)` — nie globalna lista US-20.
- Zmiana filtra region/segment/doradca → propagacja do `AnalyticsGlobalFilters`.
- Etykiety PL z `lib/analytics/analytics-labels.ts`.

### `lib/analytics/filters.ts` / `scope.ts`

- Filtr region/segment stosowany w agregacjach executive (join z `clients.segmentId` lub `deal.regionId`).

## Done when

- [x] Marek nie widzi selectów Region/Segment.
- [x] Jan widzi Region + Segment; brak filtra Doradca na domyślnym pasku.
- [x] Zmiana presetu przeładowuje `widgetOrder` jak dziś.
- [x] Filtry wpływają na metryki hero KPI (T-36-05).

## Poza zakresem

- Klik w tabelę → filtr (US-37/38).
