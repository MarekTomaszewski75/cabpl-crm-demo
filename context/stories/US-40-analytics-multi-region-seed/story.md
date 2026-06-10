# US-40 — Analityka: seed multi-region

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-02, US-20, US-28  
**Źródło:** [`analytics-roles-rebuild-spec.md`](../../analytics-roles-rebuild-spec.md) §6.3

## Jako

agent implementujący widoki analityki zarządu

## Chcę

mieć operacyjne dane demo (leady, deale, zadania) poza regionem Mazowsze

## Aby

wykresy porównawcze regionów i scorecard zarządu nie opierały się wyłącznie na `kpi.json`, a operacyjne agregacje miały sensowne liczby

## Zakres

### W zakresie

- Doradcy demo w regionach **Małopolska** i **Pomorze** (`users.json`).
- Min. **3–5** rekordów `deals` / `leads` / `tasks` per region (spójne `regionId`, `ownerId`).
- Opcjonalnie spotkania w `meetings.json` dla nowych doradców.
- Walidacja seedu w `DemoDataContext` / `seed.ts` bez regresji RBAC.

### Poza zakresem

- Pełna symetria portfela względem Mazowsza.
- Plan per doradca w seedzie (split w metrykach — US-36).
- Nowe regiony poza trzema z `kpi.json`.

## Kryteria akceptacji (story)

- [x] `users.json` zawiera doradców z `regionId`: `malopolska`, `pomorze`.
- [x] `deals.json` / `leads.json` / `tasks.json` — rekordy z tymi regionami i poprawnymi `ownerId`.
- [x] `filterByScope` — executive widzi wszystkie regiony; menedżer Mazowsze — bez zmian.
- [x] `npm run dev` — brak błędów walidacji seedu.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-40-01](./tasks/T-40-01-advisors-multi-region.md) | Done | — |
| [T-40-02](./tasks/T-40-02-operational-seed-multi-region.md) | Done | T-40-01 |

## Kolejność implementacji (agent)

1. T-40-01 → T-40-02
