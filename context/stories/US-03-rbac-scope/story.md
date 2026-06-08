# US-03 — RBAC data scope

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02

## Jako

użytkownik demo z określoną rolą

## Chcę

widzieć tylko dane przypisane do mojego zakresu (własne / region / bank)

## Aby

zademonstrować role-based access na prezentacji

## Kryteria akceptacji

- [x] `filterByScope(items, user)` w `lib/rbac/scope.ts`
- [x] `canAccessEntity(entity, user)` dla widoków szczegółów
- [x] `canSeeNavItem(id, user)` dla menu
- [x] 4 użytkowników z seed — różne liczby rekordów po zalogowaniu (`filterByScope` + seed; widok po integracji US-04+)

## Taski

| Task | Status |
|------|--------|
| [T-03-01](./tasks/T-03-01-filter-by-scope.md) | Done |
| [T-03-02](./tasks/T-03-02-nav-visibility.md) | Done |

## Odniesienia

- [`requirements.md`](../../requirements.md) §11.4
