# T-20-02 — Biblioteka metryk analitycznych

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-01](./T-20-01-analytics-types-and-widget-registry.md)

## Cel

Wyliczać agregacje dla widżetów z danych sesji (`leads`, `deals`/`opportunities`, `tasks`) z uwzględnieniem filtrów globalnych i RBAC.

## Zakres techniczny

### Pliki

- `lib/analytics/filters.ts` — typ `AnalyticsGlobalFilters`, helpery dat (okres: miesiąc / kwartał / YTD; demo: czerwiec 2026).
- `lib/analytics/metrics.ts` — funkcje per `metricKey` z rejestru.
- `lib/analytics/scope.ts` — opakowanie `filterByScope` + filtrowanie po `ownerId` / liście opiekunów.

### Filtry globalne

```ts
type AnalyticsTimePeriod = "month" | "quarter" | "ytd"
type AnalyticsGlobalFilters = {
  timePeriod: AnalyticsTimePeriod
  ownerIds: string[] // pusta = wszyscy w scope użytkownika
  panelPresetId: string
}
```

### Funkcje metryk (minimum)

| `metricKey` | Wejście | Wyjście |
| --- | --- | --- |
| `new_leads_count` | leads | `number` |
| `won_deals_count` | deals | `number` |
| `open_deals_count` | deals | `number` |
| `overdue_tasks_count` | tasks | `number` |
| `deal_funnel` | deals | `{ stage: DealStatus; count: number }[]` |
| `won_amount_by_source` | deals won | `{ source: DealSource; amountPln: number }[]` |
| `avg_deal_value` | deals | `number` (PLN) |
| `avg_deal_duration_days` | deals closed | `number` |
| `overdue_tasks_by_owner` | tasks | `{ ownerId; ownerName; count }[]` |
| `tasks_by_priority` | tasks | `{ priority: TaskPriority; count }[]` |

### Reguły

- Wszystkie listy wejściowe najpierw `filterByScope(..., sessionUser)`.
- Filtr **okresu**: po `createdAt` / `closedAt` / `dueDate` zależnie od metryki (udokumentować w komentarzu per funkcja).
- Filtr **opiekunów**: po `ownerId` (deale, leady, zadania).
- Dla pustych zbiorów: zwracać `0` lub puste tablice — widżet pokaże zero-state, nie błąd.
- Reuse: `formatCurrencyPln`, etykiety `deal-labels`, `lead-labels`, `task-labels`.

### Testowalność

- Funkcje czyste — eksportować bez zależności od React Context (przyjmują tablice + `DemoUser` + filtry).

## Done when

- [ ] Każdy `metricKey` z T-20-01 ma implementację w `metrics.ts`.
- [ ] `filterByScope` stosowany przed agregacją.
- [ ] Filtr okresu i opiekunów zmienia wynik (weryfikacja ręczna na seedzie).
- [ ] Lejek zwraca 6 etapów zgodnych z US-18 (`DealStatus`).

## Poza zakresem

- KPI plan/forecast (`kpi.json`) — pozostaje w `executive-metrics.ts` (T-20-08).
