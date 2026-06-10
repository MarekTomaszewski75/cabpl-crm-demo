# US-36 — Analityka: shell per rola

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-20, US-39 (T-39-01 dla hero Radial)  
**Źródło:** [`analytics-roles-rebuild-spec.md`](../../analytics-roles-rebuild-spec.md) §1, §5, §7

## Jako

regionalny menedżer lub członek zarządu (demo)

## Chcę

wejść na `/dashboard` i od razu zobaczyć panel dopasowany do mojej roli — z właściwymi filtrami, presetem i hero KPI

## Aby

Analityka nie była wspólnym „najniższym wspólnym mianownikiem”, lecz narzędziem nadzoru zespołu (menedżer) lub banku (zarząd)

## Zakres

### W zakresie

- Rozszerzenie `lib/analytics/metrics.ts` o agregacje per doradca, region, segment, timeline (§6.2 spec).
- Podział rejestru: `MANAGER_PANEL_PRESETS` / `EXECUTIVE_PANEL_PRESETS`; `getAnalyticsPresetsForRole`, `getDefaultPresetForRole`.
- Filtry globalne zależne od roli: menedżer (okres, doradca); zarząd (okres, region, segment).
- Podtytuł modułu pod nagłówkiem (region + liczba doradców / bank + liczba regionów).
- **Hero KPI row** — 4 karty z Radial realizacji planu (US-39).
- Zakładka **Plan i cele**: menedżer — region zablokowany; zarząd — tabela segmentów pod wykresem.
- Widżety roli: render tylko gdy widżet należy do presetu roli — bez overlay „Ograniczony dostęp” dla dedykowanych metryk.

### Poza zakresem

- Konkretne wykresy menedżera/zarządu poza hero KPI (US-37, US-38).
- Zakładka Raporty (Wkrótce).
- Seed multi-region (US-40 — opcjonalna zależność).

## Kryteria akceptacji (story)

- [x] Login **Marek** → preset domyślny **Mój zespół**; filtry bez Region/Segment.
- [x] Login **Jan** → preset **Portfel banku**; filtry Region + Segment.
- [x] Podtytuł roli widoczny pod „Analityka”.
- [x] Hero row: 4 KPI + Radial realizacji planu.
- [x] Plan i cele: menedżer widzi tylko swój region (Mazowsze).
- [x] Brak regresji DnD siatki i zakładek.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-36-01](./tasks/T-36-01-extended-analytics-metrics.md) | Done | — |
| [T-36-02](./tasks/T-36-02-role-aware-widget-registry.md) | Done | T-36-01 |
| [T-36-03](./tasks/T-36-03-role-specific-filters-bar.md) | Done | T-36-02 |
| [T-36-04](./tasks/T-36-04-workspace-subtitle-default-preset.md) | Done | T-36-02, T-36-03 |
| [T-36-05](./tasks/T-36-05-hero-kpi-radial-row.md) | Done | T-36-01, [T-39-01](../US-39-analytics-shadcn-charts/tasks/T-39-01-radial-chart-component.md) |
| [T-36-06](./tasks/T-36-06-plan-tab-role-adjustments.md) | Done | T-36-04 |

## Kolejność implementacji (agent)

1. T-36-01  
2. T-36-02  
3. T-36-03 + T-36-05 (równolegle)  
4. T-36-04  
5. T-36-06
