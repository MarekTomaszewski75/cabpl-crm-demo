# T-18-02 — DemoDataContext: CRUD dealów i finalizacja

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-01](./T-18-01-deal-types-and-seed.md)

## Cel

Mutacje dealów w `DemoDataContext` + logika **wygranej** / **przegranej** + aktywności feedu.

## Zakres techniczny

### Mutacje (minimum)

| API | Zachowanie |
| --- | --- |
| `addDeal(input)` | nowe — `AddDealInput` + auto `ownerId`/`regionId`/`status: new`/`createdAt` |
| `updateDeal(id, patch)` | partial update wszystkich pól z modelu |
| `winDeal(id, params?)` | `status: won`, `finishedByUserId`, `finishedAt`, `firstFinishedByUserId` (jeśli brak) |
| `loseDeal(id, reason)` | `status: lost`, `lostReason`, metadane zakończenia |
| `addDealActivity(dealId, item)` | wpis feedu |
| `addDealNote(dealId, note)` | skrót do notatki w feedzie |

### Deprecacja / migracja API

| Stare | Nowe |
| --- | --- |
| `addOpportunity` | `addDeal` (alias deprecated lub bezpośrednia zamiana) |
| `updateOpportunity(id, { stage, … })` | `updateDeal(id, { status, … })` |
| `buildWinLeadResult` → tworzy `Opportunity` | tworzy `Deal` ze `status: "new"`, `name`, `contactId`, `clientId`, `source` z leada |

### `lib/crm/win-lead.ts`

- Zaktualizować `buildWinLeadResult`: nowy deal zamiast szansy ze starym `stage`.
- Usunąć wybór „lejka sprzedażowego” z logiki danych (UI leada może uprościć dialog w osobnym tasku lub zostawić pole ignorowane — prefer: usunąć Select lejka z `LeadFinishDialog` w T-18-11).

### Aktywność deala (feed)

Typy systemowe: `deal_created`, `deal_status_changed`, `deal_won`, `deal_lost`, `deal_note`.

Model jak `LeadActivity` / `CompanyActivity` — osobna tablica `dealActivities` w Context lub rozszerzenie seedu `data/deal-activities.json`.

## Done when

- [ ] `addDeal` / `updateDeal` działają z nowym modelem.
- [ ] `winDeal` / `loseDeal` ustawiają status terminalny + metadane.
- [ ] `winLead` tworzy deal w nowym modelu; lead `opportunityId` wskazuje na nowy rekord.
- [ ] `addDealActivity` dostępne w hooku.

## Poza zakresem

- Dialogi UI (→ T-18-10).
- Route `/pipeline/[id]` (→ T-18-06).
