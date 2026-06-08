# T-19-03 — Shell strony produktów (nagłówek jak leady/deale)

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-02](./T-19-02-demo-data-product-crud.md)

## Cel

Zastąpić `ModulePlaceholder` na `/products` szkieletem strony zgodnym z **Leady** / **Deale** — nagłówek, CTA, wyszukiwanie, przełącznik widoków; tabela jako placeholder do T-19-04.

## Zakres techniczny

### Pliki

- `app/(dashboard)/products/page.tsx` — import `ProductsTable` lub `ProductsView`.
- `components/crm/products-table.tsx` (lub `products-view.tsx`) — nowy, client component.

### Nagłówek (jak `leads-table.tsx` / `deals-table.tsx`)

- `Card size="sm"` lub układ dwóch kart — spójny z leadami:
  - **Tytuł:** „Produkty” + ikona `Settings` (disabled, tooltip „Etap 1”).
  - **CTA:** `ProductFormDialog` trigger **„+ Dodaj”** (Sheet — treść w T-19-07; na razie trigger + pusty Sheet lub disabled).
  - **`InputGroup`** wyszukiwanie — placeholder „Szukaj” (stan lokalny `searchQuery`).
  - **Tag filtra:** `Badge` / removable chip **„Aktywne produkty”** (domyślnie włączony; usunięcie = pokaż wszystkie aktywności).
  - **„Filtry”** — przycisk z ikoną (wizualnie jak screen; logika filtrów → T-19-06).

### Przełącznik widoków

- `ToggleGroup` lub para `Button` z ikonami:
  - **Lista** (`Rows2` / `LayoutList`) — domyślny.
  - **Drzewo kategorii** (`FolderTree` / `LayoutGrid`).
- Stan: `viewMode: "list" | "tree"` w komponencie nadrzędnym.

### Usunąć

- `ModulePlaceholder` z route produktów.

## Done when

- [x] `/products` renderuje nowy layout (nie placeholder).
- [x] Nagłówek wizualnie spójny z `/leads` (tytuł, szukaj, Dodaj, przełącznik widoków).
- [x] Przełącznik zmienia `viewMode` (layout drzewa — szkielet w T-19-05).
- [x] Breadcrumb / sidebar „Produkty” bez regresji.

## Poza zakresem

- Kolumny i dane w tabeli (→ T-19-04).
- Pełna treść Sheet (→ T-19-07).
- Dropdowny filtrów (→ T-19-06).
