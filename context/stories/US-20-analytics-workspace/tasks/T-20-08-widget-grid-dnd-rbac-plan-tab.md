# T-20-08 — Siatka panelu, DnD, zakładka Plan i cele

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-03](./T-20-03-analytics-page-shell-tabs-filters.md), [T-20-05](./T-20-05-kpi-count-widgets.md), [T-20-06](./T-20-06-deals-chart-widgets.md), [T-20-07](./T-20-07-tasks-team-chart-widgets.md)

## Cel

Domknąć moduł: responsywna siatka wszystkich widżetów, przeciąganie układu w sesji, zakładka Plan i cele z US-07, opcjonalne skeletony przy ładowaniu.

## Zakres techniczny

### Pliki

- `components/crm/analytics/analytics-panel-grid.tsx` — CSS grid + `@dnd-kit/core` / `SortableContext`.
- `components/crm/analytics-workspace.tsx` — integracja grid + preset + kolejność w `useState`.
- `components/crm/executive-dashboard.tsx` — użyty w zakładce Plan i cele (bez duplikacji logiki KPI).
- `components/crm/executive-role-guard.tsx` — deprecacja na rzecz `analytics-role-guard` lub alias.

### Siatka

- Kontener: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-min`.
- Mapowanie `AnalyticsWidgetSize`:
  - `1x1` → `col-span-1`
  - `2x1` → `col-span-2`
  - `1x2` → `row-span-2` *(opcjonalnie — jeśli brak widżetu 1x2, pominąć)*
- Preset zmienia **zestaw** widżetów; DnD zmienia **kolejność** w obrębie presetu (stan lokalny, reset po odświeżeniu strony — OK na demo).

### Drag and drop

- Reuse `@dnd-kit/core` jak w pipeline (US-06).
- Uchwyt: props z T-20-04 `GripVertical`.
- Bez zapisu do Context globalnego / JSON.

### Zakładka Plan i cele

- Osadzić istniejący `ExecutiveDashboard` (lub wydzielić `ExecutivePlanView` bez zmiany UX).
- Zachować filtry YTD/kwartał, region, segment z US-07.
- Tytuł wewnętrzny może zostać „Plan i realizacja” — moduł nadrzędny to Analityka.

### RBAC — domknięcie

- `nav-structure.ts`: `analytics.roles = ["executive", "regional_manager"]`.
- Helper `canViewAnalyticsWidget(definition, user)` — sprawdza `restrictedRoles`.
- Udokumentować w story ostateczną listę restricted (zaktualizować tabelę w `story.md` jeśli inna niż propozycja).

### Skeleton (nice to have)

- Przy pierwszym mount zakładki Panele: `isLoading` true przez ~300ms na widżetach — efekt jak na referencji.
- Jeśli brak czasu: pominąć bez blokowania Done.

### Cleanup

- Usunąć / zastąpić bezpośrednie wywołanie `ExecutiveDashboard` jako cała strona dashboard.
- Breadcrumb: etykieta **Analityka** (nie Panel zarządczy).

## Done when

- [ ] Preset „Sprzedaż i lejek” i „Zespół i zadania” pokazują różne zestawy widżetów.
- [ ] Przeciągnięcie widżetu zmienia kolejność do odświeżenia strony.
- [ ] Zakładka Plan i cele = funkcjonalność US-07 bez regresji.
- [ ] `executive` i `regional_manager` — pełny flow; overlay restricted działa.
- [ ] Wszystkie taski T-20-01–07 spełnione w jednym spójnym ekranie.

## Poza zakresem

- Persist layoutu w `sessionStorage`.
- Zakładka Raporty.
- Aktualizacja scenariusza §6 w requirements (osobny commit dokumentacji po Done story).
