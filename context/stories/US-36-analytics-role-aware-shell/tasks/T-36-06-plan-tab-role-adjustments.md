# T-36-06 — Plan i cele: dostosowanie per rola

**Story:** [US-36](../story.md)  
**Status:** Done  
**Zależy od:** T-36-04

## Cel

Zakładka **Plan i cele** spójna z perspektywą roli — menedżer widzi tylko swój region; zarząd — tabelę segmentów.

## Zakres

### `components/crm/executive-dashboard.tsx`

- Prop `lockedRegionId?: string` — gdy ustawiony: ukryć select Region; wymusić filtr regionu.
- Dla `regional_manager`: przekazać `user.regionId` z sesji.

### `components/crm/analytics-workspace.tsx`

- Przekazanie `lockedRegionId` do `ExecutiveDashboard` gdy rola menedżera.

### Tabela segmentów (zarząd only)

- Pod wykresem Composed: prosta tabela `kpi.bySegment` — Plan · Realizacja · % · Forecast.
- Komponent: `components/crm/analytics/plan-segment-table.tsx` lub sekcja w `ExecutiveDashboard`.

## Done when

- [x] Marek w Plan i cele — KPI i wykres tylko Mazowsze; brak selecta regionu.
- [x] Jan — pełny widok bank-wide + tabela 2 segmentów.
- [x] Brak regresji filtrów segment/YTD dla zarządu.

## Poza zakresem

- Nowe wykresy forecast (US-38).
