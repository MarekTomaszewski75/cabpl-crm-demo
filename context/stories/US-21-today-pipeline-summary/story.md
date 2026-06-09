# US-21 — Widok „Dziś”: podsumowanie deali i leadów

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-13 (widok `/today`), US-17 (leady), US-18 (deale), US-03 (RBAC)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §1](../../crm-specialists-feedback-spec.md#1-widok-dziś--podsumowanie-deali-i-leadów)

## Jako

doradca korporacyjny (demo)

## Chcę

na ekranie **Dziś** widzieć skrót **deali i leadów wymagających uwagi** — ostatnie etapy, zbliżające się terminy — obok zadań i spotkań

## Aby

móc zaplanować pracę sprzedażową na dziś i jutro bez przeszukiwania modułów Leady i Deale

## Zakres

### W zakresie

- Nowa logika selekcji w `lib/crm/today-pipeline-summary.ts` (lub równoważnie).
- **Deale** (`filterByScope` na `deals` / `opportunities`):
  - statusy końcowe procesu: `offer_submitted`, `negotiation_started` (nie `won` / `lost`);
  - `expectedCloseDate` w horyzoncie **dziś … dziś+7 dni** (stała `TODAY_PIPELINE_HORIZON_DAYS = 7`);
  - sortowanie: termin rosnąco, potem `amount` malejąco.
- **Leady**:
  - status `in_progress` (oraz opcjonalnie `new` starsze niż 3 dni);
  - „stale”: brak aktywności w `leadActivities` od ≥ **7 dni** względem daty demo (`getDemoToday()`), lub brak aktywności w ogóle od `createdAt`;
  - sortowanie: najstarsza aktywność / `createdAt` rosnąco.
- UI na `/today` (`TodayView`):
  - karty **„Deale wymagające uwagi”** i **„Leady do domknięcia”**;
  - max **5** pozycji + link „Zobacz wszystkie” → `/pipeline` / `/leads`;
  - wpis: nazwa, klient/firma (jeśli jest), status/etap PL, termin, kwota deala (`formatCurrencyPln`);
  - klik → `/pipeline/[id]` lub `/leads/[id]`;
  - pusty stan PL + badge z liczbą w nagłówku.
- Widoczność: **tylko `advisor`** (jak obecny `/today`).
- Ewentualne uzupełnienie seedu (`expectedCloseDate`, aktywności leadów) tylko jeśli demo nie pokazuje sensownych przykładów.

### Poza zakresem

- Edycja deala/leada z „Dziś”.
- Powiadomienia (→ US-22); wspólna funkcja pilności może być wyekstrahowana w T-21-01 do reuse w US-22.
- Widok pipeline dla `regional_manager` / `executive`.

## Kryteria akceptacji (story)

- [x] Doradca na `/today` widzi obie sekcje w swoim scope.
- [x] Kryteria statusów i terminów działają deterministycznie.
- [x] Nawigacja do kart encji działa.
- [x] Puste stany i liczniki po polsku.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-21-01](./tasks/T-21-01-today-pipeline-summary-lib.md) | Done | — |
| [T-21-02](./tasks/T-21-02-seed-dates-for-demo.md) | Done | T-21-01 |
| [T-21-03](./tasks/T-21-03-today-view-pipeline-cards.md) | Done | T-21-01 |

## Kolejność implementacji (agent)

1. T-21-01 → T-21-02 (jeśli seed wymaga korekty) → T-21-03

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md), aktualizacja [`requirements.md`](../../requirements.md) §6 (krok doradcy: Dziś z pipeline summary).
