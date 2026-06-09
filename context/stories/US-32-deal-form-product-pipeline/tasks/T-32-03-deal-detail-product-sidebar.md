# T-32-03 — Produkt i kategoria w sidebarze karty deala

**Story:** [US-32](../story.md)  
**Status:** Done  
**Zależy od:** [T-32-01](./T-32-01-deal-form-product-field.md)

## Cel

Pokazać na karcie deala powiązany produkt i kategorię; usunąć stub zakładki Produkty.

## Zakres techniczny

### `components/crm/deal-detail-sidebar.tsx`

- Pola readonly:
  - **Produkt** — `Product.name` (+ opcjonalnie SKU drugą linią);
  - **Kategoria** — `DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId]`.
- Gdy `deal.status === 'new'`: opcjonalnie edycja produktu (ten sam Combobox co w formularzu) — jeśli koszt niski; w przeciwnym razie strict readonly po `new`.

### `components/crm/deal-activity-panel.tsx` (lub tabs na karcie)

- Usunąć / ukryć stub zakładki **„Produkty”** jeśli istnieje — zostawić Notatka / Aktywność / Pliki.

## Done when

- [x] Sidebar karty deala pokazuje produkt i kategorię dla seedu US-28.
- [x] Brak mylącego pustego tabu „Produkty”.
- [x] Link do `/products` nie jest wymagany (P2).

## Poza zakresem

- Karta produktu.
