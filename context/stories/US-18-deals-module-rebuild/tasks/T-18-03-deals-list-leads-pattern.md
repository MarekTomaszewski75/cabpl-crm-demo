# T-18-03 — Lista dealów wzorowana na leadach

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-02](./T-18-02-demo-data-deal-crud.md)

## Cel

Przebudować `/pipeline` — UX listy **spójny z `/leads`**; **zastąpić** kanban US-06 na tej trasie.

## Zakres techniczny

### `deals-table.tsx` + `deals-columns.tsx` (nowe)

- **Karta filtrów** `Card size="sm"`:
  - tytuł „Deale”;
  - `InputGroup` + ikona wyszukiwania (nazwa, firma, kontakt, opiekun);
  - przycisk CTA → `DealFormDialog` (Sheet) **„Nowy deal”**.
- **`DataTable`**: `onRowClick` → `/pipeline/[id]`; **bez** kolumny Akcji / DnD / edycji w wierszu.
- **RBAC:** `filterByScope(deals, user)`.

### Kolumny (propozycja)

| Kolumna | Źródło |
| --- | --- |
| Deal | `name` |
| Status | `status` → `Badge` + `DEAL_STATUS_LABELS` |
| Kwota | `amount` + `currency` → format PL |
| Źródło | `source` → etykieta lub „—” |
| Typ | `dealType` → etykieta lub „—” |
| Opiekun | `ownerId` → `users.displayName` |
| Utworzono | `createdAt` → `formatDatePl` |

### `app/(dashboard)/pipeline/page.tsx`

- Zastąpić render `PipelineBoard` → `DealsTable`.
- Kanban (`pipeline-board.tsx`, `pipeline-column.tsx`, `pipeline-opportunity-card.tsx`, `pipeline-summary.tsx`) — nieużywany po tym tasku (fizyczne usunięcie → T-18-11).

### Filtry (P1 — jeśli czas w tasku)

- `Tabs` lub faceted filter: status workflow + terminalne (`won`, `lost`).
- Minimum: samo wyszukiwanie + tabela.

### `Empty`

- Stan pusty — komponent `Empty`.

## Done when

- [ ] Lista wizualnie i behawioralnie jak leady.
- [ ] Klik wiersza → `/pipeline/[id]` (route w T-18-06 — można tymczasowo stub).
- [ ] Brak kanban na `/pipeline`.
- [ ] Scope bez zmian.

## Poza zakresem

- Zawartość Sheet tworzenia (→ T-18-04).
- Karta szczegółów (→ T-18-06).
- Usunięcie plików kanban (→ T-18-11).
