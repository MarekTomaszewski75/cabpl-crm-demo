# T-17-01 — Typy leada, enumy i migracja seedu

**Story:** [US-17](../story.md)  
**Status:** Done

## Cel

Zdefiniować nowy model `Lead` i zaktualizować `data/leads.json` + etykiety — bez zmiany UI (→ kolejne taski).

## Zakres techniczny

### `types/crm.ts`

- Zastąpić `LeadStatus`: `"new" | "in_progress" | "won" | "lost"` (usunąć `contacted`, `qualified`, `converted`).
- Dodać `LeadSource`, `LeadType`, `LeadLostReason` (enumy jak w story).
- Rozszerzyć `interface Lead`:
  - `name: string` (wymagane)
  - `contactId: string | null`
  - `comments: string`
  - `source: LeadSource` (zamiast wolnego `string`)
  - `leadType: LeadType | null`
  - `companyName: string` (opcjonalne, do deala)
  - `position`, `socialMedia`, `phones`, `emails` (jak firma — opcjonalne na karcie)
  - `lostReason: LeadLostReason | null`
  - `opportunityId: string | null`
  - zachować `clientId`, `createdAt`, `ownerId`, `regionId`
- **Usunąć** użycie `companyName` jako jedynego pola tytułu — migracja seed: `name` ← dotychczasowe `companyName`.

### `lib/crm/lead-labels.ts`

- `LEAD_STATUS_LABELS`, `LEAD_STATUS_OPTIONS`, `leadStatusBadgeVariant`.
- Etykiety dla `LeadSource`, `LeadType`, `LeadLostReason`.
- Zastąpić `canConvertLead` → `canFinishLead(status)` (true dla `new` i `in_progress`).
- Usunąć / zdeprecjonować `LEAD_STATUS_CREATE_OPTIONS` ze starymi statusami.

### Seed `data/leads.json`

- Mapowanie statusów: patrz tabela w story.
- Uzupełnić sensowne `source` (enum), opcjonalnie `leadType`.
- Zachować istniejące `id` (`lead-001` …) — pipeline i powiązania demo nie psuć.

### Breaking changes (świadome)

- Wszystkie importy `LeadStatus` / `companyName` w komponencie leadów — naprawić w taskach UI lub minimalnie tutaj jeśli build się wywraca (prefer: tylko typy + seed + labels w T-17-01).

## Done when

- [ ] Typy i enumy zgodne ze story.
- [ ] Seed przejściowy — każdy rekord ma `name` i nowy `status`.
- [ ] `lead-labels.ts` bez starych statusów US-11.
- [ ] Istniejące `id` leadów bez zmian.

## Poza zakresem

- Context CRUD (→ T-17-02).
- Komponenty UI.
