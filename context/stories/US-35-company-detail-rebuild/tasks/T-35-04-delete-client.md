# T-35-04 — Karta firmy: usuń firmę (AlertDialog)

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-01](./T-35-01-company-detail-layout-cleanup.md)

## Cel

Funkcjonalne usuwanie firmy — wzorzec z US-33 (`deleteLead`).

## Zakres

### `company-detail-header.tsx`

- Usunąć **Edytuj** (disabled).
- **Usuń** → `AlertDialog` z potwierdzeniem.
- Ostrzeżenie gdy firma ma powiązane deale / otwarte zadania.
- Po potwierdzeniu: `deleteClient` → toast → `/clients`.

### `DemoDataContext`

- `deleteClient(id: string)`:
  - Usuwa `clients` entry.
  - Usuwa `contactEvents` i `clientDocuments` dla `clientId`.
  - Odczepia `clientId: null` na `deals`, `leads`, `tasks`, `meetings`.
  - Kontakty `CrmContact` — pozostają w seedzie (bez kaskady delete).

- Reuse `AlertDialog` z US-33.

## Done when

- [ ] Menu: tylko **Usuń** (aktywne).
- [ ] Dialog z anulowaniem i potwierdzeniem.
- [ ] Firma znika z Context; redirect `/clients`.
- [ ] RBAC: `canAccessEntity`.

## Poza zakresem

- Usuwanie powiązanych deali.
