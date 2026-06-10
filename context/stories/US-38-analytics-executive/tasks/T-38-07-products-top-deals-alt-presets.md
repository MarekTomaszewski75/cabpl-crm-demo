# T-38-07 — Widżety produktów, top deale + presety alternatywne

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01

## Cel

Dokończyć preset **Portfel banku** i skonfigurować presety **Regiony** oraz **Produkty i lejki**.

## Zakres

### Widżet produktowy

- `components/crm/analytics/widgets/product-category-won-widget.tsx`
- `product-category-won`, `kind: "bar_chart"`, stacked lub grouped, `size: "2x1"`, tag **Deale**
- `getProductCategoryWonRows` — etykiety kategorii z `deal-pipeline` / produktów.

### Widżet leady vs wygrane

- `components/crm/analytics/widgets/leads-vs-won-line-widget.tsx`
- `leads-vs-won-line`, `kind: "line_chart"`, `size: "2x1"` — 2 serie wolumenowe miesięczne.

### Tabela top dealów

- `components/crm/analytics/widgets/top-open-deals-table-widget.tsx`
- `top-open-deals-table`, `kind: "table"`, `size: "2x1"`
- `getTopOpenDealsRows(..., limit: 10)` — linki `/pipeline/[id]`.

### Presety alternatywne

| Preset | Zestaw |
| --- | --- |
| **Regiony** | region bar + radar + scorecard + radial KPI regionu (po filtrze) |
| **Produkty i lejki** | product bar + deal funnel + won-by-source + avg deal value + top deals |

## Done when

- [ ] Preset **Portfel banku** — wszystkie sloty wypełnione (nie stub).
- [ ] 3 presety executive przełączalne.
- [ ] Top deals — sort kwota malejąco, max 10 wierszy.
