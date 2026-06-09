# T-30-02 — Faceted filters zamiast tabs statusowych

**Story:** [US-30](../story.md)  
**Status:** Done  
**Zależy od:** [T-30-01](./T-30-01-deals-columns-category-product.md)

## Cel

Zastąpić zakładki statusów filtrami faceted — kategoria i status.

## Zakres techniczny

### `components/crm/deals-table.tsx`

**Usunąć:**

- `statusTab` state, `Tabs` / `TabsList` / `TabsTrigger` dla statusów.
- `filterByStatusTab`.

**Dodać:**

- `categoryFilters: string[]` — faceted po `pipelineCategoryId` (wartości = id, etykiety = nazwy PL).
- `statusFilters: string[]` — faceted po `deal.status` (wartości = kod statusu, etykiety z `getAllDealStatusFilterOptions()`).
- Dwa komponenty `DataTableFacetedFilter` w toolbarze trybu **table** (obok istniejących Źródło / Typ / Opiekun).

**Logika filtrowania (`applyDealListFilters` lub osobna funkcja):**

- Kategoria: jeśli `categoryFilters.length > 0` → `pipelineCategoryId` ∈ wybrane.
- Status: jeśli `statusFilters.length > 0` → `status` ∈ wybrane.
- AND z pozostałymi filtrami i `searchQuery`.

**Kanban:**

- Nie stosować `categoryFilters` / `statusFilters` z listy do kanban (kanban ma własny select kategorii US-29); wspólny `searchQuery` — opcjonalnie zachować.

### Kolumny tabeli dla filtrów

- Ukryte kolumny filtrów (`id: 'pipelineCategoryId'`, `id: 'dealStatus'`) jeśli wymagane przez `DataTableFacetedFilter` — wzorzec jak w `leads-table` / `products-table`.

## Done when

- [x] W trybie lista nie ma tabs statusowych.
- [x] Filtr Kategoria zawęża wiersze do wybranych linii produktowych.
- [x] Filtr Status zawęża do wybranych etapów (etykiety PL czytelne).
- [x] Łączenie filtrów + wyszukiwanie działa (AND).
- [x] Przełączenie kanban ↔ lista nie psuje stanu (filtry listy nie psują kanban).

## Poza zakresem

- Grupowanie opcji statusu per kategoria w UI filtra (P1).
