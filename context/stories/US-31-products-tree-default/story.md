# US-31 — Produkty: drzewo domyślne i filtry faceted per widok

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-19 (produkty), US-27 (katalog rozszerzony)  
**Specyfikacja:** [products-deal-pipelines-spec.md §7](../../products-deal-pipelines-spec.md)

## Jako

doradca / menedżer produktu (demo)

## Chcę

otwierać **Produkty** na **drzewie kategorii** z filtrami dopasowanymi do wybranej kategorii, a listę traktować jako widok uzupełniający

## Aby

narracja demo odzwierciedlała strukturę linii produktowych banku korporacyjnego

## Zakres

### W zakresie

- `products-table.tsx`:
  - domyślny `viewMode`: **`"tree"`** (było `"list"`).
  - przycisk Drzewo wizualnie primary gdy aktywny (jak kanban w US-25).
- **Widok drzewo:**
  - panel „Kategorie” po lewej — bez zmian layoutu US-19;
  - filtry faceted w prawej części: Aktywność, Dostępność, Typ produktu, Stan, Cena (`priceKind`) — **bez** filtra Kategoria (kategoria z panelu);
  - wybór `pcat-leasing` (grupa) — pokaż produkty z podkategorii `pcat-leasing-op` + `pcat-factoring` (agregacja dzieci).
- **Widok lista:**
  - usunąć `Select` „Wszystkie kategorie…”;
  - dodać **`DataTableFacetedFilter` Kategoria** — wielokrotny wybór (liście + opcjonalnie korzenie);
  - pozostałe filtry faceted jak w drzewie;
  - opcjonalna kolumna **Kategoria** w tabeli (P1 w spec — zrobić jeśli niski koszt).
- Wyszukiwanie tekstowe — bez zmian semantyki (`filterProducts`).
- Tag „Aktywne produkty” — bez zmian.

### Poza zakresem

- Karta produktu `/products/[id]`.
- CRUD kategorii.
- Powiązanie produktów z dealami w UI produktów (tylko dane w seedzie).

## Kryteria akceptacji (story)

- [x] `/products` otwiera się na widoku drzewa.
- [x] W drzewie: wybór kategorii + faceted filtrują produkty w tej kategorii (lub dzieciach grupy).
- [x] W liście: faceted Kategoria zamiast dropdownu; wszystkie produkty gdy brak filtra kategorii.
- [x] Przełącznik Lista/Drzewo działa bez regresji paginacji i empty state.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-31-01](./tasks/T-31-01-default-tree-view.md) | Done | — |
| [T-31-02](./tasks/T-31-02-tree-faceted-filters.md) | Done | T-31-01 |
| [T-31-03](./tasks/T-31-03-list-category-faceted-filter.md) | Done | T-31-01 |

## Kolejność implementacji (agent)

1. T-31-01 → T-31-02 ∥ T-31-03

## Wpływ na dokumentację

[`reuse-and-conventions.md`](../../reuse-and-conventions.md) — sekcja Products module.
