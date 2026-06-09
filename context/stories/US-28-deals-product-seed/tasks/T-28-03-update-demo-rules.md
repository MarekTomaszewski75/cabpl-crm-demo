# T-28-03 — Reguły demo pod nowe statusy deala

**Story:** [US-28](../story.md)  
**Status:** Done  
**Zależy od:** [T-28-01](./T-28-01-migrate-opportunities-json.md)

## Cel

Zaktualizować logikę „Dziś”, powiadomień i banerów — nie opierać się na usuniętych statusach US-18.

## Zakres techniczny

### `lib/crm/today-pipeline-summary.ts`

- Zamiast stałej listy `offer_submitted`, `negotiation_started`:
  - deale „wymagające uwagi” = status jest **ostatnim lub przedostatnim** krokiem workflow w `getPipelineWorkflowSteps(deal.pipelineCategoryId)` (nie `won`/`lost`);
  - zachować filtr `expectedCloseDate` w horyzoncie 7 dni.
- Etykieta etapu w UI — `getDealStatusLabel(deal.status, deal.pipelineCategoryId)`.

### `lib/crm/banner-rules.ts`

- Jeśli reguła krytycznego deala używa statusów US-18 — zamienić na warunek oparty o indeks kroku w lejku lub kwotę + termin (bez zmiany biznesu bannera US-23).

### `lib/crm/notification-rules.ts`

- Reguły typu `deal_status_*` / pilność — dostosować do nowych statusów lub do ostatnich kroków lejka.

### Smoke

- Doradca na `/today` — sekcja deali niepusta (przy seedzie po T-28-01).
- Dzwonek powiadomień — brak regresji liczników.

## Done when

- [x] Brak importów / referencji do `association_created`, `meeting_scheduled`, `offer_submitted`, `negotiation_started` w `lib/crm/` (poza `mapLegacyDealStatus`).
- [x] `/today` pokazuje deale po nowej logice.
- [x] Banner krytyczny deala nadal może się pojawić (smoke na seedzie).

## Poza zakresem

- Zmiana treści powiadomień seed (`data/notifications.json`) — tylko jeśli zawierają hardcoded stare etykiety statusów.
