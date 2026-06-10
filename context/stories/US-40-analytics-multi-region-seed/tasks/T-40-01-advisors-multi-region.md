# T-40-01 — Doradcy demo: Małopolska i Pomorze

**Story:** [US-40](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Dodać użytkowników-doradców w regionach poza Mazowszem, żeby operacyjne agregacje miały właścicieli rekordów.

## Zakres

### `data/users.json`

- Min. **1 doradca** per region: `malopolska`, `pomorze`.
- Pola: `id`, `displayName`, `email`, `role: "advisor"`, `roleLabelPl`, `regionId`, `scopeDescriptionPl`.
- Idempotencja: unikalne `id` (np. `user-kasia`, `user-tomek`).

### `lib/data/seed.ts`

- Upewnić się, że nowi użytkownicy są ładowani bez regresji.

## Done when

- [x] ≥ 2 nowych doradców w seedzie (po 1 na region).
- [x] Login picker / lista użytkowników — nowe konta widoczne (opcjonalnie ukryte z prezentacji — wystarczy obecność w seedzie).
- [x] Brak duplikatów `id` / `email`.

## Poza zakresem

- Deale, leady, zadania (T-40-02).
