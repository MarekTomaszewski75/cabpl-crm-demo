# T-03-01 — filterByScope & canAccessEntity

**Story:** [US-03](../story.md)  
**Status:** Done

## Cel

Centralna logika RBAC bez duplikacji w stronach.

## Reguły (przykład)

| Rola | Zakres |
|------|--------|
| `advisor` | `entity.ownerId === user.id` |
| `regional_manager` | `entity.regionId === user.regionId` |
| `executive` | wszystko |

## Zakres

- `lib/rbac/scope.ts`
- Generyczne `filterByScope<T extends ScopedEntity>(items, user)`
- `canAccessEntity(entity, user): boolean`

## Done when

- [x] Unit-test ręczny lub krótki komentarz w pliku z przykładami
- [x] Wpis w `reuse-and-conventions.md`
