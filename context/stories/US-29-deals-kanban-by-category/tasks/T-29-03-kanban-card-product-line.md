# T-29-03 — Nazwa produktu na karcie kanban deala

**Story:** [US-29](../story.md)  
**Status:** Done  
**Zależy od:** [T-29-02](./T-29-02-dynamic-kanban-columns.md)

## Cel

Pokazać na karcie kanban, z jakim produktem bankowym związany jest deal.

## Zakres techniczny

### `components/crm/deal-kanban-card.tsx`

- Lookup produktu: `products.find(p => p.id === deal.productId)`.
- Jedna linia pod tytułem deala / klientem: `text-muted-foreground text-xs` — nazwa produktu.
- Fallback gdy brak produktu (dev): „—” (nie powinno wystąpić po US-28).

### `DealsKanbanBoard`

- Przekazać `products` z `useDemoData()`.

## Done when

- [x] Karty w kanbanie pokazują np. „Kredyt obrotowy” dla deala z `prod-001`.
- [x] Brak regresji layoutu karty (US-25 engagement indicators jeśli są — zachować).

## Poza zakresem

- Kolumna produktu w tabeli (→ US-30).
