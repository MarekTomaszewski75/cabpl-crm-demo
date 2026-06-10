# T-38-06 — Widżet: macierz regionów (Radar) + scorecard (tabela)

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01, US-39 T-39-05

## Cel

Para widżetów: **Radar** porównujący regiony + **tabela scorecard** z drill-down.

## Zakres

### Radar

- `components/crm/analytics/widgets/region-radar-widget.tsx`
- `region-radar`, `kind: "radar_chart"`, `size: "2x2"`, tag **Regiony**
- `getRegionRadarRows` — osie: Realizacja planu · Pipeline · Konwersja · Aktywność · Nowi klienci.

### Scorecard

- `components/crm/analytics/widgets/region-scorecard-table-widget.tsx`
- `region-scorecard-table`, `kind: "table"`, `size: "2x2"`, tag **Regiony**
- Kolumny spec §3.6: Region · Plan · Realizacja · % · Forecast · Luka · Otwarte deale · Trend.

### Interakcja

- Klik wiersza scorecard → `onRegionFilter(regionId)`.

## Done when

- [ ] Radar — 3 regiony na wykresie.
- [ ] Tabela — 3 wiersze z danymi KPI + operacyjnymi licznikami deali.
- [ ] Klik Mazowsze ustawia filtr Region w pasku filtrów.
