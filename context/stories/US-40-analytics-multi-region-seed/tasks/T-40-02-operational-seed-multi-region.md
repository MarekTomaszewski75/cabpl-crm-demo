# T-40-02 — Seed operacyjny: deale, leady, zadania multi-region

**Story:** [US-40](../story.md)  
**Status:** Done  
**Zależy od:** T-40-01

## Cel

Uzupełnić seed operacyjny o rekordy w Małopolskie i Pomorze — min. 3–5 per typ encji i region.

## Zakres

### Pliki seed

| Plik | Wymagania |
| --- | --- |
| `data/opportunities.json` (deale) | `regionId`, `ownerId` nowych doradców; mix statusów (otwarte + kilka `won`); `productId` / `pipelineCategoryId` zgodne z US-28 |
| `data/leads.json` | `regionId`, `ownerId`; mix statusów |
| `data/tasks.json` | `ownerId` doradców regionalnych; kilka po terminie dla wiarygodności |
| `data/meetings.json` | opcjonalnie — kilka spotkań per nowy region |

### Spójność

- `ownerId` → istniejący user z tym samym `regionId`.
- Daty względem `DEMO_REFERENCE_DATE` (`lib/analytics/filters.ts`).
- Kwoty PLN realistyczne (rzędu setek tys. – kilku mln).

## Done when

- [x] ≥ 3 deale per region (`malopolska`, `pomorze`) — łącznie z Mazowszem executive ma ≥ 3 regiony na wykresach operacyjnych.
- [x] ≥ 3 leady per region poza Mazowszem.
- [x] Zadania przypisane do właściwych `ownerId`.
- [x] `npm run dev` — seed ładuje się bez błędów walidacji.

## Poza zakresem

- Klienci w nowych regionach (opcjonalnie — deal może wskazywać istniejącego klienta z Mazowsza tylko jeśli model na to pozwala; preferowane: nowe lub reuse z poprawnym `regionId` na kliencie).
