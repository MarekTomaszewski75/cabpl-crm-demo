# T-38-03 — Widżet: realizacja wg regionu (Bar grouped)

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01

## Cel

**Grouped Bar Chart** — plan vs realizacja dla 3 regionów.

## Zakres

### Pliki

- `components/crm/analytics/widgets/region-realization-bar-widget.tsx`
- `region-realization-bar`, `kind: "bar_chart"`, `size: "2x1"`, tag **Regiony**

### Dane

- `getRegionScorecardRows` lub bezpośrednio `kpi.byRegion` + `pickPeriodValues` z okresem filtra.
- Serie: **Plan**, **Realizacja**.

### UI

- Bar pionowy grouped; 3 grupy (Mazowsze, Małopolska, Pomorze).
- Kolory `--chart-5` (plan) vs `--chart-2` (realizacja).

## Done when

- [ ] 3 regiony z `kpi.json` na wykresie.
- [ ] Tooltip PLN dla obu serii.
- [ ] Okres kwartał/YTD zmienia wartości.
