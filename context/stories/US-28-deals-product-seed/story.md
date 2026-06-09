# US-28 — Seed dealów: produkt, kategoria lejka, nowe statusy

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-27  
**Specyfikacja:** [products-deal-pipelines-spec.md §4.4–4.5](../../products-deal-pipelines-spec.md)

## Jako

doradca / menedżer (demo)

## Chcę

żeby **każdy deal w demo** był powiązany z produktem bankowym i miał status z właściwego lejka kategorii

## Aby

kanban, lista i karta deala pokazywały spójną narrację sprzedaży produktów BK

## Zakres

### W zakresie

- Migracja `data/opportunities.json` do formatu US-18 z polami:
  - `name`, `status` (nowe kody lejka), `productId`, `pipelineCategoryId`
  - zachować `clientId`, `amount`, `expectedCloseDate`, `probability`, `ownerId`, `regionId`
- Mapowanie tytułów dealów → `productId` wg tabeli §4.4 spec (+ uzupełnienie dla wszystkich rekordów).
- Mapowanie starych statusów US-18 → nowe przez `mapLegacyDealStatus` per kategoria.
- Aktualizacja `lib/data/seed.ts` — `normalizeDeals` obsługuje nowe pola; legacy `stage`/`title` tylko jako fallback dev.
- Rozkład seedu: min. **2 deale** na każdą z 6 kategorii lejka w scope `user-anna`.
- Aktualizacja reguł demo zależnych od statusów deala:
  - `lib/crm/today-pipeline-summary.ts` — „ostatnie etapy” = przedostatni krok workflow w lejku deala
  - `lib/crm/banner-rules.ts` — krytyczny deal (jeśli oparty na statusie)
  - `lib/crm/notification-rules.ts` — reguły statusowe deala
- `DemoDataContext`: `addDeal` / `updateDeal` walidują `status` względem `pipelineCategoryId`.

### Poza zakresem

- UI kanban / lista (→ US-29, US-30).
- Formularz wyboru produktu (→ US-32).
- Zmiana analityki / dashboardu.

## Kryteria akceptacji (story)

- [x] 100% dealów w seedzie ma `productId` + `pipelineCategoryId` — brak rekordów legacy bez produktu.
- [x] Każdy `status` jest dozwolony w lejku przypisanej kategorii.
- [x] Min. 2 deale per kategoria lejka w seedzie (scope prezentacji).
- [x] `/today` (US-21) nadal pokazuje deale wymagające uwagi po migracji statusów.
- [x] Powiadomienia i banner dealowe działają bez regresji (smoke).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-28-01](./tasks/T-28-01-migrate-opportunities-json.md) | Done | US-27 T-27-01 |
| [T-28-02](./tasks/T-28-02-seed-normalize-and-context.md) | Done | T-28-01 |
| [T-28-03](./tasks/T-28-03-update-demo-rules.md) | Done | T-28-01 |

## Kolejność implementacji (agent)

1. T-28-01 → T-28-02 → T-28-03

## Wpływ na dokumentację

Aktualizacja [`products-deal-pipelines-spec.md`](../../products-deal-pipelines-spec.md) §13 — zamknięcie pytania #3 (brak dealów bez produktu).
