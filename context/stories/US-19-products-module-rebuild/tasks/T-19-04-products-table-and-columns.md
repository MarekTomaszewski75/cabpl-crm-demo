# T-19-04 — Tabela produktów i widok lista

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-02](./T-19-02-demo-data-product-crud.md), [T-19-03](./T-19-03-products-list-page-shell.md)

## Cel

`DataTable` z kolumnami ze screena Uspacy + **widok lista** (dropdown kategorii nad tabelą) + empty state + paginacja.

## Zakres techniczny

### `products-columns.tsx`

| Kolumna UI | Źródło |
| --- | --- |
| (checkbox) | selekcja wiersza — `rowSelection` TanStack |
| Towar/Usługa | `goodsOrService` → etykieta PL |
| Artykuł | `name` + opcjonalnie `sku` (muted) |
| Cena | `formatProductPrice(product)` |
| Dostępność | `availability` → Badge |
| Stan | `condition` → Badge |

- Ukryta kolumna `_filter` — `createFilterSearchColumn()` (nazwa, sku, opis).
- `meta: { title }` na kolumnach.

### `products-table.tsx` — tryb `list`

- Dropdown **„Wszystkie kategorie…”** (`Select` / `Combobox`) — filtr `categoryId`; opcja „Wszystkie” = brak filtra.
- `DataTable` z `products` po filtrach kategorii + wyszukiwaniu (filtry zaawansowane → T-19-06).
- **`onRowClick`:** brak nawigacji (story: karta poza zakresem) — opcjonalnie `cursor-default` lub toast „Karta produktu — następny etap”.
- **Toolbar:** ikony kolumn (`Columns3Cog`) — reuse view options; koło w nagłówku tabeli — stub.
- **Empty:** `Empty` — tekst jak na screenie + link/przycisk otwierający Sheet Dodaj.
- **Paginacja:** domyślnie 20 wierszy.

## Done when

- [x] Tabela wypełniona seedem; kolumny zgodne ze screenem (PL).
- [x] Widok lista: dropdown kategorii filtruje wiersze.
- [x] Wyszukiwanie z nagłówka filtruje tabelę.
- [x] Empty gdy brak wyników; paginacja działa.
- [x] Checkbox zaznaczenia wierszy — stan lokalny (bez akcji bulk).

## Poza zakresem

- Panel kategorii po lewej (→ T-19-05).
- Dropdowny Aktywność/Cena/… (→ T-19-06).
- Sheet tworzenia (→ T-19-07).
