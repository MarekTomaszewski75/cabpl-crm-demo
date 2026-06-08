# T-17-06 — Karta leada: szkielet layoutu (2 kolumny, nagłówek)

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-02](./T-17-02-demo-data-lead-crud.md)

## Cel

Nowy widok `/leads/[id]` — układ zbliżony do screenu Uspacy i karty firmy (US-16), w designie CA.

## Layout (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ [← Leady]  ikona  Nazwa leada    opiekun (badge)   ⋮        │
│                    [Niepowodzenie]  [Wygrano]               │
├─────────────────────────────────────────────────────────────┤
│ PASEK STATUSÓW: Nowy | W toku | Zakończ przetwarzanie       │  ← T-17-07
├─────────────────────────────────────────────────────────────┤
│ Tabs: Ogólne (domyślna)                                     │
├──────────────────┬──────────────────────────────────────────┤
│ LEWA (~320px)    │ PRAWA (flex-1)                           │
│ (T-17-08)        │ (T-17-09)                                │
└──────────────────┴──────────────────────────────────────────┘
```

## Komponenty (propozycja)

- `lead-detail-view.tsx` — orchestracja.
- `lead-detail-header.tsx` — nazwa (`lead.name`), link do `/leads`, badge opiekuna, `DropdownMenu` (stub).
- Przyciski **Niepowodzenie** (`variant` destructive/outline + ikona X) i **Wygrano** (primary/success + check) — wywołują ten sam flow co segment „Zakończ przetwarzanie” (T-17-10); w tym tasku mogą być `disabled` z tooltipem do czasu T-17-10.
- Zakładka **Ogólne**: grid 2 kolumny; sloty na sidebar i feed.

## RBAC

- `canAccessEntity(lead, user)` — jak firma: Alert / redirect przy braku dostępu.

## Done when

- [ ] `/leads/[id]` renderuje layout 2 kolumny.
- [ ] Nagłówek: nazwa + opiekun + przyciski (wired lub disabled do T-17-10).
- [ ] Responsywność: `flex-col` na wąskim ekranie.
- [ ] Placeholder w slotach lewy/prawy do czasu T-17-08 / T-17-09.

## Poza zakresem

- Pasek statusów — logika (→ T-17-07).
- Inline edit (→ T-17-08).
- Feed (→ T-17-09).
