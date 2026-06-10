# US-38 — Analityka: panel członka zarządu

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-36, US-39, US-40 (zalecane dla wykresów operacyjnych regionów)  
**Źródło:** [`analytics-roles-rebuild-spec.md`](../../analytics-roles-rebuild-spec.md) §3

## Jako

członek zarządu (Jan Zarząd, demo)

## Chcę

widzieć wyniki całego banku — realizację planu, porównanie regionów i segmentów, forecast i portfel produktowy

## Aby

podejmować decyzje strategiczne na podstawie jednego panelu analitycznego bez wchodzenia w operacje per doradca

## Zakres

### W zakresie

- Preset **Portfel banku** — siatka §3.4 spec.
- Widżety: plan vs realizacja (Area), realizacja regionów (Bar grouped), udział segmentów (Pie), scenariusze forecast (Line), portfel produktowy (Bar stacked), macierz regionów (Radar), scorecard (Tabela), źródła wygranych (reuse US-20), leady vs deale (Line).
- Presety: **Regiony**, **Produkty i lejki**.
- Klik wiersza scorecard → filtr Region.
- Tabela top 10 otwartych dealów.

### Poza zakresem

- Ranking doradców na głównym panelu (delegacja do menedżera).
- Eksport raportów.
- Widżety restricted overlay — executive ma pełny dostęp.

## Kryteria akceptacji (story)

- [x] Preset **Portfel banku** — ≥ 4 typy wykresów shadcn (Area, Bar, Pie, Line/Radar).
- [x] **Scorecard** — 3 regiony z KPI z `kpi.json` + operacyjne liczniki.
- [x] Klik regionu w tabeli → filtr Region odświeża wykresy.
- [x] **Pie** segmentów — MŚP vs Enterprise z danymi.
- [x] Prezentacja: Jan → dashboard → Portfel banku (§7.2 spec).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-38-01](./tasks/T-38-01-executive-preset-grid-wiring.md) | Done | [US-36](../US-36-analytics-role-aware-shell/story.md) T-36-02 |
| [T-38-02](./tasks/T-38-02-plan-actual-area-widget.md) | Done | T-38-01, [T-39-02](../US-39-analytics-shadcn-charts/tasks/T-39-02-area-chart-component.md) |
| [T-38-03](./tasks/T-38-03-region-realization-bar-widget.md) | Done | T-38-01 |
| [T-38-04](./tasks/T-38-04-segment-share-pie-widget.md) | Done | T-38-01, [T-39-04](../US-39-analytics-shadcn-charts/tasks/T-39-04-pie-chart-component.md) |
| [T-38-05](./tasks/T-38-05-forecast-scenarios-line-widget.md) | Done | T-38-01, [T-39-03](../US-39-analytics-shadcn-charts/tasks/T-39-03-line-chart-component.md) |
| [T-38-06](./tasks/T-38-06-region-radar-scorecard-widget.md) | Done | T-38-01, [T-39-05](../US-39-analytics-shadcn-charts/tasks/T-39-05-radar-chart-component.md) |
| [T-38-07](./tasks/T-38-07-products-top-deals-alt-presets.md) | Done | T-38-01 |

## Kolejność implementacji (agent)

1. T-38-01  
2. T-38-02 … T-38-06 równolegle (osobne pliki)  
3. T-38-07
