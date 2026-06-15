# T-48-04 — Nawigacja sidebar: Kontakty

**Story:** [US-48](../story.md)  
**Status:** Done  
**Zależy od:** [T-48-03](./T-48-03-contacts-table-page.md)

## Cel

Widoczna pozycja **Kontakty** dla doradcy i menedżera w strukturze nawigacji prezentacji.

## Zakres

### `lib/rbac/nav-structure.ts`

- `contacts` nav item: `roles: ["advisor", "regional_manager"]` (usunąć `executive` z `ALL_ROLES` dla tej pozycji).
- Dodać `contacts` do grupy **„CRM i sprzedaż”** w `CRM_NAV_STRUCTURE`:
  - kolejność: `leads`, `pipeline`, **`contacts`**, `clients`, `products`.
- Eksport stałej `contacts` jeśli potrzebna (jak `leads`, `pipeline`).

### Wyszukiwarka globalna (jeśli dotyczy)

- [`lib/crm/global-search-items.ts`](../../../../lib/crm/global-search-items.ts) — upewnić się, że `/contacts` jest w scope tylko dla ról z dostępem (opcjonalny follow-up).

### Breadcrumb

- `getNavItemByHref('/contacts')` — już działa przez `CRM_NAV_ITEMS`; zweryfikować po zmianie ról.

## Done when

- [ ] Anna i Marek widzą „Kontakty” w sidebarze w grupie CRM.
- [ ] Jan (executive) nie widzi pozycji.
- [ ] Klik prowadzi do `/contacts`.

## Poza zakresem

- Zmiana kolejności innych modułów poza wstawieniem Kontakty.
