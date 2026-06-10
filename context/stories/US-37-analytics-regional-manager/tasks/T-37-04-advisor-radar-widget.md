# T-37-04 — Widżet: profil doradców (Radar)

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** T-37-01, US-39 T-39-05

## Cel

**Radar Chart** porównujący doradców w wymiarach operacyjnych.

## Zakres

### Pliki

- `components/crm/analytics/widgets/advisor-radar-widget.tsx`
- `advisor-radar`, `kind: "radar_chart"`, `size: "2x2"`, tag **Zespół**

### Wymiary (spec §2.4)

Leady · Otwarte deale · Wygrane · Zadania zamknięte · Spotkania — znormalizowane 0–100 (`getAdvisorRadarRows`).

### UI

- `AnalyticsRadarChart` — 2 serie (Anna, Piotr) domyślnie.
- Przy filtrze jednego doradcy — 1 serie + opcjonalnie średnia zespołu przerywana.

## Done when

- [x] Radar renderuje ≥ 2 polygonów z legendą.
- [x] Wartości zmieniają się po zmianie okresu.
- [x] Tooltip z surowymi liczbami (opcjonalnie w `ChartTooltipContent`).
