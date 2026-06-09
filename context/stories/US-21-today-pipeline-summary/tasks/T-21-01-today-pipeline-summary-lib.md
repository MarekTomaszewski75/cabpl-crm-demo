# T-21-01 — Logika podsumowania pipeline na „Dziś”

**Story:** [US-21](../story.md)  
**Status:** Done

## Cel

Wyekstrahować reguły selekcji i sortowania deali oraz leadów wymagających uwagi — poza komponentem UI.

## Zakres techniczny

### Nowy plik `lib/crm/today-pipeline-summary.ts`

Eksporty (propozycja):

- `TODAY_PIPELINE_HORIZON_DAYS = 7`
- `TODAY_LEAD_STALE_DAYS = 7`
- `DEAL_ATTENTION_STATUSES: DealStatus[]` — `offer_submitted`, `negotiation_started`
- `getDealsRequiringAttention(deals, clients, asOfDate): TodayDealSummary[]`
- `getLeadsRequiringAttention(leads, leadActivities, asOfDate): TodayLeadSummary[]`

Typy pomocnicze:

```ts
type TodayDealSummary = {
  deal: Deal
  clientName: string | null
  daysUntilClose: number | null
}

type TodayLeadSummary = {
  lead: Lead
  daysSinceLastActivity: number
}
```

### Reguły deali

- `filter`: status ∈ `DEAL_ATTENTION_STATUSES`, nie `won`/`lost`.
- `expectedCloseDate` zdefiniowane i ≤ `asOfDate + HORIZON`.
- Sort: `expectedCloseDate` ASC, `amount` DESC.

### Reguły leadów

- Status `in_progress` lub (`new` i `createdAt` starsze niż 3 dni od `asOfDate`).
- Ostatnia aktywność z `leadActivities` (max `occurredAt`) lub `createdAt` — starsza niż `STALE_DAYS`.
- Sort: najstarsza aktywność ASC.

### Reuse

- `getDemoToday()`, `toLocalDateKey` z `lib/crm/demo-today`.
- Funkcje eksportowane tak, by US-22 mógł reuse części reguł (opcjonalnie wspólny moduł `lib/crm/urgency-rules.ts` — tylko jeśli uniknie duplikacji bez over-engineering).

## Done when

- [x] Plik z typami i funkcjami zgodny ze story US-21.
- [x] Jednostkowo czytelne reguły (komentarz przy stałych jeśli nieoczywiste).
- [x] Brak importów React w tym pliku.

## Poza zakresem

- UI (`TodayView`).
- Zmiany seedu (→ T-21-02).
