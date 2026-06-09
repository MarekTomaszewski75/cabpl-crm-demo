# T-29-01 — Select kategorii w nagłówku kanban

**Story:** [US-29](../story.md)  
**Status:** Done

## Cel

Dodać wybór kategorii lejka w toolbarze kanban deali.

## Zakres techniczny

### `components/crm/deals-table.tsx`

- Stan `selectedPipelineCategoryId` — domyślnie `'pcat-credit'`.
- W sekcji toolbaru (widocznej gdy `viewMode === 'kanban'`):
  - `Select` z etykietą **„Kategoria produktu”**;
  - opcje z `getPipelineCategoryIds()` + `DEAL_PIPELINE_CATEGORY_LABELS`.
- Przekazać `selectedPipelineCategoryId` i `onCategoryChange` do `DealsKanbanBoard`.
- Filtrowanie `scopedDeals` przed przekazaniem do kanban: `pipelineCategoryId === selected`.

### UX

- Select umieszczony obok przełącznika Kanban/Lista (nie w trybie tabela).
- Szerokość selecta — min. mieszczenie najdłuższej etykiety („Gwarancje i akredytywy”).

## Done when

- [x] Zmiana kategorii w select przeładowuje dane kanban (inny zestaw deali).
- [x] Domyślnie wybrane: Kredyty korporacyjne.
- [x] Tryb lista nie pokazuje selecta kategorii.

## Poza zakresem

- Dynamiczne kolumny (→ T-29-02).
