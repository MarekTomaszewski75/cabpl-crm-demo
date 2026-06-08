# T-05-01 — CrmAppShell component

**Story:** [US-05](../story.md)  
**Status:** Done

## Cel

`components/crm/crm-app-shell.tsx` na bazie shadcn `Sidebar`.

## Zakres

- Styl z [`design-guide.md`](../../../design-guide.md) §6: **ciemny sidebar** (`--ca-shell`), **jasny main**
- Logo białe inline SVG + tytuł „CRM Korporacyjny — Demo”
- `SidebarMenu` — aktywna pozycja: akcent limonkowy
- Header: breadcrumb, avatar + `displayName` + rola, wyloguj
- `canSeeNavItem` z US-03

## Done when

- [x] Wpis `CrmAppShell` w `reuse-and-conventions.md`
- [x] Wylogowanie działa
