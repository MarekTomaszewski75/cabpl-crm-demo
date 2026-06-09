# US-30 — Lista dealów: kategoria, produkt, filtry faceted

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-27, US-28, US-18 (lista dealów)  
**Specyfikacja:** [products-deal-pipelines-spec.md §6](../../products-deal-pipelines-spec.md)

## Jako

doradca / regionalny menedżer (demo)

## Chcę

na **liście dealów** widzieć wszystkie kategorie naraz z kolumnami **Kategoria** i **Produkt** oraz filtrować przez **faceted filters** (kategoria, status)

## Aby

menedżer mógł przeszukiwać pipeline wieloproduktowy bez przełączania kanbanu per kategoria

## Zakres

### W zakresie

- `deals-columns.tsx` / `deals-table.tsx`:
  - nowe kolumny **Kategoria** (`pipelineCategoryId` → nazwa) i **Produkt** (`productId` → `Product.name`);
  - rozszerzyć `DealTableRow` o `categoryName`, `productName` (w `buildDealTableRow`).
- **Usunąć** `Tabs` statusów w trybie lista; zastąpić **`DataTableFacetedFilter`**:
  - **Kategoria produktu** — wielokrotny wybór (6 kategorii lejka);
  - **Status** — wielokrotny wybór; opcje z `getAllDealStatusFilterOptions()` (płaska lista etykiet);
  - zachować istniejące faceted: Źródło, Typ, Opiekun (gdy widoczny).
- `DealStatusBadge` — etykieta z `getDealStatusLabel(status, pipelineCategoryId)`.
- Grupowanie tabeli: dodać opcje **Kategoria** i **Produkt**.
- Tryb kanban — bez zmian z US-29 (tabs nie wracają globalnie).

### Poza zakresem

- Grupowanie statusów w filtrze po kategorii (P1 — płaska lista w Etap 1).
- Eksport / zapisane widoki filtrów.
- Zmiana kolumn na kanbanie.

## Kryteria akceptacji (story)

- [x] Lista pokazuje deale ze wszystkich kategorii jednocześnie.
- [x] Kolumny Kategoria i Produkt wypełnione dla każdego wiersza.
- [x] Brak tabs statusowych; filtry Kategoria + Status działają jako faceted (AND z wyszukiwaniem).
- [x] Badge statusu pokazuje etykietę z właściwego lejka deala.
- [x] Grupowanie po kategorii / produkcie działa.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-30-01](./tasks/T-30-01-deals-columns-category-product.md) | Done | US-28 |
| [T-30-02](./tasks/T-30-02-faceted-filters-replace-tabs.md) | Done | T-30-01 |
| [T-30-03](./tasks/T-30-03-status-badge-pipeline-labels.md) | Done | US-27 T-27-02 |

## Kolejność implementacji (agent)

1. T-30-01 + T-30-03 (równolegle) → T-30-02

## Wpływ na dokumentację

[`reuse-and-conventions.md`](../../reuse-and-conventions.md) — sekcja Deals module (lista + faceted).
