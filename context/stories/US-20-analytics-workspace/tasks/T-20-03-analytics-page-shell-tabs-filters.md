# T-20-03 — Shell strony Analityka (zakładki + filtry)

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-01](./T-20-01-analytics-types-and-widget-registry.md)

## Cel

Przebudować `/dashboard`: nagłówek modułu, zakładki, pasek filtrów globalnych — szkielet pod siatkę widżetów.

## Zakres techniczny

### Pliki

- `app/(dashboard)/dashboard/page.tsx` — zamiana `ExecutiveDashboard` na `AnalyticsWorkspace` (lub podobnie).
- `components/crm/analytics-workspace.tsx` — client component, stan filtrów.
- `components/crm/analytics-filters-bar.tsx` — toolbar filtrów.
- `components/crm/analytics-role-guard.tsx` — rozszerzenie `ExecutiveRoleGuard`: role `executive` + `regional_manager`.

### Nagłówek

- Tytuł: **„Analityka”**.
- Podtytuł: krótki opis PL (np. „Panele operacyjne i plan sprzedaży — demo BK”).
- **Nie** kopiować pełnoekranowego fioletowego paska z referencji — layout jak inne moduły (leady, deale).

### Zakładki (`Tabs`)

| Zakładka | Zachowanie |
| --- | --- |
| **Panele** | domyślna; render siatki widżetów (placeholder do T-20-05+) |
| **Plan i cele** | placeholder → pełna treść w T-20-08 (`ExecutiveDashboard`) |
| **Raporty** | `disabled` + `Badge` „Wkrótce” |

### Pasek filtrów (tylko zakładka Panele)

- **Widok panelu** — `Select` z presetami z rejestru (T-20-01).
- **Okres** — `Select`: Bieżący miesiąc · Bieżący kwartał · YTD.
- **Opiekunowie** — `Select` „Wszyscy” + lista użytkowników doradczych z seedu (demo: single-select wystarczy; multi — nice to have).

Stan filtrów: `useState<AnalyticsGlobalFilters>` w `AnalyticsWorkspace`; przekazywany w dół do widżetów przez props / context lokalny.

### RBAC guard

- `advisor` → redirect na `/pipeline` lub `/today` + toast „Brak dostępu”.
- Aktualizacja `lib/rbac/nav-structure.ts`: `analytics.roles` → `["executive", "regional_manager"]`.

## Done when

- [ ] `/dashboard` pokazuje „Analityka” z trzema zakładkami.
- [ ] Filtry globalne widoczne na zakładce Panele i zmieniają stan.
- [ ] `regional_manager` ma dostęp; `advisor` — brak w menu + guard na trasie.
- [ ] Zakładka Raporty — disabled z „Wkrótce”.
- [ ] Breadcrumb / sidebar „Analityka” bez regresji.

## Poza zakresem

- Konkretne widżety (→ T-20-05–07).
- Treść Plan i cele (→ T-20-08).
