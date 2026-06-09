# T-27-01 — Typy Deal i konfiguracja lejków

**Story:** [US-27](../story.md)  
**Status:** Done

## Cel

Zdefiniować rozszerzony model deala i centralną konfigurację 6 lejków produktowych.

## Zakres techniczny

### `types/crm.ts`

- Dodać do `Deal`:
  - `productId: string`
  - `pipelineCategoryId: string`
- Rozszerzyć `DealStatus` o wszystkie kroki z [spec §3.2](../../../products-deal-pipelines-spec.md#32-kroki-środkowe-per-kategoria):
  - Kredyt: `credit_qualification`, `credit_analysis`, `credit_offer`, `credit_committee`
  - Leasing: `leasing_needs`, `leasing_offer`, `leasing_risk`, `leasing_negotiation`
  - Faktoring: `factoring_buyers`, `factoring_portfolio`, `factoring_offer`, `factoring_signing`
  - Gwarancje: `guarantee_contract`, `guarantee_pricing`, `guarantee_approval`, `guarantee_issuance`
  - Rachunki: `accounts_qualification`, `accounts_proposal`, `accounts_onboarding`, `accounts_activation`
  - Depozyty: `deposit_liquidity`, `deposit_offer`, `deposit_acceptance`, `deposit_opening`
  - Wspólne: `new`, `won`, `lost`
- Oznaczyć stare statusy US-18 jako deprecated lub usunąć z unionu (preferowane: usunąć — migracja w US-28).

### `lib/crm/deal-pipeline.ts` (nowy)

- `DEAL_PIPELINE_CATEGORY_IDS` — 6 id kategorii liścia (§2.1 spec).
- `getPipelineSteps(pipelineCategoryId): DealStatus[]` — pełna kolejność kolumn kanban.
- `getPipelineWorkflowSteps(pipelineCategoryId)` — kroki bez `won`/`lost`.
- `getPipelineCategoryIds(): string[]`
- `isTerminalDealStatus(status)`, `isDealWorkflowStatus(status, categoryId)`
- `mapLegacyDealStatus(pipelineCategoryId, oldStatus: LegacyDealStatus): DealStatus` — mapowanie US-18 → nowy lejek (§3.3 spec).
- `resolvePipelineCategoryId(productCategoryId): string` — reguła: liść drzewa = kategoria lejka; `pcat-leasing` (grupa) → błąd / wymaga liścia.
- Opcjonalnie: `dealStepProbability(pipelineCategoryId, status): number`.

### `AddDealInput` / mutacje

- Rozszerzyć typ wejścia `addDeal` / `addOpportunity` o `productId` (wymagane dla nowych dealów).

## Done when

- [ ] Plik `deal-pipeline.ts` eksportuje API używane przez kanban i transition.
- [ ] `getPipelineSteps` pokrywa 6 kategorii z poprawną kolejnością.
- [ ] `mapLegacyDealStatus` działa deterministycznie dla każdej kategorii.
- [ ] TypeScript kompiluje `types/crm.ts` bez konfliktów.

## Poza zakresem

- Etykiety PL (→ T-27-02).
- Aktualizacja komponentów UI.
