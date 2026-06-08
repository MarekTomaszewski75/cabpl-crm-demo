# T-20-05 — Widżety KPI (liczniki)

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-02](./T-20-02-analytics-metrics-lib.md), [T-20-03](./T-20-03-analytics-page-shell-tabs-filters.md), [T-20-04](./T-20-04-analytics-widget-shell.md)

## Cel

Cztery widżety 1×1 z dużą liczbą wyśrodkowaną — jak „Nowe leady” / „Wygrane deale” na referencji.

## Zakres techniczny

### Pliki

- `components/crm/analytics/widgets/kpi-count-widget.tsx` — uniwersalny renderer liczby.
- `components/crm/analytics/widgets/widget-renderer.tsx` — mapowanie `kind === "kpi_count"` → komponent.

### Widżety

| ID | Tytuł | Metryka |
| --- | --- | --- |
| `new-leads` | Nowe leady | `new_leads_count` |
| `won-deals` | Wygrane deale | `won_deals_count` |
| `open-deals` | Otwarte deale | `open_deals_count` |
| `overdue-tasks` | Zadania po terminie | `overdue_tasks_count` |

### UI

- Duża typografia (`text-4xl` / `font-heading`), liczba wyśrodkowana w `CardContent`.
- Zero-state: wyświetlić `0` (nie ukrywać widżetu).
- Reaguje na `AnalyticsGlobalFilters` z rodzica.

### Integracja

- W `AnalyticsWorkspace` (zakładka Panele): podłączyć pierwszą paczkę widżetów z presetu przez `WidgetRenderer`.

## Done when

- [ ] 4 KPI renderują się w siatce na `/dashboard` → Panele.
- [ ] Zmiana okresu / opiekuna zmienia liczby zgodnie z seedem.
- [ ] Każdy widżet używa `AnalyticsWidget` shell (T-20-04).
- [ ] Tagi domeny: Leady / Deale / Zadania poprawne.

## Poza zakresem

- KPI walutowe i czasowe (→ T-20-06).
- DnD siatki (→ T-20-08).
