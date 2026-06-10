# T-33-03 — Karta leada: usuń lead (AlertDialog)

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-01](./T-33-01-lead-detail-layout-cleanup.md)

## Cel

Funkcjonalne usuwanie leada z menu ⋮ i potwierdzeniem.

## Zakres

### `lead-detail-header.tsx`

- Usunąć pozycję **Edytuj** (disabled).
- Pozycja **Usuń** → otwiera `AlertDialog`.
- Dialog: tytuł „Usunąć leada?”, opis z `lead.name`; dla `won` + `opportunityId` — ostrzeżenie że deal pozostaje.
- Przyciski **Anuluj** / **Usuń** (destructive).
- Po potwierdzeniu: `deleteLead` → toast → `router.push("/leads")`.

### `DemoDataContext`

- `deleteLead(id: string)`:
  - Usuwa lead z `leads`.
  - Usuwa `leadActivities` i `leadDocuments` dla `leadId`.
  - Odczepia `leadId: null` na powiązanych `tasks` / `meetings`.

### shadcn

- `npx shadcn@latest add alert-dialog` jeśli brak komponentu.

## Done when

- [ ] Menu: tylko **Usuń** (aktywne).
- [ ] AlertDialog z anulowaniem i potwierdzeniem.
- [ ] Lead znika z Context; redirect `/leads`.
- [ ] RBAC: tylko użytkownik z `canAccessEntity`.

## Poza zakresem

- Usuwanie powiązanego deala.
- Soft delete.
