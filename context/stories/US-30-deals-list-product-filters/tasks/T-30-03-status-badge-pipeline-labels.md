# T-30-03 — Badge statusu z etykietą lejka deala

**Story:** [US-30](../story.md)  
**Status:** Done  
**Zależy od:** [US-27 T-27-02](../../US-27-deal-pipeline-model/tasks/T-27-02-deal-pipeline-labels.md)

## Cel

Wyświetlać poprawną polską etykietę statusu w kontekście lejka kategorii deala.

## Zakres techniczny

### `components/crm/deal-status-badge.tsx`

- Props: `status: DealStatus`, `pipelineCategoryId: string` (wymagane).
- Etykieta: `getDealStatusLabel(status, pipelineCategoryId)`.
- Warianty: `dealStatusBadgeVariant` / `dealStatusIndicatorVariant` — przekazać `pipelineCategoryId` lub indeks kroku.

### Miejsca użycia — zaktualizować call site

- `deals-columns.tsx` — przekazać `row.original.pipelineCategoryId`.
- `deal-detail-header.tsx`, `deal-status-bar.tsx` (przygotowanie pod US-32) — jeśli kompilacja wymaga.
- `deal-kanban-card.tsx` — jeśli badge statusu jest na karcie.

## Done when

- [x] Ten sam kod statusu w różnych lejkach nie myli etykiet (np. krok 1 kredytu ≠ krok 1 faktoringu).
- [x] Lista dealów pokazuje badge z właściwą etykietą PL.

## Poza zakresem

- Pasek segmentów na karcie deala (→ US-32).
