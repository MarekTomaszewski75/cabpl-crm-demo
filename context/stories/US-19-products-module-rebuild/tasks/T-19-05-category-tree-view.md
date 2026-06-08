# T-19-05 — Widok drzewa kategorii

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-04](./T-19-04-products-table-and-columns.md)

## Cel

Drugi tryb widoku — **panel „Kategorie”** po lewej + ta sama tabela po prawej, jak na referencji `products-tree-view-reference.png`.

## Zakres techniczny

### Layout (`viewMode === "tree"`)

```
┌─────────────────┬──────────────────────────────────┐
│ Kategorie       │  [filtry szybkie — T-19-06]      │
│ ─────────────── │  ┌──────────────────────────────┐  │
│ Wszystkie kat.  │  │ DataTable (reuse)            │  │
│ Kredyty         │  │                              │  │
│ Leasing…        │  └──────────────────────────────┘  │
└─────────────────┴──────────────────────────────────┘
```

- Lewy panel: `Card` lub `aside` z tytułem **„Kategorie”**.
- Lista pozycji z `productCategories` posortowana `sortOrder`.
- Pozycja **„Wszystkie kategorie”** na górze (aktywna domyślnie) — `selectedCategoryId: string | null`.
- Podświetlenie aktywnej kategorii (`bg-sidebar-primary` / token akcentu CA — jak aktywny item w sidebarze).
- Ikona folderu (`Folder` / `FolderOpen`) przy pozycjach.
- **Hierarchia:** jeśli `parentId` — wcięcie `pl-4` dla dzieci (demo: opcjonalnie 1 poziom).

### Zachowanie

- Klik kategorii → filtruje tabelę po `categoryId` (ta sama logika co dropdown w widoku lista).
- Przełączenie z listy na drzewo **zachowuje** wybraną kategorię (wspólny stan `selectedCategoryId`).
- W widoku lista dropdown kategorii **zsynchronizowany** z tym samym stanem.

### W widoku lista

- Ukryć lewy panel; pokazać dropdown kategorii (T-19-04) zamiast panelu.

## Done when

- [x] Przełącznik „drzewo” pokazuje panel Kategorie + tabelę.
- [x] Wybór kategorii filtruje produkty.
- [x] „Wszystkie kategorie” pokazuje pełną listę (z uwzględnieniem pozostałych filtrów).
- [x] Wygląd zbliżony do referencji (proporcje: wąski panel ~240–280px).

## Poza zakresem

- Drag-and-drop kategorii, CRUD kategorii z UI.
- Drzewo wielopoziomowe z expand/collapse (wystarczy płaska lista z wcięciem).
