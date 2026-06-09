# US-27 — Model lejków deali per kategoria produktu

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-18 (deale), US-19 (produkty)  
**Specyfikacja:** [products-deal-pipelines-spec.md §3–4](../../products-deal-pipelines-spec.md)

## Jako

developer / agent implementujący demo

## Chcę

mieć **konfigurację lejków deali per kategoria produktu** oraz rozszerzony model `Deal` z polami produktu

## Aby

kolejne story (seed, kanban, lista, formularz) mogły korzystać z jednego źródła prawdy o krokach lejka i statusach

## Zakres

### W zakresie

- Rozszerzenie typu `Deal` w `types/crm.ts`:
  - `productId: string`
  - `pipelineCategoryId: string`
  - `DealStatus` — union wszystkich kroków z 6 lejków (§3.2 spec) + `new` + `won` + `lost`; **usunięcie** statusów US-18 (`association_created`, `meeting_scheduled`, `offer_submitted`, `negotiation_started`) po migracji w US-28.
- Nowe moduły:
  - `lib/crm/deal-pipeline.ts` — `DEAL_PIPELINE_CATEGORIES`, `getPipelineSteps(categoryId)`, `getPipelineCategoryIds()`, `isDealWorkflowStatus()`, `mapLegacyDealStatus()`, opcjonalnie `dealStepProbability()`
  - `lib/crm/deal-pipeline-labels.ts` — etykiety PL wszystkich statusów per lejek
- Aktualizacja istniejących helperów deala:
  - `deal-labels.ts` — delegacja etykiet statusu do `deal-pipeline-labels.ts`; `canFinishDeal`, `isTerminalDealStatus`
  - `deal-kanban.ts` — kolumny i motywy **po indeksie kroku** w lejku (funkcja `getKanbanThemeForStepIndex`)
  - `deal-status-transition.ts` — przejścia dozwolone w obrębie lejka danej kategorii
- Rozszerzenie seedu produktów (`data/products.json`): nowe pozycje `prod-014` … `prod-018` wg §2.3 spec; ewentualna korekta nazw istniejących.
- Kategorie produktów (`data/product-categories.json`) — bez zmian struktury; weryfikacja zgodności z §2.2.

### Poza zakresem

- Migracja `data/opportunities.json` (→ US-28).
- Zmiany UI kanban / lista / formularz (→ US-29 … US-32).
- Aktualizacja reguł `today-pipeline-summary`, `banner-rules`, `notification-rules` (→ US-28 T-28-03).

## Kryteria akceptacji (story)

- [x] `getPipelineSteps(categoryId)` zwraca poprawną kolejność 7 kolumn (workflow + won + lost) dla każdej z 6 kategorii lejka.
- [x] `Deal` w TypeScript ma `productId` i `pipelineCategoryId`.
- [x] `deal-pipeline-labels.ts` zawiera etykiety PL dla wszystkich statusów.
- [x] `deal-status-transition.ts` blokuje przejścia między krokami z różnych lejków.
- [x] Seed produktów ma min. 15 pozycji bankowych korporacyjnych.
- [x] `npm run dev` kompiluje się (UI może tymczasowo używać starych statusów do czasu US-28).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-27-01](./tasks/T-27-01-deal-types-and-pipeline-config.md) | Done | — |
| [T-27-02](./tasks/T-27-02-deal-pipeline-labels.md) | Done | T-27-01 |
| [T-27-03](./tasks/T-27-03-migrate-deal-helpers.md) | Done | T-27-01, T-27-02 |
| [T-27-04](./tasks/T-27-04-product-seed-expansion.md) | Done | — |

## Kolejność implementacji (agent)

1. T-27-01 → T-27-02 → T-27-03  
2. T-27-04 (równolegle z T-27-01 po typach `Product`)

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Deals — lejki per kategoria).
