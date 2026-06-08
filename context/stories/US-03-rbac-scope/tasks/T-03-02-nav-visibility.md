# T-03-02 — Navigation visibility by role

**Story:** [US-03](../story.md)  
**Status:** Done  
**Zależy od:** T-03-01

## Cel

Konfiguracja pozycji menu + helper `canSeeNavItem`.

## Zakres

- `lib/rbac/nav-items.ts` — lista modułów z `roles: UserRole[]`
- Dashboard tylko dla `executive` (lub executive + manager — ustal w story, domyślnie executive only per requirements)

## Done when

- [x] Helper gotowy do użycia w US-05 `CrmAppShell`
