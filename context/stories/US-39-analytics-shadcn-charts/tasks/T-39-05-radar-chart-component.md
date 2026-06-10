# T-39-05 — Komponent Radar Chart

**Story:** [US-39](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Reużywalny **Radar Chart** — porównanie wielowymiarowe (doradcy, regiony).

## Zakres

### Nowy plik

`components/crm/analytics/charts/analytics-radar-chart.tsx`

### Props

- `data`: `{ dimension: string; [entityKey: string]: number | string }[]` — wymiary na osiach.
- `entities`: `{ key, label, color? }[]` — serie (doradcy / regiony).
- `maxValue?: number` — domyślnie 100 (znormalizowane metryki).

### Wzorzec

- [shadcn Radar Chart](https://ui.shadcn.com/charts/radar) — `RadarChart`, `Radar`, `PolarGrid`, `PolarAngleAxis`.

## Done when

- [x] ≥ 2 serie (np. Anna vs Piotr) na ≥ 4 wymiarach.
- [x] Opacity fill ~0.3, stroke pełne — czytelność na białym tle.
- [x] Legenda z kolorami entity.

## Poza zakresem

- Normalizacja metryk (US-36 metrics + widżety US-37/38).
