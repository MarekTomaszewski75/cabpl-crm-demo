# T-18-06 — Karta deala: szkielet layoutu (2 kolumny, nagłówek, zakładki)

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-02](./T-18-02-demo-data-deal-crud.md)

## Cel

Nowy widok `/pipeline/[id]` — układ zbliżony do screenu Uspacy i karty leada (US-17), w designie CA.

## Layout (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ [← Deale]  ikona  Nazwa deala    opiekun (badge)   ⋮        │
│                    [Stracony deal]  [Wygrany deal]          │
├─────────────────────────────────────────────────────────────┤
│ PASEK STATUSÓW (6 segmentów)                                │  ← T-18-07
├─────────────────────────────────────────────────────────────┤
│ Tabs: Ogólne | Produkty (stub) | Historia (stub)            │
├──────────────────┬──────────────────────────────────────────┤
│ LEWA (~320px)    │ PRAWA (flex-1) — tylko zakładka Ogólne   │
│ (T-18-08)        │ (T-18-09)                                │
└──────────────────┴──────────────────────────────────────────┘
```

## Komponenty (propozycja)

- `deal-detail-view.tsx` — orchestracja.
- `deal-detail-header.tsx` — nazwa (`deal.name`), link do `/pipeline`, badge opiekuna, `DropdownMenu` (stub).
- Przyciski **Stracony deal** (destructive/outline + ikona X) i **Wygrany deal** (success + check) — ten sam flow co „Zakończ przetwarzanie” (T-18-10); w tym tasku mogą być `disabled` do czasu T-18-10.
- Zakładka **Ogólne**: grid 2 kolumny; sloty na sidebar i feed.
- Zakładka **Produkty**: `Empty` — „Dodawanie produktów — następny etap”.
- Zakładka **Historia**: `Empty` — „Pełna historia — Etap 1 w przygotowaniu” (feed w Ogólne).

## RBAC

- `canAccessEntity(deal, user)` — jak lead/firma: Alert / redirect przy braku dostępu.

## Done when

- [ ] `/pipeline/[id]` renderuje layout 2 kolumny.
- [ ] Nagłówek: nazwa + opiekun + przyciski (wired lub disabled do T-18-10).
- [ ] Trzy zakładki; Produkty i Historia — stub.
- [ ] Responsywność: `flex-col` na wąskim ekranie.
- [ ] Placeholder w slotach lewy/prawy do czasu T-18-08 / T-18-09.

## Poza zakresem

- Pasek statusów — logika (→ T-18-07).
- Inline edit (→ T-18-08).
- Feed (→ T-18-09).
