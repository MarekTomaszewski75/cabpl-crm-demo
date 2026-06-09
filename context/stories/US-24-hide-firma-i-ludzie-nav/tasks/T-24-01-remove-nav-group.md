# T-24-01 — Usunięcie grupy „Firma i ludzie” z sidebara

**Story:** [US-24](../story.md)  
**Status:** Done

## Cel

Ukryć moduły administracyjne z widocznej nawigacji — bez usuwania tras i danych.

## Zakres techniczny

### `lib/rbac/nav-structure.ts`

- Usunąć wpis grupy `Firma i ludzie` z `CRM_NAV_STRUCTURE`.
- **Zachować** `defineNavItem` dla `employees` i `companyStructure` (breadcrumb / `getNavItemByHref` / dev URL).
- Kolejność po zmianie: Dziś → Zadania → CRM i sprzedaż → Analityka (bez pustej grupy).

### Weryfikacja UI

- `CrmSidebarNav` — brak grupy; footer (Kalendarz, Zgodność) bez regresji.
- `/employees`, `/company-structure` — strony nadal renderują się przy bezpośrednim URL.

### Formularze

- Smoke: formularz deala / firmy — select opiekuna / działu nadal pobiera dane z Context.

## Done when

- [x] Sidebar bez grupy „Firma i ludzie” dla wszystkich ról.
- [x] Pozostałe pozycje menu bez regresji.
- [x] Trasy admin nadal działają po URL.

## Poza zakresem

- Global search (→ T-24-02).
