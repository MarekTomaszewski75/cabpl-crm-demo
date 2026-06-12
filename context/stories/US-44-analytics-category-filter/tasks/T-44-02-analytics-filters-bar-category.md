# T-44-02 — Pasek filtrów: kategoria produktowa

**Story:** [US-44](../story.md)  
**Status:** Done  
**Zależy od:** [T-44-01](./T-44-01-analytics-category-filter-metrics.md)

## Cel

Dodać Select kategorii produktowej do `AnalyticsFiltersBar`.

## Zakres

- `analytics-filters-bar.tsx`: nowy `Select` z etykietami z `DEAL_PIPELINE_CATEGORY_LABELS`.
- Opcja **Wszystkie kategorie** (`null`).
- Widoczność: `regional_manager`, `executive` — nie `advisor`.
- Współpraca z filtrami: okres, doradca, region, segment.

## Done when

- [x] Menedżer i zarząd widzą i używają filtra kategorii.
- [x] Zmiana filtra odświeża widżety na panelu.

## Poza zakresem

- Faceted multi-select kategorii.
