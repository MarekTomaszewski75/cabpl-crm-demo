# T-17-02 — DemoDataContext: CRUD leadów i finalizacja

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-01](./T-17-01-lead-types-and-seed.md)

## Cel

Mutacje leadów w `DemoDataContext` + logika **wygranej** / **przegranej** (następca `convertLeadToOpportunity`).

## Zakres techniczny

### Mutacje (minimum)

| API | Zachowanie |
| --- | --- |
| `addLead(lead)` | już istnieje — dopasować do nowego typu |
| `updateLead(id, patch)` | już istnieje — partial update |
| `setLeadStatus(id, status)` | opcjonalny helper lub tylko `updateLead` |
| `winLead(params)` | nowe — patrz poniżej |
| `loseLead(id, reason)` | nowe — `status: lost`, `lostReason` |

### `lib/crm/win-lead.ts` (propozycja nazwy)

`buildWinLeadResult(lead, { pipelineKey, contacts, clients, opportunities })` zwraca:

- `opportunity: Opportunity` — tytuł np. `Szansa — {lead.name}`, `stage` z mapowania lejka
- `leadPatch: Pick<Lead, "status" \| "clientId" \| "opportunityId">` — `status: "won"`
- `newClient?: Client` — jeśli brak `clientId` i podano `companyName` lub `name` jako firma
- `newContact?: CrmContact` — jeśli brak `contactId` a w leadzie są dane do utworzenia kontaktu (P1: tylko gdy user wybrał „utwórz” w dialogu)

**Firma:** jeśli `lead.clientId` — użyj istniejącej; inaczej `addClient` z `companyName || name`, `ownerId`/`regionId` z leada, `source`/`companyType` z leada (mapowanie sensowne demo).

**Kontakt:** jeśli `lead.contactId` — bez zmian; inaczej opcjonalnie nowy `CrmContact` z pól leada (telefon/e-mail) lub z formularza dialogu.

### Deprecacja

- `convertLeadToOpportunity` — zastąpić przez `winLead` lub wewnętrznie delegować do `buildWinLeadResult`; usunąć wywołania z tabeli po T-17-03.
- `lib/crm/convert-lead.ts` — przenieść logikę do `win-lead.ts` lub rozszerzyć plik z migracją nazw.

### Aktywność leada (feed)

- `addLeadActivity(leadId, item)` lub rozszerzenie wspólnego modelu aktywności (reuse wzorca z US-16 — `companyActivities` / `ContactEvent` z `kind: system`).
- Typy: `lead_created`, `lead_status_changed`, `lead_won`, `lead_lost`, `lead_note` (P1 dla notatek).

## Done when

- [ ] `addLead` / `updateLead` działają z nowym `Lead`.
- [ ] `winLead` tworzy szansę + ewentualnie firmę/kontakt; ustawia lead `won` + `opportunityId`.
- [ ] `loseLead` ustawia `lost` + `lostReason`.
- [ ] Stary `convertLeadToOpportunity` nieużywany w nowym UI (można usunąć po T-17-10).

## Poza zakresem

- Dialogi UI (→ T-17-10).
- Route `/leads/[id]` (→ T-17-06).
