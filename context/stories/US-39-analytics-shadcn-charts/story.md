# US-39 — Analityka: biblioteka wykresów shadcn

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-20, US-07  
**Źródło:** [`analytics-roles-rebuild-spec.md`](../../analytics-roles-rebuild-spec.md) §4

## Jako

developer modułu analityki

## Chcę

mieć reużywalne komponenty wykresów oparte na [shadcn Charts](https://ui.shadcn.com/charts/) i `ChartContainer`

## Aby

widżety US-36–US-38 korzystały z jednej palety wizualnej (Area, Bar, Line, Pie, Radar, Radial) z tokenami `--chart-*` CA

## Zakres

### W zakresie

- Folder `components/crm/analytics/charts/` — osobne pliki per typ wykresu (decyzja spec §11).
- Wspólne konwencje: `ChartConfig`, `ChartTooltipContent`, formatowanie PLN (`formatCurrencyPln`, `formatAxisPln`).
- Typy propsów: dane wejściowe jako tablice wierszy (bez logiki agregacji — ta w `lib/analytics/`).
- **Radial**, **Area**, **Line**, **Pie** (donut), **Radar** — gotowe do użycia w widżetach.

### Poza zakresem

- Konkretne widżety analityczne (US-37, US-38).
- Nowe typy wykresów poza listą powyżej (Composed — reuse z `executive-dashboard.tsx`).
- Instalacja nowych pakietów poza recharts (już w projekcie).

## Kryteria akceptacji (story)

- [x] ≥ 5 komponentów chart w `components/crm/analytics/charts/`.
- [x] Każdy używa `ChartContainer` + tokenów `--chart-1`…`--chart-5`.
- [x] Empty state — prop lub slot na `AnalyticsWidgetEmpty`.
- [x] Storybook nie wymagany — wystarczy użycie w ≥ 1 widżecie testowym lub docelowym.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-39-01](./tasks/T-39-01-radial-chart-component.md) | Done | — |
| [T-39-02](./tasks/T-39-02-area-chart-component.md) | Done | — |
| [T-39-03](./tasks/T-39-03-line-chart-component.md) | Done | — |
| [T-39-04](./tasks/T-39-04-pie-chart-component.md) | Done | — |
| [T-39-05](./tasks/T-39-05-radar-chart-component.md) | Done | — |

## Kolejność implementacji (agent)

1. T-39-01 (Radial — hero KPI w US-36)  
2. T-39-02, T-39-03, T-39-04, T-39-05 — równolegle po T-39-01
