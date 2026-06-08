import type { DemoUser, ScopedEntity } from "@/types/crm"

/**
 * RBAC scope — jedna funkcja dla list i szczegółów (demo, nie produkcyjne IAM).
 *
 * Reguły:
 * - advisor: `entity.ownerId === user.id`
 * - regional_manager: `entity.regionId === user.regionId` (wymaga `user.regionId`)
 * - executive: pełny dostęp
 *
 * Przykłady na seed `data/clients.json` (28 klientów):
 * - user-anna (advisor) → 14 rekordów (m.in. client-001, 002, 005)
 * - user-piotr (advisor) → 14 rekordów (m.in. client-003, 004)
 * - user-marek (regional_manager, mazowsze) → 28 rekordów
 * - user-jan (executive) → 28 rekordów
 */

function isInScope(entity: ScopedEntity, user: DemoUser): boolean {
  switch (user.role) {
    case "executive":
      return true
    case "regional_manager":
      return user.regionId !== null && entity.regionId === user.regionId
    case "advisor":
      return entity.ownerId === user.id
    default: {
      const _exhaustive: never = user.role
      return _exhaustive
    }
  }
}

export function filterByScope<T extends ScopedEntity>(
  items: readonly T[],
  user: DemoUser,
): T[] {
  return items.filter((item) => isInScope(item, user))
}

export function canAccessEntity(
  entity: ScopedEntity,
  user: DemoUser,
): boolean {
  return isInScope(entity, user)
}
