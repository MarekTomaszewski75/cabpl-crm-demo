# US-29 — Kanban deali: wybór kategorii i dynamiczne kolumny

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-27, US-28, US-25 (kanban Dice UI)  
**Specyfikacja:** [products-deal-pipelines-spec.md §5](../../products-deal-pipelines-spec.md)

## Jako

doradca korporacyjny (demo)

## Chcę

w kanbanie deali **wybrać kategorię produktu** i widzieć kolumny lejka dopasowane do tej linii produktowej

## Aby

pokazać, że proces sprzedaży kredytu różni się od faktoringu czy gwarancji — na żywym DnD

## Zakres

### W zakresie

- `deals-table.tsx` / `deals-kanban-board.tsx`:
  - **`Select` „Kategoria produktu”** w nagłówku widoku kanban (nie w trybie lista).
  - Opcje: 6 kategorii lejka — etykiety z `DEAL_PIPELINE_CATEGORY_LABELS`.
  - Domyślna wartość: `pcat-credit` (spec §13 — bez `sessionStorage` w Etap 1).
- Filtrowanie deali kanban: `deal.pipelineCategoryId === selectedCategoryId` (+ `filterByScope`).
- `DealsKanbanBoard`:
  - kolumny z `getDealKanbanStatuses(selectedCategoryId)`;
  - etykiety i motywy z `getDealKanbanTheme(selectedCategoryId)`;
  - DnD → `updateDeal` z walidacją lejka;
  - drag na `won`/`lost` → `DealFinishDialog` (bez zmian flow US-18).
- `DealKanbanCard` — jedna linia z **nazwą produktu** (lookup `products` po `deal.productId`).
- Pusty stan: „Brak deali w kategorii **{nazwa}**” + CTA „+ Nowy deal”.
- Domyślny `viewMode` pozostaje `"kanban"` (US-25).

### Poza zakresem

- Lista dealów i faceted filters (→ US-30).
- Formularz nowego deala z wyborem produktu (→ US-32) — CTA może otwierać istniejący Sheet bez pola produktu do czasu US-32.
- `sessionStorage` ostatniej kategorii.

## Kryteria akceptacji (story)

- [x] Select kategorii przełącza zestaw kolumn kanban (6 różnych układów).
- [x] W kanbanie widać tylko deale wybranej kategorii.
- [x] DnD zmienia status w obrębie lejka; finalizacja na Wygrany/Utracony działa.
- [x] Karta kanban pokazuje nazwę produktu.
- [x] `/pipeline` nadal otwiera się na kanbanie.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-29-01](./tasks/T-29-01-category-select-kanban-header.md) | Done | US-28 |
| [T-29-02](./tasks/T-29-02-dynamic-kanban-columns.md) | Done | T-29-01 |
| [T-29-03](./tasks/T-29-03-kanban-card-product-line.md) | Done | T-29-02 |

## Kolejność implementacji (agent)

1. T-29-01 → T-29-02 → T-29-03

## Wpływ na dokumentację

[`requirements.md`](../../requirements.md) §6 — krok doradcy: wybór kategorii w kanban.
