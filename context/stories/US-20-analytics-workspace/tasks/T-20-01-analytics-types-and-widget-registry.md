# T-20-01 — Typy analityki i rejestr widżetów

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Zdefiniować model konfiguracji panelu analitycznego: typy widżetów, presety layoutu, metadane RBAC — bez UI.

## Zakres techniczny

### Pliki (propozycja)

- `types/analytics.ts` — enumy i interfejsy.
- `lib/analytics/widget-registry.ts` — stała lista widżetów + presety paneli.
- `data/analytics-panels.json` *(opcjonalnie)* — jeśli wolisz seed w JSON; w przeciwnym razie rejestr w TS wystarczy na demo.

### Typy

```ts
// Przykładowy szkic — doprecyzować przy implementacji
type AnalyticsDomainTag = "leads" | "deals" | "tasks" | "plan"
type AnalyticsWidgetKind =
  | "kpi_count"
  | "kpi_currency"
  | "kpi_duration"
  | "funnel"
  | "bar_chart"
  | "stacked_bar"

type AnalyticsWidgetSize = "1x1" | "2x1" | "1x2" | "2x2"

interface AnalyticsWidgetDefinition {
  id: string
  titlePl: string
  domainTag: AnalyticsDomainTag
  kind: AnalyticsWidgetKind
  size: AnalyticsWidgetSize
  metricKey: string // klucz do lib/analytics/metrics
  restrictedRoles?: UserRole[] // role BEZ dostępu → overlay
}

interface AnalyticsPanelPreset {
  id: string
  labelPl: string
  widgetIds: string[] // kolejność w siatce
}
```

### Rejestr widżetów (minimum)

Zgodnie z tabelą w story — 10 definicji:

1. `new-leads` · Nowe leady  
2. `won-deals` · Wygrane deale  
3. `open-deals` · Otwarte deale  
4. `overdue-tasks` · Zadania po terminie  
5. `deal-funnel` · Konwersja dealów  
6. `won-amount-by-source` · Kwota wygranych wg źródła  
7. `avg-deal-value` · Średnia wartość deala  
8. `avg-deal-duration` · Średni czas trwania deala *(restricted)*  
9. `overdue-tasks-by-owner` · Zadania po terminie wg opiekuna  
10. `tasks-by-priority` · Zadania wg priorytetu  

### Presety paneli

- `sales-pipeline` — „Sprzedaż i lejek”: widżety 1–7 (+ 8 restricted).  
- `team-activity` — „Zespół i zadania”: 4, 9, 10 + wybrane KPI dealów.

### Etykiety PL

- `lib/analytics/analytics-labels.ts` — mapowanie tagów domeny i tytułów (jak `lead-labels.ts`).

## Done when

- [ ] Typy wyeksportowane z `types/analytics.ts`.
- [ ] Rejestr zawiera ≥ 10 widżetów i 2 presety z kolejnością `widgetIds`.
- [ ] Co najmniej 2 widżety mają `restrictedRoles` w definicji.
- [ ] Brak importów React — czysta warstwa danych/konfiguracji.

## Poza zakresem

- Obliczanie metryk (→ T-20-02).
- Render UI (→ T-20-04+).
