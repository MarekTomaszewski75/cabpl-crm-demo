# T-39-04 — Komponent Pie Chart (donut)

**Story:** [US-39](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Reużywalny **Pie Chart** w wariancie donut — udział segmentów w realizacji.

## Zakres

### Nowy plik

`components/crm/analytics/charts/analytics-pie-chart.tsx`

### Props

- `data`: `{ key, label, value, fill? }[]`
- `centerLabel?: string` — suma lub tytuł w środku donut.
- `valueFormatter?` — PLN lub %.

### Wzorzec

- [shadcn Pie Chart](https://ui.shadcn.com/charts/pie) — `PieChart`, `Pie`, `innerRadius` dla donut.
- Kolory z `ChartConfig` / `--chart-*`.

## Done when

- [x] Donut z etykietą centrum (np. suma YTD).
- [x] Tooltip z procentem udziału + wartością absolutną.
- [x] Legenda pod wykresem.

## Poza zakresem

- Widżet segmentów (US-38 T-38-04).
