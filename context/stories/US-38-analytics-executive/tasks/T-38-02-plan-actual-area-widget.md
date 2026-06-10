# T-38-02 — Widżet: plan vs realizacja vs forecast (Area)

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01, US-39 T-39-02

## Cel

Duży **Area Chart** — miesięczny trend planu, realizacji i forecastu banku.

## Zakres

### Pliki

- `components/crm/analytics/widgets/plan-actual-area-widget.tsx`
- `plan-actual-area`, `kind: "area_chart"`, `size: "2x2"`, tag **Plan**

### Dane

- `kpi.monthlyTrend` — serie: plan, actual, forecast (bazowy).
- Respektuj filtr region/segment (skalowanie jak `executive-metrics` gdy filtry aktywne).

### UI

- `AnalyticsAreaChart` multi-series, gradient fill (wzór shadcn Area Interactive).
- Oś Y: `formatAxisPln`.

## Done when

- [ ] 6 miesięcy z seedu widocznych na wykresie.
- [ ] Filtr regionu zawęża skalę wartości.
- [ ] Legenda: Plan · Realizacja · Forecast.
