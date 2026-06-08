# T-17-03 — Lista leadów wzorowana na pracownikach

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-02](./T-17-02-demo-data-lead-crud.md)

## Cel

Przebudować `/leads` — UX listy **spójny z `/employees`** ([`reuse-and-conventions.md`](../../../reuse-and-conventions.md)).

## Zakres techniczny

### `leads-table.tsx` + `leads-columns.tsx`

- **Karta filtrów** `Card size="sm"`:
  - tytuł „Leady”;
  - `InputGroup` + ikona wyszukiwania (nazwa, firma, kontakt, opiekun);
  - przycisk CTA → `LeadFormDialog` (Sheet) **„Nowy lead”** (`lead-form-dialog.tsx` → Sheet jak `employee-form-dialog`).
- **`DataTable`**: `onRowClick` → `/leads/[id]`; **bez** kolumny Akcje / Konwertuj / Edytuj.
- **RBAC:** `filterByScope(leads, user)`.

### Kolumny (propozycja)

| Kolumna | Źródło |
| --- | --- |
| Lead | `name` |
| Status | `status` → `Badge` + `LEAD_STATUS_LABELS` |
| Źródło | `source` → etykieta PL |
| Typ | `leadType` → etykieta lub „—” |
| Opiekun | `ownerId` → `users.displayName` |
| Utworzono | `createdAt` → `formatDatePl` |

### Filtry (P1 — jeśli czas w tasku)

- `Tabs` lub faceted filter: status (`new`, `in_progress`, `won`, `lost`).
- Minimum bez filtrów: samo wyszukiwanie + tabela.

### `Empty`

- Stan pusty — komponent `Empty`.

### Usunąć

- `LeadEditButton`, Dialog edycji z wiersza.
- Kolumna / menu „Konwertuj na szansę”.
- `handleConvert` + toast „Przejdź do lejka” z tabeli (konwersja tylko na karcie → T-17-10).

## Done when

- [ ] Lista wizualnie i behawioralnie jak pracownicy.
- [ ] Klik wiersza → `/leads/[id]` (route dodany w T-17-06 — można tymczasowo stub 404 do czasu T-17-06).
- [ ] Scope bez zmian.

## Poza zakresem

- Zawartość Sheet tworzenia (→ T-17-04).
- Karta szczegółów (→ T-17-06).
