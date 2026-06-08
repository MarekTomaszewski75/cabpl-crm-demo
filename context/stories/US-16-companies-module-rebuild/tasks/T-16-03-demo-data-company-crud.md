# T-16-03 — DemoDataContext: CRUD firmy i kontaktu + auto-opiekun

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-01](./T-16-01-company-types-and-seed.md), [T-16-02](./T-16-02-crm-contacts-entity.md)

## Cel

Mutacje w pamięci dla nowych pól firmy i kontaktów; przy tworzeniu firmy — **automatyczny opiekun** z sesji.

## Zakres techniczny

### `DemoDataContext`

- Stan: `contacts: CrmContact[]` (z seed).
- **`addClient(payload, sessionUser)`** (lub równoważna sygnatura):
  - Ustawić `ownerId = sessionUser.id`, `regionId = sessionUser.regionId` (walidacja: region wymagany dla ról z regionem).
  - `lastActivityAt = now`.
  - `createNextClientId`.
  - Odfiltrować puste stringi z `phones` / `emails`.
- **`updateClient(id, partial)`** — merge pól, aktualizacja `lastActivityAt` przy zmianie treści (demo).
- **`addContact(payload)`** — nowy `CrmContact`, zwraca utworzony rekord (do combobox in-place).
- Zachować istniejące mutacje (`updateOpportunity`, …) bez regresji.

### Typ payloadu tworzenia

- Typ `AddClientInput` / `CompanyFormValues` w `types/crm.ts` lub obok formularza — wszystkie pola ze story **oprócz** `ownerId` (ustawiane w Context).

### Hook

- `useDemoData()` eksponuje `contacts`, `addContact`, rozszerzone `addClient` / `updateClient`.

## Done when

- [ ] `addClient` z mock userem ustawia `ownerId` na zalogowanego.
- [ ] `updateClient` aktualizuje pola z T-16-01 (w tym `contactIds`, enumy).
- [ ] `addContact` dodaje kontakt widoczny w kolejnym renderze listy combobox.
- [ ] Brak Route Handlers / API.

## Poza zakresem

- UI formularzy i listy.
