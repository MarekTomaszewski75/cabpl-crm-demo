# T-36-05 — Hero KPI row z Radial Chart

**Story:** [US-36](../story.md)  
**Status:** Done  
**Zależy od:** T-36-01, [T-39-01](../../US-39-analytics-shadcn-charts/tasks/T-39-01-radial-chart-component.md)

## Cel

Rząd 4 kart KPI nad siatką widżetów — z **Radial Chart** realizacji planu.

## Zakres

### Nowy komponent

`components/crm/analytics/analytics-hero-kpi-row.tsx`

### Karty per rola (spec §2.3 / §3.3)

**Menedżer:**

| KPI | Źródło |
| --- | --- |
| Realizacja planu regionu | `kpi.byRegion` + Radial |
| Wygrane deale (kwota) | `getAdvisorWonAmountRows` suma |
| Otwarty lejek (kwota) | deale otwarte scoped |
| Zadania po terminie | reuse `overdue_tasks_count` |

**Zarząd:**

| KPI | Źródło |
| --- | --- |
| Plan YTD | `kpi.planYtdPln` |
| Realizacja YTD + Radial | `kpi.actualYtdPln` |
| Forecast YTD | `kpi.forecastYtdPln` |
| Otwarty pipeline | suma deale otwarte |

- Reuse `AnalyticsKpiVisual` / `KpiCard` gdzie możliwe.
- `AnalyticsRadialChart` size `sm` w karcie realizacji.

### Integracja

- `analytics-workspace.tsx` — hero row w `TabsContent` Panel główny, pod filtrami, nad gridem.

## Done when

- [x] 4 karty widoczne dla obu ról; treść różna.
- [x] Radial pokazuje % realizacji planu.
- [x] Zmiana filtrów okresu odświeża wartości.
- [x] Responsywność: 4→2→1 kolumny.

## Poza zakresem

- Sparkline w KPI (nice to have — nie blokujące).
