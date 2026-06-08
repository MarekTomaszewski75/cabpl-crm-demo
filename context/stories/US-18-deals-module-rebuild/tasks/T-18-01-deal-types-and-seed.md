# T-18-01 — Typy deala, enumy i migracja seedu

**Story:** [US-18](../story.md)  
**Status:** Done

## Cel

Zdefiniować nowy model **Deala** (rozszerzenie `Opportunity`) i zaktualizować `data/opportunities.json` + etykiety — bez zmiany UI (→ kolejne taski).

## Zakres techniczny

### `types/crm.ts`

- Dodać `DealStatus`: `"new" | "association_created" | "meeting_scheduled" | "offer_submitted" | "negotiation_started" | "won" | "lost"`.
- Dodać `DealCurrency`, `DealSource`, `DealType`, `DealLostReason` (enumy jak w story).
- Rozszerzyć / zastąpić `interface Opportunity` → **`Deal`** (alias `Opportunity` można zostawić jako deprecated type alias do migracji importów):
  - `name: string` (wymagane; migracja z `title`)
  - `amount: number | null` (migracja z `amountPln`)
  - `currency: DealCurrency` (domyślnie `PLN`)
  - `status: DealStatus` (zamiast `stage: OpportunityStage`)
  - `contactId: string | null`
  - `comments: string`
  - `source: DealSource | null`
  - `dealType: DealType | null`
  - `lostReason: DealLostReason | null`
  - `finishedByUserId`, `finishedAt`, `firstFinishedByUserId` — nullable
  - `createdAt: string`
  - zachować `clientId`, `ownerId`, `regionId`
  - **P2:** `probability`, `expectedCloseDate` — opcjonalnie w seedzie dla dashboardu; nie w UI deala Etap 1
- Dodać typy aktywności deala: `DealActivity`, `DealActivityKind`, `DealSystemActivityType` (jak lead/firma).

### `lib/crm/deal-labels.ts` (nowy)

- `DEAL_STATUS_LABELS`, `DEAL_STATUS_OPTIONS`, `dealStatusBadgeVariant`.
- Etykiety dla `DealCurrency`, `DealSource`, `DealType`, `DealLostReason`.
- `canFinishDeal(status)` — true dla statusów workflow (nie `won`/`lost`).
- `DEAL_WORKFLOW_STATUSES` — kolejność 5 segmentów paska.

### Deprecacja `OpportunityStage`

- `OPPORTUNITY_STAGE_LABELS` / `OPPORTUNITY_STAGES_ORDER` — oznaczyć deprecated lub mapować na `DealStatus` w helperze migracji.
- Importy w pipeline-board — naprawić w T-18-11 lub minimalnie jeśli build się wywraca.

### Seed `data/opportunities.json`

- Mapowanie `stage` → `status`: patrz tabela w story.
- `name` ← `title`; `amount` ← `amountPln`; `currency: "PLN"`.
- Uzupełnić sensowne `source`, opcjonalnie `dealType`, `contactId` (z `clients.contactIds` gdzie możliwe).
- Zachować istniejące `id` (`opp-001` …) — powiązania leadów (`opportunityId`) i dashboard nie psuć.

## Done when

- [ ] Typy i enumy zgodne ze story.
- [ ] Seed przejściowy — każdy rekord ma `name`, `status`, `currency`.
- [ ] `deal-labels.ts` z etykietami PL.
- [ ] Istniejące `id` dealów bez zmian.

## Poza zakresem

- Context CRUD (→ T-18-02).
- Komponenty UI.
