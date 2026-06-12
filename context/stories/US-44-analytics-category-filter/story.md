# US-44 — Analityka: filtr kategorii i UX widżetów

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-36, US-37, US-38, US-27  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §3, §9

## Jako

menedżer regionalny / zarząd (demo)

## Chcę

filtrować panele analityczne po **kategorii produktowej** oraz nie widzieć mylących elementów UI bez funkcji

## Aby

analizować wyniki per linia produktowa (kredyt, faktoring, …) i unikać wrażenia niedokończonego interfejsu

## Zakres

### W zakresie

- Rozszerzenie `AnalyticsGlobalFilters` o `pipelineCategoryId: string | null`.
- Filtr w `AnalyticsFiltersBar` — widoczny dla `regional_manager` i `executive`.
- Propagacja filtra w `lib/analytics/metrics.ts` (`scopedDeals` / powiązane agregacje).
- Usunięcie przycisku `MoreHorizontalIcon` z `analytics-widget.tsx`.

### Poza zakresem

- Filtr po pojedynczym `productId`.
- Zapisywanie filtrów w URL.

## Kryteria akceptacji (story)

- [x] Menedżer i zarząd mogą zawęzić panel do jednej kategorii produktowej.
- [x] Widżety na siatce respektują filtr kategorii.
- [x] Karty widżetów bez ikony „…”.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-44-01](./tasks/T-44-01-analytics-category-filter-metrics.md) | Done | — |
| [T-44-02](./tasks/T-44-02-analytics-filters-bar-category.md) | Done | T-44-01 |
| [T-44-03](./tasks/T-44-03-remove-widget-menu-dots.md) | Done | — |

## Kolejność implementacji (agent)

1. T-44-01 → T-44-02  
2. T-44-03 (równolegle z T-44-01)
