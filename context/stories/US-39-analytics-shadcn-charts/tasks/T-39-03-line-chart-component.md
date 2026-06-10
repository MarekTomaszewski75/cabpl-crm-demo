# T-39-03 — Komponent Line Chart

**Story:** [US-39](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Reużywalny **Line Chart** — trendy i scenariusze (konwersja, forecast).

## Zakres

### Nowy plik

`components/crm/analytics/charts/analytics-line-chart.tsx`

### Props

- `data`, `series[]` — analogicznie do Area.
- `yAxisPercent?: boolean` — dla konwersji lead → deal.
- `showLegend?: boolean`

### Wzorzec

- [shadcn Line Chart](https://ui.shadcn.com/charts/line) — `LineChart`, `Line`, `type="monotone"`.

## Done when

- [x] ≥ 2 serie na jednym wykresie (np. bazowy + optymistyczny forecast).
- [x] Tooltip z etykietami PL z `ChartConfig`.
- [x] Empty state gdy `data.length === 0`.

## Poza zakresem

- Widżety konwersji / forecast (US-37, US-38).
