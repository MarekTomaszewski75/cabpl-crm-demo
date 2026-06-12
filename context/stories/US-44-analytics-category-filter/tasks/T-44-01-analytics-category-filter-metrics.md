# T-44-01 — Filtr kategorii w metrykach analityki

**Story:** [US-44](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Rozszerzyć model filtrów i agregacje o `pipelineCategoryId`.

## Zakres

### `types/analytics.ts`

- `AnalyticsGlobalFilters.pipelineCategoryId: string | null` (`null` = wszystkie).

### `lib/analytics/metrics.ts`

- `scopedDeals` (i powiązane): gdy `pipelineCategoryId` ustawione — filtruj `deal.pipelineCategoryId`.
- Leady: opcjonalnie przez powiązany deal lub `pipelineCategoryId` na leadzie jeśli istnieje — **preferencja:** filtruj metryki dealowe; leady bez zmian jeśli brak pola (udokumentować w tasku).

### `analytics-workspace.tsx`

- Domyślna wartość filtra: `null`.
- Propagacja do `AnalyticsPanelGrid` / hero KPI.

## Done when

- [x] Wszystkie widżety operujące na dealach respektują filtr kategorii.
- [x] Brak regresji przy `pipelineCategoryId: null`.

## Notatki implementacji

- Leady (`scopedLeads`) — bez filtra kategorii (brak `pipelineCategoryId` na encji Lead).
- `applyPipelineCategoryFilter` w `lib/analytics/scope.ts` — współdzielone przez `scopedDeals` i sparkline dealowych.

## Poza zakresem

- UI Select (→ T-44-02).
