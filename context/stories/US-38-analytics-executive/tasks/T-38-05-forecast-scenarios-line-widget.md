# T-38-05 — Widżet: scenariusze forecastu (Line)

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01, US-39 T-39-03

## Cel

**Line Chart** — miesięczne scenariusze forecastu (bazowy, optymistyczny, pesymistyczny).

## Zakres

### Pliki

- `components/crm/analytics/widgets/forecast-scenarios-line-widget.tsx`
- `forecast-scenarios-line`, `kind: "line_chart"`, `size: "2x1"`, tag **Plan**

### Dane

- `kpi.monthlyTrend`: `forecastPln`, `forecastOptimisticPln`, `forecastPessimisticPln`.
- Skalowanie przy filtrze region/segment.

### UI

- 3 linie; legenda PL; oś Y PLN skrócona.

## Done when

- [ ] 3 serie widoczne na wykresie miesięcznym.
- [ ] Spójne kolory z `executive-dashboard` (`--chart-1/3/4`).
- [ ] Empty guard gdy brak danych.
