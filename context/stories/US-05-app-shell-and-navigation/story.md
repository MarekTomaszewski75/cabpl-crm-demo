# US-05 — App shell & navigation

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-03, US-04

## Jako

zalogowany użytkownik CRM

## Chcę

nawigować między modułami w układzie enterprise (sidebar + header)

## Aby

demo wyglądało jak produkt bankowy, nie jak pojedynczy ekran

## Kryteria akceptacji

- [x] `CrmAppShell` — sidebar, header (breadcrumb, user, logout)
- [x] Menu filtrowane przez RBAC
- [x] `(dashboard)/page.tsx` — redirect wg roli (executive → `/dashboard`, advisor → `/pipeline`, …)
- [x] Placeholder routes dla modułów (puste strony OK przed US-06+)

## Taski

| Task | Status |
|------|--------|
| [T-05-01](./tasks/T-05-01-crm-app-shell.md) | Done |
| [T-05-02](./tasks/T-05-02-routes-and-redirects.md) | Done |
