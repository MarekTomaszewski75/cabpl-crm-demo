# T-21-02 — Seed: terminy deali i aktywności leadów pod demo

**Story:** [US-21](../story.md)  
**Status:** Done  
**Zależy od:** T-21-01

## Cel

Upewnić się, że po zalogowaniu jako doradca demo **Anna** (lub domyślny advisor) widok „Dziś” pokazuje sensowne przykłady — nie puste sekcje.

## Zakres techniczny

### `data/opportunities.json` (deale)

- Dla co najmniej **2 deali** w scope doradcy: ustawić `expectedCloseDate` w horyzoncie 7 dni od `DEMO_TODAY_DATE_KEY` (patrz `lib/crm/demo-today.ts`).
- Statusy: `offer_submitted` lub `negotiation_started`.
- Zachować istniejące `id` — nie psuć powiązań z leadami / klientami.

### `data/lead-activities.json` (jeśli istnieje) lub Context

- Dla co najmniej **1 leada** `in_progress`: ostatnia aktywność starsza niż 7 dni lub brak aktywności.
- Dla co najmniej **1 leada** spełniającego kryteria w scope doradcy.

### Weryfikacja

- Uruchomić `getDealsRequiringAttention` / `getLeadsRequiringAttention` z danymi seed — wynik niepusty dla użytkownika demo.

## Done when

- [x] Doradca demo ma ≥1 deal i ≥1 lead w wynikach helpera T-21-01.
- [x] Istniejące `id` encji bez zmian (tylko pola dat/statusów).

## Poza zakresem

- Nowe encje (tylko korekta pól).
