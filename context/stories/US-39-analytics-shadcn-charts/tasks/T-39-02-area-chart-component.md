# T-39-02 — Komponent Area Chart

**Story:** [US-39](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Reużywalny **Area Chart** — serie stacked lub multi-line z gradient fill.

## Zakres

### Nowy plik

`components/crm/analytics/charts/analytics-area-chart.tsx`

### Warianty użycia (spec)

| Wariant | Serie | Konsument |
| --- | --- | --- |
| Plan vs realizacja vs forecast | 3 linie area | US-38 |
| Aktywność zespołu stacked | leads, dealsWon, tasksDone | US-37 |

### Props

- `data`: tablica `{ label: string; [seriesKey: string]: number | string }[]`
- `series`: `{ key, label, color?, stackId? }[]`
- `valueFormatter?`, `stacked?: boolean`

### Wzorzec

- [shadcn Area Chart](https://ui.shadcn.com/charts/area) — `AreaChart`, `Area`, gradient defs opcjonalnie.
- `ChartLegend` + `ChartTooltipContent`.

## Done when

- [x] Działa wariant multi-series (≥ 2 serie).
- [x] Działa wariant stacked (`stackId`).
- [x] Oś Y formatuje PLN gdy `valueFormatter` przekazany.

## Poza zakresem

- Agregacja danych (US-36 / US-37 / US-38).
