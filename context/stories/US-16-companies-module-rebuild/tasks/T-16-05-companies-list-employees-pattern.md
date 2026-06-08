# T-16-05 — Lista firm wzorowana na pracownikach

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-03](./T-16-03-demo-data-company-crud.md)

## Cel

Przebudować `/clients` tak, aby UX listy był **spójny z `/employees`** ([`reuse-and-conventions.md`](../../../reuse-and-conventions.md) § Wzorce modułu CRM).

## Zakres techniczny

### `clients-table.tsx` + `clients-columns.tsx`

- **Karta filtrów** `Card size="sm"`:
  - tytuł „Firmy”;
  - `InputGroup` + ikona wyszukiwania (nazwa, e-mail, telefon, opiekun — przez `_filter` / kolumnę filtra);
  - przycisk CTA → `CompanyFormDialog` (Sheet) **„Nowa firma”** (nazwa pliku: `company-form-dialog.tsx` lub alias przy refactorze).
- **`DataTable`**: `onRowClick` → `/clients/[id]`; **bez** kolumny Akcje / Edytuj.
- **RBAC:** `filterByScope(clients, user)` — bez zmian zasady.

### Kolumny (propozycja)

| Kolumna | Źródło |
| --- | --- |
| Firma | `name` |
| Typ | `companyType` → etykieta PL |
| Źródło | `source` → etykieta PL |
| Opiekun | `ownerId` → `users.displayName` |
| Ostatnia aktywność | `lastActivityAt` → `formatDatePl` |

- Usunąć z widoku domyślnego (lub ukryć w menu kolumn): NIP, segment — opcjonalnie dostępne w „Kolumny” dla demo bankowego.

### Filtry (P1 w tym tasku — jeśli czas)

- `Tabs` lub `DataTableFacetedFilter`: typ firmy, źródło (jak status/dział u pracowników).
- Jeśli brak czasu: jeden task follow-up — w story zostaje P1; minimum: wyszukiwanie + tabela.

### `Empty`

- Stan pusty po filtrach — komponent `Empty`, nie własny markup.

### Usunąć / nie używać

- `filterPlaceholder` w toolbarze DataTable jako **jedyne** wyszukiwanie (przenieść do `InputGroup` jak pracownicy).

## Done when

- [ ] Lista wizualnie i behawioralnie jak pracownicy (karta + search + Sheet trigger + row click).
- [ ] Scope: użytkownik widzi tylko swoje firmy (jak dziś).
- [ ] Klik wiersza otwiera kartę firmy.

## Poza zakresem

- Zawartość Sheet tworzenia (→ T-16-06).
