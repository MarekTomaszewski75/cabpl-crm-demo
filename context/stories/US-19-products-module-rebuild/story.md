# US-19 — Produkty: katalog z listą i drzewem kategorii (Uspacy-style)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-05, US-14 (stub `/products`), US-17 / US-18 (wzorzec nagłówka listy, Sheet tworzenia)  
**Zastępuje / rozszerza:** [US-14](../US-14-sidebar-uspacy-navigation/story.md) — stub `ModulePlaceholder` na `/products` → pełny moduł katalogu.  
**Inspiracja:** załączone screeny Uspacy (Produkty); wzorzec nagłówka i CTA: **Leady** / **Deale**; wzorzec tabeli: **DataTable** + filtry jak `/employees` / `/leads`.

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

przeglądać katalog produktów bankowych korporacyjnych w dwóch widokach (lista i drzewo kategorii), filtrować i wyszukiwać jak w Uspacy, oraz dodawać nowy produkt z poziomu listy przez panel boczny (Sheet)

## Aby

pokazać moduł **Produkty** (`/products`) jako realny katalog linii produktowych BK na prezentacji — bez backendu, w designie CA; przygotować grunt pod przyszłe powiązanie z zakładką Produkty na dealu (US-18 stub)

## Zakres

### W zakresie

- **Nowy model danych:** `Product`, `ProductCategory` + enumy; seed `data/products.json`, `data/product-categories.json`; etykiety PL (`product-labels.ts`).
- **Zastąpienie stubu** `/products` — pełna strona listy (nie `ModulePlaceholder`).
- **Nagłówek strony** — wzorzec jak `/leads` / `/pipeline`:
  - tytuł „Produkty” + ikona ustawień (stub / disabled + tooltip „Etap 1”);
  - przycisk **„+ Dodaj”** → Sheet „Nowy produkt”;
  - pasek wyszukiwania z **przypiętym filtrem** (domyślnie tag „Aktywne produkty”, usuwalny);
  - przycisk **„Filtry”** (otwiera panel / rozwija sekcję filtrów — demo: wystarczy widoczny pasek dropdownów jak na screenie).
- **Przełącznik widoków** (dwa tryby):
  1. **Lista** — dropdown kategorii „Wszystkie kategorie…” nad tabelą; tabela na pełnej szerokości.
  2. **Drzewo kategorii** — lewy panel „Kategorie” (lista / drzewo płaskie z `parentId`); prawa kolumna — ta sama tabela, przefiltrowana po wybranej kategorii (w tym „Wszystkie kategorie”).
- **Pasek filtrów szybkich** (dropdowny jak na screenie): **Aktywność**, **Dostępność**, **Cena**, **Typ produktu**, **Stan** — filtrują dane klient-side na liście.
- **Tabela produktów** (`DataTable`): kolumny ze screena (PL):
  - **Towar/Usługa** (`goodsOrService`)
  - **Artykuł** (`name` + opcjonalnie kod/SKU w drugiej linii)
  - **Cena** (`price` + `currency` + `priceKind`)
  - **Dostępność** (`availability`)
  - **Stan** (`condition`)
  - checkbox zaznaczenia wiersza (bulk selection — demo: UI + stan lokalny, bez akcji masowych).
- **Paginacja** — reuse `DataTablePagination` („Wierszy na stronie”, licznik rekordów).
- **Empty state** — komponent `Empty` z komunikatem jak na screenie (*„Teraz jest tu pusto…”*) + CTA do Sheet.
- **Tworzenie (Sheet):** pola z tabeli poniżej; po zapisie — toast, zamknięcie Sheet, produkt widoczny na liście (bez karty szczegółów w tej story).
- **RBAC:** katalog produktów **bez** `filterByScope` (jak pracownicy — wspólny katalog BK); pola `ownerId` / `regionId` na encji dla spójności architektury i przyszłego scope.
- **CRUD w sesji:** `addProduct`, `updateProduct` w `DemoDataContext` (edycja z listy — P2; minimum: create + read).

### Poza zakresem

- **Karta produktu** `/products/[id]` — osobna story (klik wiersza w Etap 1: brak nawigacji lub toast „Karta — następny etap”).
- **Powiązanie produktów z dealem** — zakładka Produkty na `/pipeline/[id]` pozostaje stub (US-18).
- **Akcje masowe** na zaznaczonych wierszach (usuń, eksport, zmiana kategorii).
- **Konfiguracja kolumn** (ikona koła zębatego w nagłówku tabeli) — stub disabled.
- **Zapisane widoki filtrów** (pin + licznik „0” + link) — tylko jeden domyślny tag „Aktywne produkty”.
- **Import / eksport**, cenniki wielowalutowe poza PLN/EUR demo, workflow zatwierdzania produktu.
- **Route Handlers**, baza danych.

## Model danych

### Kategoria (`ProductCategory`)

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `id` | `string` | np. `pcat-credit` |
| `name` | `string` | PL, np. „Kredyty korporacyjne” |
| `parentId` | `string \| null` | `null` = korzeń; demo: 1 poziom zagnieżdżenia wystarczy |
| `sortOrder` | `number` | kolejność w panelu Kategorie |

### Produkt (`Product`)

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `id` | `string` | `createNextProductId()` |
| `name` | `string` | wymagane — **Artykuł** |
| `sku` | `string` | opcjonalne — kod produktu BK |
| `goodsOrService` | `ProductGoodsOrService` | **Towar/Usługa** |
| `categoryId` | `string` | → `ProductCategory.id` |
| `price` | `number \| null` | opcjonalne |
| `currency` | `ProductCurrency` | domyślnie `PLN` |
| `priceKind` | `ProductPriceKind` | stała / od / % — pod etykietę Cena |
| `availability` | `ProductAvailability` | **Dostępność** |
| `productType` | `ProductType` | **Typ produktu** (filtr) |
| `condition` | `ProductCondition` | **Stan** (filtr + kolumna) |
| `isActive` | `boolean` | **Aktywność** — domyślnie `true`; filtr „Aktywne produkty” |
| `description` | `string` | opcjonalne; tylko w Sheet |
| `ownerId` | `string` | z sesji przy tworzeniu |
| `regionId` | `string` | z sesji przy tworzeniu |
| `createdAt` | `string` | ISO |

### Enum: Towar/Usługa (`ProductGoodsOrService`)

`goods` · `service`

Etykiety PL: **Towar**, **Usługa**. *(W kontekście BK: np. usługa = faktoring, „towar” = pakiet produktowy — dopuszczalne uproszczenie demo.)*

### Enum: Aktywność (filtr)

Logiczne pole `isActive`: **Aktywny** / **Nieaktywny** (etykiety PL).

### Enum: Dostępność (`ProductAvailability`)

`available` · `limited` · `on_request` · `unavailable`

Etykiety PL: **Dostępny**, **Ograniczona**, **Na zapytanie**, **Niedostępny**.

### Enum: Cena — filtr (`ProductPriceKind`)

`fixed` · `from` · `percent` · `free`

Etykiety PL: **Stała**, **Od**, **Procent**, **Bez opłaty** — filtr „Cena” grupuje po `priceKind`; wyświetlanie w kolumnie: np. „od 0,5%”, „1 200 PLN”.

### Enum: Typ produktu (`ProductType`)

`credit` · `deposit` · `leasing` · `factoring` · `guarantee` · `payment` · `other`

Etykiety PL: **Kredyt**, **Depozyt**, **Leasing**, **Faktoring**, **Gwarancja**, **Płatności**, **Inne**.

### Enum: Stan (`ProductCondition`)

`active` · `draft` · `archived`

Etykiety PL: **Aktywny**, **Szkic**, **Zarchiwizowany**.

### Enum: Waluta (`ProductCurrency`)

`PLN` · `EUR` · `USD` — jak deal.

## Seed (propozycja demo)

**Kategorie (6–8):** Wszystkie kategorie (wirtualna — `null` / brak filtra), Kredyty, Leasing i faktoring, Gwarancje i akredytywy, Rachunki i płatności, Depozyty.

**Produkty (10–15):** np. Kredyt obrotowy, Kredyt inwestycyjny, Leasing operacyjny, Faktoring pełny, Akredytywa importowa, Gwarancja bankowa, Konto firmowe Premium — rozłożone po kategoriach, mix `isActive`, `availability`, `condition`.

## Kryteria akceptacji (story)

- [x] `/products` — zamiast placeholder: nagłówek jak leady/deale + wyszukiwanie + tag „Aktywne produkty” + „+ Dodaj”.
- [x] Przełącznik **Lista** / **Drzewo kategorii** — dwa layouty jak na referencjach wizualnych.
- [x] W widoku drzewa: panel „Kategorie” po lewej; wybór kategorii filtruje tabelę.
- [x] W widoku listy: dropdown „Wszystkie kategorie…” filtruje tabelę.
- [x] Pięć dropdownów filtrów (Aktywność, Dostępność, Cena, Typ produktu, Stan) działa łącznie z wyszukiwaniem.
- [x] Tabela: kolumny Towar/Usługa, Artykuł, Cena, Dostępność, Stan; paginacja; empty state.
- [x] Sheet „Nowy produkt”: walidacja (nazwa + kategoria wymagane); toast; zapis w `DemoDataContext`.
- [x] Seed załadowany przy starcie dev; `npm run dev` — moduł działa bez regresji nawigacji.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-19-01](./tasks/T-19-01-product-types-and-seed.md) | Done | — |
| [T-19-02](./tasks/T-19-02-demo-data-product-crud.md) | Done | T-19-01 |
| [T-19-03](./tasks/T-19-03-products-list-page-shell.md) | Done | T-19-02 |
| [T-19-04](./tasks/T-19-04-products-table-and-columns.md) | Done | T-19-02, T-19-03 |
| [T-19-05](./tasks/T-19-05-category-tree-view.md) | Done | T-19-04 |
| [T-19-06](./tasks/T-19-06-products-filters-toolbar.md) | Done | T-19-04 |
| [T-19-07](./tasks/T-19-07-product-create-sheet-form.md) | Done | T-19-02, T-19-03 |

## Kolejność implementacji (agent)

1. T-19-01 → T-19-02 (dane + mutacje)  
2. T-19-03 (shell strony, zastąpienie stubu)  
3. T-19-04 (kolumny + tabela + widok lista)  
4. T-19-05 + T-19-06 (równolegle: drzewo kategorii + filtry)  
5. T-19-07 (Sheet tworzenia — może zacząć po T-19-03 jeśli formularz niezależny)

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Produkty), wpis **EXP-007** w [`demo-expansion.md`](../../demo-expansion.md), opcjonalnie krok w [`requirements.md`](../../requirements.md) §6 (doradca: katalog produktów przy ofercie).

## Referencja wizualna

| Widok | Plik |
| --- | --- |
| Lista + dropdown kategorii | [`.context/assets/products-list-view-reference.png`](../../assets/products-list-view-reference.png) |
| Drzewo kategorii + panel boczny | [`.context/assets/products-tree-view-reference.png`](../../assets/products-tree-view-reference.png) |
